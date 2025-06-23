import express from 'express';
import BodyMaterialController from '../controller/BodyMaterialController.js';

const bodyMaterialRouter = express.Router();
const bInstance = new BodyMaterialController();

bodyMaterialRouter.get('/', bInstance.index);
bodyMaterialRouter.post('/', bInstance.store);
bodyMaterialRouter.put('/:id', bInstance.update);
bodyMaterialRouter.delete('/:id', bInstance.delete);

export default bodyMaterialRouter;
