const ErrorHandler=require('../utils/errorHandler')

module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode || 500;
    err.message=err.message || "Internal server error"


    //Wrong Mongodb Id Error ...........Handling Cast Errors
    if(err.name==="CastError"){
        const message=`Resource not found. Invalid: ${err.path}`;
        err=new ErrorHandler(message,400);
    }

    //Wrong JWT Error
    if(err.name==="JsonWebTokenError"){
        const message=`Json web token is invalid try again`;
        err=new ErrorHandler(message,400);
    }

    //Wrong JWT Expire Error
     if(err.name === "TokenExpireError"){
        const message=`Json web token is expired try again`;
        err=new ErrorHandler(message,400);
    }


    //Mongoose duplicate key error
    if(err.code === 11000){
        const message=`Duplicate ${Object.keys(err.keyValue)} Entered`
        err=new ErrorHandler(message,400);
    }
    res.status(err.statusCode).json({
        sucess:false,
        message:err.message
    })

}