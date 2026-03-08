import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useShop } from '../context/ShopContext';
import Button from '../components/UI/Button';
import './Auth.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useShop();
    const navigate = useNavigate();

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address');
            return false;
        }
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const success = await login(email, password);
        if (success) {
            const searchParams = new URLSearchParams(window.location.search);
            const redirect = searchParams.get('redirect');
            toast.success('Login successful! Welcome back.');
            navigate(redirect ? `/${redirect}` : '/');
        } else {
            toast.error('Invalid email or password');
        }
    };

    return (
        <div className="auth-page container">
            <div className="auth-card glass">
                <h1 className="gradient-text">Welcome Back</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <Button className="auth-btn" type="submit">Login</Button>
                </form>
                <p className="auth-redirect">
                    New Customer? <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
