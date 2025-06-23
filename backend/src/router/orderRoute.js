import express from 'express'
import OrderController from '../controller/OrderController.js';

const orderRouter=express.Router();
const oInstance=new OrderController;


orderRouter.get('/',oInstance.index);
orderRouter.post('/',oInstance.store);
orderRouter.put('/:id',oInstance.update );
orderRouter.delete('/:id',oInstance.delete);

export default orderRouter;