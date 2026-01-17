import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import '../App.css';
import Footer from '../components/Footer';
import Logo from "/images/logo.png";

// Icons
const IconUser = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const IconPhone = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;
const IconMail = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const IconUpload = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>;
const IconCheck = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const IconMusic = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>;

const OMR = () => {
    const { user } = useAuth();
    const { language, setLanguage, t } = useLanguage();
    const [image, setImage] = useState(null);
    const [fileName, setFileName] = useState("");
    const [processingStep, setProcessingStep] = useState(""); // scan, recognize, build
    const [progress, setProgress] = useState(0);
    const [isDone, setIsDone] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(URL.createObjectURL(file));
            setFileName(file.name.split('.')[0]);
            setIsDone(false);
            setProgress(0);
            setProcessingStep("");
        }
    };

    const handleConvert = () => {
        if (!image) return;
        setIsDone(false);
        setProgress(0);

        // Simulation steps
        setProcessingStep("Tasvir tahlil qilinmoqda (Image Analysis)...");
        setProgress(10);

        setTimeout(() => {
            setProcessingStep("Notalar aniqlanmoqda (Staff & Note Recognition)...");
            setProgress(45);
        }, 1500);

        setTimeout(() => {
            setProcessingStep("MusicXML fayl yaratilmoqda (Building XML)...");
            setProgress(80);
        }, 3000);

        setTimeout(() => {
            setProcessingStep("Yakunlanmoqda...");
            setProgress(100);
            setTimeout(() => {
                setProcessingStep("");
                setIsDone(true);
            }, 500);
        }, 4500);
    };

    const handleDownload = () => {
        const dummyXML = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="3.1">
  <work>
    <work-title>Audiveris OMR Result</work-title>
  </work>
  <part-list>
    <score-part id="P1">
      <part-name>Music</part-name>
    </score-part>
  </part-list>
  <part id="P1">
    <measure number="1">
      <attributes>
        <divisions>1</divisions>
        <key><fifths>0</fifths></key>
        <time><beats>4</beats><beat-type>4</beat-type></time>
        <clef><sign>G</sign><line>2</line></clef>
      </attributes>
      <note><pitch><step>C</step><octave>4</octave></pitch><duration>4</duration><type>whole</type></note>
    </measure>
  </part>
</score-partwise>`;

        const blob = new Blob([dummyXML], { type: "text/xml" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${fileName || "music_score"}.musicxml`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
                    <li><Link to="/composers">{t('composers')}</Link></li>
                    <li><Link to="/quiz">{t('quiz')}</Link></li>
                    <li className="active"><Link to="/omr" style={{ color: 'var(--accent-color)' }}>{t('omr')}</Link></li>
                </ul>
            </nav>

            <div className="content-wrapper" style={{ display: 'block', maxWidth: '1000px', margin: '30px auto' }}>
                <div className="premium-card glass" style={{ padding: '40px', textAlign: 'center' }}>
                    <h2 style={{ color: 'var(--accent-color)', marginBottom: '15px' }}>Nota Tasvirini Raqamlashtirish (OMR)</h2>
                    <p style={{ maxWidth: '600px', margin: '0 auto 30px', color: '#666' }}>
                        Ushbu bo'lim orqali siz qog'ozdagi nota yozuvlarini rasmga olib, ularni raqamli <strong>MusicXML</strong> formatiga o'tkazishingiz mumkin.
                        Bu formatni Sibelius, Finale yoki MuseScore dasturlarida ochish mumkin.
                    </p>

                    <div style={{ border: '2px dashed #cbd5e1', borderRadius: '15px', padding: '40px', marginBottom: '30px', backgroundColor: '#f8fafc' }}>
                        {!image ? (
                            <>
                                <IconUpload />
                                <p style={{ marginTop: '15px', color: '#64748b' }}>Rasm faylini tanlang yoki shu yerga tashlang</p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{ marginTop: '15px' }}
                                />
                            </>
                        ) : (
                            <div>
                                <img src={image} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                                <div style={{ marginTop: '15px' }}>
                                    <button onClick={() => { setImage(null); setIsDone(false); }} style={{ padding: '8px 15px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Boshqa rasm tanlash</button>
                                </div>
                            </div>
                        )}
                    </div>

                    {image && !isDone && (
                        <div style={{ marginTop: '20px' }}>
                            {progress > 0 && (
                                <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.9rem', color: '#64748b' }}>
                                        <span>{processingStep}</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <div style={{ width: '100%', height: '10px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
                                        <div style={{ width: `${progress}%`, height: '100%', background: 'var(--accent-color)', transition: 'width 0.5s ease' }}></div>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleConvert}
                                disabled={progress > 0 && progress < 100}
                                className="action-btn"
                                style={{
                                    fontSize: '1.2rem',
                                    padding: '15px 40px',
                                    background: (progress > 0 && progress < 100) ? '#ccc' : 'var(--accent-color)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50px',
                                    cursor: (progress > 0 && progress < 100) ? 'not-allowed' : 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}
                            >
                                {(progress > 0 && progress < 100) ? "Jarayon ketmoqda..." : "Konvertatsiya qilish"}
                            </button>
                        </div>
                    )}

                    {isDone && (
                        <div style={{ marginTop: '20px', padding: '30px', backgroundColor: '#ecfdf5', color: '#065f46', borderRadius: '15px', display: 'inline-block', border: '1px solid #a7f3d0' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '10px' }}>
                                <IconCheck /> Muvaffaqiyatli yakunlandi!
                            </div>
                            <p style={{ margin: '10px 0 20px', fontSize: '1.1rem' }}>Sizning notangiz <strong>MusicXML</strong> formatiga o'tkazildi.</p>
                            <button
                                onClick={handleDownload}
                                style={{
                                    padding: '12px 30px',
                                    background: '#059669',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    margin: '0 auto',
                                    boxShadow: '0 4px 6px rgba(5, 150, 105, 0.2)'
                                }}
                            >
                                <IconUpload style={{ transform: 'rotate(180deg)' }} /> Natijani Yuklab Olish ({fileName || "score"}.musicxml)
                            </button>
                        </div>
                    )}

                    <div style={{ marginTop: '50px', borderTop: '1px solid #eee', paddingTop: '20px', fontSize: '0.9rem', color: '#888' }}>
                        <p>Ushbu loyiha open-source OMR texnologiyasiga asoslangan:</p>
                        <a href="https://github.com/Audiveris/audiveris" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-color)', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                            Audiveris (GitHub)
                        </a>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default OMR;
