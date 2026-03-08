import React, { useEffect, useState } from 'react';
import { useShop } from '../context/ShopContext';
import './ProfilePage.css';

const ProfilePage = () => {
    const { user, fetchMyOrders } = useShop();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (user) {
            const loadOrders = async () => {
                const data = await fetchMyOrders();
                setOrders(data);
            };
            loadOrders();
        }
    }, [user]);

    if (!user) return <div className="container" style={{ paddingTop: '100px' }}>Please login</div>;

    return (
        <div className="profile-page container">
            <div className="profile-header glass">
                <h1 className="gradient-text">My Profile</h1>
                <div className="user-info">
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                </div>
            </div>

            <div className="order-history">
                <h2>Order History</h2>
                {orders.length === 0 ? (
                    <p>No orders found.</p>
                ) : (
                    <div className="table-container glass">
                        <table>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Date</th>
                                    <th>Total</th>
                                    <th>Paid</th>
                                    <th>Delivered</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order._id}>
                                        <td>{order._id}</td>
                                        <td>{order.createdAt.substring(0, 10)}</td>
                                        <td>${order.totalPrice}</td>
                                        <td>{order.isPaid ? '✅' : '❌'}</td>
                                        <td>{order.isDelivered ? '✅' : '❌'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
