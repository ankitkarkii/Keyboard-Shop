import express from 'express';
import LightingController from '../controller/LightingController.js';

const lightingRouter = express.Router();
const lInstance = new LightingController();

lightingRouter.get('/', lInstance.index);
lightingRouter.post('/', lInstance.store);
lightingRouter.put('/:id', lInstance.update);
lightingRouter.delete('/:id', lInstance.delete);

export default lightingRouter;
