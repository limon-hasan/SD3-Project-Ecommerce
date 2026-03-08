import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import Button from '../../components/UI/Button';

const ProductList = () => {
    const { products, deleteProduct, createProduct } = useShop();
    const [isCreating, setIsCreating] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '', price: '', description: '', imageUrl: '', brand: '', category: '', countInStock: 0
    });

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            await deleteProduct(id);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        const success = await createProduct(newProduct);
        if (success) {
            setIsCreating(false);
            setNewProduct({ name: '', price: '', description: '', imageUrl: '', brand: '', category: '', countInStock: 0 });
        }
    };

    return (
        <div className="product-list">
            <div className="list-header">
                <h2>Product Management</h2>
                <Button onClick={() => setIsCreating(!isCreating)}>
                    {isCreating ? 'Cancel' : 'Add New Product'}
                </Button>
            </div>

            {isCreating && (
                <form onSubmit={handleCreate} className="create-form glass">
                    <input placeholder="Name" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} required />
                    <input placeholder="Price" type="number" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} required />
                    <input placeholder="Image URL" value={newProduct.imageUrl} onChange={e => setNewProduct({ ...newProduct, imageUrl: e.target.value })} />
                    <input placeholder="Brand" value={newProduct.brand} onChange={e => setNewProduct({ ...newProduct, brand: e.target.value })} />
                    <input placeholder="Category" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} />
                    <textarea placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
                    <Button type="submit">Create Product</Button>
                </form>
            )}

            <div className="table-container glass">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product._id}>
                                <td>{product._id.substring(20, 24)}...</td>
                                <td>{product.name}</td>
                                <td>${product.price}</td>
                                <td>{product.category}</td>
                                <td>
                                    <Button variant="outline" onClick={() => handleDelete(product._id)} className="sm-btn">
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductList;
