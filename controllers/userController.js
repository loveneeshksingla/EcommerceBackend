const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors=require('../middleware/catchAsyncErrors');

const User=require('../model/userModel');
const sendToken = require('../utils/jwToken');
const sendEmail =require('../utils/sendEmail')
const crypto =require('crypto')



//Register a User

exports.registerUser=catchAsyncErrors( async(req,res,next)=>{
    const {name,email,password}=req.body;

    const user=await User.create({name,email,password,
        avatar:{
            public_id:"this is a sample id",
            url:"this is a sample url"
        }
    })
    
   sendToken(user,201,res)
   
})


//Login User

exports.loginUser=catchAsyncErrors(async(req,res,next)=>{
    const {email,password}=req.body;
    //checking if user has given password and email both

    if(!email || !password){
        return next(new ErrorHandler("Please enter email & password",400))
    }

    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid email or password",401))
    }
    
    const isPasswordMatched = await user.comparePassword(password)
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password",401))
    }

    sendToken(user,200,res)
})


//Logout User

exports.logout = catchAsyncErrors(async(req,res,next)=>{
    
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })
    
    res.status(200).json({
        sucess:true,
        msg:"Logged Out"
    })
})


// Forgot password 

exports.forgotPassword = catchAsyncErrors(async(req,res,next)=>{
    const user= await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler("User not found",404))
    }

    //get reset password token
    const resetToken=user.getResetPasswordToken();
    await user.save({validateBeforeSave:false});

    const resetPasswordUrl=`${req.protocol}://${req.get("host")}/api/user/password/reset/${resetToken}`


    const message= `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n 
    If you have not requested this email then please Ignore it`


    try{

        await sendEmail({
            email:user.email,
            subject:`Ecommerce Password Recovery`,
            message,
        })
        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`
        })

    }catch(error){
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;

        await user.save({validateBeforeSave:false});

        return next(new ErrorHandler(error.message,500))
    }
})


//Reset Password

exports.resetPassword =catchAsyncErrors(async(req,res,next)=>{

    //creating  token hash
    const resetPasswordToken=crypto
    .createHash('sha256') 
    .update(req.params.token)
    .digest('hex')

    const user =await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()},
    });

    if(!user){
        return next(new ErrorHandler("Reset password token is Invalid or has been expired",400))
    }

    if(req.body.password!==req.body.confirmPassword){
        return next(new ErrorHandler("password does not Matched",400))
    }

    user.password=req.body.password;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;

    await user.save();
    sendToken(user,200,res)
})


// User Details

exports.getUserDetails = catchAsyncErrors(async(req,res,next)=>{

    const user =await User.findById(req.user.id);

    if(!user){
        return next(new ErrorHandler("User does not exist",400))
    }

    res.status(200).json({
        sucess:true,
        user,
    })
})

//Update user password
exports.updatePassword = catchAsyncErrors(async(req,res,next)=>{

    const user =await User.findById(req.user.id).select("+password");
    
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword)
    if(!isPasswordMatched){
        return next(new ErrorHandler("Old Password is incorrect",400))
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not matched",400))
    }

    user.password=req.bodynewPassword;

    await user.save()
   
    sendToken(user,200,res)
})

//Update user profile
exports.updateProfile = catchAsyncErrors(async(req,res,next)=>{

   const newUserData={
       name:req.body.name,
       email:req.body.email
   }

   //We will add cloudinary later
   const user=await User.findByIdAndUpdate(req.user.id,newUserData,{
       new:true,
       runValidators:true,
       useFindAndModify:false,
   })
   
   res.status(200).json({
       sucesss:true
   })

})


//Get all users(admin)
exports.getAllUsers = catchAsyncErrors(async(req,res,next)=>{

    const users=await User.find();
        

    if(!user){
        return next(new ErrorHandler("No users exist",400))
    }
        res.status(200).json({
            sucess:true,
            users
        })
})


//Get single user(admin)
exports.getSingleUser = catchAsyncErrors(async(req,res,next)=>{

    const user=await User.findById(req.params.id);
        
    if(!user){
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`))
    }
        res.status(200).json({
            sucess:true,
            user
        })
})


//Update user role---Admin
exports.updateUserProfile = catchAsyncErrors(async(req,res,next)=>{

    const newUserData={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role,
    }

    const user=await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    })
    

    if(!user){
        return next(new ErrorHandler(`User does not exist with id ${req.params.id}`,401))
    }

    res.status(200).json({
        sucesss:true
    })
 
 })


 //Delete user role----Admin
exports.deleteUser = catchAsyncErrors(async(req,res,next)=>{
 

    const user=await User.findById(req.params.id);
        //We will remove cloudinary later

    if(!user){
        return next(new ErrorHandler(`User does not exist with id ${req.params.id}`,401))
    }

    await user.remove()

    res.status(200).json({
        sucesss:true,
        msg:"User Deleted Successfully"
    })
 
 })