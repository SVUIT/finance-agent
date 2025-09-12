import os
import tempfile
from fastapi import FastAPI, File, UploadFile, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel
from langgraph.graph import StateGraph, END 

from agents.categorize_agent import csv_reader, categorize, GraphState
from models import User, UserSettings
from auth import create_user, authenticate_user, create_access_token, verify_token
from config import get_db, create_tables

workflow = StateGraph(GraphState)
workflow.add_node("csv_reader", csv_reader)
workflow.add_node("categorizer", categorize)
workflow.set_entry_point("csv_reader")
workflow.add_edge("csv_reader", "categorizer")
workflow.add_edge("categorizer", END)
graph = workflow.compile()

app = FastAPI(title="Transaction Categorizer Multi-Agent")

create_tables()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    try:
        payload = verify_token(credentials.credentials)
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Token không hợp lệ")
        user = db.query(User).filter(User.id == user_id).first()
        if user is None:
            raise HTTPException(status_code=401, detail="Người dùng không tồn tại")
        return user
    except Exception:
        raise HTTPException(status_code=401, detail="Xác thực thất bại")

@app.post("/auth/signup")
async def signup(req: SignupRequest, db: Session = Depends(get_db)):
    try:
        user = create_user(db, req.name, req.email, req.password)
        access_token = create_access_token(data={"sub": str(user.id)})
        return {
            "message": "Đăng ký thành công!",
            "user": {"id": user.id, "name": user.name, "email": user.email},
            "access_token": access_token,
            "token_type": "bearer"
        }
    except HTTPException as e:
        raise e
    except Exception:
        raise HTTPException(status_code=500, detail="Có lỗi xảy ra khi đăng ký")

import traceback

@app.post("/auth/login")
async def login(req: LoginRequest, db: Session = Depends(get_db)):
    try:
        user = authenticate_user(db, req.email, req.password)
        if not user:
            raise HTTPException(status_code=401, detail="Email hoặc mật khẩu không đúng")

        access_token = create_access_token(data={"sub": str(user.id)})
        return {
            "message": "Đăng nhập thành công!",
            "user": {"id": user.id, "name": user.name, "email": user.email},
            "access_token": access_token,
            "token_type": "bearer"
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        print("🔥 Error in login:", str(e))
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Có lỗi xảy ra khi đăng nhập")


@app.get("/auth/me")
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "created_at": current_user.created_at
    }

@app.post("/categorize")
async def categorize_file(file: UploadFile = File(...), current_user: User = Depends(get_current_user)):
    tmp_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".csv") as tmp:
            tmp_path = tmp.name
            content = await file.read()
            tmp.write(content)

        initial_state: GraphState = {"file_path": tmp_path, "message": []}
        output_state = await graph.ainvoke(initial_state)

        df = output_state.get("df")
        if df is None:
            raise ValueError("df not found in output_state")

        return {"status": "successed"}
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "failed", "error": str(e)})
    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)

@app.post("/chat")
async def chat(request: dict, current_user: User = Depends(get_current_user)):
    try:
        message = request.get("message", "")
        if "upload" in message.lower() or "tải lên" in message.lower():
            response_text = "Vui lòng sử dụng nút 📎 để upload file CSV của bạn."
        elif "help" in message.lower() or "giúp" in message.lower():
            response_text = "Tôi có thể giúp bạn phân loại và phân tích giao dịch từ file CSV."
        else:
            response_text = "Vui lòng upload file CSV để bắt đầu!"
        return {"message": response_text}
    except Exception:
        raise HTTPException(status_code=500, detail="Có lỗi xảy ra khi xử lý chat")

@app.get("/settings")
async def get_settings(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    if not settings:
        settings = UserSettings(
            user_id=current_user.id,
            email_notifications=True,
            weekly_reports=True,
            monthly_reports=False
        )
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return {
        "email": current_user.email,
        "name": current_user.name,
        "emailNotifications": settings.email_notifications,
        "weeklyReports": settings.weekly_reports,
        "monthlyReports": settings.monthly_reports
    }

@app.put("/settings")
async def update_settings(settings_data: dict, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        if "name" in settings_data:
            current_user.name = settings_data["name"]
        if "email" in settings_data:
            current_user.email = settings_data["email"]

        settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
        if not settings:
            settings = UserSettings(user_id=current_user.id)
            db.add(settings)

        settings.email_notifications = settings_data.get("emailNotifications", settings.email_notifications)
        settings.weekly_reports = settings_data.get("weeklyReports", settings.weekly_reports)
        settings.monthly_reports = settings_data.get("monthlyReports", settings.monthly_reports)

        db.commit()
        return {"message": "Cài đặt đã được cập nhật thành công"}
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Có lỗi xảy ra khi cập nhật cài đặt")

@app.post("/health", status_code=201)
def health():
    return {"ok": True}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
