import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import '../App.css';


import Logo from "/images/logo.png"

const SHEET_ID = '1EplZnqMhRJHS2XBqr00Qjpl8-iaXMDRKhMCL3E3Y2ts';
const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=MusiqaLugati`;
const ANALYTICS_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=analitika%20web`;
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyemAthfI7hbmhs1_K7MADxYxfxro0zdRCCnqrdw5VKqZlgb1MX4LzNL3p6JISAwEoU/exec';

const TermCard = ({ term }) => {
    const { language, t } = useLanguage();

    const handleSpeak = (e) => {
        e.stopPropagation();
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(term.atama);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
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
        <div className="term-card">
            <div className="term-header">
                <h3>{term.atama}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                        onClick={handleSpeak}
                        title={t('listen')}
                        className="speak-btn"
                    >
                        🔊
                    </button>
                    <span className="term-id">#{term.id}</span>
                </div>
            </div>
            <div className="term-body">
                <div style={{ marginBottom: '10px' }}>
                    <span style={{ fontWeight: '500', fontSize: '1.1rem' }}>{definition || "-"}</span>
                </div>

                {term.rasm_url && (
                    <div className="term-image-container" style={{ marginTop: '15px' }}>
                        <img src={term.rasm_url} alt={term.atama} className="term-image" onError={(e) => e.target.style.display = 'none'} />
                    </div>
                )}
            </div>
        </div>
    );
};

const TrendingTerms = () => {
    const [trends, setTrends] = useState([]);
    const { t } = useLanguage();

    useEffect(() => {
        Papa.parse(ANALYTICS_CSV_URL, {
            download: true,
            header: false,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.data && results.data.length > 1) {
                    const rawRows = results.data.slice(1);
                    const formatted = rawRows.map(row => ({
                        term: row[0],
                        count: parseInt(row[1] || 0)
                    })).sort((a, b) => b.count - a.count)
                        .slice(0, 5);

                    setTrends(formatted);
                }
            }
        });
    }, []);

    if (trends.length === 0) return null;

    return (
        <div className="trending-container" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>🔥 {t('trending')}</p>
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

    const { user } = useAuth();
    const { language, setLanguage, t } = useLanguage();

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

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
                                const manosi_ru = row[1];
                                const rasm = row[2];
                                const manosi_uz = row[3];
                                const manosi_kaa = row[4];

                                if (!atama) return null;
                                return {
                                    id: index + 1,
                                    atama: atama.trim(),
                                    manosi_ru: manosi_ru ? manosi_ru.trim() : "",
                                    rasm_url: rasm || "",
                                    manosi_uz: manosi_uz ? manosi_uz.trim() : "",
                                    manosi_kaa: manosi_kaa ? manosi_kaa.trim() : ""
                                };
                            }).filter(item => item !== null);

                            setTerms(formattedData);
                            if (formattedData.length === 0) setError(t('error_empty'));
                        } else {
                            setError(t('error_empty'));
                        }
                        setLoading(false);
                    },
                    error: (err) => {
                        console.error(err);
                        setError(t('error_fetch'));
                        setLoading(false);
                    }
                });
            } catch (err) {
                console.error(err);
                setError(t('error_fetch'));
                setLoading(false);
            }
        };
        fetchData();
    }, [t]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search.length > 3) {
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

    const filteredTerms = useMemo(() => {
        return terms.filter(t =>
            t.atama?.toLowerCase().includes(search.toLowerCase()) ||
            t.manosi_ru?.toLowerCase().includes(search.toLowerCase()) ||
            t.manosi_uz?.toLowerCase().includes(search.toLowerCase()) ||
            t.manosi_kaa?.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, terms]);

    return (
        <div className="container">
            {/* Header */}
            <header className="header">
                <nav className="nav-container">
                    <div className="nav-left">
                        <Link to="/profile" className="profile-link">
                            <div className="avatar-circle">
                                {user?.fullname?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <span className="profile-name">{user?.fullname?.split(' ')[0]}</span>
                        </Link>
                    </div>

                    <div className="nav-right">
                        {/* Language Switcher */}
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="lang-select"
                        >
                            <option value="uz">O'zbek</option>
                            <option value="ru">Русский</option>
                            <option value="kaa">Qaraqalpaq</option>
                        </select>

                        <Link to="/composers" className="nav-link">
                            🎵 {t('composers')}
                        </Link>

                        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="theme-toggle">
                            {theme === 'light' ? '🌙' : '☀️'}
                        </button>
                    </div>
                </nav>

                <div className="title-wrapper">
                    <img src={Logo} alt="Logo" className="site-logo" />
                    <h1 className="title">Virtual Musiqa Lug'ati</h1>
                </div>

                <div className="search-container">
                    <input
                        type="text"
                        placeholder={t('search_placeholder')}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input"
                    />
                </div>
            </header>

            <main className="main-content">
                <TrendingTerms />

                <div className="terms-grid">
                    {loading ? (
                        <p className="loading">{t('loading')}</p>
                    ) : error ? (
                        <p className="error">{error}</p>
                    ) : filteredTerms.length > 0 ? (
                        filteredTerms.map(term => (
                            <TermCard key={term.id} term={term} />
                        ))
                    ) : (
                        <div className="no-results">
                            <p>{t('no_results')}</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Home;
