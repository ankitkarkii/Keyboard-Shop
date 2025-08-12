import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import API from '../API';
export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const [allProducts, setAllProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState(null);
    const updateTimeoutRef = useRef(null);

    // Load cart from localStorage on mount
    const loadCartFromLocalStorage = useCallback(() => {
        try {
            const savedCart = localStorage.getItem('cart');
            if (savedCart && savedCart !== 'undefined' && savedCart !== 'null') {
                const parsedCart = JSON.parse(savedCart);
                if (typeof parsedCart === 'object' && parsedCart !== null) {
                    return parsedCart;
                }
            }
            return {};
        } catch (error) {
            console.error('Error parsing cart from localStorage:', error);
            return {};
        }
    }, []);

    // Save cart to localStorage with debouncing
    const saveCartToLocalStorage = useCallback((cart) => {
        try {
            localStorage.setItem('cart', JSON.stringify(cart));
        } catch (error) {
            console.error('Error saving cart to localStorage:', error);
        }
    }, []);

    // Debounced cart update
    const debouncedCartUpdate = useCallback((newCart) => {
        if (updateTimeoutRef.current) {
            clearTimeout(updateTimeoutRef.current);
        }
        
        updateTimeoutRef.current = setTimeout(() => {
            saveCartToLocalStorage(newCart);
        }, 300);
    }, [saveCartToLocalStorage]);

    // Initialize cart state
    useEffect(() => {
        const initializeCart = async () => {
            const token = localStorage.getItem('token');
            const localCart = loadCartFromLocalStorage();
            
            setCartItems(localCart);
            setIsInitialized(true);
            
            if (token) {
                await fetchUserCart();
            }
        };
        
        initializeCart();
        
        return () => {
            if (updateTimeoutRef.current) {
                clearTimeout(updateTimeoutRef.current);
            }
        };
    }, [loadCartFromLocalStorage]);

    // Save cart to localStorage with debouncing
    useEffect(() => {
        if (isInitialized) {
            debouncedCartUpdate(cartItems);
        }
    }, [cartItems, isInitialized, debouncedCartUpdate]);

    useEffect(() => {
        API.get('/product')
            .then((response) => {
                setAllProducts(response.data);
            })
            .catch((error) => {
                console.error('Error fetching products', error);
                setError('Failed to load products');
            });
    }, []);

    // Fetch user's cart with better error handling
    const fetchUserCart = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await API.get('/cart');
            const serverCart = response.data || {};
            
            // Smart merge: prioritize server cart but preserve local additions
            const localCart = loadCartFromLocalStorage();
            const mergedCart = { ...serverCart };
            
            // Add any items that exist locally but not on server
            Object.keys(localCart).forEach(productId => {
                if (!mergedCart[productId] && localCart[productId]?.quantity > 0) {
                    mergedCart[productId] = localCart[productId];
                }
            });
            
            setCartItems(mergedCart);
            saveCartToLocalStorage(mergedCart);
        } catch (error) {
            console.error('Error fetching cart:', error);
            setError('Failed to sync cart with server');
            const localCart = loadCartFromLocalStorage();
            setCartItems(localCart);
        } finally {
            setIsLoading(false);
        }
    };

    const getTotalAmount = () => {
        let totalAmount = 0;
        for (const itemId in cartItems) {
            const item = cartItems[itemId];
            if (item && item.quantity > 0 && item.new_price) {
                totalAmount += item.new_price * item.quantity;
            }
        }
        return totalAmount;
    };

    const getTotalCartItems = () => {
        let totalItem = 0;
        for (const itemId in cartItems) {
            const item = cartItems[itemId];
            if (item && item.quantity > 0) {
                totalItem += item.quantity;
            }
        }
        return totalItem;
    };

    // Improved addToCart with proper rollback and error handling
    const addToCart = async (itemId, quantity) => {
        const previousCart = { ...cartItems };
        
        try {
            setIsLoading(true);
            setError(null);
            
            // Validate product exists
            const product = allProducts.find(p => p._id === itemId);
            if (!product) {
                throw new Error('Product not found');
            }
            
            // Optimistic update with validation
            const newCart = {
                ...cartItems,
                [itemId]: {
                    ...product,
                    quantity: Math.max(0, (cartItems[itemId]?.quantity || 0) + quantity)
                }
            };
            
            // Remove if quantity becomes 0
            if (newCart[itemId].quantity === 0) {
                delete newCart[itemId];
            }
            
            setCartItems(newCart);
            
            const token = localStorage.getItem('token');
            if (token) {
                await API.post('/cart/add', { productId: itemId, quantity });
                // Don't refetch entire cart, just trust the server response
            } else {
                saveCartToLocalStorage(newCart);
            }
            
            return { success: true };
        } catch (error) {
            console.error('Error adding to cart:', error);
            setError(error.response?.data?.message || 'Failed to add item to cart');
            
            // Rollback to previous state
            setCartItems(previousCart);
            
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    };

    // Improved removeFromCart with proper rollback
    const removeFromCart = async (itemId) => {
        const previousCart = { ...cartItems };
        
        try {
            setIsLoading(true);
            setError(null);
            
            const newCart = { ...cartItems };
            delete newCart[itemId];
            setCartItems(newCart);
            
            const token = localStorage.getItem('token');
            if (token) {
                await API.delete(`/cart/remove/${itemId}`);
            } else {
                saveCartToLocalStorage(newCart);
            }
            
            return { success: true };
        } catch (error) {
            console.error('Error removing from cart:', error);
            setError(error.response?.data?.message || 'Failed to remove item from cart');
            
            // Rollback to previous state
            setCartItems(previousCart);
            
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    };

    const clearCart = async () => {
        const previousCart = { ...cartItems };
        
        try {
            setIsLoading(true);
            setError(null);
            
            setCartItems({});
            
            const token = localStorage.getItem('token');
            if (token) {
                await API.delete('/cart/clear');
            }
            
            saveCartToLocalStorage({});
            return { success: true };
        } catch (error) {
            console.error('Error clearing cart:', error);
            setError(error.response?.data?.message || 'Failed to clear cart');
            
            // Rollback to previous state
            setCartItems(previousCart);
            
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    };

    const contextValue = {
        allProducts,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartItems,
        getTotalAmount,
        clearCart,
        isLoading,
        error,
        fetchUserCart
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
