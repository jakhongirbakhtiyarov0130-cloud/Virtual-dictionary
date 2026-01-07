import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import '../App.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const { t } = useLanguage();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const success = await login(username, password);
            if (!success) {
                setError(t('login_or_password_incorrect'));
            }
        } catch (err) {
            setError(t('system_error_occurred'));
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>{t('login')}</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>{t('username')}</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>{t('password')}</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="search-input"
                            placeholder="Password"
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="login-btn" disabled={loggingIn}>
                        {loggingIn ? 'Tekshirilmoqda...' : 'Kirish'}
                    </button>
                </form>

                <p className="auth-footer">
                    Hali hisobingiz yo'qmi? <Link to="/register">Ro'yxatdan o'tish</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
