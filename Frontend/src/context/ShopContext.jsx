import React, { createContext, useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user from local storage on boot
    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
        setLoading(false);
    }, []);

    // Fetch products
    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            if (!res.ok) throw new Error('Failed to fetch products');
            const data = await res.json();
            if (Array.isArray(data)) {
                setProducts(data);
            } else {
                setProducts([]);
                console.error('API returned non-array:', data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products');
            setProducts([]);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Cart Actions
    const addToCart = (product, qty = 1) => {
        const existItem = cart.find((x) => x._id === product._id);

        if (existItem) {
            setCart(
                cart.map((x) =>
                    x._id === product._id ? { ...existItem, qty: existItem.qty + qty } : x
                )
            );
        } else {
            setCart([...cart, { ...product, qty }]);
        }
        toast.success('Added to cart');
    };

    const removeFromCart = (id) => {
        setCart(cart.filter((x) => x._id !== id));
        toast.success('Removed from cart');
    };

    // Auth Actions
    const login = async (email, password) => {
        try {
            const res = await fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) throw new Error('Login failed');

            const data = await res.json();
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success('Login successful');
            return true;
        } catch (error) {
            console.error(error);
            toast.error('Invalid email or password');
            return false;
        }
    };

    const register = async (name, email, password) => {
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            if (!res.ok) throw new Error('Registration failed');

            const data = await res.json();
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success('Registration successful');
            return true;
        } catch (error) {
            console.error(error);
            toast.error('Registration failed');
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
        setCart([]);
        toast.success('Logged out');
    };

    // Admin Actions
    const createProduct = async (productData) => {
        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
                body: JSON.stringify(productData),
            });
            if (!res.ok) throw new Error('Failed to create product');
            await fetchProducts(); // Refresh list
            toast.success('Product created');
            return true;
        } catch (error) {
            console.error(error);
            toast.error('Failed to create product');
            return false;
        }
    };

    const deleteProduct = async (id) => {
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
            });
            if (!res.ok) throw new Error('Failed to delete product');
            await fetchProducts(); // Refresh list
            toast.success('Product deleted');
            return true;
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete product');
            return false;
        }
    };

    const fetchAllOrders = async () => {
        try {
            const res = await fetch('/api/orders', {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
            });
            if (!res.ok) throw new Error('Failed to fetch orders');
            return await res.json();
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    const deliverOrder = async (id) => {
        try {
            const res = await fetch(`/api/orders/${id}/deliver`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
            });
            if (!res.ok) throw new Error('Failed to update order');
            toast.success('Order marked as delivered');
            return true;
        } catch (error) {
            console.error(error);
            toast.error('Failed to update order');
            return false;
        }
    };

    // User Actions
    const fetchMyOrders = async () => {
        try {
            const res = await fetch('/api/orders/myorders', {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
            });
            if (!res.ok) throw new Error('Failed to fetch my orders');
            return await res.json();
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    // Review Actions
    const createProductReview = async (productId, review) => {
        try {
            const res = await fetch(`/api/products/${productId}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
                body: JSON.stringify(review),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to submit review');
            }
            toast.success('Review submitted successfully');
            await fetchProducts(); // Refresh to show new rating
            return true;
        } catch (error) {
            console.error(error);
            toast.error(error.message);
            return false;
        }
    };

    // Wishlist Actions
    const [wishlist, setWishlist] = useState([]);

    const fetchWishlist = async () => {
        if (!user) return;
        try {
            const res = await fetch('/api/users/wishlist', {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
            });
            if (res.ok) {
                const data = await res.json();
                setWishlist(data.map(item => item._id));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const toggleWishlist = async (productId) => {
        if (!user) {
            toast.error('Please login to use wishlist');
            return;
        }
        try {
            const res = await fetch(`/api/users/wishlist/${productId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
            });
            if (res.ok) {
                const data = await res.json();
                setWishlist(data.wishlist);
                toast.success(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to update wishlist');
        }
    };

    useEffect(() => {
        if (user) {
            fetchWishlist();
        } else {
            setWishlist([]);
        }
    }, [user]);

    return (
        <ShopContext.Provider
            value={{
                products,
                cart,
                user,
                loading,
                wishlist,
                addToCart,
                removeFromCart,
                login,
                register,
                logout,
                createProduct,
                deleteProduct,
                fetchAllOrders,
                deliverOrder,
                fetchMyOrders,
                createProductReview,
                toggleWishlist,
            }}
        >
            {children}
        </ShopContext.Provider>
    );
};

export const useShop = () => useContext(ShopContext);
