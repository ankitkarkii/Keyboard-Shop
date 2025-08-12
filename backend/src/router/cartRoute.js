import express from 'express';
import { authenticateToken } from '../utils/auth.js';
import {
    getUserCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} from '../controller/CartController.js';

const router = express.Router();

// All cart routes require authentication
router.use(authenticateToken);

// Cart routes
router.get('/', getUserCart);
router.post('/add', addToCart);
router.put('/update/:productId', updateCartItem);
router.delete('/remove/:productId', removeFromCart);
router.delete('/clear', clearCart);

export default router;
