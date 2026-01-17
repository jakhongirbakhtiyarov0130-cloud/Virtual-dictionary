import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { quizData } from '../data/quizData';

const ActiveQuiz = () => {
    const { user } = useAuth();
    const { language, t } = useLanguage();
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const [cameraActive, setCameraActive] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 mins
    const [violationCount, setViolationCount] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAnswer, setSelectedAnswer] = useState(null);

    // Initialize Quiz
    useEffect(() => {
        // Shuffle and pick 30 questions (or all if <30)
        const allQuestions = [...(quizData[language] || quizData.uz)];
        // Fisher-Yates shuffle
        for (let i = allQuestions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
        }
        setQuestions(allQuestions);
        setIsLoading(false);

        // Request Camera
        startCamera();

        // Anti-Cheat: Tab Visibility
        const handleVisibilityChange = () => {
            if (document.hidden) {
                handleViolation("Tabdan chiqish yoki oynani almashtirish taqiqlanadi!");
            }
        };

        const handleBlur = () => {
            handleViolation("Diqqat! Ekranni tark etmang.");
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleBlur);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("blur", handleBlur);
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setCameraActive(true);
            }
        } catch (err) {
            alert("Kamerani yoqish majburiy! Ruxsat bering.");
            navigate('/quiz');
        }
    };

    const handleViolation = (msg) => {
        setViolationCount(prev => {
            const newCount = prev + 1;
            if (newCount >= 3) {
                alert("Siz qoidalarni juda ko'p buzdingiz! Test bekor qilindi.");
                navigate('/quiz');
            } else {
                alert(`Ogohlantirish ${newCount}/3: ${msg}`);
            }
            return newCount;
        });
    };

    const handleAnswer = (idx) => {
        setSelectedAnswer(idx);
        // Delay for visual feedback
        setTimeout(() => {
            if (idx === questions[currentQuestion].correct) {
                setScore(prev => prev + 1);
            }

            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(prev => prev + 1);
                setSelectedAnswer(null);
            } else {
                finishQuiz(score + (idx === questions[currentQuestion].correct ? 1 : 0));
            }
        }, 500);
    };

    const finishQuiz = (finalScore) => {
        const history = JSON.parse(localStorage.getItem('quiz_results') || '[]');
        const result = {
            id: Date.now(),
            user: user?.fullname || user?.username || "Noma'lum",
            score: finalScore,
            total: questions.length,
            date: new Date().toISOString()
        };
        history.push(result);
        localStorage.setItem('quiz_results', JSON.stringify(history));

        // Show result alert or modal logic here, but for now redirect
        alert(`Test yakunlandi! Natijangiz: ${finalScore}/${questions.length}`);
        navigate('/quiz');
    };

    // Prevent right click
    useEffect(() => {
        const handleContextMenu = (e) => e.preventDefault();
        document.addEventListener('contextmenu', handleContextMenu);
        return () => document.removeEventListener('contextmenu', handleContextMenu);
    }, []);

    if (isLoading || !questions.length) return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>Yuklanmoqda...</div>;

    const currentQData = questions[currentQuestion];

    return (
        <div className="active-quiz-container">
            <div className="camera-box">
                <video ref={videoRef} autoPlay playsInline muted className="camera-feed" />
                <div className="camera-status">
                    <div className={`status-dot ${cameraActive ? 'active' : ''}`}></div>
                    {cameraActive ? "Kuzatuv faol" : "Kamera ulanmoqda..."}
                </div>
            </div>

            <div className="quiz-main-area">
                <div className="quiz-header-bar">
                    <div>Savol: {currentQuestion + 1} / {questions.length}</div>
                    <div style={{ color: '#ef4444' }}>Ogohlantirishlar: {violationCount}/3</div>
                </div>

                <div className="question-card">
                    <h2>{currentQData.q}</h2>
                    <div className="options-grid">
                        {currentQData.a.map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => handleAnswer(i)}
                                disabled={selectedAnswer !== null}
                                className={`option-btn ${selectedAnswer === i ? 'selected' : ''}`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                .active-quiz-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: #0f172a;
                    z-index: 9999;
                    color: white;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
                .camera-box {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    width: 150px;
                    height: 110px;
                    background: black;
                    border: 2px solid var(--accent-color);
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.5);
                }
                .camera-feed {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .camera-status {
                    position: absolute;
                    bottom: 5px;
                    left: 5px;
                    font-size: 0.6rem;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    background: rgba(0,0,0,0.5);
                    padding: 2px 5px;
                    border-radius: 4px;
                }
                .status-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: red;
                }
                .status-dot.active { background: #22c55e; }
                
                .quiz-main-area {
                    max-width: 800px;
                    width: 90%;
                    text-align: center;
                }
                .quiz-header-bar {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 20px;
                    font-size: 1.2rem;
                    background: rgba(255,255,255,0.1);
                    padding: 10px 20px;
                    border-radius: 10px;
                }
                .question-card h2 {
                    font-size: 2rem;
                    margin-bottom: 40px;
                    line-height: 1.3;
                }
                .options-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }
                .option-btn {
                    padding: 20px;
                    background: rgba(255,255,255,0.1);
                    border: 1px solid rgba(255,255,255,0.2);
                    color: white;
                    font-size: 1.1rem;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .option-btn:hover:not(:disabled) {
                    background: var(--accent-color);
                    transform: translateY(-2px);
                }
                .option-btn.selected {
                    background: var(--accent-color);
                    border-color: white;
                }
                @media (max-width: 600px) {
                    .options-grid { grid-template-columns: 1fr; }
                    .camera-box { width: 100px; height: 75px; }
                }
            `}</style>
        </div>
    );
};

export default ActiveQuiz;
