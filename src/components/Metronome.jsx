import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

const Metronome = () => {
    const { t } = useLanguage();
    const [bpm, setBpm] = useState(120);
    const [isPlaying, setIsPlaying] = useState(false);
    const [beat, setBeat] = useState(0);

    const audioCtx = useRef(null);
    const timerID = useRef(null);
    const nextNoteTime = useRef(0);
    const scheduleAheadTime = 0.1;
    const lookahead = 25.0;

    const playClick = (time, isFirstBeat) => {
        const osc = audioCtx.current.createOscillator();
        const envelope = audioCtx.current.createGain();

        osc.frequency.value = isFirstBeat ? 1000 : 800;
        envelope.gain.value = 1;
        envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

        osc.connect(envelope);
        envelope.connect(audioCtx.current.destination);

        osc.start(time);
        osc.stop(time + 0.1);
    };

    const scheduler = () => {
        while (nextNoteTime.current < audioCtx.current.currentTime + scheduleAheadTime) {
            playClick(nextNoteTime.current, beat === 0);
            const secondsPerBeat = 60.0 / bpm;
            nextNoteTime.current += secondsPerBeat;
            setBeat((prev) => (prev + 1) % 4);
        }
        timerID.current = setTimeout(scheduler, lookahead);
    };

    const toggleMetronome = () => {
        if (!isPlaying) {
            if (!audioCtx.current) {
                audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
            }
            setIsPlaying(true);
            nextNoteTime.current = audioCtx.current.currentTime;
            scheduler();
        } else {
            setIsPlaying(false);
            clearTimeout(timerID.current);
            setBeat(0);
        }
    };

    return (
        <div className="premium-card" style={{
            marginTop: '25px',
            padding: '25px',
            background: 'linear-gradient(135deg, #ffffff, #f1f5f9)',
            textAlign: 'center',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)'
        }}>
            <div style={{
                color: 'var(--accent-color)',
                fontWeight: '800',
                fontSize: '0.75rem',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                justifyContent: 'center',
                textTransform: 'uppercase',
                letterSpacing: '1px'
            }}>
                <span style={{ fontSize: '1rem' }}>⏲️</span> {t('metronome')}
            </div>

            <div style={{
                background: '#1e293b',
                padding: '15px',
                borderRadius: '12px',
                marginBottom: '20px',
                boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)',
                border: '1px solid #334155',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    fontSize: '2rem',
                    fontWeight: '800',
                    color: 'var(--secondary-color)',
                    fontFamily: 'monospace',
                    textShadow: '0 0 10px rgba(251, 191, 36, 0.3)',
                    position: 'relative',
                    zIndex: 2
                }}>{bpm}</div>
                <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: '700', position: 'relative', zIndex: 2 }}>BPM</div>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at center, rgba(251,191,36,0.1) 0%, transparent 70%)',
                    opacity: isPlaying && beat === 0 ? 1 : 0,
                    transition: 'opacity 0.1s'
                }}></div>
            </div>

            <input
                type="range"
                min="40"
                max="240"
                value={bpm}
                onChange={(e) => setBpm(parseInt(e.target.value))}
                style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--accent-color)', marginBottom: '20px' }}
            />

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
                {[0, 1, 2, 3].map((i) => (
                    <div key={i} className={isPlaying && (beat === (i + 1) % 4) ? 'metronome-pulse' : ''} style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        background: (isPlaying && (beat === (i + 1) % 4)) ? 'var(--secondary-color)' : '#e2e8f0',
                        transition: 'all 0.1s ease',
                        border: '1px solid rgba(0,0,0,0.05)'
                    }} />
                ))}
            </div>

            <button
                onClick={toggleMetronome}
                className="random-btn"
                style={{
                    background: isPlaying ? '#ef4444' : 'var(--accent-color)',
                    padding: '12px',
                    fontSize: '0.85rem'
                }}
            >
                {isPlaying ? t('stop') : t('start')}
            </button>
        </div>
    );
};

export default Metronome;
