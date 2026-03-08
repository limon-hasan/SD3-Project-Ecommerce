import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import Button from './Button';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { wishlist, toggleWishlist } = useShop();
    const isWishlisted = wishlist.includes(product._id);

    return (
        <div className="product-card glass">
            <div className="product-image">
                <img src={product.imageUrl || 'https://via.placeholder.com/300'} alt={product.name} />
                <button
                    className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
                    onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(product._id);
                    }}
                >
                    ♥
                </button>
            </div>
            <div className="product-info">
                <h3>{product.name}</h3>
                <div className="rating-small">
                    {'⭐'.repeat(Math.round(product.rating || 0))}
                    <span className="count">({product.numReviews})</span>
                </div>
                <p className="price">${product.price}</p>
                <Link to={`/product/${product._id}`}>
                    <Button variant="outline" className="view-btn">View Details</Button>
                </Link>
            </div>
        </div>
    );
};

export default ProductCard;
