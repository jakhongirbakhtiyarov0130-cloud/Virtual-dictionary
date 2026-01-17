import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import '../App.css';
import Footer from '../components/Footer';

import Logo from "/images/logo.png"
import Metronome from '../components/Metronome';


const SHEET_ID = '1EplZnqMhRJHS2XBqr00Qjpl8-iaXMDRKhMCL3E3Y2ts';
const COMPOSERS_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Kompozitorlar`;
const DICTIONARY_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=MusiqaLugati`;

// --- Professional Icons (SVG) ---
const IconSearch = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconUser = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const IconBook = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>;
const IconX = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconPhone = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;
const IconMail = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const IconDice = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><circle cx="15.5" cy="15.5" r="1.5"></circle><circle cx="15.5" cy="8.5" r="1.5"></circle><circle cx="8.5" cy="15.5" r="1.5"></circle><circle cx="12" cy="12" r="1.5"></circle></svg>;
const IconHeart = ({ filled }) => <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>;
const IconHistory = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const IconSpeaker = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>;


const IconSettings = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const IconGlobe = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;
const IconMusic = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>;
const IconViolin = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2c0 5 0 5 0 10"></path><circle cx="12" cy="17" r="5"></circle><line x1="8" y1="14" x2="16" y2="14"></line></svg>;
const IconScroll = () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>;
const IconChart = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>;
const IconCalendar = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const IconBulb = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M15.09 14c.18-.9.93-1.54 1.86-1.63A4 4 0 1 1 10 3.12 4.02 4.02 0 0 1 15.09 14z"></path></svg>;
const TermModal = ({ term, onClose, isFavorite, onToggleFavorite }) => {
    if (!term) return null;
    const { language } = useLanguage();

    const getFullDefinition = () => {
        switch (language) {
            case 'uz': return term.manosi_uz || term["ma'nosi"] || term.manosi_ru;
            case 'kaa': return term.manosi_kaa || term.manosi_uz || term.manosi_ru;
            case 'ru': return term.manosi_ru;
            default: return term.manosi_uz;
        }
    };

    const handleSpeak = (e) => {
        if (e) e.stopPropagation();
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(term.atama);
        const voices = window.speechSynthesis.getVoices();

        const getBestVoice = () => {
            return voices.find(v => v.name.includes('Online') && v.name.match(/Male|Sardor|Davron|Madis/i)) ||
                voices.find(v => v.name.includes('Natural') && v.name.match(/Male|Sardor|Davron|Madis/i)) ||
                voices.find(v => v.name.includes('Google') && v.lang.startsWith('ru') && v.name.includes('Male')) ||
                voices.find(v => v.name.match(/Davron|Sardor|Madis|Pavel|Dmitry/i)) ||
                voices.find(v => v.name.includes('Male')) ||
                voices.find(v => v.lang.startsWith('uz')) ||
                voices.find(v => v.lang.startsWith('tr'));
        };

        const voice = getBestVoice();
        if (voice) {
            utterance.voice = voice;
            utterance.lang = voice.lang;
        } else {
            utterance.lang = 'uz-UZ';
        }

        utterance.rate = 0.85;
        utterance.pitch = 0.9;
        utterance.volume = 1;
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="term-modal" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}><IconX /></button>
                <div className="modal-content">
                    {term.rasm_url && <img src={term.rasm_url} alt={term.atama} />}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h2 style={{ fontSize: '1.8rem', margin: 0, flex: 1 }}>{term.atama}</h2>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={handleSpeak}
                                style={{
                                    background: 'white',
                                    border: '1px solid #eee',
                                    cursor: 'pointer',
                                    color: 'var(--accent-color)',
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                    transition: 'all 0.2s',
                                }}
                                title="Tinglash"
                            >
                                <IconSpeaker />
                            </button>
                            <button
                                style={{
                                    background: 'white',
                                    border: '1px solid #eee',
                                    cursor: 'pointer',
                                    color: isFavorite ? '#ff4d4f' : '#ccc',
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                    transition: 'all 0.2s',
                                }}
                                className="fav-modal-btn"
                                onClick={() => onToggleFavorite(term)}
                            >
                                <IconHeart filled={isFavorite} />
                            </button>
                        </div>
                    </div>
                    <p className="modal-description">{getFullDefinition() || "Izoh mavjud emas."}</p>
                </div>
            </div>
        </div>
    );
};

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

    // Sidebar states
    const [dictionaryTerms, setDictionaryTerms] = useState([]);
    const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('fav_terms') || '[]'));
    const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('view_history') || '[]'));
    const [selectedTerm, setSelectedTerm] = useState(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Composers
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
                    }
                });

                // Fetch Dictionary for Sidebar Random Button
                Papa.parse(DICTIONARY_CSV_URL, {
                    download: true,
                    header: false,
                    skipEmptyLines: true,
                    complete: (results) => {
                        if (results.data && results.data.length > 1) {
                            const rawRows = results.data.slice(1);
                            const formatted = rawRows.map((row, index) => {
                                if (row.length < 2 || !row[0]) return null;
                                return {
                                    id: index + 1,
                                    atama: row[0]?.trim() || "",
                                    manosi_ru: row[1]?.trim() || "",
                                    rasm_url: row[2] || "",
                                    manosi_uz: row[3]?.trim() || "",
                                    manosi_kaa: row[4]?.trim() || ""
                                };
                            }).filter(item => item !== null);
                            setDictionaryTerms(formatted);
                        }
                        setLoading(false);
                    },
                    error: () => {
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

    const toggleFavorite = (term) => {
        const isFav = favorites.find(f => f.id === term.id);
        const newFavs = isFav ? favorites.filter(f => f.id !== term.id) : [...favorites, term];
        setFavorites(newFavs);
        localStorage.setItem('fav_terms', JSON.stringify(newFavs));
    };

    const openTerm = (term) => {
        setSelectedTerm(term);
        const newHistory = [term, ...history.filter(h => h.id !== term.id)].slice(0, 5);
        setHistory(newHistory);
        localStorage.setItem('view_history', JSON.stringify(newHistory));
    };

    const handleRandom = () => {
        if (dictionaryTerms.length > 0) {
            const random = dictionaryTerms[Math.floor(Math.random() * dictionaryTerms.length)];
            openTerm(random);
        }
    };

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
                    <li><Link to="/theory">{t('theory')}</Link></li>
                    <li className="active"><Link to="/composers" style={{ color: 'var(--accent-color)' }}>{t('composers')}</Link></li>
                    <li><Link to="/quiz">{t('quiz')}</Link></li>
                </ul>
            </nav>

            <div className="content-wrapper">
                <aside className="sidebar">
                    <button className="random-btn" onClick={handleRandom}>
                        <IconDice /> TASODIFIY ATAMA
                    </button>

                    <div className="sidebar-card premium-card" style={{ padding: '0' }}>
                        <div className="sidebar-header" style={{ padding: '15px 20px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <IconHeart filled /> SEVIMLILAR
                        </div>
                        <ul className="sidebar-menu">
                            {favorites.length > 0 ? favorites.slice(0, 5).map(f => (
                                <li key={f.id}><a href="#" onClick={() => openTerm(f)}>{f.atama}</a></li>
                            )) : <li style={{ fontSize: '0.8rem', color: '#999', padding: '10px' }}>Hali yo'q</li>}
                        </ul>
                    </div>
                    <div className="sidebar-card premium-card" style={{ padding: '0' }}>
                        <div className="sidebar-header" style={{ padding: '15px 20px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <IconHistory /> OXIRGI KO'RILGANLAR
                        </div>
                        <ul className="sidebar-menu">
                            {history.length > 0 ? history.map(h => (
                                <li key={h.id}><a href="#" onClick={() => openTerm(h)}>{h.atama}</a></li>
                            )) : <li style={{ fontSize: '0.8rem', color: '#999', padding: '10px' }}>Tarix bo'sh</li>}
                        </ul>
                    </div>

                    <Metronome />

                    {user?.username === 'admin' && (
                        <div className="premium-card" style={{
                            padding: '20px',
                            background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                            border: '1px solid #e2e8f0'
                        }}>
                            <div style={{ color: 'var(--accent-color)', fontWeight: '700', fontSize: '0.85rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <IconSettings /> {t('admin_info')}
                            </div>
                            <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: '1.4', marginBottom: '12px' }}>
                                {t('admin_desc')}
                            </p>
                            <a href={`https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit`} target="_blank" rel="noreferrer" style={{
                                display: 'block',
                                textAlign: 'center',
                                fontSize: '0.8rem',
                                color: 'var(--accent-color)',
                                textDecoration: 'none',
                                fontWeight: '600',
                                padding: '8px',
                                borderRadius: '6px',
                                border: '1px solid var(--accent-color)'
                            }}>
                                {t('open_sheets')}
                            </a>
                        </div>
                    )}
                    <div className="premium-card" style={{ padding: '25px', background: 'white' }}>
                        <div style={{ color: 'var(--accent-color)', fontWeight: '800', fontSize: '0.8rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            <span style={{ fontSize: '1.2rem', display: 'flex' }}><IconGlobe /></span> {t('sidebar_news')}
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <li className="news-item" style={{ fontSize: '0.85rem', padding: '12px', borderRadius: '10px', background: '#f8fafc', color: '#334155', border: '1px solid #f1f5f9', cursor: 'pointer', transition: 'all 0.2s' }}>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <span style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center' }}><IconMusic /></span>
                                    <span>{t('news_1')}</span>
                                </div>
                            </li>
                            <li className="news-item" style={{ fontSize: '0.85rem', padding: '12px', borderRadius: '10px', background: '#f8fafc', color: '#334155', border: '1px solid #f1f5f9', cursor: 'pointer', transition: 'all 0.2s' }}>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <span style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center' }}><IconViolin /></span>
                                    <span>{t('news_2')}</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="premium-card" style={{
                        padding: '30px 25px',
                        background: 'linear-gradient(135deg, var(--accent-color), #00224a)',
                        color: 'white',
                        position: 'relative'
                    }}>
                        <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '4rem', opacity: 0.1, transform: 'rotate(15deg)' }}><IconScroll /></div>
                        <strong style={{ color: 'var(--secondary-color)', display: 'block', marginBottom: '15px', fontSize: '0.7rem', letterSpacing: '2px', fontWeight: '800' }}>KUN HIKMATI</strong>
                        <span style={{ fontSize: '0.95rem', fontStyle: 'italic', lineHeight: '1.6', position: 'relative', zIndex: 1, display: 'block' }}>
                            "{t('daily_quote')}"
                        </span>
                    </div>
                </aside>

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

                <aside className="right-sidebar">
                    <div className="premium-card" style={{ padding: '25px', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '1rem', color: 'var(--accent-color)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <IconChart /> STATISTIKA
                        </h3>
                        <div style={{ display: 'grid', gap: '15px' }}>
                            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Jami Kompozitorlar</div>
                                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-color)' }}>{composers.length}</div>
                            </div>
                        </div>
                    </div>

                    <div className="premium-card" style={{ padding: '25px', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '1rem', color: 'var(--accent-color)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <IconCalendar /> TADBIRLAR
                        </h3>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '15px' }}>
                            <li style={{ fontSize: '0.85rem' }}>
                                <div style={{ fontWeight: '700', color: 'var(--accent-color)' }}>15-Yanvar, 2026</div>
                                <div style={{ color: '#444' }}>Bax Tavallud kuni tadbiri</div>
                            </li>
                            <li style={{ fontSize: '0.85rem' }}>
                                <div style={{ fontWeight: '700', color: 'var(--accent-color)' }}>28-Yanvar, 2026</div>
                                <div style={{ color: '#444' }}>Zamonaviy Kompozitsiya Kechasi</div>
                            </li>
                        </ul>
                    </div>

                    <div className="premium-card glass" style={{ padding: '25px', background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(255, 255, 255, 0.9))' }}>
                        <h3 style={{ fontSize: '1rem', color: 'var(--accent-color)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}><IconBulb /> MASLAHAT</h3>
                        <p style={{ fontSize: '0.85rem', color: '#444', lineHeight: '1.6' }}>
                            Kompozitorlarning hayot yo'lini o'rganish ularning musiqasini chuqurroq his qilishga yordam beradi.
                        </p>
                    </div>
                </aside>
            </div>

            <ComposerModal composer={selectedComposer} onClose={() => setSelectedComposer(null)} />
            <TermModal
                term={selectedTerm}
                onClose={() => setSelectedTerm(null)}
                isFavorite={selectedTerm && favorites.some(f => f.id === selectedTerm.id)}
                onToggleFavorite={toggleFavorite}
            />

            <Footer />
        </div>
    );
};

export default Composers;
