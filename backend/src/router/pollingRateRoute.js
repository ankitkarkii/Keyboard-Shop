import express from 'express';
import PollingRateController from '../controller/PollingRateController.js';

const pollingRateRouter = express.Router();
const pInstance = new PollingRateController();

pollingRateRouter.get('/', pInstance.index);
pollingRateRouter.post('/', pInstance.store);
pollingRateRouter.put('/:id', pInstance.update);
pollingRateRouter.delete('/:id', pInstance.delete);

export default pollingRateRouter;
