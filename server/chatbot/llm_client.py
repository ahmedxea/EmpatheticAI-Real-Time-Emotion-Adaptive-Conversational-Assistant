import subprocess
from tone_profiles import tone_profiles

def get_llm_response(message: str, emotion: str) -> str:
    """Send prompt to local Ollama model with tone control."""
    tone_instruction = tone_profiles.get(emotion, tone_profiles["neutral"])
    prompt = f"You are an empathetic AI assistant.\nDetected emotion: {emotion}\n{tone_instruction}\nUser: {message}\nAssistant:"

    try:
        result = subprocess.run(
            ["ollama", "run", "llama3", prompt],
            capture_output=True, text=True, timeout=60
        )
        if result.returncode == 0:
            return result.stdout.strip()
        else:
            return f"Error: {result.stderr}"
    except Exception as e:
        return f"Error communicating with Ollama: {e}"