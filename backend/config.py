import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base

# Database configuration (must be MySQL-compatible URL for TiDB Cloud)
# Example: "mysql+pymysql://user:password@host:4000/database"
DATABASE_URL = os.getenv("TIDB_DATABASE_URL")

# Create engine for TiDB (no sqlite connect_args)
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    echo=True  # optional: logs SQL for debugging
)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables
def create_tables():
    Base.metadata.create_all(bind=engine)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
