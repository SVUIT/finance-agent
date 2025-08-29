from typing import (
    Any, 
    AsyncGenerator, 
    Dict,
    Literal,
    Optional,
)

from langchain_core.messages import (
    BaseMessage,
    SystemMessage,
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
from schemas.graph import State
import json
from core.graphs.tools import tools
# from backend.app.core.langgraph.tools import tools

class LangGraphAgent:
    def __init__(self):
        self.llm = ChatOpenAI(
            model=settings.LLM_MODEL,
            temperature=settings.DEFAULT_LLM_TEMPERATURE,
            api_key=settings.LLM_API_KEY,
            max_tokens=settings.MAX_TOKENS,
        ).bind_tools(tools)
        # self.embeddings = OpenAIEmbeddings(model=settings.EMBEDDINGS_MODEL, api_key=settings.LLM_API_KEY)
        self.tools_by_name = {tool.name: tool for tool in tools}
        # self._connection_pool: Optional[AsyncConnectionPool] = None
        self._graph: Optional[CompiledStateGraph] = None
    
    async def _chat(self, state: State) -> State:
        SYSTEM_PROMPT = """
        You are a helpful financial assistant. 
        You can answer questions about transactions, search for transactions using the search_transactions tool, 
        and always return clear, concise answers. 
        If the user asks for a search, use the tool.
        PPlease return in Markdown format.
        """
        messages = state.messages
        if not any(isinstance(m, SystemMessage) for m in messages):
            messages = [SystemMessage(content=SYSTEM_PROMPT)] + messages
        response  = await self.llm.ainvoke(messages)
        return State(messages=messages + [response])
    
    async def _tool_call(self, state: State) -> State:
        outputs = []
        for tool_call in state.messages[-1].tool_calls:
            tool_result = await self.tools_by_name[tool_call["name"]].ainvoke(tool_call["args"])
            if isinstance(tool_result, (dict, list)):
                
                tool_result = json.dumps(tool_result, default=str)
            outputs.append(
                ToolMessage(
                    content=tool_result,
                    name=tool_call["name"],
                    tool_call_id=tool_call["id"]
                )
            )
        return State(messages=state.messages + outputs)
    
    def _should_continue(self, state: State) -> str:
        messages = state.messages
        last_message = messages[-1]
        if not last_message.tool_calls:
            return "end"
        else:
            return "continue"
    
    async def create_graph(self):
        if self._graph is None:
            builder = StateGraph(State)
            builder.add_node("chat", self._chat)
            builder.add_node("tool_call", self._tool_call
            )
            builder.add_conditional_edges(
                "chat",
                self._should_continue,
                {"continue": "tool_call", "end": END},
            )
            builder.add_edge("tool_call", "chat")
            builder.set_entry_point("chat")
            self._graph = builder.compile()
        return self._graph
