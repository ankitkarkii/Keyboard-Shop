import express from 'express'
import UserController from '../controller/UserController.js';

const userRouter=express.Router();
const uInstance=new UserController();

userRouter.get('/:id',uInstance.show);
userRouter.get('/',uInstance.index);
userRouter.post('/',uInstance.store);
userRouter.post('/search',uInstance.searchByEmail);
userRouter.put('/:id',uInstance.update);
userRouter.delete('/:id',uInstance.destroy);


export default userRouter;