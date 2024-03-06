const Order=require('../model/orderModal');
const Product=require('../model/productSchema');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors=require('../middleware/catchAsyncErrors');


//Create new Order

exports.newOrder =catchAsyncErrors(async(req,res,next)=>{
    const {shippingInfo,orderItems,paymentInfo,itemsPrice,shippingPrice,totalPrice}=req.body


    const order=await Order.create({
        shippingInfo
        ,orderItems
        ,paymentInfo
        ,itemsPrice
        ,shippingPrice
        ,totalPrice
        ,paidAt:Date.now()
        ,user:req.user._id
    });

    res.status(201).json({
        success:true,
        order
    })
})


//Get Single Order

exports.getSingleOrder=catchAsyncErrors(async(req,res,next)=>{
    const order=await Order.findById(req.params.id).populate(
        "user",
        "name email"
    );

    if(!order){
        return next(new ErrorHanlder("Order not found with this id",404));
    }

    res.status(200).json({
        success:true,
        order
    })
})


//Get logged in user Orders
exports.myOrders=catchAsyncErrors(async(req,res,next)=>{
    const orders=await Order.find({user:req.user._id});
    if(!order){
        return next(new ErrorHanlder("Order not found with this id",404));
    }

    res.status(200).json({
        success:true,
        orders
    })
})


//Get all Orders-------admin
exports.getAllOrders=catchAsyncErrors(async(req,res,next)=>{
    const orders=await Order.find();
    if(!order){
        return next(new ErrorHanlder("Orders does not exist",404));
    }


    let totalAmount=0;

    orders.forEach((order)=>{
        totalAmount+=order.totalPrice;
    })


    res.status(200).json({
        success:true,
        totalAmount,
        orders
    })
})


//updte order status-------admin
exports.updateOrderStatus=catchAsyncErrors(async(req,res,next)=>{
    const order=await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHanlder("Orders does not exist",404));
    }

    if(order.orderStatus==="Delivered"){
        return next(new ErrorHandler("You have already delivered the order",400))
    }


    order.orderItems.forEach(async (o)=>{
        await updateStock(o.product,o.quantity);
    })

    order.orderStatus=req.body.status;
   
    if(req.body.status==="Delivered"){
         
        order.deliveredAt=Date.now()
    }

    await order.save({validateBeforeSave:false})
    res.status(200).json({
        success:true
    })
})


//Delete Order -------admin
exports.deleteOrder=catchAsyncErrors(async(req,res,next)=>{

    const order=await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("order does not exist",400))
    }

    await order.remove()

    res.status(200).json({
        success:true,
        msg:"Order Deleted"
    })
})

async function updateStock(id,quantity){
    const product=await Product.findById(id);

    product.Stock-=quantity;

    await product.save({validateBeforeSave:false})
}