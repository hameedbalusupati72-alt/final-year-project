"""Convenience entry point for the FastAPI application."""

import os
from pathlib import Path

import uvicorn

from app.main import app

__all__ = ["app"]


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=os.getenv("HOST", "127.0.0.1"),
        port=int(os.getenv("PORT", "8000")),
        reload=os.getenv("APP_ENV", "development").lower() == "development",
        reload_dirs=[str(Path(__file__).resolve().parent)],
    )
