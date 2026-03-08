import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import Button from '../components/UI/Button';
import './Auth.css';

const AdminLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, user } = useShop();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.isAdmin) {
            navigate('/admin');
        }
    }, [user, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        await login(email, password);
    };

    return (
        <div className="auth-container admin-login-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f0f0f' }}>
            <div className="auth-card glass" style={{ border: '1px solid var(--primary)' }}>
                <h1 className="gradient-text" style={{ textAlign: 'center', marginBottom: '2rem' }}>Admin Portal</h1>
                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <label>Admin Email</label>
                        <input
                            type="email"
                            placeholder="Enter admin email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <Button type="submit" style={{ width: '100%', marginTop: '1rem' }}>
                        Access Dashboard
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginPage;
