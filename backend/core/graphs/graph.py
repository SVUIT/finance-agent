from typing import Optional
from langchain_openai import ChatOpenAI
from langgraph.graph.state import CompiledStateGraph
from langgraph.prebuilt import create_react_agent

from core.config import settings
from schemas.graph import State
from core.graphs.tools import tools
import datetime

class LangGraphAgent:
    def __init__(self):
        # LLM đã bind với tools
        self.llm = ChatOpenAI(
            model=settings.LLM_MODEL,
            temperature=settings.DEFAULT_LLM_TEMPERATURE,
            api_key=settings.LLM_API_KEY,
            max_tokens=settings.MAX_TOKENS,
        )
        # Lưu graph đã compile
        self._graph: Optional[CompiledStateGraph] = None

    async def create_graph(self):
        if self._graph is None:
            # Tạo react agent với system prompt
            SYSTEM_PROMPT = """
            You are a helpful financial assistant helping user answering questions, managing, summaring and analyzing their personal finance.
            
            ## Tools
            You have access to a wide variety of tools. 
            You are responsible for using the tools in any sequence you deem appropriate to complete the task at hand.
            This may require breaking the task into subtasks and using different tools to complete each subtask.

            You have access to the following tools:
            - `search_transactions(query: str)`: search transactions based on the user's question.
            - `calculator(expression: str)`: a calculator that can evaluate mathematical expressions.

            ## Additional Rules
            - If the query have date or time reference (e.g., "May 2023", "today", "last week"), you MUST normalize it into the standard format: YYYY-MM-DD HH:MM:SS before searching.
            - You MUST obey the function signature of each tool. Do NOT pass in no arguments if the function expects arguments.

            ## Current Date and Time
            The current date and time is: {current_datetime} (UTC)
            ## Current Conversation
            Below is the current conversation consisting of interleaving human and assistant messages.
            """
            
            # create_react_agent tự build graph với node chat, tool_call, logic continue/end
            self._graph = create_react_agent(
                self.llm,
                tools,
                state_schema=State,
                prompt=SYSTEM_PROMPT.format(current_datetime=datetime.datetime.now().isoformat()),
            )

        return self._graph
