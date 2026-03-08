import React, { useEffect, useState } from 'react';
import { useShop } from '../../context/ShopContext';
import Button from '../../components/UI/Button';

const OrderList = () => {
    const { fetchAllOrders, deliverOrder } = useShop();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const loadOrders = async () => {
            const data = await fetchAllOrders();
            setOrders(data);
        };
        loadOrders();
    }, []);

    const handleDeliver = async (id) => {
        await deliverOrder(id);
        const data = await fetchAllOrders(); // Refresh
        setOrders(data);
    };

    return (
        <div className="order-list">
            <h2>Order Management</h2>
            <div className="table-container glass">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Paid</th>
                            <th>Delivered</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td>{order._id.substring(20, 24)}...</td>
                                <td>{order.user && order.user.name}</td>
                                <td>{order.createdAt.substring(0, 10)}</td>
                                <td>${order.totalPrice}</td>
                                <td>{order.isPaid ? '✅' : '❌'}</td>
                                <td>{order.isDelivered ? '✅' : '❌'}</td>
                                <td>
                                    {!order.isDelivered && (
                                        <Button variant="outline" onClick={() => handleDeliver(order._id)} className="sm-btn">
                                            Mark Delivered
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderList;
