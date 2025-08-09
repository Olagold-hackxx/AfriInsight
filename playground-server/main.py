from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import infer, models, health
from config import ALLOWED_ORIGINS
from logger import logger

app = FastAPI(
    title="DeHug Inference API",
    description="AI Model inference server with IPFS integration",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(health.router)
app.include_router(models.router)
app.include_router(infer.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
