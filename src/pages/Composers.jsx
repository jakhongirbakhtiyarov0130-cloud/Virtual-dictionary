import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import '../App.css';
import Footer from '../components/Footer';

import Logo from "/images/logo.png"

const SHEET_ID = '1EplZnqMhRJHS2XBqr00Qjpl8-iaXMDRKhMCL3E3Y2ts';
const COMPOSERS_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Kompozitorlar`;

// --- Professional Icons (SVG) ---
const IconUser = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const IconBook = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>;
const IconX = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconPhone = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;
const IconMail = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;

const ComposerModal = ({ composer, onClose }) => {
    if (!composer) return null;
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="term-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
                <button className="modal-close" onClick={onClose}><IconX /></button>
                <div className="modal-content">
                    {composer.image && (
                        <div style={{ width: '100%', maxHeight: '400px', overflow: 'hidden', borderRadius: '15px', marginBottom: '25px' }}>
                            <img src={composer.image} alt={composer.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    )}
                    <h2 style={{ color: 'var(--accent-color)', fontSize: '2rem', marginBottom: '5px' }}>{composer.name}</h2>
                    <p style={{ fontWeight: 'bold', color: '#888', marginBottom: '20px', fontSize: '1.1rem' }}>{composer.years}</p>

                    <div className="composer-details" style={{ lineHeight: '1.8', color: '#444', fontSize: '1.05rem', textAlign: 'justify' }}>
                        {composer.info}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ComposerCard = ({ composer, onOpen }) => (
    <div className="term-card" onClick={() => onOpen(composer)}>
        <div className="term-image-box" style={{ height: '200px' }}>
            {composer.image ? (
                <img src={composer.image} alt={composer.name} className="term-image" style={{ objectFit: 'cover' }} />
            ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', color: '#cbd5e1' }}>
                    <IconUser />
                </div>
            )}
        </div>
        <div className="term-info">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{composer.name}</h3>
            <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '10px', fontWeight: '500' }}>{composer.years}</p>
            <p className="term-definition" style={{ WebkitLineClamp: '3', lineClamp: '3', fontSize: '0.85rem' }}>{composer.info}</p>
            <div className="term-actions" style={{ marginTop: 'auto' }}>
                <button className="btn-details">
                    <IconBook /> Batafsil ma'lumot
                </button>
            </div>
        </div>
    </div>
);

const Composers = () => {
    const { user } = useAuth();
    const { language, setLanguage, t } = useLanguage();
    const [composers, setComposers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedComposer, setSelectedComposer] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                Papa.parse(COMPOSERS_CSV_URL, {
                    download: true,
                    header: false,
                    skipEmptyLines: true,
                    complete: (results) => {
                        if (results.data && results.data.length > 1) {
                            const rawRows = results.data.slice(1);
                            const formatted = rawRows.map(row => {
                                if (!row[0]) return null;
                                return {
                                    name: row[0]?.trim(),
                                    info: row[1]?.trim() || "Ma'lumot yo'q",
                                    image: row[2]?.trim(),
                                    years: row[3]?.trim()
                                };
                            }).filter(c => c !== null);
                            setComposers(formatted);
                        } else {
                            setError("Ma'lumot topilmadi.");
                        }
                        setLoading(false);
                    },
                    error: () => {
                        setError("Faylni yuklashda xatolik.");
                        setLoading(false);
                    }
                });
            } catch (err) {
                setError("Xatolik yuz berdi.");
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="container" style={{ background: '#f4f7f6', minHeight: '100vh' }}>
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
                    <li className="active"><Link to="/composers" style={{ color: 'var(--accent-color)' }}>{t('composers')}</Link></li>
                    <li><Link to="/quiz">{t('quiz')}</Link></li>
                </ul>
            </nav>

            <div className="content-wrapper" style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px', gridTemplateColumns: '1fr' }}>
                <main className="main-content">
                    <div className="breadcrumb" style={{ marginBottom: '20px' }}>{t('home')} &gt; {t('composers')}</div>

                    <div className="section-header" style={{ marginBottom: '30px', borderBottom: '2px solid #eee', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                            <h2 style={{ color: 'var(--accent-color)', fontSize: '1.8rem', marginBottom: '5px' }}>BUYUK KOMPOZITORLAR</h2>
                            <p style={{ color: '#666', fontSize: '0.9rem' }}>Jahon va O'zbekiston musiqa san'ati darg'alari</p>
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#888' }}>Jami: <strong>{composers.length}</strong> nafar</div>
                    </div>

                    <div className="terms-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
                        {loading ? (
                            <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '100px' }}>Yuklanmoqda...</div>
                        ) : error ? (
                            <p style={{ textAlign: 'center', gridColumn: '1/-1', color: 'red' }}>{error}</p>
                        ) : composers.length > 0 ? (
                            composers.map((composer, idx) => (
                                <ComposerCard key={idx} composer={composer} onOpen={setSelectedComposer} />
                            ))
                        ) : (
                            <p style={{ textAlign: 'center', gridColumn: '1/-1' }}>Hali ma'lumot qo'shilmagan.</p>
                        )}
                    </div>
                </main>
            </div>

            <ComposerModal composer={selectedComposer} onClose={() => setSelectedComposer(null)} />

            <Footer />
        </div>
    );
};

export default Composers;
