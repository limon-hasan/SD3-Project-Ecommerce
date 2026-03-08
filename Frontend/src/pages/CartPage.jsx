import React from 'react';
import { useShop } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import Button from '../components/UI/Button';
import './CartPage.css';

const CartPage = () => {
    const { cart, removeFromCart, user } = useShop();
    const navigate = useNavigate();

    const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2);

    return (
        <div className="cart-page container">
            <h1 className="gradient-text">Shopping Cart</h1>

            {cart.length === 0 ? (
                <div className="empty-cart">
                    <p>Your cart is empty</p>
                    <Button onClick={() => navigate('/')}>Go Shopping</Button>
                </div>
            ) : (
                <div className="cart-content">
                    <div className="cart-items">
                        {cart.map((item) => (
                            <div key={item._id} className="cart-item glass">
                                <img src={item.imageUrl || 'https://via.placeholder.com/100'} alt={item.name} />
                                <div className="item-info">
                                    <h3>{item.name}</h3>
                                    <p>${item.price}</p>
                                </div>
                                <div className="item-actions">
                                    <span>Qty: {item.qty}</span>
                                    <Button variant="outline" onClick={() => removeFromCart(item._id)}>
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary glass">
                        <h2>Summary</h2>
                        <div className="summary-row">
                            <span>Total:</span>
                            <span className="total-price">${total}</span>
                        </div>
                        <Button className="checkout-btn" onClick={() => {
                            if (user) {
                                navigate('/checkout');
                            } else {
                                navigate('/login?redirect=checkout');
                            }
                        }}>
                            Proceed to Checkout
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
