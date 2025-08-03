import express from 'express';
import ProductController from '../controller/ProductController.js';
import UploadMiddleware from '../middleware/UploadMiddleware.js';

const productRouter = express.Router();
const pInstance = new ProductController();
const fInstance = new UploadMiddleware();
const upload = fInstance.upload('products');

productRouter.get('/related', pInstance.showRelated);
productRouter.get('/recommendations', pInstance.recommendations);
productRouter.get('/enhanced-recommendations', pInstance.enhancedRecommendations);
productRouter.get('/', pInstance.index);
productRouter.get('/:id', pInstance.show);
productRouter.post('/', upload.array('images'), pInstance.store);
productRouter.put('/:id', upload.array('images'), pInstance.update);
productRouter.put('/:id/decrease', pInstance.decreaseQuantity);  // New Route
productRouter.delete('/:id', pInstance.destroy);

export default productRouter;
