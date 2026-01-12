import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import '../App.css';
import Footer from '../components/Footer';

import Logo from "/images/logo.png"

const SHEET_ID = '1EplZnqMhRJHS2XBqr00Qjpl8-iaXMDRKhMCL3E3Y2ts';
const INSTRUMENTS_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Cholgular`;

// Icons
const IconUser = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const IconBook = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>;
const IconX = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconMusic = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>;

const InstrumentModal = ({ item, onClose }) => {
    if (!item) return null;
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="term-modal premium-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
                <button className="modal-close" onClick={onClose}><IconX /></button>
                <div className="modal-content">
                    {item.image && (
                        <div style={{ width: '100%', maxHeight: '400px', overflow: 'hidden', borderRadius: '15px', marginBottom: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                            <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    )}
                    <h2 style={{ color: 'var(--accent-color)', fontSize: '2.2rem', marginBottom: '15px' }}>{item.name}</h2>
                    <div className="composer-details" style={{ lineHeight: '1.8', color: '#444', fontSize: '1.1rem', textAlign: 'justify' }}>
                        {item.info}
                    </div>
                </div>
            </div>
        </div>
    );
};

const InstrumentCard = ({ item, onOpen }) => (
    <div className="premium-card" onClick={() => onOpen(item)} style={{ cursor: 'pointer', overflow: 'hidden' }}>
        <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
            {item.image ? (
                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                    onMouseOver={e => e.target.style.transform = 'scale(1.1)'}
                    onMouseOut={e => e.target.style.transform = 'scale(1)'} />
            ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', color: '#cbd5e1' }}>
                    <IconMusic />
                </div>
            )}
        </div>
        <div style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#1e293b' }}>{item.name}</h3>
            <p style={{
                fontSize: '0.9rem',
                color: '#64748b',
                display: '-webkit-box',
                WebkitLineClamp: '3',
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: '1.6',
                minHeight: '4.8em'
            }}>
                {item.info}
            </p>
            <button className="action-btn" style={{ marginTop: '20px', width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                <IconBook /> Batafsil
            </button>
        </div>
    </div>
);

const Instruments = () => {
    const { user } = useAuth();
    const { language, setLanguage, t } = useLanguage();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                Papa.parse(INSTRUMENTS_CSV_URL, {
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
                                    image: row[2]?.trim()
                                };
                            }).filter(c => c !== null);
                            setData(formatted);
                        } else {
                            setError("Ma'lumot topilmadi. Jadvalda 'Cholgular' nomli list borligini tekshiring.");
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

    return (
        <div className="container">
            <header className="header" style={{ padding: '15px 5%' }}>
                <div className="header-left">
                    <Link to="/" className="title-wrapper" style={{ textDecoration: 'none' }}>
                        <img src={Logo} alt="Logo" className="site-logo" />
                        <div className="site-title-box">
                            <h1>{t('site_title')}</h1>
                            <p>{t('site_subtitle')}</p>
                        </div>
                    </Link>
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
                    <li><Link to="/composers">{t('composers')}</Link></li>
                    <li className="active"><Link to="/instruments" style={{ color: 'var(--accent-color)' }}>{t('instruments')}</Link></li>
                    <li><Link to="/quiz">{t('quiz')}</Link></li>
                </ul>
            </nav>

            <div className="content-wrapper" style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', gridTemplateColumns: '1fr' }}>
                <main className="main-content">
                    <div className="breadcrumb" style={{ marginBottom: '20px' }}>{t('home')} &gt; {t('instruments')}</div>

                    <div style={{ marginBottom: '40px' }}>
                        <h2 style={{ fontSize: '2rem', color: 'var(--accent-color)', marginBottom: '10px' }}>{t('instruments')}</h2>
                        <p style={{ color: '#64748b' }}>Musiqa olamidagi turli xil cholg'u asboblari bilan tanishing.</p>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '100px', fontSize: '1.2rem', color: '#64748b' }}>Yuklanmoqda...</div>
                    ) : error ? (
                        <div style={{ textAlign: 'center', padding: '50px', background: '#fef2f2', borderRadius: '15px', border: '1px solid #fee2e2' }}>
                            <p style={{ color: '#dc2626' }}>{error}</p>
                            <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '10px' }}>
                                Google Jadvalda <strong> 'Cholgular' </strong> nomli list (sheet) oching va ma'lumotlarni kiriting.
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
                            {data.map((item, idx) => (
                                <InstrumentCard key={idx} item={item} onOpen={setSelectedItem} />
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {selectedItem && <InstrumentModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
            <Footer />
        </div>
    );
};

export default Instruments;
