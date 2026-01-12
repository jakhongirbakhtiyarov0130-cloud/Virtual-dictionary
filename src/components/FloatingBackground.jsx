import React, { useEffect, useState } from 'react';

const MusicalNote = ({ type, style }) => {
    // Elegant Musical Note SVGs
    const notes = {
        clef: (
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C10.5 2 9.2 2.8 8.4 4C7.6 5.2 7.2 6.7 7.2 8.3C7.2 11.5 9.2 14.5 12 16.5V11H16V9H12V3.1C13.5 3.5 14.8 4.5 15.6 5.8L17.2 4.6C16.1 2.8 14.2 1.5 12 1.1V1H12.1L12 2Z" />
            </svg>
        ),
        quaver: (
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
        ),
        doubleQuaver: (
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 3h-6v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h2v6.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V3z" />
            </svg>
        )
    };

    return (
        <div className="floating-note" style={style}>
            {notes[type] || notes.quaver}
        </div>
    );
};

const FloatingBackground = ({ showStickman = false }) => {
    // We ignore showStickman as per user request to remove "bad stickers"
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        const types = ['clef', 'quaver', 'doubleQuaver'];
        const newNotes = Array.from({ length: 15 }).map((_, i) => ({
            id: i,
            type: types[Math.floor(Math.random() * types.length)],
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            size: 20 + Math.random() * 40 + 'px',
            duration: 15 + Math.random() * 20 + 's',
            delay: Math.random() * 10 + 's',
            opacity: 0.05 + Math.random() * 0.1
        }));
        setNotes(newNotes);
    }, []);

    return (
        <div className="floating-background" style={{ pointerEvents: 'none' }}>
            {notes.map(note => (
                <MusicalNote
                    key={note.id}
                    type={note.type}
                    style={{
                        position: 'absolute',
                        left: note.left,
                        top: note.top,
                        width: note.size,
                        height: note.size,
                        animation: `floatAround ${note.duration} linear infinite`,
                        animationDelay: note.delay,
                        opacity: note.opacity,
                        color: 'var(--accent-color)',
                        pointerEvents: 'none'
                    }}
                />
            ))}
            <style>
                {`
                @keyframes floatAround {
                    0% { transform: translate(0, 0) rotate(0deg); }
                    33% { transform: translate(30px, 50px) rotate(10deg); }
                    66% { transform: translate(-20px, 80px) rotate(-10deg); }
                    100% { transform: translate(0, 0) rotate(0deg); }
                }
                `}
            </style>
        </div>
    );
};

export default FloatingBackground;
