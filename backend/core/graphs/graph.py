from typing import (
    Any, 
    AsyncGenerator, 
    Dict,
    Literal,
    Optional,
)

from langchain_core.messages import (
    BaseMessage,
    ToolMessage,
    convert_to_openai_messages,
)

from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langgraph.graph import (
    END,
    StateGraph,
)
from langgraph.graph.state import CompiledStateGraph
from langgraph.types import StateSnapshot
from core.config import (
    settings
)

# from backend.app.core.langgraph.tools import tools

class LangGraphAgent:
    def __init__(self):
        self.llm = ChatOpenAI(
            model=settings.LLM_MODEL,
            temperature=settings.DEFAULT_LLM_TEMPERATURE,
            api_key=settings.LLM_API_KEY,
            max_tokens=settings.MAX_TOKENS,
        )

        # self.embeddings = OpenAIEmbeddings(model=settings.EMBEDDINGS_MODEL, api_key=settings.LLM_API_KEY)
        # self.tools_by_name = {tool.name: tool for tool in tools}
        # self._connection_pool: Optional[AsyncConnectionPool] = None
        self._graph: Optional[CompiledStateGraph] = None