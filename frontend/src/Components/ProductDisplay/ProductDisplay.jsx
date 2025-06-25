import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../../Context/ShopContext';
import { AuthContext } from '../../Context/AuthContext';

const ProductDisplay = (props) => {
    const { product } = props;
    const { addToCart } = useContext(ShopContext);
    const { user } = useContext(AuthContext) || {};
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 1 && newQuantity <= product.quantity) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = () => {
        if (quantity > 0) {
            addToCart(product._id, quantity); // Make sure you're using the database _id
        } else {
            console.log('Quantity must be greater than 0');
        }
    };

    const handleThumbnailClick = (index) => {
        setSelectedImageIndex(index);
    };

    const handlePrevImage = () => {
        setSelectedImageIndex((prevIndex) =>
            prevIndex === 0 ? product.image.length - 1 : prevIndex - 1
        ); 
    };

    const handleNextImage = () => {
        setSelectedImageIndex((prevIndex) =>
            prevIndex === product.image.length - 1 ? 0 : prevIndex + 1
        );
    };

    // Helper function to get viewed products from localStorage
    const getViewedProducts = () => {
        const viewed = localStorage.getItem('viewedProducts');
        return viewed ? JSON.parse(viewed) : [];
    };

    // Helper function to save viewed product to localStorage
    const saveViewedProduct = (productId) => {
        let viewed = getViewedProducts();
        if (!viewed.includes(productId)) {
            viewed.push(productId);
            localStorage.setItem('viewedProducts', JSON.stringify(viewed));
        }
    };

    useEffect(() => {
        if (product && product._id) {
            saveViewedProduct(product._id);
            // Save product view to localStorage for recommendations
            const viewData = {
                productId: product._id,
                price: product.new_price,
                category: product.categoryId || product.category || '',
                date: new Date().toISOString(),
                user_email: user && user.email ? user.email : 'guest',
            };
            let views = JSON.parse(localStorage.getItem('recentKeyboardViews') || '[]');
            // Remove any existing entry for this productId
            views = [viewData, ...views.filter(v => v.productId !== product._id)].slice(0, 5); // keep last 5 unique
            localStorage.setItem('recentKeyboardViews', JSON.stringify(views));
        }
    }, [product]);

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg  flex flex-col md:flex-row gap-10">
            {/* Thumbnails vertical on left */}
            {Array.isArray(product.image) && product.image.length > 1 && (
                <div className="flex flex-col gap-4 overflow-y-auto max-h-[450px]">
                    {product.image.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt={`Thumbnail ${index + 1}`}
                            className={`w-40 h-20 object-cover cursor-pointer rounded-lg border-2 transition-transform duration-300 ease-in-out hover:scale-110 ${
                                selectedImageIndex === index ? 'border-purple-600 ' : 'border-gray-200'
                            }`}
                            onClick={() => handleThumbnailClick(index)}
                        />
                    ))}
                </div>
            )}

            {/* Main image with arrows */}
            <div className="relative w-full max-w-[500px] border rounded-lg p-5 flex items-center justify-center  bg-gray-50">
                <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3  hover:bg-purple-100 transition-colors"
                    aria-label="Previous Image"
                >
                    &#8249;
                </button>
                <img
                    src={Array.isArray(product.image) ? product.image[selectedImageIndex] : product.image}
                    alt={product.name}
                    className="max-h-[400px] object-contain rounded-lg"
                />
                <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3  hover:bg-purple-100 transition-colors"
                    aria-label="Next Image"
                >
                    &#8250;
                </button>
            </div>

            {/* Product details */}
            <div className="w-full md:w-[60%] flex flex-col gap-8 items-start">
                <div className="flex flex-col gap-3">
                    <h1 className="text-5xl font-extrabold text-gray-900">{product.name}</h1>
                    <div className="flex items-center gap-4">
                        <p className="text-3xl font-semibold text-red-600">
                            Rs.{product.new_price}
                        </p>
                        <p className="text-xl line-through text-gray-400">
                            Rs.{product.old_price}
                        </p>
                    </div>
                </div>

                <div className="w-full">
                <p className="text-lg font-medium text-gray-700 mb-2">
                  {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                </p>
                    <div className="w-full bg-gray-300 rounded-full h-3">
                        <div
                            className="bg-red-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${(product.quantity / 100) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {product.quantity > 0 && (
                  <div className="flex items-center gap-6">
                      <div className="flex items-center border border-gray-300 rounded-full overflow-hidden ">
                          <button
                              onClick={() => handleQuantityChange(quantity - 1)}
                              className="px-5 py-3 text-lg font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                              aria-label="Decrease quantity"
                          >
                              -
                          </button>
                          <input
                              type="text"
                              readOnly
                              value={quantity}
                              className="w-16 text-center text-lg font-semibold border-l border-r border-gray-300"
                          />
                          <button
                              onClick={() => handleQuantityChange(quantity + 1)}
                              className="px-5 py-3 text-lg font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                              aria-label="Increase quantity"
                          >
                              +
                          </button>
                      </div>

                      <button
                          onClick={handleAddToCart}
                          className="bg-purple-700 text-white px-10 py-3 rounded-full font-semibold hover:bg-purple-800 transition"
                      >
                          ADD TO CART
                      </button>
                  </div>
                )}
            </div>
        </div>
    );
};

export default ProductDisplay;
