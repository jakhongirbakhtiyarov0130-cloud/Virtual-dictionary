import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import '../App.css';

import Logo from "/images/logo.png"

// Icons
const IconUser = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const IconPhone = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;
const IconMail = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const IconAward = () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>;

const quizData = {
    uz: [
        { q: "Fortepiano necha xil turga bo'linadi?", a: ["2 xil (Royal va Pianino)", "3 xil", "1 xil", "4 xil"], correct: 0 },
        { q: "Musiqada necha xil nota bor?", a: ["5 ta", "7 ta", "10 ta", "12 ta"], correct: 1 },
        { q: "O'zbekiston davlat madhiyasi bastakori kim?", a: ["Abdulla Oripov", "Mutal Burxonov", "G'afur G'ulom", "Sherali Jo'rayev"], correct: 1 },
        { q: "Eng baland ayol ovozi qanday ataladi?", a: ["Alt", "Soprano", "Mezzo-soprano", "Tenor"], correct: 1 },
        { q: "Simfoniya janrini kim 'otasi' hisoblanadi?", a: ["Betxoven", "Motsart", "Haydn", "Bax"], correct: 2 }
    ],
    ru: [
        { q: "На какие виды делится фортепиано?", a: ["2 вида (Рояль и Пианино)", "3 вида", "1 вид", "4 вида"], correct: 0 },
        { q: "Сколько нот в музыке?", a: ["5", "7", "10", "12"], correct: 1 },
        { q: "Кто композитор государственного гимна Узбекистана?", a: ["Абдулла Орипов", "Мутал Бурханов", "Гафур Гулям", "Шерали Джураев"], correct: 1 },
        { q: "Как называется самый высокий женский голос?", a: ["Альт", "Сопрано", "Меццо-сопрано", "Тенор"], correct: 1 },
        { q: "Кто считается 'отцом' симфонического жанра?", a: ["Бетховен", "Моцарт", "Гайдн", "Бах"], correct: 2 }
    ],
    kaa: [
        { q: "Fortepiano neshe túrge bólinedi?", a: ["2 túrli (Royal hám Pianino)", "3 túrli", "1 túrli", "4 túrli"], correct: 0 },
        { q: "Musıkada neshe nota bar?", a: ["5 ta", "7 ta", "10 ta", "12 ta"], correct: 1 },
        { q: "Ózbekstan mámleketlik gimni kompozitorı kim?", a: ["Abdulla Oripov", "Mutal Burxonov", "G'afur G'ulom", "Sherali Jo'rayev"], correct: 1 },
        { q: "Eń bálent hayal dawısı qalay ataladı?", a: ["Alt", "Soprano", "Mezzo-soprano", "Tenor"], correct: 1 },
        { q: "Simfoniya janrınıń 'atası' kim esaplanadı?", a: ["Betxoven", "Motsart", "Haydn", "Bax"], correct: 2 }
    ]
};

