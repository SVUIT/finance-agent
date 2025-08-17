import os
import tempfile
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from langgraph.graph import StateGraph, END 
from agents.categorize_agent import csv_reader, categorize, GraphState

# ----- Build Graph -----
workflow = StateGraph(GraphState)
workflow.add_node("csv_reader", csv_reader)
workflow.add_node("categorizer", categorize)

workflow.set_entry_point("csv_reader")
workflow.add_edge("csv_reader", "categorizer")
workflow.add_edge("categorizer", END)

graph = workflow.compile()

# ----- FastAPI -----
app = FastAPI(title="Transaction Categorizer Multi-Agent", )
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/categorize")
async def categorize_file(file: UploadFile = File(...)):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".csv") as tmp:
            tmp_path = tmp.name
            content = await file.read()
            tmp.write(content)
        print("CSV saved to:", tmp_path)

        initial_state: GraphState = {
            "file_path": tmp_path,
            "message": []
        }

        output_state = await graph.ainvoke(initial_state)
        print("Graph output_state:", output_state)

        df = output_state.get("df")
        if df is None:
            raise ValueError("df not found in output_state")

        return JSONResponse(status_code=200, content={"status": "successed"})
    except Exception as e:
        print("Error in /categorize:", e)
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"status": "failed", "error": str(e)})
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

@app.post("/health", status_code=201)
def health():
    return {"ok": True}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)