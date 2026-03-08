import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import Button from '../components/UI/Button';
import ProductCard from '../components/UI/ProductCard';
import './ProductPage.css';

const ProductPage = () => {
    const { id } = useParams();
    const { products, addToCart, user, createProductReview, wishlist, toggleWishlist } = useShop();

    // Find product safely
    const product = products.find((p) => p._id === id);

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    if (!product) return <div className="container" style={{ paddingTop: '100px' }}>Product not found</div>;

    const isWishlisted = wishlist.includes(product._id);

    // Related Products Logic
    const relatedProducts = products
        .filter(p => p.category === product.category && p._id !== product._id)
        .slice(0, 4);

    const submitHandler = async (e) => {
        e.preventDefault();
        const success = await createProductReview(id, { rating, comment });
        if (success) {
            setRating(5);
            setComment('');
        }
    };

    return (
        <div className="product-page container">
            <div className="product-details glass">
                <div className="product-image-large">
                    <img src={product.imageUrl || 'https://via.placeholder.com/500'} alt={product.name} />
                </div>
                <div className="product-info-large">
                    <h1 className="gradient-text">{product.name}</h1>
                    <div className="rating">
                        <span>{'⭐'.repeat(Math.round(product.rating || 0))}</span>
                        <span className="num-reviews">({product.numReviews || 0} reviews)</span>
                    </div>
                    <p className="price-large">${product.price}</p>
                    <p className="description">{product.description}</p>
                    <p className="stock-status">
                        Status: {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                    </p>

                    <div className="action-buttons">
                        <Button
                            onClick={() => addToCart(product)}
                            disabled={product.countInStock === 0}
                        >
                            {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                        <button
                            className={`wishlist-btn-large ${isWishlisted ? 'active' : ''}`}
                            onClick={() => toggleWishlist(product._id)}
                            title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                        >
                            ♥
                        </button>
                    </div>
                </div>
            </div>

            <div className="reviews-section glass">
                <h2>Reviews</h2>
                {(!product.reviews || product.reviews.length === 0) && <p>No reviews yet.</p>}

                <div className="reviews-list">
                    {product.reviews && product.reviews.map((review) => (
                        <div key={review._id} className="review-item">
                            <strong>{review.name}</strong>
                            <div className="review-rating">{'⭐'.repeat(review.rating)}</div>
                            <p>{review.createdAt.substring(0, 10)}</p>
                            <p>{review.comment}</p>
                        </div>
                    ))}
                </div>

                <div className="write-review">
                    <h3>Write a Customer Review</h3>
                    {user ? (
                        <form onSubmit={submitHandler}>
                            <div className="form-group">
                                <label>Rating</label>
                                <select value={rating} onChange={(e) => setRating(e.target.value)}>
                                    <option value="1">1 - Poor</option>
                                    <option value="2">2 - Fair</option>
                                    <option value="3">3 - Good</option>
                                    <option value="4">4 - Very Good</option>
                                    <option value="5">5 - Excellent</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Comment</label>
                                <textarea
                                    rows="3"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                            <Button type="submit">Submit Review</Button>
                        </form>
                    ) : (
                        <p>Please <Link to="/login">sign in</Link> to write a review.</p>
                    )}
                </div>
            </div>

            {relatedProducts.length > 0 && (
                <div className="related-products-section">
                    <h2 className="section-title gradient-text">Related Products</h2>
                    <div className="products-grid">
                        {relatedProducts.map(p => (
                            <ProductCard key={p._id} product={p} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductPage;
