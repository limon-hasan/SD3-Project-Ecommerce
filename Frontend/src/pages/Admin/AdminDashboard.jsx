import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import ProductList from './ProductList';
import OrderList from './OrderList';
import Button from '../../components/UI/Button';
import './Admin.css';

import AnalyticsDashboard from './AnalyticsDashboard';

const AdminDashboard = () => {
    const { user, logout } = useShop();
    const [activeTab, setActiveTab] = useState('analytics');

    if (!user || !user.isAdmin) {
        return <div className="container" style={{ paddingTop: '100px' }}>Access Denied</div>;
    }

    return (
        <div className="admin-dashboard container" style={{ paddingTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="gradient-text" style={{ margin: 0 }}>Admin Portal</h1>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span>{user.name}</span>
                    <Button variant="outline" onClick={logout}>Logout</Button>
                </div>
            </div>

            <div className="admin-tabs glass">
                <Button
                    variant={activeTab === 'analytics' ? 'primary' : 'outline'}
                    onClick={() => setActiveTab('analytics')}
                >
                    Analytics
                </Button>
                <Button
                    variant={activeTab === 'products' ? 'primary' : 'outline'}
                    onClick={() => setActiveTab('products')}
                >
                    Products
                </Button>
                <Button
                    variant={activeTab === 'orders' ? 'primary' : 'outline'}
                    onClick={() => setActiveTab('orders')}
                >
                    Orders
                </Button>
            </div>

            <div className="admin-content">
                {activeTab === 'analytics' && <AnalyticsDashboard />}
                {activeTab === 'products' && <ProductList />}
                {activeTab === 'orders' && <OrderList />}
            </div>
        </div>
    );
};

export default AdminDashboard;
