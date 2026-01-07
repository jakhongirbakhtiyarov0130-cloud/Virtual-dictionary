import React, { useState, useMemo, useEffect } from 'react';
import Papa from 'papaparse';
import './App.css';
import localDb from './db.json';

const SHEET_ID = '1EplZnqMhRJHS2XBqr00Qjpl8-iaXMDRKhMCL3E3Y2ts';
// Using GVIZ strictly
const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=MusiqaLugati`;

const TermCard = ({ term }) => (
  <div className="term-card">
    <div className="term-header">
      <h3>{term.atama}</h3>
      <span className="term-id">#{term.id}</span>
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

function App() {
  const [search, setSearch] = useState('');
  const [theme, setTheme] = useState('light');
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Fetch data from Google Sheets
  useEffect(() => {
    const fetchData = async () => {
      try {
        Papa.parse(SHEET_CSV_URL, {
          download: true,
          header: false, // Strict indexing: 0=Atama, 1=Manosi
          skipEmptyLines: true,
          complete: (results) => {
            console.log("Raw CSV Data:", results.data);

            if (results.data && results.data.length > 1) {
              // Skip header row
              const rawRows = results.data.slice(1);

              const formattedData = rawRows.map((row, index) => {
                // Safety check for row length
                if (row.length < 2) return null;

                const atama = row[0];
                const manosi = row[1];
                const rasm = row[2]; // Assuming 3rd column is image

                if (!atama || !manosi) return null;

                return {
                  id: index + 1,
                  atama: atama.trim(),
                  "ma'nosi": manosi.trim(),
                  rasm_url: rasm || ""
                };
              }).filter(item => item !== null);

              setTerms(formattedData);
              if (formattedData.length === 0) {
                setError("Jadvalda ma'lumot topilmadi (To'g'ri to'ldirilganmi?)");
              }
            } else {
              setError("Jadval bo'sh yoki yuklanmadi.");
            }
            setLoading(false);
          },
          error: (err) => {
            console.error(err);
            setError("Jadvalni yuklab bo'lmadi. Internetni tekshiring.");
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

      <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === 'light' ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

      <main className="terms-grid">
        {loading ? (
          <div className="no-results"><p>Yuklanmoqda...</p></div>
        ) : error ? (
          <div className="no-results" style={{ color: 'red', flexDirection: 'column' }}>
            <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Xatolik yuz berdi!</p>
            <p>{error}</p>
            <p style={{ fontSize: '0.9rem', marginTop: '10px', opacity: 0.8 }}>Agar brauzer xatolik bersa, "Publish to Web" qilinganligini tekshiring.</p>
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

export default App;
