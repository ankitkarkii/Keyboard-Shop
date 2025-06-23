import express from 'express';
import productRouter from './productRoute.js';
import categoryRouter from './categoryRoute.js';
import connectivityRouter from './connectivityRoute.js';
import lightingRouter from './lightingRoute.js';
import pollingRateRouter from './pollingRateRoute.js';
import colorRouter from './colorRoute.js';
import bodyMaterialRouter from './bodyMaterialRoute.js';
import adminRouter from './adminRoute.js';
import userRouter from './userRoute.js';
import orderRouter from './orderRoute.js';

const router=express.Router();

router.get('/',(req,res)=>{
    res.send("Hello");
})


router.use('/product',productRouter);
router.use('/category',categoryRouter);
router.use('/connectivity', connectivityRouter);
router.use('/lighting', lightingRouter);
router.use('/pollingRate', pollingRateRouter);
router.use('/color', colorRouter);
router.use('/bodyMaterial', bodyMaterialRouter);
router.use('/admin',adminRouter);
router.use('/user',userRouter);
router.use('/order',orderRouter);

export default router;
