from typing import List
import uuid
from sqlmodel import Field, SQLModel
from datetime import datetime
from pydantic import BaseModel

class Transaction(SQLModel, table=True):
    
    __tablename__ = "transaction_info"  # <-- Đặt tên bảng ở đây
    id: str = Field(..., primary_key=True)
    name: str = Field(..., description="The name of who implement the transaction")
    amount: float = Field(..., description="The amount of the transaction")
    currency: str = Field(..., description="The currency of the transaction")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="The timestamp when the transaction was created")
    transaction_type: str
    category: str
    subcategory: str

class TransactionCreate(BaseModel):
    name: str
    amount: float
    currency: str
    created_at: datetime
    transaction_type: str
    transfer_note: str = ""