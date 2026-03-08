import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../components/UI/Button';

const VerifyEmailPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // verifying, success, error

    useEffect(() => {
        const verify = async () => {
            // Simulate API call
            setTimeout(() => {
                setStatus('success');
                toast.success('Email Verified Successfully!');
            }, 2000);
        };
        verify();
    }, []);

    return (
        <div className="container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass" style={{ padding: '2rem', textAlign: 'center', maxWidth: '400px' }}>
                <h1 className="gradient-text" style={{ marginBottom: '1rem' }}>
                    {status === 'verifying' ? 'Verifying...' : 'Email Verified!'}
                </h1>

                {status === 'verifying' ? (
                    <div style={{ fontSize: '3rem' }}>⏳</div>
                ) : (
                    <>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                        <p style={{ marginBottom: '1.5rem', color: '#ccc' }}>
                            Your email has been successfully verified. You can now access all features.
                        </p>
                        <Button onClick={() => navigate('/login')}>
                            Go to Login
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyEmailPage;
