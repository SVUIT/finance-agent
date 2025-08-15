import os
import pandas as pd
from typing import TypedDict, Annotated, List, Any
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, AnyMessage
from langchain_openai import ChatOpenAI

load_dotenv()

# ----- Graph State -----
class GraphState(TypedDict):
    file_path: str
    df: pd.DataFrame
    messages: Annotated[List[AnyMessage], "Conversation messages"]


# ----- LLM -----
llm = ChatOpenAI(model='gpt-4o-mini', api_key=os.getenv("OPENAI_API_KEY"))

# ----- Agent 1: CSV Reader -----
async def csv_reader(state: GraphState) -> GraphState:
    df = pd.read_csv(state["file_path"])
    # Process the DataFrame as needed
    return {**state, "df": df}

# ----- Agent 2: Categorizer -----
async def categorize(state: GraphState) -> GraphState:
    df = state["df"]
    prompt_template = """
    Based on the name, created_at, transfer_purpose, classify the category 
    (salary, food, transportation, health, education, family, apparel, etc.) of the transaction.
    Transaction details:
    name: {name}
    created_at: {created_at}
    transfer_purpose: {transfer_purpose}
    Return only the category name, nothing else.
    """

    def classify_transaction(row):
        response = llm.invoke([
            SystemMessage(content="You are a helpful assistant that classifies financial transactions."),
            HumanMessage(content=prompt_template.format(
                name=row["name"],
                created_at=row["created_at"],
                transfer_purpose=row["transfer_purpose"]
            ))
        ])
        return response.content.strip()

    df["category"] = df.apply(classify_transaction, axis=1)
    return {**state, "df": df}
