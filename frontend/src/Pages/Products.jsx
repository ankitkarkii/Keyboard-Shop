import React, { useState, useEffect, useMemo } from 'react';
import API from '../API';
import { Link } from 'react-router-dom';
import Fuse from 'fuse.js';

const ProductsList = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        API.get('/product')
            .then(res => {
                setProducts(res.data);
            })
            .catch(err => {
                console.error("Failed to fetch products:", err);
            });
    }, []);

    // Initialize Fuse with products and options
    const fuse = useMemo(() => {
        return new Fuse(products, {
            keys: ['name'],
            threshold: 0.3, // Adjust threshold for fuzzy matching sensitivity
        });
    }, [products]);

    // Get search results using Fuse or all products if searchTerm is empty
    const filteredProducts = searchTerm
        ? fuse.search(searchTerm).map(result => result.item)
        : products;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Browse Our Products</h1>
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
            </div>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredProducts.map(product => (
                    <div key={product._id} className="border rounded-xl shadow hover:shadow-md transition overflow-hidden">
                        <img
                            src={Array.isArray(product.image) ? product.image[0] : product.image}
                            alt={product.name}
                            className="w-full h-52 object-cover"
                        />
                        <div className="p-4">

                            <Link to={`/product/${product._id}`}>
                                <h2 className="text-lg font-semibold text-cyan-700 hover:underline cursor-pointer">
                                    {product.name}
                                </h2>
                            </Link>
                           
                            <div className="mt-2 flex items-center gap-2">
                                <span className="text-green-600 font-bold text-md">Rs.{product.new_price}</span>
                                {product.old_price && (
                                    <span className="text-red-400 line-through text-sm">RS.{product.old_price}</span>
                                )}
                            </div>
                            <p className="text-xs text-gray-400 mt-1">{product.quantity > 0 ? "In Stock" : "Out of Stock"}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductsList;
