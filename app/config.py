import os

class Settings:
    CONVEX_BASE_URL: str = os.getenv("CONVEX_BASE_URL", "http://localhost:3000")

settings = Settings()
