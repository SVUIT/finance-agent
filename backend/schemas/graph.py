
from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages
from pydantic import BaseModel, Field
from typing import Annotated
class State(BaseModel):
    messages: Annotated[list[BaseMessage], add_messages]
    # thêm remaining_steps, mặc định có thể là 5-10 tùy nhu cầu
    remaining_steps: int = Field(default=5)
