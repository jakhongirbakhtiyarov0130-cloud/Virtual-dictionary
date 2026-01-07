import React, { useEffect, useState } from 'react';

const terms = [
    "Allegro", "Adagio", "Piano", "Forte", "Crescendo",
    "Vivo", "Largo", "Presto", "Coda", "Da Capo",
    "Staccato", "Legato", "Andante", "Dolce", "Vivace"
];

const Stickman = () => {
    const [stickmanState, setStickmanState] = useState('idle'); // idle, throwing, pulling, holding, throwing_term, moving
    const [caughtTerm, setCaughtTerm] = useState(null);
    const [position, setPosition] = useState({ x: 80, y: 80 }); // Start bottom-right
    const [transitionDur, setTransitionDur] = useState('1s');

    // Re-implementing logic to be cleaner inside the component body:

    const moveStickman = () => {
        setStickmanState('moving');
        const newX = Math.random() * 80 + 10;
        const newY = Math.random() * 80 + 10;

        const isFast = Math.random() > 0.5;
        const duration = isFast ? 0.8 : 3.0; // Fast dash or slow crawl

        setTransitionDur(`${duration}s`);
        setPosition({ x: newX, y: newY });

        setTimeout(() => {
            setStickmanState('idle');
            decideNextAction();
        }, duration * 1000 + 200);
    };

    const decideNextAction = () => {
        const r = Math.random();
        if (r > 0.4) {
            moveStickman();
        } else {
            startCatchSequence();
        }
    };

    const startCatchSequence = () => {
        setStickmanState('throwing');
        setTransitionDur('0.5s'); // Quick turn to throw

        // 1. Throw Rope (1s)
        setTimeout(() => {
            const randomTerm = terms[Math.floor(Math.random() * terms.length)];
            setCaughtTerm(randomTerm);
            setStickmanState('pulling');

            // 2. Pull Back (1.5s)
            setTimeout(() => {
                setStickmanState('holding');

                // 3. Hold briefly (0.5s)
                setTimeout(() => {
                    setStickmanState('throwing_term');

                    // 4. Throw Away (1s)
                    setTimeout(() => {
                        setCaughtTerm(null);
                        setStickmanState('idle');
                        decideNextAction();
                    }, 1000);
                }, 500);

            }, 1500);

        }, 1000);
    };

    // Initialize
    useEffect(() => {
        const t = setTimeout(decideNextAction, 1000);
        return () => clearTimeout(t);
    }, []);


    return (
        <div
            className="stickman-container"
            style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                bottom: 'auto',
                right: 'auto',
                transition: `top ${transitionDur} ease-in-out, left ${transitionDur} ease-in-out`
            }}
        >
            {/* Caught Term Animation */}
            {caughtTerm && (
                <div
                    className="caught-term"
                    style={{
                        animation: stickmanState === 'pulling'
                            ? 'termPull 1.5s ease-in forwards'
                            : (stickmanState === 'throwing_term' ? 'termThrow 1s ease-out forwards' : 'none'),
                        opacity: (stickmanState === 'pulling' || stickmanState === 'holding' || stickmanState === 'throwing_term') ? 1 : 0,
                        transform: stickmanState === 'holding' ? 'scale(0.5)' : 'none',
                        top: stickmanState === 'holding' ? '70px' : (stickmanState === 'throwing_term' ? '70px' : '60px'),
                        left: stickmanState === 'holding' ? '75px' : (stickmanState === 'throwing_term' ? '75px' : '100px'),
                    }}
                >
                    {caughtTerm}
                </div>
            )}

            <svg className="stickman-svg" viewBox="0 0 150 200">
                {/* Rope */}
                <path
                    d={stickmanState === 'throwing' || stickmanState === 'pulling'
                        ? "M 115 85 Q 200 20 280 -100"
                        : "M 115 85 Q 120 100 115 120"}
                    className="rope"
                    style={{
                        strokeDasharray: 300,
                        strokeDashoffset: (stickmanState === 'throwing') ? 0 : 300,
                        transition: stickmanState === 'throwing' ? 'stroke-dashoffset 1s ease-out' : 'stroke-dashoffset 1.5s ease-in',
                        opacity: (stickmanState === 'throwing' || stickmanState === 'pulling') ? 1 : 0
                    }}
                />

                {/* Body */}
                <circle cx="75" cy="40" r="15" className="stickman-head" />
                <line x1="75" y1="55" x2="75" y2="120" className="stickman-body" />

                {/* Legs: Animate when moving */}
                <g style={{
                    animation: stickmanState === 'moving' ? 'legMove 0.5s infinite alternate' : 'none',
                    transformOrigin: '75px 120px'
                }}>
                    <line x1="75" y1="120" x2="55" y2="180" className="stickman-leg" />
                    <line x1="75" y1="120" x2="95" y2="180" className="stickman-leg" />
                </g>

                {/* Arms */}
                <line x1="75" y1="70" x2="45" y2="100" className="stickman-arm-fixed" />

                {/* Right Arm (Animated) */}
                <g style={{
                    transformOrigin: '75px 70px',
                    transform: stickmanState === 'throwing' ? 'rotate(-45deg)'
                        : (stickmanState === 'pulling' ? 'rotate(20deg)'
                            : (stickmanState === 'throwing_term' ? 'rotate(-135deg)'
                                : 'rotate(0deg)')),
                    transition: stickmanState === 'throwing_term' ? 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'transform 0.5s'
                }}>
                    <line x1="75" y1="70" x2="115" y2="85" className="stickman-body" />
                </g>
            </svg>
        </div>
    );
};

const FloatingBackground = ({ showStickman = true }) => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        // Generate random positions and delays
        const newItems = terms.map((term, index) => ({
            id: index,
            text: term,
            left: Math.random() * 90 + '%', // 0-90% width
            top: Math.random() * 90 + '%',  // 0-90% height
            animationDuration: 15 + Math.random() * 20 + 's', // 15-35s duration
            animationDelay: Math.random() * 5 + 's', // 0-5s delay
            fontSize: 1 + Math.random() * 1.5 + 'rem', // 1rem - 2.5rem size
            opacity: 0.1 + Math.random() * 0.2 // 0.1 - 0.3 opacity
        }));
        setItems(newItems);
    }, []);

    return (
        <div className="floating-background">
            {items.map(item => (
                <div
                    key={item.id}
                    className="floating-term"
                    style={{
                        left: item.left,
                        top: item.top,
                        animationDuration: item.animationDuration,
                        animationDelay: item.animationDelay,
                        fontSize: item.fontSize,
                        opacity: item.opacity
                    }}
                >
                    {item.text}
                </div>
            ))}
            {showStickman && <Stickman />}
        </div>
    );
};

export default FloatingBackground;
