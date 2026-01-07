import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Link } from 'react-router-dom';
import '../App.css';

const SHEET_ID = '1EplZnqMhRJHS2XBqr00Qjpl8-iaXMDRKhMCL3E3Y2ts';
const COMPOSERS_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Kompozitorlar`;

const ComposerCard = ({ composer }) => (
    <div className="term-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {composer.image && (
            <div style={{ width: '100%', height: '200px', overflow: 'hidden', borderRadius: '12px', marginBottom: '1rem' }}>
                <img
                    src={composer.image}
                    alt={composer.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => e.target.src = 'https://via.placeholder.com/300x200?text=Rasm+yoq'}
                />
            </div>
        )}
        <div className="term-header" style={{ marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.4rem' }}>{composer.name}</h3>
            {composer.years && <span className="term-id">{composer.years}</span>}
        </div>
        <div className="term-body" style={{ flexGrow: 1 }}>
            <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>{composer.info}</p>
        </div>
    </div>
);

const Composers = () => {
    const [composers, setComposers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                Papa.parse(COMPOSERS_CSV_URL, {
                    download: true,
                    header: false,
                    skipEmptyLines: true,
                    complete: (results) => {
                        if (results.data && results.data.length > 1) {
                            // 0: Name, 1: Info, 2: Image, 3: Years
                            const rawRows = results.data.slice(1);
                            const formatted = rawRows.map(row => {
                                if (!row[0]) return null;
                                return {
                                    name: row[0],
                                    info: row[1] || "Ma'lumot yo'q",
                                    image: row[2],
                                    years: row[3]
                                };
                            }).filter(c => c !== null);
                            setComposers(formatted);
                        } else {
                            setError("Jadval bo'sh yoki topilmadi (Kompozitorlar)");
                        }
                        setLoading(false);
                    },
                    error: (err) => {
                        console.error(err);
                        setError("Yuklashda xatolik");
                        setLoading(false);
                    }
                });
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="app-container">
            <div className="bg-blob blob-1"></div>
            <div className="bg-blob blob-2"></div>

            <header className="main-header" style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem' }}>
                    <Link to="/" className="login-btn" style={{ width: 'auto', padding: '0.5rem 1rem', background: 'var(--glass-border)', marginTop: 0 }}>
                        &larr; Ortga
                    </Link>
                    <h1 style={{ fontSize: '2rem', margin: 0 }}>Buyuk Kompozitorlar</h1>
                    <div style={{ width: '80px' }}></div> {/* Spacer for centering */}
                </div>
            </header>

            <main className="terms-grid" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
                {loading ? (
                    <div className="no-results"><p>Yuklanmoqda...</p></div>
                ) : error ? (
                    <div className="no-results" style={{ color: 'red' }}>
                        <p>{error}</p>
                    </div>
                ) : composers.length > 0 ? (
                    composers.map((composer, index) => (
                        <ComposerCard key={index} composer={composer} />
                    ))
                ) : (
                    <div className="no-results"><p>Ma'lumot topilmadi</p></div>
                )}
            </main>
        </div>
    );
};

export default Composers;
