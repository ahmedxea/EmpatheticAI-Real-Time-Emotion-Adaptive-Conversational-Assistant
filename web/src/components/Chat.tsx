// @ts-nocheck
import { useState } from "react";
import EmotionProbe from "./EmotionProbe";

const emotionColors: Record<string, string> = {
  happy: "from-yellow-100 to-yellow-50",
  sad: "from-blue-100 to-blue-50",
  angry: "from-red-100 to-red-50",
  fearful: "from-purple-100 to-purple-50",
  disgusted: "from-green-100 to-green-50",
  surprised: "from-pink-100 to-pink-50",
  neutral: "from-gray-100 to-gray-50",
};

export default function Chat() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [emotion, setEmotion] = useState("neutral");
  const [loading, setLoading] = useState(false);

 const sendMessage = async () => {
  if (!input.trim()) return;

  const userMsg = { role: "user", text: input };
  const tempBotMsg = { role: "assistant", text: "🤖 Typing..." };

  // 👇 Instantly show the user's message and the "typing" placeholder
  setMessages((prev) => [...prev, userMsg, tempBotMsg]);
  const currentInput = input;
  setInput("");
  setLoading(true);

  try {
    const res = await fetch("http://localhost:8001/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: currentInput, emotion }),
    });

    const data = await res.json();
    const replyText = data.reply || "Hmm... I didn’t get that.";

    // 👇 Replace the "Typing..." message with the actual reply
    setMessages((prev) =>
      prev.map((m, i) =>
        i === prev.length - 1 ? { role: "assistant", text: replyText } : m
      )
    );
  } catch (err) {
    console.error(err);
    setMessages((prev) => [
      ...prev,
      { role: "system", text: "⚠️ Could not reach backend." },
    ]);
  } finally {
    setLoading(false);
  }
};


  const bgColor = emotionColors[emotion] || emotionColors.neutral;

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-start bg-gradient-to-b ${bgColor} transition-all duration-700 p-6`}
    >
      <div className="text-center mb-6">
        <h1 className="text-4xl font-extrabold mb-2 tracking-tight text-gray-800">
          EmpathAI
        </h1>
        <p className="text-sm text-gray-600">
          Adaptive AI Assistant — tuned to your mood ✨
        </p>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-5 backdrop-blur-md">
        <EmotionProbe onEmotion={setEmotion} />
        <p className="text-sm text-gray-700 text-center mb-4">
          Detected emotion:{" "}
          <span className="font-semibold text-indigo-700">{emotion}</span>
        </p>

        <div className="border rounded-xl h-80 overflow-y-auto p-3 bg-gradient-to-b from-gray-50 to-white mb-3 space-y-3 shadow-inner flex flex-col">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`p-3 max-w-[80%] rounded-2xl ${
                m.role === "assistant"
                  ? "bg-indigo-100 text-indigo-900 self-start animate-fadeIn"
                  : m.role === "user"
                  ? "bg-green-100 text-green-900 self-end ml-auto animate-fadeIn"
                  : "bg-gray-200 text-gray-700 text-sm italic"
              }`}
            >
              {m.text.includes("Typing") ? (
                <span className="italic typing text-indigo-800">{m.text}</span>
              ) : (
                m.text
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <input
            className="border rounded-xl p-3 flex-grow focus:outline-none focus:ring focus:ring-indigo-300"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Type your message..."
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}