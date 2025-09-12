import os
import pandas as pd
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, AnyMessage
from fastapi.responses import JSONResponse
from fastapi import File, UploadFile, APIRouter, Request
import tempfile
import json
import uuid
from core.graphs.graph import LangGraphAgent
from schemas.graph import State
from service.database import database_service
from utils.extract_currency import extract_amount_currency
from core.config import settings
from langchain_openai import ChatOpenAI
from model.transaction import TransactionCreate
from collections import Counter
import asyncio
from utils.format_datetime import format_datetime
api_router = APIRouter()
llm = ChatOpenAI(model_name="gpt-4o-mini", api_key=settings.LLM_API_KEY)
# Optional: Set a tracking URI and an experiment
def classify_transaction(name, created_at, transfer_note):
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
        print("Prompt to LLM:", prompt_template.format(
            name=name,
            created_at=created_at,
            transfer_note=transfer_note
        ))
        response = llm.invoke([
            SystemMessage(content="You are a helpful assistant that classifies financial transactions."),
            HumanMessage(content=prompt_template.format(
                name=name,
                created_at=created_at,
                transfer_note=transfer_note
            ))
        ])
        try:
            result = json.loads(response.content.strip())
            print("LLM response:", response.content)
            return result.get("category", ""), result.get("subcategory", "")
        except Exception as e:
            print("LLM response:", repr(response.content))
            print(e)
            return "", ""
            
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
        # Read csv
        df = pd.read_csv(tmp_path)
        if df is None:
            raise ValueError("df not found in output_state")
        
        # Categorize transaction
        df[["category", "subcategory"]] = df.apply(lambda row: pd.Series(classify_transaction(row["name"], row["created_at"], row["transfer_note"])), axis=1)   
        
        # Extract currency
        df[['amount', 'currency']] = df['amount'].apply(lambda row: pd.Series(extract_amount_currency(row)))
        
        # Format datetime
        df["created_at"] = pd.to_datetime(df["created_at"])
        documents = []

        for _, row in df.iterrows():
            id = str(uuid.uuid4())
            if str.lower(row['transaction_type']) == "outgoing":
                texts = f"This is outgoing transaction. Sender is me, Beneficiary is {row['name']}.The transaction was processed at {format_datetime(str(row['created_at']))}. Note of transaction: {row['transfer_note']}. The transaction was categorized under the subcategory {row['subcategory']} within the category {row['category']}"
            elif str.lower(row['transaction_type']) == "incoming":
                texts = f"This is incoming transaction. Sender is {row['name']}, Beneficiary is me. The transaction was processed at {format_datetime(str(row['created_at']))}. Note of transaction: {row['transfer_note']}. The transaction was categorized under the subcategory {row['subcategory']} within the category {row['category']}"
            else:
                texts = f"Sender is unknown, Beneficiary is unknown. The transaction was processed at {format_datetime(str(row['created_at']))}. Note of transaction: {row['transfer_note']}. The transaction was categorized under the subcategory {row['subcategory']} within the category {row['category']}"
            documents.append({
                "texts": texts,
                "metadatas": {
                    "id": str(id),
                }
            })

            # create transaction in upload to sql 
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
        # upload to vectorstore
        database_service.vectorstore.add_texts(
            texts=[
                doc["texts"] for doc in documents
            ],
            metadatas=[
                doc["metadatas"] for doc in documents
            ]
        )
        return JSONResponse(status_code=200, content={"status": "successed"})
    except Exception as e:
        print("Error in /categorize:", e)
        #traceback.print_exc()
        return JSONResponse(status_code=500, content={"status": "failed", "error": str(e)})
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

