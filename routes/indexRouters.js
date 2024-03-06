const express=require('express')
const rootRouter=express.Router();

const productRouter=require('./productRouter');
const userRouter=require('./userRouter')
const orderRouter=require('./orderRouter')

rootRouter.use("/products",productRouter)
rootRouter.use("/user",userRouter)
rootRouter.use("/order",orderRouter)


module.exports=rootRouter;