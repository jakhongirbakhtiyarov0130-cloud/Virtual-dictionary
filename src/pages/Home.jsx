import React, { useState, useEffect, useMemo, useRef } from 'react';
import Papa from 'papaparse';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import '../App.css';
import WelcomeGreeting from '../components/WelcomeGreeting';
import Footer from '../components/Footer';
import VirtualPiano from '../components/VirtualPiano';
import Metronome from '../components/Metronome';

import Logo from "/images/logo.png"

const SHEET_ID = '1EplZnqMhRJHS2XBqr00Qjpl8-iaXMDRKhMCL3E3Y2ts';
const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=MusiqaLugati`;
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyemAthfI7hbmhs1_K7MADxYxfxro0zdRCCnqrdw5VKqZlgb1MX4LzNL3p6JISAwEoU/exec';

// --- Professional Icons (SVG) ---
const IconSearch = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconUser = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const IconDice = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><circle cx="15.5" cy="15.5" r="1.5"></circle><circle cx="15.5" cy="8.5" r="1.5"></circle><circle cx="8.5" cy="15.5" r="1.5"></circle><circle cx="12" cy="12" r="1.5"></circle></svg>;
const IconHeart = ({ filled }) => <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>;
const IconHistory = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const IconSpeaker = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>;
const IconBook = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>;
const IconMessage = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;
const IconSend = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>;
const IconX = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconPhone = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;
const IconMail = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;

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
            // Priority: 1. Online Male, 2. Natural Male, 3. Specific Male Names (Sardor, Davron, Madis), 4. Any Male
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

const TermCard = ({ term, onOpen, isFavorite, onToggleFavorite }) => {
    const { language } = useLanguage();

    const handleSpeak = (e) => {
        e.stopPropagation();
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

    const getDefinition = () => {
        switch (language) {
            case 'uz': return term.manosi_uz || term["ma'nosi"] || term.manosi_ru;
            case 'kaa': return term.manosi_kaa || term.manosi_uz || term.manosi_ru;
            case 'ru': return term.manosi_ru;
            default: return term.manosi_uz;
        }
    };

    const definition = getDefinition();

    return (
        <div className="term-card" onClick={() => onOpen(term)}>
            <div className="term-image-box">
                <button
                    className="favorite-btn"
                    style={{ color: isFavorite ? '#ff4d4f' : '#ccc' }}
                    onClick={(e) => { e.stopPropagation(); onToggleFavorite(term); }}
                >
                    <IconHeart filled={isFavorite} />
                </button>
                {term.rasm_url ? (
                    <img src={term.rasm_url} alt={term.atama} className="term-image" />
                ) : (
                    <div className="term-image-placeholder" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', color: '#cbd5e1' }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
                    </div>
                )}
            </div>
            <div className="term-info">
                <h3>{term.atama}</h3>
                <p className="term-definition">{definition || "Ta'rif mavjud emas."}</p>
                <div className="term-actions">
                    <button className="action-btn" onClick={handleSpeak}><IconSpeaker /> Tinglash</button>
                    <button className="action-btn"><IconBook /> Batafsil</button>
                </div>
            </div>
        </div>
    );
};

const AlphabetFilter = ({ onLetterSelect, activeLetter }) => {
    const alphabet = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split("");
    return (
        <div className="alphabet-filter">
            <button
                className={`letter-btn ${activeLetter === null ? 'active' : ''}`}
                onClick={() => onLetterSelect(null)}
            >
                ALL
            </button>
            {alphabet.map(letter => (
                <button
                    key={letter}
                    className={`letter-btn ${activeLetter === letter ? 'active' : ''}`}
                    onClick={() => onLetterSelect(letter)}
                >
                    {letter}
                </button>
            ))}
        </div>
    );
};

function Home() {
    const [search, setSearch] = useState('');
    const [terms, setTerms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedLetter, setSelectedLetter] = useState(null);
    const [selectedTerm, setSelectedTerm] = useState(null);
    const [isPianoOpen, setIsPianoOpen] = useState(false);

    // Dynamic Sheet Data
    const [dailyTerm, setDailyTerm] = useState(null);
    const [dailyQuote, setDailyQuote] = useState("Musiqa — so'z bilan aytib bo'lmaydigan tuyg'ular sadosi.");

    // AI Chat State
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [messages, setMessages] = useState([
        { role: 'bot', content: 'Assalomu alaykum! Men AI yordamchiman. Musiqiy atamalar haqida so\'rashingiz mumkin.' }
    ]);
    const chatEndRef = useRef(null);

    // Welcome greeting state
    const [showWelcome, setShowWelcome] = useState(false);

    // Check if first visit
    useEffect(() => {
        const hasVisited = localStorage.getItem('hasVisitedBefore');
        if (!hasVisited) {
            setShowWelcome(true);
            localStorage.setItem('hasVisitedBefore', 'true');
        }
    }, []);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Favorites & History state
    const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('fav_terms') || '[]'));
    const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('view_history') || '[]'));

    const { user } = useAuth();
    const { language, setLanguage, t } = useLanguage();

    useEffect(() => {
        const fetchData = async () => {
            try {
                Papa.parse(SHEET_CSV_URL, {
                    download: true,
                    header: false,
                    skipEmptyLines: true,
                    complete: (results) => {
                        if (results.data && results.data.length > 1) {
                            const rawRows = results.data.slice(1);
                            const formattedData = rawRows.map((row, index) => {
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

                            setTerms(formattedData.sort((a, b) => a.atama.localeCompare(b.atama)));

                            // Deterministic Daily Term (Changes once a day)
                            if (formattedData.length > 0) {
                                // Calculate day of year to pick a consistent term for everyone today
                                const now = new Date();
                                const start = new Date(now.getFullYear(), 0, 0);
                                const diff = now - start;
                                const oneDay = 1000 * 60 * 60 * 24;
                                const dayOfYear = Math.floor(diff / oneDay);

                                const index = dayOfYear % formattedData.length;
                                setDailyTerm(formattedData[index]);
                            }
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
                setError("Fetch xatoligi.");
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
        if (terms.length > 0) {
            const random = terms[Math.floor(Math.random() * terms.length)];
            openTerm(random);
        }
    };

    // Track search terms for analytics
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search.length > 2) {
                fetch(SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'search', term: search })
                }).catch(err => console.error("Tracking error", err));
            }
        }, 2000);
        return () => clearTimeout(timer);
    }, [search]);

    const handleSearchClick = () => {
        if (search) setSelectedLetter(null);
    };

    const handleChatSend = () => {
        if (!chatInput.trim()) return;
        const userMsg = { role: 'user', content: chatInput };
        setMessages(prev => [...prev, userMsg]);
        setChatInput('');

        setTimeout(() => {
            const query = chatInput.toLowerCase().trim();
            const foundTerm = terms.find(t => t.atama.toLowerCase() === query || t.atama.toLowerCase().includes(query));

            let botMsg;
            if (foundTerm) {
                const desc = language === 'uz' ? foundTerm.manosi_uz : foundTerm.manosi_ru;
                botMsg = { role: 'bot', content: `${foundTerm.atama}: ${desc || "Izoh mavjud emas."}` };
            } else {
                botMsg = { role: 'bot', content: `Kechirasiz, "${chatInput}" atamasini lug'atdan topa olmadim.` };
            }
            setMessages(prev => [...prev, botMsg]);
        }, 600);
    };

    const filteredTerms = useMemo(() => {
        const query = search.toLowerCase().trim();
        if (!query) {
            return selectedLetter
                ? terms.filter(t => t.atama.toUpperCase().startsWith(selectedLetter))
                : terms;
        }
        const normalizedQuery = query.replace(/[‘'’`]/g, "'").replace(/o'/g, "o").replace(/g'/g, "g");
        const results = terms.filter(t => {
            const atamaLower = t.atama.toLowerCase();
            const normalizedAtama = atamaLower.replace(/[‘'’`]/g, "'").replace(/o'/g, "o").replace(/g'/g, "g");
            const matchesSearch = atamaLower.includes(query) || normalizedAtama.includes(normalizedQuery) ||
                t.manosi_uz.toLowerCase().includes(query) || t.manosi_ru.toLowerCase().includes(query);
            const matchesLetter = selectedLetter ? t.atama.toUpperCase().startsWith(selectedLetter) : true;
            return matchesSearch && matchesLetter;
        });
        return results.sort((a, b) => {
            const aTitle = a.atama.toLowerCase();
            const bTitle = b.atama.toLowerCase();
            if (aTitle === query) return -1;
            if (bTitle === query) return 1;
            const aStarts = aTitle.startsWith(query);
            const bStarts = bTitle.startsWith(query);
            if (aStarts && !bStarts) return -1;
            if (!aStarts && bStarts) return 1;
            return aTitle.localeCompare(bTitle);
        });
    }, [search, terms, selectedLetter]);

    return (
        <div className="container" style={{ background: '#f4f7f6', minHeight: '100vh' }}>
            {showWelcome && <WelcomeGreeting userName={user?.fullname?.split(' ')[0] || "Mehmon"} />}

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

                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Musiqiy atamani yozing..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            if (e.target.value) setSelectedLetter(null);
                        }}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearchClick()}
                        className="search-input"
                    />
                    <button className="search-btn" onClick={handleSearchClick}>QIDIRUV</button>
                </div>

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
                <ul>
                    <li className="active"><Link to="/">{t('dictionary')}</Link></li>
                    <li><Link to="/composers">{t('composers')}</Link></li>
                    <li><Link to="/quiz">{t('quiz')}</Link></li>
                </ul>
            </nav>

            <div className="content-wrapper">
                <aside className="sidebar">
                    <button className="random-btn" onClick={handleRandom}>
                        <IconDice /> TASODIFIY ATAMA
                    </button>
                    <button className="random-btn random-btn-piano" onClick={() => setIsPianoOpen(true)}>
                        🎹 {t('virtual_piano')}
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
                                ⚙️ {t('admin_info')}
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
                            <span style={{ fontSize: '1.2rem' }}>🌐</span> {t('sidebar_news')}
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <li className="news-item" style={{ fontSize: '0.85rem', padding: '12px', borderRadius: '10px', background: '#f8fafc', color: '#334155', border: '1px solid #f1f5f9', cursor: 'pointer', transition: 'all 0.2s' }}>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <span style={{ fontSize: '1.1rem' }}>🎵</span>
                                    <span>{t('news_1')}</span>
                                </div>
                            </li>
                            <li className="news-item" style={{ fontSize: '0.85rem', padding: '12px', borderRadius: '10px', background: '#f8fafc', color: '#334155', border: '1px solid #f1f5f9', cursor: 'pointer', transition: 'all 0.2s' }}>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <span style={{ fontSize: '1.1rem' }}>🎻</span>
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
                        <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '4rem', opacity: 0.1, transform: 'rotate(15deg)' }}>📜</div>
                        <strong style={{ color: 'var(--secondary-color)', display: 'block', marginBottom: '15px', fontSize: '0.7rem', letterSpacing: '2px', fontWeight: '800' }}>KUN HIKMATI</strong>
                        <span style={{ fontSize: '0.95rem', fontStyle: 'italic', lineHeight: '1.6', position: 'relative', zIndex: 1, display: 'block' }}>
                            "{t('daily_quote')}"
                        </span>
                    </div>
                </aside>

                <main className="main-content">
                    <div className="breadcrumb" style={{ marginBottom: '15px' }}>{t('home')} &gt; {t('dictionary')}</div>

                    {/* Featured Term Card - Dynamic Surprise Feature */}
                    {dailyTerm && (
                        <div className="premium-card glass" style={{
                            padding: '30px',
                            marginBottom: '30px',
                            display: 'flex',
                            gap: '30px',
                            alignItems: 'center',
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(251, 191, 36, 0.1))'
                        }}>
                            <div style={{ flex: 1 }}>
                                <span style={{
                                    background: 'var(--secondary-color)',
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    color: '#000'
                                }}>{t('term_of_the_day')}</span>
                                <h2 style={{ fontSize: '2.2rem', marginTop: '10px', color: 'var(--accent-color)' }}>{dailyTerm.atama}</h2>
                                <p style={{ color: '#444', lineHeight: '1.6', fontSize: '1rem', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {language === 'uz' ? (dailyTerm.manosi_uz || dailyTerm.manosi_ru) :
                                        language === 'kaa' ? (dailyTerm.manosi_kaa || dailyTerm.manosi_uz) :
                                            dailyTerm.manosi_ru}
                                </p>
                                <button className="action-btn" onClick={() => openTerm(dailyTerm)} style={{ marginTop: '15px', padding: '10px 20px' }}>
                                    <IconBook /> {t('read_more')}
                                </button>
                            </div>
                            <div style={{ width: '200px', height: '200px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {dailyTerm.rasm_url ? (
                                    <img src={dailyTerm.rasm_url} alt={dailyTerm.atama} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <IconBook />
                                )}
                            </div>
                        </div>
                    )}

                    <AlphabetFilter onLetterSelect={setSelectedLetter} activeLetter={selectedLetter} />
                    <div className="results-count" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <span>Topildi: <strong>{filteredTerms.length}</strong> ta atama</span>
                    </div>
                    <div className="terms-grid">
                        {loading ? (
                            <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '100px' }}>Yuklanmoqda...</div>
                        ) : error ? (
                            <p className="error" style={{ textAlign: 'center', gridColumn: '1/-1', color: 'red' }}>{error}</p>
                        ) : filteredTerms.length > 0 ? (
                            filteredTerms.map(term => (
                                <TermCard
                                    key={term.id}
                                    term={term}
                                    onOpen={openTerm}
                                    isFavorite={favorites.some(f => f.id === term.id)}
                                    onToggleFavorite={toggleFavorite}
                                />
                            ))
                        ) : (
                            <div className="no-results" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '80px', background: 'white', borderRadius: '20px' }}>
                                <p style={{ fontSize: '1.2rem', color: '#666' }}>Bunday atama topilmadi.</p>
                                <button onClick={() => { setSearch(''); setSelectedLetter(null); }} style={{ marginTop: '15px', padding: '10px 25px', background: 'var(--accent-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Barchasini ko'rsatish</button>
                            </div>
                        )}
                    </div>
                </main>

                <aside className="right-sidebar">
                    <div className="premium-card" style={{ padding: '25px', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '1rem', color: 'var(--accent-color)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            📊 STATISTIKA
                        </h3>
                        <div style={{ display: 'grid', gap: '15px' }}>
                            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Jami Atamalar</div>
                                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-color)' }}>{terms.length}</div>
                            </div>
                            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Sevimli Atamalar</div>
                                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ff4d4f' }}>{favorites.length}</div>
                            </div>
                        </div>
                    </div>

                    <div className="premium-card" style={{ padding: '25px', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '1rem', color: 'var(--accent-color)', marginBottom: '15px' }}>
                            📅 TADBIRLAR
                        </h3>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '15px' }}>
                            <li style={{ fontSize: '0.85rem' }}>
                                <div style={{ fontWeight: '700', color: 'var(--accent-color)' }}>20-Yanvar, 2026</div>
                                <div style={{ color: '#444' }}>Simfonik Musiqa Kechasi</div>
                                <div style={{ fontSize: '0.75rem', color: '#888' }}>Konsert Zali, 18:30</div>
                            </li>
                            <li style={{ fontSize: '0.85rem' }}>
                                <div style={{ fontWeight: '700', color: 'var(--accent-color)' }}>25-Yanvar, 2026</div>
                                <div style={{ color: '#444' }}>Yosh Musiqachilar Tanlovi</div>
                                <div style={{ fontSize: '0.75rem', color: '#888' }}>Madaniyat Saroyi</div>
                            </li>
                        </ul>
                    </div>

                    <div className="premium-card glass" style={{ padding: '25px', background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(255, 255, 255, 0.9))' }}>
                        <h3 style={{ fontSize: '1rem', color: 'var(--accent-color)', marginBottom: '10px' }}>💡 MASLAHAT</h3>
                        <p style={{ fontSize: '0.85rem', color: '#444', lineHeight: '1.6' }}>
                            Musiqa o'rganishda muntazamlik eng muhimi. Kuniga 15 daqiqa bo'lsa ham mashq qilish, haftada bir marta 2 soat mashq qilishdan samaraliroq.
                        </p>
                    </div>
                </aside>
            </div>

            <TermModal
                term={selectedTerm}
                onClose={() => setSelectedTerm(null)}
                isFavorite={selectedTerm && favorites.some(f => f.id === selectedTerm.id)}
                onToggleFavorite={toggleFavorite}
            />

            {
                isChatOpen && (
                    <div className="chat-window shadow-lg">
                        <div className="chat-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <IconMessage />
                                <span>AI Yordamchi</span>
                            </div>
                            <button className="chat-close-btn" onClick={() => setIsChatOpen(false)}><IconX /></button>
                        </div>
                        <div className="chat-messages">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`message ${msg.role}`}>{msg.content}</div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>
                        <div className="chat-input-area">
                            <input
                                type="text"
                                className="chat-input"
                                placeholder="Atama yozing..."
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
                            />
                            <button className="chat-send-btn" onClick={handleChatSend}><IconSend /></button>
                        </div>
                    </div>
                )
            }
            <div className="chat-widget" onClick={() => setIsChatOpen(!isChatOpen)}>
                <IconMessage />
            </div>

            <Footer />
            {isPianoOpen && <VirtualPiano onClose={() => setIsPianoOpen(false)} />}
        </div >
    );
}

export default Home;
