"""This file contains the database service for the application."""
from typing import List, Optional
from core.config import settings
from fastapi import HTTPException 
from sqlalchemy.exc import SQLAlchemyError
from sqlmodel import Session, select, create_engine , SQLModel
from model.transaction import Transaction
from langchain_community.vectorstores import TiDBVectorStore
from langchain_openai import OpenAIEmbeddings
import uuid
import datetime 
import pymysql
class DatabaseService:
    def __init__(self):
        try:
            # define engine
            self.engine = create_engine(
                settings.TIDB_DATABASE_URL
            )
            # Create tables (only if they don't exist)
            SQLModel.metadata.create_all(self.engine)

            # define vectorstore
            embeddings = OpenAIEmbeddings(api_key=settings.LLM_API_KEY)

            self.vectorstore = TiDBVectorStore(
                embedding_function=embeddings,
                table_name="embedding_data",
                connection_string=settings.TIDB_DATABASE_URL,
                distance_strategy="cosine",  # default, another option is "l2"
            )

        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=500,
                detail=f"Database connection error: {str(e)}"
            )

    async def create_transaction(self, id: uuid.UUID, name: str, currency: str, amount: float, created_at: datetime, transaction_type: str, category: str, subcategory: str) -> Transaction:
        with Session(self.engine) as session:
            transaction = Transaction(
                id=id,
                name=name,
                currency=currency,
                amount=amount,
                created_at=created_at,
                transaction_type=transaction_type,
                category=category,
                subcategory=subcategory
            )
            session.add(transaction)
            session.commit()
            session.refresh(transaction)
            return transaction

    # get all transaction
    async def get_transaction(self) -> List[Transaction]:
        with Session(self.engine) as session:
            statement = select(Transaction)
            result = session.exec(statement)
            return result

    # get transaction by category
    async def get_transaction_by_category(self, category: str) -> List[Transaction]:
        with Session(self.engine) as session:
            transactions = session.query(Transaction).filter(Transaction.category == category).all()
            return transactions

# Create an instance
database_service = DatabaseService()