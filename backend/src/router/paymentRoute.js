import express from 'express';
import EsewaPaymentController from '../controller/EsewaPaymentController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const paymentRouter = express.Router();
const eInstance = new EsewaPaymentController();

// Payment initiation endpoint
paymentRouter.post('/initiate', authMiddleware, EsewaPaymentController.initiatePayment);
paymentRouter.post('/verify', EsewaPaymentController.verifyPayment);
paymentRouter.get('/status/:orderId', authMiddleware, EsewaPaymentController.getPaymentStatus);

export default paymentRouter;
