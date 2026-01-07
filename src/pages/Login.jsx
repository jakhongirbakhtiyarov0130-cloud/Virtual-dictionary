import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loggingIn, setLoggingIn] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoggingIn(true);
        setError('');

        try {
            await login(username, password);
            navigate('/'); // Muvaffaqiyatli kirgandan so'ng asosiy sahifaga yo'naltirish
        } catch (err) {
            setError(err.message);
        } finally {
            setLoggingIn(false);
        }
    };

    return (
        <div className="app-container auth-page">
            <div className="bg-blob blob-1"></div>
            <div className="bg-blob blob-2"></div>

            <div className="auth-card">
                <h1>Kirish</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Foydalanuvchi nomi</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="search-input" // Reuse existing input style
                            placeholder="Username"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Parol</label>
                        <input
                            type="password"
                            id="password"
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
