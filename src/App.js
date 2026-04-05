import { useState } from 'react';
import Chat from './chat';

function App() {
  const [started, setStarted] = useState(false);

  if (started) return <Chat />;

  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', fontFamily: 'Arial' }}>
      <h1>MyanLearn</h1>
      <p style={{ fontSize: '24px', color: '#555' }}>
        You can speak it. Now learn to read it.
      </p>
      <p style={{ maxWidth: '600px', margin: '20px auto', fontSize: '16px', lineHeight: '1.6' }}>
        Millions of us grew up speaking Burmese but never master to read and write it. 
        MyanLearn uses AI to teach you the script through the words you already.
      </p>
      <button onClick={() => setStarted(true)} style={{
        padding: '15px 40px',
        fontSize: '18px',
        backgroundColor: '#DA291C',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        marginTop: '20px'
      }}>
        Start Learning
      </button>
    </div>
  );
}

export default App;