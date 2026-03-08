import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/UI/Button';
import './NotFoundPage.css';

const NotFoundPage = () => {
    return (
        <div className="not-found-page container">
            <div className="not-found-content glass">
                <h1 className="gradient-text">404</h1>
                <h2>Page Not Found</h2>
                <p>The page you are looking for does not exist or has been moved.</p>
                <Link to="/">
                    <Button>Go Back Home</Button>
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;
