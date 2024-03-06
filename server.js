const app=require('./app')
const dotenv=require('dotenv')
const connectDatabase=require('./config/database')

dotenv.config({path:'./config/config.env'})

//Handling un caught exceptions
process.on("uncaughtException",err=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`)
    process.exit(1)
})

const server=app.listen(process.env.PORT,()=>{
    console.log(`server is working on http://localhost:${process.env.PORT}`)
})

connectDatabase();

//Handling unhandled promise rejections
process.on("unhandledRejection",err=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled promise Rejection`)
    server.close(()=>{
        process.exit(1)
    })
})