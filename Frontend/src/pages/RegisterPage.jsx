import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useShop } from '../context/ShopContext';
import Button from '../components/UI/Button';
import './Auth.css';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useShop();
    const navigate = useNavigate();

    const validateForm = () => {
        if (name.trim().length < 2) {
            toast.error('Name must be at least 2 characters');
            return false;
        }
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

        const success = await register(name, email, password);
        if (success) {
            toast.success('Registration successful!');
            navigate('/');
        } else {
            toast.error('Registration failed. Email might be taken.');
        }
    };

    return (
        <div className="auth-page container">
            <div className="auth-card glass">
                <h1 className="gradient-text">Create Account</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
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
                    <Button className="auth-btn" type="submit">Register</Button>
                </form>
                <p className="auth-redirect">
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
