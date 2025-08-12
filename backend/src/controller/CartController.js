import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// Get user's cart
export const getUserCart = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const cartItems = await Cart.find({ userId })
            .populate('productId', 'name new_price old_price image category subImages')
            .lean();
        
        // Transform the data to match frontend expectations
        const formattedCart = {};
        cartItems.forEach(item => {
            formattedCart[item.productId._id] = {
                ...item.productId,
                quantity: item.quantity
            };
        });
        
        res.json(formattedCart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Error fetching cart' });
    }
};

// Add item to cart
export const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity = 1 } = req.body;
        
        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }
        
        // Validate quantity
        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({ message: 'Quantity must be a positive integer' });
        }
        
        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        // Check if item already exists in cart
        const existingItem = await Cart.findOne({ userId, productId });
        
        if (existingItem) {
            // Update quantity
            existingItem.quantity += quantity;
            await existingItem.save();
        } else {
            // Create new cart item
            const newCartItem = new Cart({ userId, productId, quantity });
            await newCartItem.save();
        }
        
        // Return the updated cart
        const updatedCart = await Cart.find({ userId })
            .populate('productId', 'name new_price old_price image category subImages')
            .lean();
        
        const formattedCart = {};
        updatedCart.forEach(item => {
            formattedCart[item.productId._id] = {
                ...item.productId,
                quantity: item.quantity
            };
        });
        
        res.json({ message: 'Item added to cart successfully', cart: formattedCart });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Error adding to cart' });
    }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;
        const { quantity } = req.body;
        
        if (!Number.isInteger(quantity) || quantity < 0) {
            return res.status(400).json({ message: 'Quantity must be a non-negative integer' });
        }
        
        if (quantity <= 0) {
            // Remove item if quantity is 0 or less
            await Cart.findOneAndDelete({ userId, productId });
            
            // Return updated cart
            const updatedCart = await Cart.find({ userId })
                .populate('productId', 'name new_price old_price image category subImages')
                .lean();
            
            const formattedCart = {};
            updatedCart.forEach(item => {
                formattedCart[item.productId._id] = {
                    ...item.productId,
                    quantity: item.quantity
                };
            });
            
            return res.json({ message: 'Item removed from cart', cart: formattedCart });
        }
        
        const updatedItem = await Cart.findOneAndUpdate(
            { userId, productId },
            { quantity },
            { new: true }
        );
        
        if (!updatedItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }
        
        // Return updated cart
        const updatedCart = await Cart.find({ userId })
            .populate('productId', 'name new_price old_price image category subImages')
            .lean();
        
        const formattedCart = {};
        updatedCart.forEach(item => {
            formattedCart[item.productId._id] = {
                ...item.productId,
                quantity: item.quantity
            };
        });
        
        res.json({ message: 'Cart updated successfully', cart: formattedCart });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ message: 'Error updating cart' });
    }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;
        
        await Cart.findOneAndDelete({ userId, productId });
        
        // Return updated cart
        const updatedCart = await Cart.find({ userId })
            .populate('productId', 'name new_price old_price image category subImages')
            .lean();
        
        const formattedCart = {};
        updatedCart.forEach(item => {
            formattedCart[item.productId._id] = {
                ...item.productId,
                quantity: item.quantity
            };
        });
        
        res.json({ message: 'Item removed from cart', cart: formattedCart });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ message: 'Error removing from cart' });
    }
};

// Clear user's cart
export const clearCart = async (req, res) => {
    try {
        const userId = req.user.id;
        
        await Cart.deleteMany({ userId });
        
        res.json({ message: 'Cart cleared successfully', cart: {} });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ message: 'Error clearing cart' });
    }
};