@api_router.post("/add-transaction")
async def add_transaction(transaction: TransactionCreate):
    try:
        id = str(uuid.uuid4())
        print(f"""
            {id}, {transaction.name}, {transaction.currency}, {transaction.amount}, {transaction.created_at}, {transaction.transfer_note},
            {transaction.transaction_type}
        """)
        category, subcategory = classify_transaction(transaction.name, transaction.created_at, transaction.transfer_note)
        await database_service.create_transaction(
            id=id,
            name=transaction.name,
            currency=transaction.currency,
            amount=transaction.amount,
            created_at=transaction.created_at,
            transaction_type=transaction.transaction_type,
            category=category,
            subcategory=subcategory
        )
        # a = await chatbot_endpoint()
        if str.lower(transaction.transaction_type) == "outgoing":
            text = f"This is outgoing transaction. Sender is me, Beneficiary is {transaction.name}. The transaction was processed at {format_datetime(str(transaction.created_at))}. Note of transaction: {transaction.transfer_note}. The transaction was categorized under the subcategory {subcategory} within the category {category}."
        elif str.lower(transaction.transaction_type) == "incoming":
            text = f"This is incoming transaction. Sender is {transaction.name}, Beneficiary is me. The transaction was processed at {format_datetime(str(transaction.created_at))}. Note of transaction: {transaction.transfer_note}. The transaction was categorized under the subcategory {subcategory} within the category {category}."
        else:
            text = f"Sender is unknown, Beneficiary is unknown. The transaction was processed at {format_datetime(str(transaction.created_at))}. Note of transaction: {transaction.transfer_note}. The transaction was categorized under the subcategory {subcategory} within the category {category}."
        database_service.vectorstore.add_texts(
            texts=[text],
            metadatas=[{"id": id}]
        )
        return {"status": "success", "id": id}
    except Exception as e:
        print("Error in /add-transaction:", e)
        return JSONResponse(status_code=500, content={"status": "failed", "error": str(e)})

@api_router.post("/chatbot")
async def chatbot_endpoint(request: Request):
    agent = LangGraphAgent()
    body = await request.json()
    # Expect body: {"messages": [{"role": "user", "content": "..."}]}
    messages = body.get("messages", [])
    # Khởi tạo state cho agent
    formatted_messages = []
    for msg in messages:
        if msg["role"] == "user":
            formatted_messages.append(HumanMessage(content=msg["content"]))
        elif msg["role"] == "assistant":
            # Xử lý cả content và tool_calls nếu có
            if msg.get("tool_calls"):
                formatted_messages.append(AIMessage(
                    content=msg.get("content", ""),
                    tool_calls=msg["tool_calls"]
                ))
            else:
                formatted_messages.append(AIMessage(content=msg["content"]))
        elif msg["role"] == "tool":
            # Xử lý tool messages
            from langchain_core.messages import ToolMessage
            formatted_messages.append(ToolMessage(
                content=msg["content"],
                tool_call_id=msg["tool_call_id"]
            ))
    print(formatted_messages)
    state = {
        "messages": formatted_messages,
        "remaining_steps": 5,   # số vòng lặp tối đa cho agent
    }
    graph = await agent.create_graph()
    # Trả về message cuối cùng của assistant
    content = await run_with_majority_voting(graph, state, n_runs=1)
    # last_msg = content["messages"][-1]
    # content = last_msg.content
    # content = serialize_obj(content)
    return JSONResponse(content={"response": content})

import datetime
def serialize_obj(obj):
    if isinstance(obj, dict):
        return {k: serialize_obj(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [serialize_obj(v) for v in obj]
    elif isinstance(obj, datetime.datetime):
        return obj.isoformat()
    else:
        return obj

from collections import Counter
import asyncio
import copy
async def run_with_majority_voting(graph, state, n_runs=3):
    answers = []
    normalized_to_original = {}

    for _ in range(n_runs):
        result = await graph.ainvoke(copy.deepcopy(state))
        msgs = result["messages"]

        final_answer = None
        for m in reversed(msgs):
            if isinstance(m, AIMessage) and not getattr(m, "tool_calls", None):
                final_answer = m.content.strip()
                break

        if final_answer:
            normalized = final_answer.lower()
            answers.append(normalized)
            normalized_to_original.setdefault(normalized, final_answer)

    if not answers:
        return None

    most_common = Counter(answers).most_common(1)[0][0]
    return normalized_to_original[most_common]