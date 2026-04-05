import { useState, useRef } from "react";

export default function Chat() {
  const [status, setStatus] = useState("idle"); // idle | recording | processing | speaking
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      mediaRecorder.onstop = handleRecordingStop;

      mediaRecorder.start();
      setStatus("recording");
    } catch (err) {
      setError("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current?.stream.getTracks().forEach((t) => t.stop());
  };

  const handleRecordingStop = async () => {
    setStatus("processing");
    const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });

    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");

    try {
      const res = await fetch("/api/voice", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const { transcript, reply, audioBase64 } = await res.json();
      setTranscript(transcript);
      setResponse(reply);

      setStatus("speaking");
      const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`);
      audio.onended = () => setStatus("idle");
      audio.play();
    } catch (err) {
      setError("Failed to process audio. Please try again.");
      setStatus("idle");
    }
  };

  return (
    <div className="voice-chat">
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>Transcript: {transcript}</p>
      <p>AI Response: {response}</p>

      {status === "idle" && (
        <button onClick={startRecording}>🎙️ Hold to speak</button>
      )}
      {status === "recording" && (
        <button onClick={stopRecording}>⏹️ Stop</button>
      )}
      {status === "processing" && <p>Processing...</p>}
      {status === "speaking" && <p>🔊 Speaking...</p>}
    </div>
  );
}
