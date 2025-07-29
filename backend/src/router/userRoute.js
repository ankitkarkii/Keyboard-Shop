import express from 'express';
import UserController from '../controller/UserController.js';

const userRouter = express.Router();
const uInstance = new UserController();

userRouter.post('/search', uInstance.searchByEmail);

export default userRouter;
