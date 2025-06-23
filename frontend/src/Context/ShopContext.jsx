import React, { createContext, useState, useEffect } from 'react';
import API from '../API';
export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const [allProducts, setAllProducts] = useState([]);

    useEffect(() => {
        // Fetch products from your API
        API.get('/product') // Adjust the endpoint as per your backend route
            .then((response) => {
                setAllProducts(response.data); // Assuming response.data is the list of products
                setCartItems(getDefaultCart(response.data));
            })
            .catch((error) => {
                console.error('Error fetching products', error);
            });
    }, []);

    const getDefaultCart = (products) => {
        let cart = {};
        products.forEach((product) => {
            cart[product._id] = 0;
        });
        return cart;
    };

    const addToCart = (itemId, quantity) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: prev[itemId] + quantity,
        }));
    };

    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: Math.max(0, prev[itemId] - 1),
        }));
    };

    const getTotalAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                const itemInfo = allProducts.find((product) => product._id === item);
                if (itemInfo) {
                    totalAmount += itemInfo.new_price * cartItems[item];
                }
            }
        }
        return totalAmount;
    };

    const getTotalCartItems = () => {
        let totalItem = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                totalItem += cartItems[item];
            }
        }
        return totalItem;
    };

    const contextValue = {
        allProducts,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalAmount,
        getTotalCartItems,
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
