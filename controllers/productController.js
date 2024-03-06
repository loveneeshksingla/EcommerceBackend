const Product=require('../model/productSchema');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors=require('../middleware/catchAsyncErrors');
const ApiFeatures = require('../utils/apifeatures');



//CREATE A PRODUCT ----ADMIN
const createNewProduct=catchAsyncErrors(async (req,res,next)=>{
    req.body.user =req.user.id;
    const product=await Product.create(req.body);
    res.status(201).json({
        success:true,
        product
    })
});

const getAllProducts= catchAsyncErrors(async (req,res,next)=>{

    const resultPerPage=5;
    const productCount=await Product.countDocuments();
    const apiFeature=new ApiFeatures(Product.find(),req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
    const products=await apiFeature.query;
    res.status(200).json({
        message:"fetched",
        products,
        productCount
    })
});

const updateProduct= catchAsyncErrors(async (req,res,next)=>{
    let product=await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product not found",404))
    }
    product=await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    });
    res.status(200).json({
         success:true,
         product
    })
});

const deleteProduct= catchAsyncErrors(async (req,res,next)=>{
    let product=await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product not found",404))
    }
    await product.remove();
    res.status(200).json({
        success:true,
        msg:"Product Deleted"
    })
});

const getProductDetails = catchAsyncErrors(async (req,res,next)=>{
    const product= await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product not found",404))
    }
    res.status(200).json({
        success:true,
        product
    })
})


//Create New Review or Update the Review

const createProductReview =catchAsyncErrors(async(req,res,next)=>{

    const {rating,comment,productId}=req.body;
    const review ={
        user:req.user._id,
        name:req.user.name,
        rating,
        comment
    }

    const product=await Product.findById(productId);

    const isReviewd =product.reviews.find(rev=>rev.user.toString()===req.user._id.toString())

    if(isReviewd){
        product.reviews.forEach(rev=>{
            if(rev=>rev.user.toString()===req.user._id.toString()){
                rev.rating=rating,
                rev.comment=comment
            }
        })
    }
    else{
        product.reviews.push(review)
        product.numOfReviews=product.reviews.length
    }


    let avg=0;
    product.reviews.forEach(rev=>{
        avg+=rev.rating
    })
    
    product.ratings =avg/product.reviews.length

    await product.save({validateBeforeSave:false})

    res.status(200).json({
        sucess:true
    })
})


//Get All reviews of a Single Product

const getProductReviews =catchAsyncErrors(async(req,res,next)=>{
    const product=await Product.findById(req.query.id);

    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }

    res.status(200).json({
        reviews:product.reviews,
        success:true,
        
    })
})

//Delete Review

const deleteReview = catchAsyncErrors(async(req,res,next)=>{
    const product=await Product.findById(req.query.productId);

    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }

    const reviews =product.reviews.filter(rev=>rev._id.toString() !==req.query.id.toString())


    let avg=0;
    reviews.forEach(rev=>{
        avg+=rev.rating
    })
    
    const ratings =avg/product.reviews.length

    const numOfReviews=reviews.length;

    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,
        ratings,
        numOfReviews
    },
    {
        new:true,
        runValidator:true,
        useFindAndModify:false,
    })
    res.status(200).json({
        success:true
    })
})




module.exports={getAllProducts
    ,deleteProduct
    ,updateProduct
    ,createNewProduct
    ,getProductDetails
    ,createProductReview
    ,getProductReviews
    ,deleteReview}