import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const IconMapPin = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const IconPhone = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;
const IconMail = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const IconSend = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>;

const Footer = () => {
    const { t } = useLanguage();
    const [email, setEmail] = useState('');

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            alert(t('footer_subscribe_success'));
            setEmail('');
        }
    };

    return (
        <footer style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            color: 'white',
            marginTop: '80px'
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                padding: '60px 5% 30px'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '50px',
                    marginBottom: '50px'
                }}>
                    {/* Bog'lanish */}
                    <div>
                        <h3 style={{
                            color: '#fbbf24',
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            marginBottom: '20px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>{t('footer_contact')}</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: '#cbd5e1' }}>
                                <IconMapPin />
                                <span style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                                    {t('footer_address_label')}
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#cbd5e1' }}>
                                <IconPhone />
                                <span style={{ fontSize: '0.9rem' }}>+998 (90) 123-45-67</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#cbd5e1' }}>
                                <IconMail />
                                <span style={{ fontSize: '0.9rem' }}>info@libmusic.uz</span>
                            </div>
                        </div>
                    </div>

                    {/* Resurslar */}
                    <div>
                        <h3 style={{
                            color: '#fbbf24',
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            marginBottom: '20px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>{t('footer_resources')}</h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <li>
                                <Link to="/" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
                                    onMouseOver={(e) => e.target.style.color = '#fbbf24'}
                                    onMouseOut={(e) => e.target.style.color = '#cbd5e1'}>
                                    {t('dictionary')}
                                </Link>
                            </li>
                            <li>
                                <Link to="/composers" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
                                    onMouseOver={(e) => e.target.style.color = '#fbbf24'}
                                    onMouseOut={(e) => e.target.style.color = '#cbd5e1'}>
                                    {t('composers')}
                                </Link>
                            </li>
                            <li>
                                <a href="#" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
                                    onMouseOver={(e) => e.target.style.color = '#fbbf24'}
                                    onMouseOut={(e) => e.target.style.color = '#cbd5e1'}>
                                    Musiqa metodikasi
                                </a>
                            </li>
                            <li>
                                <a href="#" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
                                    onMouseOver={(e) => e.target.style.color = '#fbbf24'}
                                    onMouseOut={(e) => e.target.style.color = '#cbd5e1'}>
                                    Akademik nashirlar
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Musiqiy Meros */}
                    <div>
                        <h3 style={{
                            color: '#fbbf24',
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            marginBottom: '20px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>{t('footer_heritage')}</h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <li>
                                <a href="#" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
                                    onMouseOver={(e) => e.target.style.color = '#fbbf24'}
                                    onMouseOut={(e) => e.target.style.color = '#cbd5e1'}>
                                    Xalq qo'shiqlari
                                </a>
                            </li>
                            <li>
                                <a href="#" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
                                    onMouseOver={(e) => e.target.style.color = '#fbbf24'}
                                    onMouseOut={(e) => e.target.style.color = '#cbd5e1'}>
                                    Maqom san'ati
                                </a>
                            </li>
                            <li>
                                <a href="#" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
                                    onMouseOver={(e) => e.target.style.color = '#fbbf24'}
                                    onMouseOut={(e) => e.target.style.color = '#cbd5e1'}>
                                    Nosirhonlik darajasi
                                </a>
                            </li>
                            <li>
                                <a href="#" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
                                    onMouseOver={(e) => e.target.style.color = '#fbbf24'}
                                    onMouseOut={(e) => e.target.style.color = '#cbd5e1'}>
                                    Yangi musiqachilar maktabi
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Yangiliklar */}
                    <div>
                        <h3 style={{
                            color: '#fbbf24',
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            marginBottom: '20px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>{t('footer_news')}</h3>
                        <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '15px' }}>
                            {t('footer_news_text')}
                        </p>
                        <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t('footer_subscribe_placeholder')}
                                required
                                style={{
                                    flex: 1,
                                    padding: '12px 15px',
                                    borderRadius: '8px',
                                    border: '1px solid #475569',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: 'white',
                                    fontSize: '0.9rem',
                                    outline: 'none'
                                }}
                            />
                            <button type="submit" style={{
                                background: '#fbbf24',
                                color: '#1e293b',
                                border: 'none',
                                padding: '12px 20px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'all 0.3s'
                            }}
                                onMouseOver={(e) => e.target.style.background = '#f59e0b'}
                                onMouseOut={(e) => e.target.style.background = '#fbbf24'}>
                                <IconSend />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Copyright */}
                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    paddingTop: '30px',
                    textAlign: 'center',
                    color: '#94a3b8',
                    fontSize: '0.85rem'
                }}>
                    <p style={{ margin: 0 }}>
                        © 2026 {t('site_title')}. {t('footer_rights')}. |
                        <a href="#" style={{ color: '#fbbf24', textDecoration: 'none', marginLeft: '5px' }}>{t('footer_privacy')}</a>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
