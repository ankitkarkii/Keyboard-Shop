import express from 'express'
import AdminController from '../controller/AdminController.js'

const adminRouter=express.Router();
const aInstance=new AdminController();

adminRouter.get('/',aInstance.index);
adminRouter.post('/search',aInstance.searchByEmail);
adminRouter.post('/',aInstance.store);


export default adminRouter;