import os
from dotenv import load_dotenv

class Settings:
    def __init__(self):
        load_dotenv()
        self.TIDB_DATABASE_URL = os.getenv("TIDB_DATABASE_URL", "mysql+pymysql://root:password@localhost:4000/test")   
        # LangGraph Configuration
        self.LLM_API_KEY = os.getenv("OPENAI_API_KEY", "your-openai-api-key")
        self.LLM_MODEL = os.getenv("LLM_MODEL", "gpt-4o-mini")
        self.DEFAULT_LLM_TEMPERATURE = float(os.getenv("DEFAULT_LLM_TEMPERATURE", "0.2"))
        self.MAX_TOKENS = int(os.getenv("MAX_TOKENS", "2000"))
        self.EMBEDDINGS_MODEL = os.getenv("EMBEDDINGS_MODEL", "text-embedding-3-small")

# Create settings instance

settings = Settings()