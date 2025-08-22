import os
from dotenv import load_dotenv

class Settings:
    def __init__(self):
        self.TIDB_DATABASE_URL = os.getenv("TIDB_DATABASE_URL", "mysql+pymysql://root:password@localhost:4000/test")
        self.OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "your-openai-api-key")

# Create settings instance
settings = Settings()