const Quiz = () => {
    const { user } = useAuth();
    const { language, setLanguage, t } = useLanguage();

    const [gameState, setGameState] = useState('start'); // start, playing, result
    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);
    const [selected, setSelected] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);

    const questions = quizData[language] || quizData.uz;

    const handleAnswer = (idx) => {
        if (selected !== null) return;
        setSelected(idx);
        const correct = idx === questions[currentQ].correct;
        setIsCorrect(correct);
        if (correct) setScore(score + 1);

        setTimeout(() => {
            if (currentQ < questions.length - 1) {
                setCurrentQ(currentQ + 1);
                setSelected(null);
                setIsCorrect(null);
            } else {
                setGameState('result');
            }
        }, 1500);
    };

    const getLevel = () => {
        if (score === questions.length) return t('quiz_level_expert');
        if (score > questions.length / 2) return t('quiz_level_advanced');
        return t('quiz_level_beginner');
    };

    return (
        <div className="container" style={{ background: '#f4f7f6', minHeight: '100vh' }}>
            <div className="top-bar">
                <div className="top-bar-left">{t('welcome_portal')}</div>
                <div className="top-bar-info">
                    <span><IconPhone /> +998 (90) 123-45-67</span>
                    <span style={{ marginLeft: '25px' }}><IconMail /> info@libmusic.uz</span>
                </div>
            </div>

            <header className="header">
                <div className="header-left">
                    <div className="title-wrapper">
                        <img src={Logo} alt="Logo" className="site-logo" />
                        <div className="site-title-box">
                            <h1>{t('site_title')}</h1>
                            <p>{t('site_subtitle')}</p>
                        </div>
                    </div>
                </div>
                <div style={{ flex: 1 }}></div>
                <div className="user-nav">
                    <Link to="/profile" className="profile-btn">
                        <IconUser /> {user?.fullname?.split(' ')[0] || "Mehmon"}
                    </Link>
                    <select value={language} onChange={(e) => setLanguage(e.target.value)} className="lang-select">
                        <option value="uz">UZ</option>
                        <option value="ru">RU</option>
                        <option value="kaa">QAA</option>
                    </select>
                </div>
            </header>

            <nav className="main-nav">
                <ul style={{ gap: '20px' }}>
                    <li><Link to="/">{t('dictionary')}</Link></li>
                    <li><Link to="/composers">{t('composers')}</Link></li>
                    <li className="active"><Link to="/quiz" style={{ color: 'var(--accent-color)' }}>{t('quiz')}</Link></li>
                </ul>
            </nav>

            <div className="content-wrapper">
                <aside className="sidebar">
                    <div className="premium-card" style={{ padding: '25px', background: 'white' }}>
                        <h3 style={{ fontSize: '1rem', color: 'var(--accent-color)', marginBottom: '15px' }}>🏆 NATIJALAR</h3>
                        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Oxirgi natijangiz: {score} / 5</p>
                    </div>
                </aside>

                <main className="main-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className="breadcrumb" style={{ alignSelf: 'flex-start', marginBottom: '20px' }}>{t('home')} &gt; {t('quiz')}</div>

                    <div className="quiz-card" style={{
                        background: 'white',
                        borderRadius: '24px',
                        padding: '40px',
                        width: '100%',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
                        textAlign: 'center',
                        minHeight: '400px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {gameState === 'start' && (
                            <div className="fade-in">
                                <IconAward />
                                <h2 style={{ fontSize: '2rem', color: 'var(--accent-color)', margin: '20px 0' }}>{t('quiz_title')}</h2>
                                <p style={{ color: '#666', marginBottom: '30px' }}>5 ta savol orqali bilimingizni sinab ko'ring!</p>
                                <button onClick={() => setGameState('playing')} className="login-btn" style={{ maxWidth: '250px', margin: '0 auto' }}>
                                    {t('start_quiz')}
                                </button>
                            </div>
                        )}

                        {gameState === 'playing' && (
                            <div className="fade-in">
                                <div style={{ fontSize: '0.9rem', color: '#999', marginBottom: '10px' }}>{t('quiz_question')} {currentQ + 1} / {questions.length}</div>
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '30px', color: '#1e293b' }}>{questions[currentQ].q}</h2>
                                <div style={{ display: 'grid', gap: '15px' }}>
                                    {questions[currentQ].a.map((opt, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleAnswer(i)}
                                            style={{
                                                padding: '15px 25px',
                                                borderRadius: '12px',
                                                border: '2px solid',
                                                borderColor: selected === i ? (isCorrect ? '#22c55e' : '#ef4444') : '#e2e8f0',
                                                background: selected === i ? (isCorrect ? '#f0fdf4' : '#fef2f2') : 'white',
                                                cursor: selected === null ? 'pointer' : 'default',
                                                fontSize: '1rem',
                                                fontWeight: '500',
                                                transition: 'all 0.2s',
                                                textAlign: 'left'
                                            }}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {gameState === 'result' && (
                            <div className="fade-in">
                                <IconAward />
                                <h2 style={{ fontSize: '2.5rem', color: 'var(--accent-color)', margin: '10px 0' }}>{score} / {questions.length}</h2>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#334155', marginBottom: '10px' }}>{getLevel()}</div>
                                <p style={{ color: '#64748b', marginBottom: '30px' }}>Ajoyib natija! Musiqa olamini o'rganishda davom eting.</p>
                                <button onClick={() => { setGameState('start'); setCurrentQ(0); setScore(0); setSelected(null); setIsCorrect(null); }}
                                    className="btn-back" style={{ display: 'inline-block', width: 'auto', padding: '12px 40px' }}>
                                    {t('quiz_restart')}
                                </button>
                            </div>
                        )}
                    </div>
                </main>

                <aside className="right-sidebar">
                    <div className="premium-card glass" style={{ padding: '25px' }}>
                        <h3 style={{ fontSize: '1rem', color: 'var(--accent-color)', marginBottom: '10px' }}>🎯 VAZIFA</h3>
                        <p style={{ fontSize: '0.85rem', color: '#444' }}>
                            Barcha savollarga to'g'ri javob berib "Musiqa Professori" darajasini qo'lga kiriting!
                        </p>
                    </div>
                </aside>
            </div>

            <style>{`
                .fade-in { animation: fadeIn 0.5s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
            <Footer />
        </div>
    );
};

export default Quiz;
