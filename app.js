const express=require('express')
const app=express()
const errorMiddleware=require('./middleware/error')
const rootRouter=require('./routes/indexRouters')
const cors=require('cors')
const cookieParser=require('cookie-parser')

app.use(cookieParser())
app.use(cors())
app.use(express.json());
app.use(errorMiddleware)
app.use("/api",rootRouter)
module.exports=app;

