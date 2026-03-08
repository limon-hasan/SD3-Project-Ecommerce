import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useShop } from '../context/ShopContext';
import Button from '../components/UI/Button';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './CheckoutPage.css';

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const CheckoutPage = () => {
    const { cart, user, setCart } = useShop(); // Ensure setCart is available in context or needs to be added
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('Stripe');
    const [bkashTrxId, setBkashTrxId] = useState('');

    const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2);

    const handlePlaceOrder = async (paymentResult = {}) => {
        try {
            // 1. Create Order
            const orderRes = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    orderItems: cart,
                    shippingAddress: { address: '123 Fake St', city: 'Dhaka', postalCode: '1000', country: 'Bangladesh' }, // Hardcoded for demo
                    paymentMethod: paymentMethod,
                    totalPrice: total,
                }),
            });

            if (!orderRes.ok) throw new Error('Order creation failed');
            const order = await orderRes.json();

            // 2. Pay Order (if success)
            const payRes = await fetch(`/api/orders/${order._id}/pay`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(paymentResult),
            });

            if (!payRes.ok) throw new Error('Payment recording failed');

            toast.success('Order Placed Successfully!');
            // Clear cart (Simulated, ideally use context method)
            window.location.href = '/profile';
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    const handleBkashSubmit = (e) => {
        e.preventDefault();
        if (!bkashTrxId) return toast.error('Please enter Transaction ID');

        handlePlaceOrder({
            id: bkashTrxId,
            status: 'COMPLETED',
            update_time: new Date().toISOString(),
            email_address: user.email,
        });
    };

    // Stripe Component (Inner)
    const StripeForm = () => {
        const stripe = useStripe();
        const elements = useElements();
        const [processing, setProcessing] = useState(false);

        const handleSubmit = async (e) => {
            e.preventDefault();
            if (!stripe || !elements) return;
            setProcessing(true);

            try {
                const res = await fetch('/api/payment/create-intent', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
                    body: JSON.stringify({ amount: Math.round(total * 100) }),
                });
                const { clientSecret } = await res.json();
                const result = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: { card: elements.getElement(CardElement) },
                });

                if (result.error) {
                    toast.error(result.error.message);
                } else if (result.paymentIntent.status === 'succeeded') {
                    await handlePlaceOrder(result.paymentIntent);
                }
            } catch (err) {
                toast.error('Payment failed');
            }
            setProcessing(false);
        };

        return (
            <form onSubmit={handleSubmit} className="checkout-form">
                <div className="card-element-container glass">
                    <CardElement options={{ style: { base: { fontSize: '16px', color: '#fff', '::placeholder': { color: '#aab7c4' } } } }} />
                </div>
                <Button disabled={!stripe || processing} className="pay-btn" style={{ width: '100%', marginTop: '1rem' }}>
                    {processing ? 'Processing...' : `Pay $${total}`}
                </Button>
            </form>
        );
    };

    return (
        <div className="checkout-page container">
            <h1 className="gradient-text">Checkout</h1>
            <div className="checkout-container">
                <div className="order-summary glass">
                    <h2>Order Summary</h2>
                    {cart.map(item => (
                        <div key={item._id} className="summary-item">
                            <span>{item.name} x {item.qty}</span>
                            <span>${(item.price * item.qty).toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="total-row">
                        <span>Total</span>
                        <span>${total}</span>
                    </div>
                </div>

                <div className="payment-section glass">
                    <h2>Select Payment Method</h2>
                    <div className="payment-methods" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div
                            className={`method-card ${paymentMethod === 'Stripe' ? 'selected' : ''}`}
                            onClick={() => setPaymentMethod('Stripe')}
                            style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', background: paymentMethod === 'Stripe' ? 'rgba(255,255,255,0.1)' : 'transparent' }}
                        >
                            💳 Credit Card
                        </div>
                        <div
                            className={`method-card ${paymentMethod === 'bKash' ? 'selected' : ''}`}
                            onClick={() => setPaymentMethod('bKash')}
                            style={{ padding: '1rem', border: '1px solid #e2136e', borderRadius: '8px', cursor: 'pointer', background: paymentMethod === 'bKash' ? 'rgba(226, 19, 110, 0.2)' : 'transparent', color: '#e2136e', fontWeight: 'bold' }}
                        >
                            💸 bKash
                        </div>
                    </div>

                    {paymentMethod === 'Stripe' ? (
                        <Elements stripe={stripePromise}>
                            <StripeForm />
                        </Elements>
                    ) : (
                        <div className="bkash-form">
                            <div className="bkash-instructions" style={{ marginBottom: '1rem', padding: '1rem', background: '#e2136e', color: 'white', borderRadius: '8px' }}>
                                <p>1. Go to your bKash App</p>
                                <p>2. Send <strong>${total}</strong> to <strong>01700000000</strong></p>
                                <p>3. Enter the Transaction ID below</p>
                            </div>
                            <form onSubmit={handleBkashSubmit}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label>Transaction ID</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 8J7HA6..."
                                        value={bkashTrxId}
                                        onChange={(e) => setBkashTrxId(e.target.value)}
                                        required
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}
                                    />
                                </div>
                                <Button type="submit" style={{ width: '100%', background: '#e2136e', border: 'none' }}>
                                    Confirm bKash Payment
                                </Button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
