# core/graphs/tools.py
from langchain_core.tools import tool
from core.config import settings
from service.database import database_service

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
    
@tool
def search_transactions(query: str) -> list:
    """Semantic search transactions by query, return top k results with full info."""
    retriever = database_service.vectorstore.as_retriever(
        search_type="similarity_score_threshold",
        search_kwargs={"score_threshold": 0.5, "k": 100}
    )
    docs = retriever.invoke(query)
    ids = [doc.metadata["id"] for doc in docs]
    print(f"[search_transactions] Retrieved docs: {docs}")
    print(f"[search_transactions] Matched IDs: {ids}")
    # Lấy thông tin chi tiết từ database_transaction
    search_query = "SELECT * FROM transaction_info WHERE id IN :ids"
    params = {"ids": tuple(ids)}
    print(f"[search_transactions] SQL: {search_query} | Params: {params}")
    transactions_detail = database_service.vectorstore.tidb_vector_client.execute(search_query, params)
    results = transactions_detail.get("result")
    print(f"[search_transactions] Query: {query} | Results: {results}")
    columns = ["id", "name", "amount", "currency", "created_at", "transaction_type", "category", "subcategory"]
    
    if not results:
            return []
    raw_results = [dict(zip(columns, t)) for t in results if t]
    return [serialize_obj(r) for r in raw_results]
    # transactions = [database_service.get_transaction_by_id(id) for id in ids]
    # return [t.dict() for t in transactions_detail.get("result") if t]