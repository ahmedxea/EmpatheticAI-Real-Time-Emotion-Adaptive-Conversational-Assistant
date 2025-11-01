// @ts-nocheck
import { useEffect, useRef, useState } from "react";
// @ts-ignore: missing type declarations for 'face-api.js'
import * as faceapi from "face-api.js";

export default function EmotionProbe({
  onEmotion,
}: {
  onEmotion: (emotion: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState("Loading models...");
  const [currentEmotion, setCurrentEmotion] = useState("neutral");

  // Load models on mount
  useEffect(() => {
    const loadModels = async () => {
      try {
        setStatus("Loading models...");
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models/");
        await faceapi.nets.faceExpressionNet.loadFromUri("/models/");
        setStatus("Models loaded ✅");
        startVideo();
      } catch (err) {
        console.error("Model load error:", err);
        setStatus("❌ Failed to load models");
      }
    };

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera error:", err);
        setStatus("❌ Camera access denied");
      }
    };

    loadModels();
  }, []);

  // Run emotion detection every second
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!videoRef.current || videoRef.current.readyState !== 4) return;

      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections.length > 0) {
        const emotions = detections[0].expressions;
        const detected = Object.keys(emotions).reduce((a, b) =>
          emotions[a] > emotions[b] ? a : b
        );
        setCurrentEmotion(detected);
        onEmotion(detected);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [onEmotion]);

  return (
    <div className="flex flex-col items-center mb-4">
      <video
        ref={videoRef}
        autoPlay
        muted
        width="320"
        height="240"
        className="rounded-xl shadow-md"
      />

      {/* 💬 Emotion legend */}
      <div className="flex justify-center gap-2 mt-3 text-sm">
        {[
          { label: "neutral", icon: "😐" },
          { label: "happy", icon: "😊" },
          { label: "sad", icon: "😢" },
          { label: "angry", icon: "😡" },
          { label: "fearful", icon: "😨" },
          { label: "disgusted", icon: "🤢" },
          { label: "surprised", icon: "😲" },
        ].map((e) => (
          <span
            key={e.label}
            className={`px-2 py-1 rounded-full transition ${
              currentEmotion === e.label
                ? "bg-indigo-100 text-indigo-800 font-semibold"
                : "text-gray-500"
            }`}
          >
            {e.icon}
          </span>
        ))}
      </div>

      <p className="text-sm text-gray-600 mt-2">{status}</p>
    </div>
  );
}