import React, { useEffect, useState } from 'react';
import { useShop } from '../../context/ShopContext';
import './Admin.css';

const AnalyticsDashboard = () => {
    const { user } = useShop();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await fetch('/api/analytics', {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                    },
                });
                const result = await res.json();
                setData(result);
            } catch (error) {
                console.error('Error fetching analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [user]);

    if (loading) return <div>Loading Analytics...</div>;
    if (!data) return <div>Error loading data</div>;

    return (
        <div className="analytics-dashboard">
            <div className="stats-grid">
                <div className="stat-card glass">
                    <h3>Total Sales</h3>
                    <p className="stat-value">${data.totalSales.toFixed(2)}</p>
                </div>
                <div className="stat-card glass">
                    <h3>Total Orders</h3>
                    <p className="stat-value">{data.totalOrders}</p>
                </div>
                <div className="stat-card glass">
                    <h3>Total Users</h3>
                    <p className="stat-value">{data.totalUsers}</p>
                </div>
                <div className="stat-card glass">
                    <h3>Total Products</h3>
                    <p className="stat-value">{data.totalProducts}</p>
                </div>
            </div>

            <div className="recent-activity glass">
                <h3>Recent Activity Logs</h3>
                <div className="logs-list">
                    {data.recentLogs.map((log) => (
                        <div key={log._id} className="log-item">
                            <span className="log-action">{log.action}</span>
                            <span className="log-details">{log.details}</span>
                            <span className="log-user">
                                {log.user ? log.user.name : 'System/Guest'}
                            </span>
                            <span className="log-time">
                                {new Date(log.createdAt).toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
