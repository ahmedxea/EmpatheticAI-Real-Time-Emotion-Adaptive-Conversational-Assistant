import os
import subprocess
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

# Add Ollama binary path to system PATH for subprocess access
os.environ["PATH"] += os.pathsep + "/opt/homebrew/bin"

from chatbot.llm_client import get_llm_response

# Initialize FastAPI application
app = FastAPI(title="EmpathAI Backend")

# Configure CORS for local frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatInput(BaseModel):
    """Schema for incoming chat requests."""
    message: str
    emotion: str


@app.get("/")
def root():
    """Health check endpoint."""
    return {"message": "EmpathAI API is running"}


@app.post("/chat")
def chat_endpoint(input: ChatInput):
    """
    Handle chat requests from the frontend.
    Passes message and detected emotion to the LLM for response generation.
    """
    try:
        reply = get_llm_response(input.message, input.emotion)
        return {"reply": reply}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.get("/test-ollama")
def test_ollama():
    """Check if Ollama server is accessible and list available models."""
    try:
        result = subprocess.run(
            ["/opt/homebrew/bin/ollama", "list"],
            capture_output=True,
            text=True,
            timeout=10,
        )
        if result.returncode != 0:
            return JSONResponse(
                status_code=500,
                content={"status": "error", "message": result.stderr.strip()},
            )
        return {"status": "ok", "models": result.stdout.strip()}
    except FileNotFoundError:
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": "Ollama CLI not found. Please ensure it is installed."},
        )
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})


@app.get("/test-chat")
def test_chat():
    """Run a simple test query against the local model."""
    try:
        prompt = "Say hello in a friendly tone!"
        result = subprocess.run(
            ["/opt/homebrew/bin/ollama", "run", "llama3", prompt],
            capture_output=True,
            text=True,
            timeout=30,
        )
        if result.returncode != 0:
            return JSONResponse(
                status_code=500,
                content={"status": "error", "message": result.stderr.strip()},
            )
        return {"reply": result.stdout.strip()}
    except FileNotFoundError:
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": "Ollama CLI not found. Please ensure it is installed."},
        )
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})