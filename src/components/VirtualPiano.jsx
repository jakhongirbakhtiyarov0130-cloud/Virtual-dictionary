import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const VirtualPiano = ({ onClose }) => {
    const { t } = useLanguage();
    const [activeKey, setActiveKey] = useState(null);

    const playNote = (frequency) => {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 1);
    };

    const keys = [
        { note: 'C4', freq: 261.63, type: 'white' },
        { note: 'C#4', freq: 277.18, type: 'black' },
        { note: 'D4', freq: 293.66, type: 'white' },
        { note: 'D#4', freq: 311.13, type: 'black' },
        { note: 'E4', freq: 329.63, type: 'white' },
        { note: 'F4', freq: 349.23, type: 'white' },
        { note: 'F#4', freq: 369.99, type: 'black' },
        { note: 'G4', freq: 392.00, type: 'white' },
        { note: 'G#4', freq: 415.30, type: 'black' },
        { note: 'A4', freq: 440.00, type: 'white' },
        { note: 'A#4', freq: 466.16, type: 'black' },
        { note: 'B4', freq: 493.88, type: 'white' },
        { note: 'C5', freq: 523.25, type: 'white' }
    ];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="term-modal premium-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px', padding: '40px' }}>
                <button className="modal-close" onClick={onClose}>×</button>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h2 style={{ color: 'var(--accent-color)', fontSize: '1.8rem', marginBottom: '10px' }}>{t('virtual_piano')}</h2>
                    <p style={{ color: '#666' }}>Musiqiy notalarni chalib ko'ring (Sichqoncha bilan bosing)</p>
                </div>

                <div className="piano-container" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    height: '250px',
                    position: 'relative',
                    background: '#1e293b',
                    padding: '20px',
                    borderRadius: '15px',
                    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
                }}>
                    {keys.map((key, i) => (
                        <div
                            key={i}
                            onMouseDown={() => { playNote(key.freq); setActiveKey(i); }}
                            onMouseUp={() => setActiveKey(null)}
                            onMouseLeave={() => setActiveKey(null)}
                            style={{
                                width: key.type === 'white' ? '50px' : '34px',
                                height: key.type === 'white' ? '100%' : '60%',
                                background: key.type === 'white'
                                    ? (activeKey === i ? '#e2e8f0' : 'white')
                                    : (activeKey === i ? '#334155' : 'black'),
                                border: '1px solid #ccc',
                                borderRadius: '0 0 5px 5px',
                                cursor: 'pointer',
                                zIndex: key.type === 'white' ? 1 : 2,
                                marginLeft: key.type === 'white' ? '2px' : '-17px',
                                marginRight: key.type === 'white' ? '2px' : '-17px',
                                transition: 'background 0.1s',
                                boxShadow: key.type === 'white' ? '0 4px 0 #ddd' : '0 4px 0 #000',
                                position: 'relative'
                            }}
                        >
                            {key.type === 'white' && (
                                <span style={{
                                    position: 'absolute',
                                    bottom: '10px',
                                    width: '100%',
                                    textAlign: 'center',
                                    fontSize: '0.7rem',
                                    color: '#999',
                                    fontWeight: 'bold'
                                }}>{key.note}</span>
                            )}
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '30px', textAlign: 'center', color: '#888', fontSize: '0.9rem' }}>
                    *Bu funksiya Web Audio API yordamida brauzeringizda tovush hosil qiladi.
                </div>
            </div>
        </div>
    );
};

export default VirtualPiano;
