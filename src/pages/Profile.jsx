import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px', color: 'white' }}>
                <p>Foydalanuvchi ma'lumotlari topilmadi.</p>
                <Link to="/login" style={{ color: 'var(--accent-color)' }}>Kirish</Link>
            </div>
        );
    }

    return (
        <div className="app-container auth-page">
            <div className="bg-blob blob-1"></div>
            <div className="bg-blob blob-2"></div>

            <div className="auth-card" style={{ maxWidth: '500px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--gradient-1), var(--gradient-2))',
                        margin: '0 auto 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '3rem',
                        color: 'white',
                        fontWeight: 'bold'
                    }}>
                        {user.fullname ? user.fullname.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <h1>Mening Profilim</h1>
                </div>

                <div className="form-group">
                    <label>To'liq Ism:</label>
                    <div className="search-input" style={{ background: 'var(--glass-border)', cursor: 'default' }}>
                        {user.fullname}
                    </div>
                </div>

                <div className="form-group">
                    <label>Foydalanuvchi nomi (Login):</label>
                    <div className="search-input" style={{ background: 'var(--glass-border)', cursor: 'default' }}>
                        {user.username}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <Link to="/" className="login-btn" style={{ textAlign: 'center', textDecoration: 'none', background: 'var(--glass-border)', border: '1px solid var(--text-secondary)' }}>
                        Orqaga
                    </Link>

                    <button onClick={handleLogout} className="login-btn" style={{ background: 'rgba(255, 77, 77, 0.8)' }}>
                        Chiqish
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
