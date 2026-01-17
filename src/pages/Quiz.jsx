import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import '../App.css';

import Logo from "/images/logo.png"

// Icons
const IconUser = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const IconPhone = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;
const IconMail = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const IconTrophy = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="gold" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>;
const IconMedal = ({ color }) => <svg width="20" height="20" viewBox="0 0 24 24" fill={color} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>;
const IconPlay = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>;

const Quiz = () => {
    const { user } = useAuth();
    const { language, setLanguage, t } = useLanguage();
    const navigate = useNavigate();
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        // Load results from localStorage
        const savedResults = JSON.parse(localStorage.getItem('quiz_results') || '[]');
        // Sort by score desc
        const sorted = savedResults.sort((a, b) => b.score - a.score);
        setLeaderboard(sorted);
    }, []);

    const startQuiz = () => {
        const confirmMsg = "Test boshlanmoqda. Iltimos diqqat qiling:\n\n1. Oynani yoki tabni almashtirmang.\n2. Kameraga qarab turing.\n\nTayyormisiz?";
        if (window.confirm(confirmMsg)) {
            navigate('/quiz/active');
        }
    };

    const renderLeaderboardList = (limit, offset = 0) => {
        const list = leaderboard.slice(offset, offset + limit);
        if (!list.length) return <p style={{ color: '#999', fontStyle: 'italic' }}>Hali natijalar yo'q</p>;

        return (
            <ul className="leaderboard-list">
                {list.map((r, i) => (
                    <li key={i} className={`rank-${offset + i + 1}`}>
                        <div className="rank-num">{offset + i + 1}</div>
                        <div className="user-info">
                            <span className="user-name">{r.user}</span>
                            <span className="user-date">{new Date(r.date).toLocaleDateString()}</span>
                        </div>
                        <div className="user-score">{r.score} / {r.total}</div>
                    </li>
                ))}
            </ul>
        );
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
                    <li><Link to="/theory">{t('theory')}</Link></li>
                    <li><Link to="/composers">{t('composers')}</Link></li>
                    <li className="active"><Link to="/quiz" style={{ color: 'var(--accent-color)' }}>{t('quiz')}</Link></li>
                    <li><Link to="/omr">{t('omr')}</Link></li>
                </ul>
            </nav>

            <div className="content-wrapper" style={{ display: 'block' }}>
                <div className="quiz-hero premium-card" style={{ marginBottom: '30px', textAlign: 'center', padding: '50px', background: 'linear-gradient(135deg, var(--accent-color), #00224a)', color: 'white' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}><IconTrophy /></div>
                    <h2 style={{ fontSize: '3rem', marginBottom: '10px' }}>Musiqiy Viktorina</h2>
                    <p style={{ fontSize: '1.2rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto 30px' }}>
                        30 ta savoldan iborat maxsus test. Bilimingizni sinang va reytingda yuqori o'ringa chiqing!
                    </p>
                    <button onClick={startQuiz} className="start-btn pulse-anim">
                        <IconPlay /> TESTNI BOSHLASH
                    </button>
                    <div style={{ marginTop: '20px', fontSize: '0.9rem', opacity: 0.8 }}>
                        ⚠️ Diqqat: Test paytida kamera yoqilgan bo'lishi shart.
                    </div>
                </div>

                <div className="leaderboard-grid">
                    <div className="premium-card highlight-card">
                        <h3><IconMedal color="gold" /> TOP 3 (Oltin)</h3>
                        {renderLeaderboardList(3)}
                    </div>
                    <div className="premium-card">
                        <h3>TOP 5</h3>
                        {renderLeaderboardList(2, 3)}
                        <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '10px' }}>(4 va 5-o'rinlar)</p>
                    </div>
                    <div className="premium-card">
                        <h3>TOP 10</h3>
                        {renderLeaderboardList(5, 5)}
                    </div>
                </div>

                {leaderboard.length > 0 && (
                    <div className="premium-card" style={{ marginTop: '30px', background: '#ecfdf5', border: '1px solid #10b981' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ background: '#059669', color: 'white', padding: '10px', borderRadius: '50%' }}>
                                <IconTrophy />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.9rem', color: '#047857', fontWeight: 'bold', textTransform: 'uppercase' }}>Mutlaq Rekord</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#064e3b' }}>
                                    {leaderboard[0].user} — {leaderboard[0].score} ball
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .leaderboard-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 20px;
                }
                .start-btn {
                    padding: 15px 40px;
                    font-size: 1.5rem;
                    background: #f59e0b;
                    color: white;
                    border: none;
                    border-radius: 50px;
                    cursor: pointer;
                    font-weight: bold;
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    transition: transform 0.2s;
                    box-shadow: 0 10px 20px rgba(245, 158, 11, 0.4);
                }
                .start-btn:hover {
                    transform: scale(1.05);
                }
                .pulse-anim {
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7); }
                    70% { box-shadow: 0 0 0 20px rgba(245, 158, 11, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
                }
                .leaderboard-list {
                    list-style: none;
                    padding: 0;
                }
                .leaderboard-list li {
                    display: flex;
                    align-items: center;
                    padding: 12px;
                    border-bottom: 1px solid #eee;
                }
                .leaderboard-list li:last-child { border-bottom: none; }
                .rank-num {
                    width: 30px;
                    height: 30px;
                    background: #eee;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    margin-right: 15px;
                    color: #555;
                }
                .rank-1 .rank-num { background: gold; color: white; }
                .rank-2 .rank-num { background: silver; color: white; }
                .rank-3 .rank-num { background: #cd7f32; color: white; }
                
                .user-info { flex: 1; }
                .user-name { display: block; font-weight: 600; color: #334155; }
                .user-date { font-size: 0.75rem; color: #94a3b8; }
                .user-score { font-weight: 800; color: var(--accent-color); font-size: 1.1rem; }
            `}</style>

            <Footer />
        </div>
    );
};

export default Quiz;
