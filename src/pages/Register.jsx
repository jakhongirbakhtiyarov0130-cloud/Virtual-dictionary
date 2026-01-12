import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import FloatingBackground from '../components/FloatingBackground';
import Footer from '../components/Footer';
import '../App.css';

import Logo from "/images/logo.png"

// Icons
const IconPhone = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;
const IconMail = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;

const Register = () => {
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyemAthfI7hbmhs1_K7MADxYxfxro0zdRCCnqrdw5VKqZlgb1MX4LzNL3p6JISAwEoU/exec";

    const [formData, setFormData] = useState({
        fullname: '',
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { t, language, setLanguage } = useLanguage();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'register',
                    ...formData
                })
            });

            alert(t("registration_success_message"));
            navigate('/login');

        } catch (err) {
            console.error(err);
            setError(t("registration_error_message"));
        } finally {
            setLoading(false);
        }
    };

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

            <div className="content-wrapper" style={{
                maxWidth: '600px',
                margin: '50px auto',
                padding: '0 20px',
                gridTemplateColumns: '1fr',
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <div style={{
                    background: 'white',
                    borderRadius: '20px',
                    padding: '45px 50px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    width: '100%',
                    maxWidth: '500px'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <h2 style={{
                            fontSize: '1.8rem',
                            color: 'var(--accent-color)',
                            margin: '0 0 8px 0',
                            fontWeight: 700
                        }}>
                            {t('register')}
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
                            Yangi hisob yarating
                        </p>
                    </div>

                    {error && (
                        <div style={{
                            background: '#fee',
                            color: '#c33',
                            padding: '12px 20px',
                            borderRadius: '10px',
                            marginBottom: '20px',
                            border: '1px solid #fcc',
                            animation: 'shake 0.3s'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                color: '#334155',
                                fontWeight: 600,
                                fontSize: '0.9rem'
                            }}>{t('fullname')}</label>
                            <input
                                type="text"
                                name="fullname"
                                value={formData.fullname}
                                onChange={handleChange}
                                required
                                className="auth-input"
                                placeholder="To'liq ismingizni kiriting"
                            />
                        </div>

                        <div className="form-group">
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                color: '#334155',
                                fontWeight: 600,
                                fontSize: '0.9rem'
                            }}>{t('username')}</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                className="auth-input"
                                placeholder="Foydalanuvchi nomini tanlang"
                            />
                        </div>

                        <div className="form-group">
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                color: '#334155',
                                fontWeight: 600,
                                fontSize: '0.9rem'
                            }}>{t('password')}</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="auth-input"
                                placeholder="Xavfsiz parol yarating"
                            />
                        </div>

                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? (
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                    <span className="spinner"></span>
                                    {t('loading')}
                                </span>
                            ) : t('submit')}
                        </button>
                    </form>

                    <p style={{
                        textAlign: 'center',
                        marginTop: '25px',
                        color: '#64748b',
                        fontSize: '0.95rem'
                    }}>
                        {t('have_account')} <Link to="/login" style={{
                            color: 'var(--accent-color)',
                            textDecoration: 'none',
                            fontWeight: 600
                        }}>{t('enter')}</Link>
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-10px); }
                    75% { transform: translateX(10px); }
                }
                .spinner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.6s linear infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>

            <Footer />
        </div>
    );
};

export default Register;
