import React, { useState, useEffect } from 'react';
import Sidebar from '../Components/Sidebar/Sidebar';
import API from '../API';
import { Link } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);

  useEffect(() => {
    API.get('/product').then(res => {
      setProducts(res.data);
    });

    API.get('/category').then(res => {
      setCategories(res.data);
    });
  }, []);

  const getCategoryName = (catId) => {
    const category = categories.find((cat) => cat._id === catId);
    return category ? category.cat_name : "unknown";
  };

  const remove = async (id) => {
    if (window.confirm("Do you want to delete this product?")) {
      try {
        await API.delete(`/product/${id}`);
        setProducts(products.filter(product => product._id !== id));
        alert('Product Deleted Successfully');
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Filter products by search term and selected category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? product.categoryId === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex gap-5">
      <Sidebar />
      <div className="p-5 w-full">
        <h1 className="text-2xl font-bold font-inter text-gray-800 mb-5">All Products</h1>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <input
            type="text"
            placeholder="Search products..."
            className="p-2 border border-gray-300 rounded w-full sm:w-1/3"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentProducts.map(product => (
            <div key={product._id} className="bg-white rounded-lg shadow p-4 flex flex-col">
              <img
                src={Array.isArray(product.image) && product.image.length > 0 ? product.image[0] : product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded mb-4"
              />
              <h2 className="text-lg font-semibold mb-1 truncate">{product.name}</h2>
              <p className="text-gray-600 mb-1">Category: {getCategoryName(product.categoryId)}</p>
              <p className="text-gray-600 mb-1">Quantity: {product.quantity}</p>
              <p className="text-gray-600 mb-3">Price: Rs.{product.new_price} <span className="line-through text-sm text-gray-400">Rs.{product.old_price}</span></p>
              <div className="mt-auto flex justify-between">
                <Link to={`/updateproduct/${product._id}`} className="text-blue-600 hover:text-blue-800" title="Edit Product">
                  <i className="fa-solid fa-pen-to-square"></i>
                </Link>
                <button onClick={() => remove(product._id)} className="text-red-600 hover:text-red-800" title="Delete Product">
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-cyan-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
