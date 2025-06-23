import express from 'express';
import ColorController from '../controller/ColorController.js';

const colorRouter = express.Router();
const cInstance = new ColorController();

colorRouter.get('/', cInstance.index);
colorRouter.post('/', cInstance.store);
colorRouter.put('/:id', cInstance.update);
colorRouter.delete('/:id', cInstance.delete);

export default colorRouter;
