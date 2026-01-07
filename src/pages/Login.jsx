import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loggingIn, setLoggingIn] = useState(false);
    const { login } = useAuth();
    const { t, language, setLanguage } = useLanguage();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoggingIn(true);
        setError('');
        try {
            const success = await login(username, password);
            if (!success) {
                setError(t('login_or_password_incorrect'));
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(t('system_error_occurred'));
        } finally {
            setLoggingIn(false);
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
                            className="auth-input"
                        />
                    </div>
                    <div className="form-group">
                        <label>{t('password')}</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="auth-input"
                        />
                    </div>

                    <button type="submit" className="login-btn" disabled={loggingIn}>
                        {loggingIn ? t('loading') : t('enter')}
                    </button>
                </form>

                <p className="auth-footer">
                    {t('no_account')} <Link to="/register">{t('register_action')}</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
