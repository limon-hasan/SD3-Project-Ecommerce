import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { useTheme } from '../../context/ThemeContext';
import Button from '../UI/Button';
import './Navbar.css';

const Navbar = () => {
    const { cart, user, logout } = useShop();
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        if (theme === 'light') setTheme('dark');
        else if (theme === 'dark') setTheme('system');
        else setTheme('light');
    };

    return (
        <nav className="navbar glass">
            <div className="container navbar-content">
                <Link to="/" className="logo gradient-text">ShopSphere</Link>

                <ul className="nav-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/">Shop</Link></li>
                </ul>

                <div className="nav-actions">
                    {user ? (
                        <div className="user-menu">
                            {user.isAdmin && (
                                <Link to="/admin" style={{ color: 'var(--secondary)' }}>Admin</Link>
                            )}
                            <Link to="/profile" style={{ marginRight: '10px' }}>{user.name}</Link>
                            <Button variant="outline" onClick={logout}>Logout</Button>
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login">
                                <Button variant="outline">Login</Button>
                            </Link>
                            <Link to="/register">
                                <Button>Register</Button>
                            </Link>
                        </div>
                    )}

                    <Link to="/cart">
                        <Button>Cart ({cart.reduce((acc, item) => acc + item.qty, 0)})</Button>
                    </Link>

                    <Button variant="outline" onClick={toggleTheme} className="theme-btn">
                        {theme === 'light' ? '☀️' : theme === 'dark' ? '🌙' : '💻'}
                    </Button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
