import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer glass">
            <div className="container footer-content">
                <div className="footer-section">
                    <h3 className="gradient-text">LuxeMarket</h3>
                    <p>Premium essentials for the modern lifestyle.</p>
                </div>
                <div className="footer-section">
                    <h4>Shop</h4>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/#shop">Products</Link></li>
                        <li><Link to="/cart">Cart</Link></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Support</h4>
                    <ul>
                        <li><Link to="/profile">My Account</Link></li>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Contact</h4>
                    <p>Email: support@luxemarket.com</p>
                    <p>Phone: +1 (555) 123-4567</p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} LuxeMarket. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
