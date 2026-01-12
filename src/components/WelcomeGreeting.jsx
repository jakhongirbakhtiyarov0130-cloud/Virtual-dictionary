import React, { useEffect, useRef } from 'react';

const WelcomeConfetti = ({ onComplete }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Confetti particles
        const particles = [];
        const particleCount = 150;
        const colors = ['#00479A', '#FFD700', '#FF6B6B', '#4ECDC4', '#95E1D3', '#F38181'];

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height - canvas.height;
                this.size = Math.random() * 8 + 4;
                this.speedY = Math.random() * 3 + 2;
                this.speedX = Math.random() * 2 - 1;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.rotation = Math.random() * 360;
                this.rotationSpeed = Math.random() * 10 - 5;
                this.opacity = 1;
            }

            update() {
                this.y += this.speedY;
                this.x += this.speedX;
                this.rotation += this.rotationSpeed;

                // Fade out near bottom
                if (this.y > canvas.height * 0.8) {
                    this.opacity -= 0.02;
                }

                // Reset if out of bounds
                if (this.y > canvas.height || this.opacity <= 0) {
                    this.y = -20;
                    this.x = Math.random() * canvas.width;
                    this.opacity = 1;
                }
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.translate(this.x, this.y);
                ctx.rotate((this.rotation * Math.PI) / 180);
                ctx.fillStyle = this.color;

                // Draw confetti as rectangles
                ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 1.5);

                ctx.restore();
            }
        }

        // Create particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        let animationFrameId;
        let startTime = Date.now();
        const duration = 4000; // 4 seconds

        const animate = () => {
            const elapsed = Date.now() - startTime;

            if (elapsed > duration) {
                cancelAnimationFrame(animationFrameId);
                if (onComplete) onComplete();
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, [onComplete]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 9999
            }}
        />
    );
};

const WelcomeModal = ({ userName, onClose }) => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            animation: 'fadeIn 0.3s ease-out'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '20px',
                padding: '50px 60px',
                textAlign: 'center',
                maxWidth: '500px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                animation: 'scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}>
                <div style={{
                    fontSize: '4rem',
                    marginBottom: '20px',
                    animation: 'wave 1s ease-in-out infinite'
                }}>👋</div>
                <h2 style={{
                    fontSize: '2rem',
                    color: 'var(--accent-color)',
                    marginBottom: '15px',
                    fontWeight: 700
                }}>
                    Xush kelibsiz, {userName}!
                </h2>
                <p style={{
                    fontSize: '1.1rem',
                    color: '#666',
                    marginBottom: '30px',
                    lineHeight: '1.6'
                }}>
                    Virtual Musiqa Lug'ati portaliga birinchi marta tashrif buyurganingiz uchun tashakkur!
                    Musiqa dunyosini birga kashf etamiz! 🎵
                </p>
                <button
                    onClick={onClose}
                    style={{
                        background: 'var(--accent-color)',
                        color: 'white',
                        border: 'none',
                        padding: '15px 40px',
                        borderRadius: '50px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        boxShadow: '0 4px 15px rgba(0, 71, 154, 0.3)'
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >
                    Boshlash
                </button>
            </div>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { transform: scale(0.8); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                @keyframes wave {
                    0%, 100% { transform: rotate(0deg); }
                    25% { transform: rotate(-10deg); }
                    75% { transform: rotate(10deg); }
                }
            `}</style>
        </div>
    );
};

const WelcomeGreeting = ({ userName }) => {
    const [showModal, setShowModal] = React.useState(true);
    const [showConfetti, setShowConfetti] = React.useState(true);

    const handleClose = () => {
        setShowModal(false);
        // Confetti continues for a bit after modal closes
        setTimeout(() => setShowConfetti(false), 1500);
    };

    return (
        <>
            {showConfetti && <WelcomeConfetti onComplete={() => setShowConfetti(false)} />}
            {showModal && <WelcomeModal userName={userName} onClose={handleClose} />}
        </>
    );
};

export default WelcomeGreeting;
