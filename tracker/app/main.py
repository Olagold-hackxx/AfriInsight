from fastapi import FastAPI
from .routes import router
from .models import Base
from .db import engine
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Download Tracker")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # or ["*"] for all origins (not recommended for production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


Base.metadata.create_all(bind=engine)
app.include_router(router)
