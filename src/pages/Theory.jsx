import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import '../App.css';
import { lessons } from '../data/theoryData';

import Logo from "/images/logo.png"

// Icons
const IconUser = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const IconPhone = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;
const IconMail = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const IconBookOpen = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>;
const IconCheck = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const IconPlay = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>;
const IconLock = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;

const Theory = () => {
    const { user } = useAuth();
    const { language, setLanguage, t } = useLanguage();
    const [activeLesson, setActiveLesson] = useState(null);

    // Progress state: Stores the ID of the highest unlocked lesson. Default is 1.
    const [maxUnlockedLesson, setMaxUnlockedLesson] = useState(1);

    // Initialize from localStorage if available
    useEffect(() => {
        const savedProgress = localStorage.getItem('music_theory_progress');
        if (savedProgress) {
            setMaxUnlockedLesson(parseInt(savedProgress, 10));
        }
    }, []);

    // Save progress when it changes
    useEffect(() => {
        localStorage.setItem('music_theory_progress', maxUnlockedLesson.toString());
    }, [maxUnlockedLesson]);

    // Lessons are imported from ../data/theoryData

    const handleCompleteLesson = (lessonId) => {
        if (lessonId === maxUnlockedLesson && lessonId < lessons.length) {
            setMaxUnlockedLesson(prev => prev + 1);
        }
        // If not last lesson, move to next
        if (lessonId < lessons.length) {
            setActiveLesson(lessonId + 1);
        }
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
                    <li className="active"><Link to="/theory" style={{ color: 'var(--accent-color)' }}>{t('theory')}</Link></li>
                    <li><Link to="/composers">{t('composers')}</Link></li>
                    <li><Link to="/quiz">{t('quiz')}</Link></li>
                </ul>
            </nav>

            <div className="content-wrapper" style={{ flexDirection: 'column' }}>
                <div className="breadcrumb" style={{ marginBottom: '20px' }}>{t('home')} &gt; {t('theory')}</div>

                <div className="theory-container" style={{ display: 'flex', gap: '30px', alignItems: 'flex-start', flexWrap: 'wrap' }}>

                    {/* Left Sidebar: Lesson List */}
                    <div className="theory-list" style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-color)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <IconBookOpen /> {t('lesson')}lar
                        </h3>
                        <div style={{ maxHeight: '80vh', overflowY: 'auto', paddingRight: '5px' }}>
                            {lessons.map((item) => {
                                const isLocked = item.id > maxUnlockedLesson;
                                return (
                                    <div
                                        key={item.id}
                                        className={`premium-card glass ${activeLesson === item.id ? 'active-lesson' : ''}`}
                                        style={{
                                            padding: '20px',
                                            marginBottom: '15px',
                                            background: activeLesson === item.id ? 'var(--accent-color)' : (isLocked ? '#e2e8f0' : 'white'),
                                            color: activeLesson === item.id ? 'white' : (isLocked ? '#94a3b8' : '#1e293b'),
                                            cursor: isLocked ? 'not-allowed' : 'pointer',
                                            transition: 'all 0.3s',
                                            borderLeft: `5px solid ${activeLesson === item.id ? 'var(--secondary-color)' : 'transparent'}`,
                                            opacity: isLocked ? 0.6 : (activeLesson && activeLesson !== item.id ? 0.7 : 1),
                                            display: 'flex',
                                            flexDirection: 'column',
                                            position: 'relative'
                                        }}
                                        onClick={() => !isLocked && setActiveLesson(item.id)}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                            <span style={{
                                                background: activeLesson === item.id ? 'rgba(255,255,255,0.2)' : (isLocked ? '#cbd5e1' : 'var(--accent-color)'),
                                                color: 'white',
                                                padding: '3px 10px',
                                                borderRadius: '15px',
                                                fontSize: '0.7rem',
                                                fontWeight: 'bold',
                                                textTransform: 'uppercase'
                                            }}>
                                                {t('day')} {item.id}
                                            </span>
                                            {isLocked ? <IconLock /> : (item.id < maxUnlockedLesson ? <IconCheck /> : (activeLesson === item.id ? <IconPlay /> : null))}
                                        </div>
                                        <h4 style={{ fontSize: '1rem', marginBottom: '5px', lineHeight: '1.4' }}>{item.title}</h4>
                                        <p style={{ fontSize: '0.8rem', opacity: 0.8, display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.desc}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Content Area */}
                    <div className="theory-content" style={{ flex: '2 1 500px', minWidth: '300px' }}>
                        {activeLesson ? (
                            <div className="premium-card" style={{ padding: '40px', background: 'white', minHeight: '500px', animation: 'fadeIn 0.5s' }}>
                                {(() => {
                                    const lesson = lessons.find(l => l.id === activeLesson);
                                    return (
                                        <>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px' }}>
                                                <div>
                                                    <span style={{ color: 'var(--accent-color)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem' }}>{t('day')} {lesson.id}</span>
                                                    <h1 style={{ fontSize: '2rem', color: '#1e293b', marginTop: '5px', lineHeight: '1.2' }}>{lesson.title}</h1>
                                                </div>
                                                <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '50%', color: 'var(--accent-color)' }}>
                                                    <IconBookOpen />
                                                </div>
                                            </div>

                                            {/* Video Player */}
                                            {lesson.videoId && (
                                                <div className="video-container" style={{ marginBottom: '30px', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                                                    <iframe
                                                        width="100%"
                                                        height="400"
                                                        src={`https://www.youtube.com/embed/${lesson.videoId}`}
                                                        title={lesson.title}
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    ></iframe>
                                                </div>
                                            )}

                                            <div
                                                className="lesson-body"
                                                style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#334155' }}
                                                dangerouslySetInnerHTML={{ __html: lesson.content }}
                                            />

                                            <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>

                                                {/* Completion Info */}
                                                <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
                                                    <p style={{ fontStyle: 'italic', color: '#64748b', marginBottom: '15px' }}>
                                                        Keyingi darsga o'tish uchun quyidagi tugmani bosing va videoni to'liq ko'rganingizni tasdiqlang.
                                                    </p>
                                                    <button
                                                        onClick={() => handleCompleteLesson(lesson.id)}
                                                        className="login-btn"
                                                        style={{
                                                            width: 'auto',
                                                            padding: '12px 30px',
                                                            background: 'linear-gradient(45deg, var(--accent-color), var(--secondary-color))',
                                                            boxShadow: '0 4px 15px rgba(var(--accent-rgb), 0.3)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '10px'
                                                        }}
                                                    >
                                                        {lesson.id === maxUnlockedLesson && lesson.id < lessons.length ? (
                                                            <>Darsni yakunlash va Keyingisiga o'tish &rarr;</>
                                                        ) : (
                                                            <>Keyingi dars &rarr;</>
                                                        )}
                                                    </button>
                                                </div>

                                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                                    <button
                                                        onClick={() => setActiveLesson(prev => prev > 1 ? prev - 1 : prev)}
                                                        disabled={activeLesson === 1}
                                                        className="action-btn"
                                                        style={{ opacity: activeLesson === 1 ? 0.5 : 1, cursor: activeLesson === 1 ? 'not-allowed' : 'pointer', background: '#e2e8f0', color: '#475569' }}
                                                    >
                                                        &larr; Oldingi dars
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>
                        ) : (
                            // Welcome State (No lesson selected)
                            <div className="premium-card" style={{
                                padding: '50px',
                                background: 'linear-gradient(135deg, var(--accent-color), var(--secondary-color))',
                                color: 'white',
                                textAlign: 'center',
                                borderRadius: '20px',
                                position: 'relative',
                                overflow: 'hidden',
                                minHeight: '400px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px' }}>
                                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}><IconPlay /></div>
                                    <h2 style={{ fontSize: '2.5rem', marginBottom: '15px' }}>{t('theory')}</h2>
                                    <p style={{ fontSize: '1.2rem', opacity: 0.9, lineHeight: '1.6', marginBottom: '30px' }}>
                                        Musiqiy savodxonlik dunyosiga xush kelibsiz! <br />
                                        O'rganishni boshlash uchun chap tomondagi darslardan birini tanlang.
                                    </p>
                                    <button
                                        className="login-btn"
                                        style={{ background: 'white', color: 'var(--accent-color)', width: 'auto', padding: '15px 40px', fontWeight: 'bold' }}
                                        onClick={() => setActiveLesson(maxUnlockedLesson)}
                                    >
                                        Davom ettirish ({maxUnlockedLesson}-dars)
                                    </button>
                                </div>
                                <div style={{ position: 'absolute', top: '-10%', right: '-10%', opacity: 0.1 }}>
                                    <svg width="400" height="400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" /></svg>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .lesson-card:hover {
                    transfrom: translateY(-5px);
                    box-shadow: 0 15px 30px rgba(0,0,0,0.1);
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <Footer />
        </div>
    );
};

export default Theory;
