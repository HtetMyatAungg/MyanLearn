import { useState, useRef } from 'react';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // ── Text send (unchanged) ──────────────────────────────────────────────────
  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('https://myanlearn-api.jianghenry25.workers.dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', text: data.response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, something went wrong. Try again.' }]);
    }

    setLoading(false);
  };

  // ── Voice: start recording ─────────────────────────────────────────────────
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      mediaRecorder.onstop = handleVoiceStop;

      mediaRecorder.start();
      setRecording(true);
    } catch {
      alert('Microphone access denied. Please allow microphone permissions.');
    }
  };

  // ── Voice: stop recording ──────────────────────────────────────────────────
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current?.stream.getTracks().forEach(t => t.stop());
    setRecording(false);
  };

  // ── Voice: send audio to Worker, get transcript + reply ───────────────────
  const handleVoiceStop = async () => {
    setLoading(true);
    const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });

    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');

    try {
      const res = await fetch('https://myanlearn-api.jianghenry25.workers.dev/voice', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      // Show what the user said + the AI reply in the chat
      setMessages(prev => [
        ...prev,
        { role: 'user', text: `🎙️ ${data.transcript}` },
        { role: 'assistant', text: data.response },
      ]);

      // Play TTS audio if the Worker returns it
      if (data.audio) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
        audio.play();
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, voice processing failed. Try again.' }]);
    }

    setLoading(false);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'Arial' }}>
      <h2>MyanLearn</h2>

      {/* Message history */}
      <div style={{
        height: '400px',
        overflowY: 'auto',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '15px'
      }}>
        {messages.length === 0 && (
          <p style={{ color: '#999', textAlign: 'center', marginTop: '150px' }}>
            Type or press 🎙️ to start learning!
          </p>
        )}
        {messages.map((msg, i) => (
          <div key={i} style={{
            textAlign: msg.role === 'user' ? 'right' : 'left',
            marginBottom: '10px'
          }}>
            <span style={{
              display: 'inline-block',
              padding: '10px 15px',
              borderRadius: '15px',
              backgroundColor: msg.role === 'user' ? '#DA291C' : '#f0f0f0',
              color: msg.role === 'user' ? 'white' : 'black',
              maxWidth: '80%',
              whiteSpace: 'pre-wrap'
            }}>
              {msg.text}
            </span>
          </div>
        ))}
        {loading && (
          <div style={{ textAlign: 'left', marginBottom: '10px' }}>
            <span style={{
              display: 'inline-block',
              padding: '10px 15px',
              borderRadius: '15px',
              backgroundColor: '#f0f0f0',
              color: '#999'
            }}>
              Thinking...
            </span>
          </div>
        )}
      </div>

      {/* Input row — text + mic + send */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type here..."
          disabled={recording}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '16px'
          }}
        />

        {/* Mic button */}
        <button
          onClick={recording ? stopRecording : startRecording}
          disabled={loading}
          title={recording ? 'Stop recording' : 'Start voice input'}
          style={{
            padding: '12px 16px',
            backgroundColor: recording ? '#c0392b' : '#f0f0f0',
            color: recording ? 'white' : '#333',
            border: '1px solid #ddd',
            borderRadius: '8px',
            cursor: loading ? 'default' : 'pointer',
            fontSize: '20px',
            animation: recording ? 'pulse 1s infinite' : 'none',
          }}
        >
          {recording ? '⏹️' : '🎙️'}
        </button>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={loading || recording}
          style={{
            padding: '12px 25px',
            backgroundColor: (loading || recording) ? '#ccc' : '#DA291C',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: (loading || recording) ? 'default' : 'pointer',
            fontSize: '16px'
          }}
        >
          Send
        </button>
      </div>

      {recording && (
        <p style={{ color: '#c0392b', textAlign: 'center', marginTop: '10px', fontSize: '14px' }}>
          🔴 Recording… press ⏹️ when done
        </p>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}

export default Chat;