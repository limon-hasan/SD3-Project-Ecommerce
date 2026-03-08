import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import Button from '../components/UI/Button';
import ProductCard from '../components/UI/ProductCard';
import './HomePage.css';

const HomePage = () => {
    const { products, user } = useShop();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const safeProducts = Array.isArray(products) ? products : [];
    const categories = ['All', ...new Set(safeProducts.map(p => p.category).filter(Boolean))];

    const filteredProducts = safeProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (!user) {
        return (
            <div className="home-page">
                <section className="hero-section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="hero-content container" style={{ textAlign: 'center' }}>
                        <h1 className="hero-title">
                            Welcome to <span className="gradient-text">ShopSphere</span>
                        </h1>
                        <p className="hero-subtitle">
                            Join our exclusive community to discover premium luxury items.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                            <Link to="/login">
                                <Button variant="primary" className="hero-btn">Login to Shop</Button>
                            </Link>
                            <Link to="/register">
                                <Button variant="outline" className="hero-btn">Register Now</Button>
                            </Link>
                        </div>
                    </div>
                    <div className="hero-background">
                        <div className="orb orb-1"></div>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="home-page">
            <section className="hero-section">
                <div className="hero-content container">
                    <h1 className="hero-title">
                        Discover <span className="gradient-text">Luxury</span> <br />
                        Redefined
                    </h1>
                    <p className="hero-subtitle">
                        Curated collection of premium essentials for the modern lifestyle.
                    </p>
                    <Link to="/#shop">
                        <Button variant="primary" className="hero-btn">Shop Now</Button>
                    </Link>
                </div>
                <div className="hero-background">
                    <div className="orb orb-1"></div>
                    <div className="orb orb-2"></div>
                </div>
            </section>

            <section id="shop" className="products-section container">
                <h2 className="section-title gradient-text">Featured Collection</h2>

                <div className="filters glass">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    <div className="category-buttons">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="products-grid">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                    {filteredProducts.length === 0 && (
                        <p className="no-results">No products found.</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default HomePage;
