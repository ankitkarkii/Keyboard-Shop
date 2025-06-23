import express from 'express';
import ConnectivityController from '../controller/ConnectivityController.js';

const connectivityRouter = express.Router();
const cInstance = new ConnectivityController();

connectivityRouter.get('/', cInstance.index);
connectivityRouter.post('/', cInstance.store);
connectivityRouter.put('/:id', cInstance.update);
connectivityRouter.delete('/:id', cInstance.delete);

export default connectivityRouter;
