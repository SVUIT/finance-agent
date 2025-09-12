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

@tool(description="""Search transactions by query, return top k results with full info. If the query contains a date or time reference (e.g., "May 2023", "today", "last week"), the tool should normalize it into the standard format: YYYY-MM-DD HH:MM:SS before searching.""")
def search_transactions(query: str) -> list:
    """Semantic search transactions by query, return top k results with full info.

    This tool performs semantic search over transactions based on a natural language query.
    If the query contains a date or time reference (e.g., "May 2023", "today", "last week"),
    the tool should normalize it into the standard format: YYYY-MM-DD HH:MM:SS before searching.
    
    Example:
        "Find all transactions in May 2023"
        → normalized as "2023-05-01 00:00:00" to "2023-05-31 23:59:59"
    
    Args:
        query (str): The natural language search query.
"""
    # retriever = database_service.vectorstore.max_marginal_relevance_search(
    #     search_type="similarity_score_threshold",
    #     search_kwargs={"score_threshold": 0.5, "k": 100}
    # )
    docs_with_relevant_score = database_service.vectorstore.similarity_search_with_score(
         query, k=50)
    docs = []
    for doc, score in docs_with_relevant_score:
         if score <= 0.25:
              docs.append(doc)

    # docs = retriever.invoke(query)
    ids = [doc.metadata["id"] for doc in docs]
    print(f"[search_transactions] Query: {query} | Results: {ids}")
    # Lấy thông tin chi tiết từ database_transaction
    search_query = "SELECT * FROM transaction_info WHERE id IN :ids"
    params = {"ids": tuple(ids)}
    transactions_detail = database_service.vectorstore.tidb_vector_client.execute(search_query, params)
    results = transactions_detail.get("result")
    print(f"[search_transactions] Query: {query} | Results: {results}")
    columns = ["name", "amount", "currency", "created_at", "transaction_type", "category", "subcategory"]
    if not results:
            return []
    raw_results = [dict(zip(columns, t[1:])) for t in results if t]

    return [serialize_obj(r) for r in raw_results]
    # transactions = [database_service.get_transaction_by_id(id) for id in ids]
    # return [t.dict() for t in transactions_detail.get("result") if t]