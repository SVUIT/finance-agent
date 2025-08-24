from typing import List
import uuid
from sqlmodel import Field, SQLModel
from datetime import datetime

class Transaction(SQLModel, table=True):
    
    __tablename__ = "transaction_info"  # <-- Đặt tên bảng ở đây

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(..., description="The name of who implement the transaction")
    amount: float = Field(..., description="The amount of the transaction")
    currency: str = Field(..., description="The currency of the transaction")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="The timestamp when the transaction was created")
    transaction_type: str
    category: str
    subcategory: str