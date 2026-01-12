import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import FloatingBackground from '../components/FloatingBackground';
import Footer from '../components/Footer';
import '../App.css';

import Logo from "/images/logo.png"

// Icons
const IconUser = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const IconPhone = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;
const IconMail = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;

const Profile = () => {
    const { user, logout } = useAuth();
    const { language, setLanguage, t } = useLanguage();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) {
        return (
            <div style={{ textAlign: 'center', marginTop: '100px' }}>
                <p>Foydalanuvchi ma'lumotlari topilmadi.</p>
                <Link to="/login" style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>Tizimga kirish</Link>
            </div>
        );
    }

    return (
        <div className="container" style={{ background: '#f4f7f6', minHeight: '100vh' }}>
            <FloatingBackground showStickman={false} />

            <div className="top-bar">
                <div className="top-bar-left">
                    {t('welcome_portal')}
                </div>
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
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="lang-select"
                    >
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
                    <li><Link to="/quiz">{t('quiz')}</Link></li>
                </ul>
            </nav>

            <div className="content-wrapper" style={{ maxWidth: '900px', margin: '30px auto', padding: '0 20px', gridTemplateColumns: '1fr' }}>
                <main className="main-content">
                    <div className="breadcrumb" style={{ marginBottom: '20px' }}>{t('home')} &gt; {t('profile')}</div>

                    <div className="profile-card" style={{
                        background: 'white',
                        borderRadius: '20px',
                        padding: '50px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        textAlign: 'center'
                    }}>
                        <div className="profile-avatar-large" style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--accent-color), var(--secondary-color))',
                            color: 'white',
                            fontSize: '3rem',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 25px',
                            boxShadow: '0 8px 25px rgba(0,71,154,0.3)'
                        }}>
                            {user.fullname ? user.fullname.charAt(0).toUpperCase() : 'U'}
                        </div>

                        <h1 style={{ marginBottom: '5px', color: '#1e293b', fontSize: '2rem' }}>{user.fullname}</h1>
                        <p style={{ color: '#64748b', marginBottom: '40px', fontSize: '1.1rem' }}>@{user.username}</p>

                        <div className="profile-details" style={{
                            display: 'grid',
                            gap: '20px',
                            textAlign: 'left',
                            maxWidth: '500px',
                            margin: '0 auto 40px'
                        }}>
                            <div className="profile-field" style={{
                                background: '#f8f9fa',
                                padding: '20px',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0'
                            }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.85rem',
                                    color: '#64748b',
                                    marginBottom: '8px',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>To'liq Ism</label>
                                <div className="profile-value" style={{
                                    fontSize: '1.1rem',
                                    color: '#1e293b',
                                    fontWeight: 500
                                }}>{user.fullname}</div>
                            </div>

                            <div className="profile-field" style={{
                                background: '#f8f9fa',
                                padding: '20px',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0'
                            }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.85rem',
                                    color: '#64748b',
                                    marginBottom: '8px',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>Foydalanuvchi nomi</label>
                                <div className="profile-value" style={{
                                    fontSize: '1.1rem',
                                    color: '#1e293b',
                                    fontWeight: 500
                                }}>{user.username}</div>
                            </div>

                            <div className="profile-field" style={{
                                background: '#f8f9fa',
                                padding: '20px',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0'
                            }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.85rem',
                                    color: '#64748b',
                                    marginBottom: '8px',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>Hisob turi</label>
                                <div className="profile-value" style={{
                                    fontSize: '1.1rem',
                                    color: '#1e293b',
                                    fontWeight: 500
                                }}>Foydalanuvchi</div>
                            </div>
                        </div>

                        <div className="profile-actions" style={{
                            display: 'flex',
                            gap: '15px',
                            justifyContent: 'center',
                            flexWrap: 'wrap'
                        }}>
                            <Link to="/" className="btn-back" style={{
                                padding: '14px 35px',
                                background: '#f1f5f9',
                                color: 'var(--accent-color)',
                                textDecoration: 'none',
                                borderRadius: '50px',
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                transition: 'all 0.3s',
                                border: '2px solid var(--accent-color)'
                            }}>
                                BOSH SAHIFA
                            </Link>
                            <button onClick={handleLogout} className="btn-logout" style={{
                                padding: '14px 35px',
                                background: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50px',
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                boxShadow: '0 4px 15px rgba(239,68,68,0.3)'
                            }}>
                                HISOBDAN CHIQISH
                            </button>
                        </div>
                    </div>

                    <p style={{ textAlign: 'center', marginTop: '30px', color: '#94a3b8', fontSize: '0.85rem' }}>
                        Virtual Musiqa Lug'ati — 2026
                    </p>
                </main>
            </div>

            <style>{`
                .btn-back:hover {
                    background: var(--accent-color);
                    color: white;
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(0,71,154,0.3);
                }
                .btn-logout:hover {
                    background: #dc2626;
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(239,68,68,0.4);
                }
            `}</style>

            <Footer />
        </div>
    );
};

export default Profile;
