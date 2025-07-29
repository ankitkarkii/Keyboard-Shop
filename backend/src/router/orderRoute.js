import express from 'express'
import OrderController from '../controller/OrderController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const orderRouter=express.Router();
const oInstance=new OrderController;


orderRouter.get('/', authMiddleware, oInstance.index);
orderRouter.get('/user', authMiddleware, oInstance.userOrders);
orderRouter.post('/', authMiddleware, oInstance.store);
orderRouter.put('/:id', authMiddleware, oInstance.update );
orderRouter.delete('/:id', authMiddleware, oInstance.delete);

export default orderRouter;
