import React, { useState, useEffect, useRef } from 'react';
const App = () => {
  const [isActive, setIsActive] = useState(false);
  const [frequencies, setFrequencies] = useState(new Array(12).fill(0));
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationRef = useRef(null);
  const startAnalyzer = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 64;
      dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
      setIsActive(true);
      const update = () => {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        setFrequencies(Array.from({ length: 12 }, (_, i) => dataArrayRef.current[i] || 0));
        animationRef.current = requestAnimationFrame(update);
      };
      update();
    } catch (err) { console.error(err); }
  };
  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '40px' }}>
      <h1 style={{ color: '#00f2ff', fontStyle: 'italic' }}>NEXUS 12-BAND ANALYZER</h1>
      <div style={{ background: '#111', height: '300px', display: 'flex', alignItems: 'flex-end', gap: '5px', padding: '20px', borderRadius: '20px', position: 'relative' }}>
        {frequencies.map((v, i) => (
          <div key={i} style={{ flex: 1, backgroundColor: '#00f2ff', height: (v/255)*100 + '%', borderRadius: '5px 5px 0 0' }} />
        ))}
        {!isActive && (
          <button onClick={startAnalyzer} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '15px 30px', borderRadius: '50px', cursor: 'pointer' }}>
            START ANALYZER
          </button>
        )}
      </div>
    </div>
  );
};
export default App;
