# 🤖 Empathetic AI

**Empathetic AI** is an **emotion-aware chatbot** that adapts its responses to your **mood in real time**.  
It detects facial expressions through your webcam and adjusts tone dynamically using **local AI models** via Ollama.

---

## 🌟 What It Does
- 🎭 Detects emotions like *happy, sad, angry, surprised, neutral*, etc.  
- 💬 Responds with an adaptive tone that matches your mood  
- ⚙️ Runs locally using **FastAPI + Ollama (llama3)**  
- 🎨 Features a clean, ChatGPT-style UI built with React + Tailwind  

---

## 🧩 Tech Stack
**Frontend:** React, Vite, TypeScript, TailwindCSS, face-api.js  
**Backend:** FastAPI, Python, Ollama  

---

## 🚀 Setup

### 🖥 Backend
```bash
cd server
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8001

-----

Run Ollama:

ollama serve


Test the API:
http://127.0.0.1:8001/test-ollama

💻 Frontend
cd web
npm install
npm run dev


Open http://localhost:5173

Allow camera access when prompted.

📁 Project Structure
empathetic-ai/
├── server/         # FastAPI backend
│   ├── app.py
│   ├── tone_profiles.py
│   └── chatbot/llm_client.py
└── web/            # React + Tailwind frontend
    ├── src/components/
    │   ├── Chat.tsx
    │   └── EmotionProbe.tsx
    └── public/models/ (face-api.js models)

💡 Concept

Empathetic AI combines emotional intelligence with artificial intelligence —
a chatbot that doesn’t just respond, it feels your vibe and adapts its tone accordingly.