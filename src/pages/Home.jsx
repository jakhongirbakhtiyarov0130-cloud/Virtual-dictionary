import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Papa from 'papaparse';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../App.css';

const SHEET_ID = '1EplZnqMhRJHS2XBqr00Qjpl8-iaXMDRKhMCL3E3Y2ts';
// Using GVIZ strictly
const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=MusiqaLugati`;
// Analitika sheeti
const ANALYTICS_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=analitika%20web`;
// Script URL (Register sahifasidan nusxalab oling yoki contextga o'tkazish kerak)
// Hozircha hardcode qilamiz, lekin eng yaxshisi bu env yoki contextda turishi kerak
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyemAthfI7hbmhs1_K7MADxYxfxro0zdRCCnqrdw5VKqZlgb1MX4LzNL3p6JISAwEoU/exec";

const TermCard = ({ term }) => {
    const handleSpeak = (e) => {
        e.stopPropagation();
        // Agar oldin gapirayotgan bo'lsa to'xtatish
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(term.atama);
        // Tilini inglizchaga sozlaymiz, shunda to'g'ri o'qiydi
        utterance.lang = 'en-US';
        utterance.rate = 0.8; // Biroz sekinroq, tushunarli bo'lishi uchun
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="term-card">
            <div className="term-header">
                <h3>{term.atama}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                        onClick={handleSpeak}
                        title="Talaffuzni eshitish"
                        style={{
                            background: 'var(--glass-border)',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--accent-color)',
                            transition: 'transform 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                        </svg>
                    </button>
                    <span className="term-id">#{term.id}</span>
                </div>
            </div>
            <div className="term-body">
                <p>{term["ma'nosi"]}</p>
                {term.rasm_url && (
                    <div className="term-image-container" style={{ marginTop: '10px' }}>
                        <img src={term.rasm_url} alt={term.atama} style={{ maxWidth: '100%', borderRadius: '8px' }} onError={(e) => e.target.style.display = 'none'} />
                    </div>
                )}
            </div>
        </div>
    );
};

// Trenddagi so'zlar komponenti
const TrendingTerms = () => {
    const [trends, setTrends] = useState([]);

    useEffect(() => {
        Papa.parse(ANALYTICS_CSV_URL, {
            download: true,
            header: false,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.data && results.data.length > 1) {
                    const rawRows = results.data.slice(1); // Header tashlanadi
                    // Formatlash: [So'z, Sanoq]
                    const formatted = rawRows.map(row => ({
                        term: row[0],
                        count: parseInt(row[1] || 0)
                    })).sort((a, b) => b.count - a.count) // Eng ko'p qidirilganlar tepadaga
                        .slice(0, 5); // Faqat TOP 5

                    setTrends(formatted);
                }
            }
        });
    }, []);

    if (trends.length === 0) return null;

    return (
        <div className="trending-container" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>🔥 Ko'p qidirilgan:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
                {trends.map((t, index) => (
                    <span key={index} style={{
                        background: 'var(--glass-border)',
                        padding: '5px 12px',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        color: 'var(--text-primary)',
                        cursor: 'default'
                    }}>
                        {t.term}
                    </span>
                ))}
            </div>
        </div>
    );
};

function Home() {
    const [search, setSearch] = useState('');
    const [theme, setTheme] = useState('light');
    const [terms, setTerms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { user, logout } = useAuth();

    // Apply theme to document element
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    // Fetch data
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
                                if (row.length < 2) return null;
                                const atama = row[0];
                                const manosi = row[1];
                                const rasm = row[2];
                                if (!atama || !manosi) return null;
                                return {
                                    id: index + 1,
                                    atama: atama.trim(),
                                    "ma'nosi": manosi.trim(),
                                    rasm_url: rasm || ""
                                };
                            }).filter(item => item !== null);

                            setTerms(formattedData);
                            if (formattedData.length === 0) setError("Jadvalda ma'lumot topilmadi");
                        } else {
                            setError("Jadval bo'sh yoki yuklanmadi.");
                        }
                        setLoading(false);
                    },
                    error: (err) => {
                        console.error(err);
                        setError("Jadvalni yuklab bo'lmadi.");
                        setLoading(false);
                    }
                });
            } catch (err) {
                console.error(err);
                setError("Dasturiy xatolik.");
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Search Tracking Logic (Debounce)
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search.length > 2) { // 3 ta harfdan oshsa yuborish
                fetch(SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'search', term: search })
                }).catch(err => console.error("Search tracking error", err));
            }
        }, 2000); // Foydalanuvchi yozib bo'lgach 2 soniyadan keyin yuborish

        return () => clearTimeout(delayDebounceFn);
    }, [search]);


    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const filteredTerms = useMemo(() => {
        return terms.filter(t =>
            t.atama?.toLowerCase().includes(search.toLowerCase()) ||
            t["ma'nosi"]?.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, terms]);

    return (
        <div className="app-container">
            <div className="bg-blob blob-1"></div>
            <div className="bg-blob blob-2"></div>
            <div className="bg-blob blob-3"></div>

            <nav style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.5rem 2rem',
                position: 'relative',
                zIndex: 200
            }}>
                {/* Chap tomon: Profil */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {user && (
                        <Link to="/profile" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--gradient-1), var(--gradient-2))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                boxShadow: '0 2px 5px var(--shadow-color)'
                            }}>
                                {user.fullname ? user.fullname.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <span className="profile-name" style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{user.fullname}</span>
                        </Link>
                    )}
                </div>

                {/* O'ng tomon: Menu va Theme */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Link to="/composers" style={{
                        textDecoration: 'none',
                        color: 'var(--text-secondary)',
                        fontWeight: '500',
                        fontSize: '1rem',
                        transition: 'color 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                    }} className="nav-link">
                        🎵 Kompozitorlar
                    </Link>

                    <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme" style={{ position: 'static', margin: 0 }}>
                        {theme === 'light' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="5"></circle>
                                <line x1="12" y1="1" x2="12" y2="3"></line>
                                <line x1="12" y1="21" x2="12" y2="23"></line>
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                <line x1="1" y1="12" x2="3" y2="12"></line>
                                <line x1="21" y1="12" x2="23" y2="12"></line>
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                            </svg>
                        )}
                    </button>
                </div>
            </nav>

            <header className="main-header">
                <h1>Virtual Musiqa Lug'ati</h1>
                <p>Musiqiy atamalar va ularning izohlari</p>


                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Atama yoki ma'noni qidiring..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input"
                        autoFocus
                    />
                    <div className="search-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </div>
                </div>
            </header>

            {/* NEW: Trending Terms Section */}
            <TrendingTerms />

            <main className="terms-grid">
                {loading ? (
                    <div className="no-results"><p>Yuklanmoqda...</p></div>
                ) : error ? (
                    <div className="no-results" style={{ color: 'red', flexDirection: 'column' }}>
                        <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Xatolik yuz berdi!</p>
                        <p>{error}</p>
                    </div>
                ) : filteredTerms.length > 0 ? (
                    filteredTerms.map(term => (
                        <TermCard key={term.id} term={term} />
                    ))
                ) : (
                    <div className="no-results">
                        <p>Hech qanday natija topilmadi</p>
                    </div>
                )}
            </main>

            <footer className="main-footer">
                <p className="creator-credit">Creator: Baxtiyarov Jahongir</p>
                <p className="creator-credit">Developer: Nurbek Sobirov</p>
            </footer>
        </div>
    );
}

export default Home;
