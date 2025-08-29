"""This file contains the state schema for the application."""
import re
from typing import Annotated
from pydantic import BaseModel, Field
from langgraph.graph.message import add_messages
class State(BaseModel):
    messages: Annotated[list, add_messages] = Field(default_factory=list)
    