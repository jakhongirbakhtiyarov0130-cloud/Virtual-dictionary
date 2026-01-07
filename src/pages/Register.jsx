import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext'; // Import hook
import '../App.css';

const Register = () => {
    // MUHIM: Bu yerga Google Apps Script Deploy qilingan URL ni qo'ying
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyemAthfI7hbmhs1_K7MADxYxfxro0zdRCCnqrdw5VKqZlgb1MX4LzNL3p6JISAwEoU/exec";

    const [formData, setFormData] = useState({
        fullname: '',
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { t, language, setLanguage } = useLanguage(); // Use hook

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // no-cors rejimi Google Sheets ga yozish uchun kerak, lekin javobni o'qiy olmaymiz
            // Shuning uchun biz muvaffaqiyatli deb hisoblab ketaveramiz yoki redirect qilamiz
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Muhim: CORS muammosini oldini olish uchun
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'register',
                    ...formData
                })
            });

            // Muvaffaqiyatli hisoblab Login sahifasiga yo'naltiramiz
            alert(t("registration_success_message"));
            navigate('/login');

        } catch (err) {
            console.error(err);
            setError(t("registration_error_message"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="lang-select"
                >
                    <option value="uz">O'zbek</option>
                    <option value="ru">Русский</option>
                    <option value="kaa">Qaraqalpaq</option>
                </select>
            </div>

            <div className="auth-card">
                <h2>{t('register')}</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>{t('fullname')}</label>
                        <input
                            type="text"
                            name="fullname"
                            value={formData.fullname}
                            onChange={handleChange}
                            required
                            className="auth-input"
                        />
                    </div>

                    <div className="form-group">
                        <label>{t('username')}</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="auth-input"
                        />
                    </div>

                    <div className="form-group">
                        <label>{t('password')}</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="auth-input"
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? t('loading') : t('submit')}
                    </button>
                </form>

                <p className="auth-footer">
                    {t('have_account')} <Link to="/login">{t('enter')}</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
