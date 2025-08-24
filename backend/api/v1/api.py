import os
import pandas as pd
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, AnyMessage
from fastapi.responses import JSONResponse
from fastapi import File, UploadFile, APIRouter
import tempfile
import json
import uuid
from core.graphs.graph import LangGraphAgent
from service.database import database_service
from utils.extract_currency import extract_amount_currency

api_router = APIRouter()

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}

@api_router.post("/categorize")
async def categorize_file(file: UploadFile = File(...)):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".csv") as tmp:
            tmp_path = tmp.name
            content = await file.read()
            tmp.write(content)
        print("CSV saved to:", tmp_path)
        df = pd.read_csv(tmp_path)
        if df is None:
            raise ValueError("df not found in output_state")
        prompt_template = """
        You are a financial transaction categorization assistant.

        Your task:
        - Classify each transaction into a main category and a subcategory based on its name, created_at, and transfer_purpose.
        - Only use the following categories and subcategories:

        Categories and subcategories:
        - food: breakfast, lunch, dinner, snack
        - health: medicine, medical, insurance
        - transportation: parking, fuel, taxi, public transport
        - personal: beauty, culture, interest, tourism, sport, apparel, entertainment
        - salary: base salary, freelance income, allowance
        - education: stationery, courses & certification, tuition
        - household: furniture & appliances, home maintenance & services, groceries & supplies, utilities
        - work-related: office supplies, electronics & devices, software subscriptions
        Return the result as a **valid JSON object** with two fields: "category" and "subcategory".
        Do not include any explanation or extra text.

        Example output:
        {{
        "category": "food",
        "subcategory": "lunch"
        }}

        Transaction details:
        name: {name}
        created_at: {created_at}
        transfer_note: {transfer_note}
        """
        agent = LangGraphAgent()
        def classify_transaction(row):
            response = agent.llm.invoke([
                SystemMessage(content="You are a helpful assistant that classifies financial transactions."),
                HumanMessage(content=prompt_template.format(
                    name=row["name"],
                    created_at=row["created_at"],
                    transfer_note=row["transfer_note"]
                ))
            ])
            try:
                result = json.loads(response.content.strip())
                return result.get("category", ""), result.get("subcategory", "")
            except Exception:
                return "", ""

        df[["category", "subcategory"]] = df.apply(lambda row: pd.Series(classify_transaction(row)), axis=1)   
        df[['amount', 'currency']] = df['amount'].apply(lambda row: pd.Series(extract_amount_currency(row)))
        df["created_at"] = pd.to_datetime(df["created_at"], format="%m/%d/%Y")
        documents = []
        for _, row in df.iterrows():
            id = uuid.uuid4()
            documents.append({
                "texts": f"{row['name']}. Note: {row['transfer_note']}. Subcategory: {row['subcategory']}. Category: {row['category']}",
                "metadatas": {
                    "id": str(id),
                }
            })
            await database_service.create_transaction(
                id=id,
                name=row["name"],
                currency=row["currency"],
                amount=row["amount"],
                created_at=row["created_at"],
                transaction_type=row["transaction_type"],
                category=row["category"],
                subcategory=row["subcategory"]
            )
        database_service.vectorstore.add_texts(
            texts=[
                doc["texts"] for doc in documents
            ],
            metadatas=[
                doc["metadatas"] for doc in documents
            ]
        )
        # initial_state: GraphState = {
        #     "file_path": tmp_path,
        #     "message": []
        # }

        # output_state = await graph.ainvoke(initial_state)
        # print("Graph output_state:", output_state)

        # df = output_state.get("df")
        return JSONResponse(status_code=200, content={"status": "successed"})
    except Exception as e:
        print("Error in /categorize:", e)
        #traceback.print_exc()
        return JSONResponse(status_code=500, content={"status": "failed", "error": str(e)})
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)