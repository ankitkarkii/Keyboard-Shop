import express from 'express';
import AdminController from '../controller/AdminController.js';

const adminRouter = express.Router();
const aInstance = new AdminController();

adminRouter.post('/search', aInstance.searchByEmail);

export default adminRouter;
