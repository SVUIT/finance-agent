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
app = FastAPI(title="Transaction Categorizer Multi-Agent")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/categorize")
async def categorize_file(file: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".csv") as tmp:
        tmp_path = tmp.name
        content = await file.read()
        tmp.write(content)
    try:
        initial_state: GraphState = {
            "file_path": tmp_path,
            "message": []
        }
        output_state = await graph.ainvoke(initial_state)
        df = output_state["df"]
        return JSONResponse({"data": df.to_dict(orient="records")})
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

@app.get("/health")
def health():
    return {"ok": True}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)