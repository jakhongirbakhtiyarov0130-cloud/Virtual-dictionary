import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    // MUHIM: Bu yerga Google Apps Script Deploy qilingan URL ni qo'ying
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyemAthfI7hbmhs1_K7MADxYxfxro0zdRCCnqrdw5VKqZlgb1MX4LzNL3p6JISAwEoU/exec";

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        fullname: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (SCRIPT_URL === "SIZNING_SCRIPT_URL_MANZILINGIZ") {
            setError("Iltimos, dasturchi bilan bog'laning (Script URL kiritilmagan)");
            return;
        }

        setLoading(true);
        setError('');

        try {
            // no-cors rejimi Google Sheets ga yozish uchun kerak, lekin javobni o'qiy olmaymiz
            // Shuning uchun biz muvaffaqiyatli deb hisoblab ketaveramiz yoki redirect qilamiz
            await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...formData, action: 'register' })
            });

            // Muvaffaqiyatli hisoblab Login sahifasiga yo'naltiramiz
            alert("So'rov yuborildi! Agar ma'lumotlar to'g'ri bo'lsa, birozdan so'ng Login qilishingiz mumkin.");
            navigate('/login');

        } catch (err) {
            console.error(err);
            setError("Xatolik yuz berdi. Internetni tekshiring.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-container auth-page">
            <div className="bg-blob blob-1"></div>
            <div className="bg-blob blob-3"></div>

            <div className="auth-card">
                <h1>Ro'yxatdan o'tish</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="fullname">To'liq ismingiz</label>
                        <input
                            type="text"
                            id="fullname"
                            value={formData.fullname}
                            onChange={handleChange}
                            required
                            className="search-input"
                            placeholder="Ism Familiya"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="username">Foydalanuvchi nomi (Login)</label>
                        <input
                            type="text"
                            id="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="search-input"
                            placeholder="Username"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Parol</label>
                        <input
                            type="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="search-input"
                            placeholder="********"
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'Yuborilmoqda...' : "Ro'yxatdan o'tish"}
                    </button>
                </form>

                <p className="auth-footer">
                    Hisobingiz bormi? <Link to="/login">Kirish</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
