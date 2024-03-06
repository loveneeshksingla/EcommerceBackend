const express=require('express');
const userRouter=express.Router();


const {registerUser, 
       loginUser,
       logout,
       forgotPassword,
       resetPassword,
       getUserDetails,
       updatePassword,
       updateProfile,
       getAllUsers,
       getSingleUser,
       updateUserProfile,
       deleteUser}=require('../controllers/userController')

const {isAuthenticatedUser,authorizeRoles}=require("../middleware/auth")


userRouter.post("/register",registerUser);
userRouter.post("/login",loginUser)
userRouter.get("/logout",logout)
userRouter.post("/password/forgot",forgotPassword)
userRouter.put("/password/reset/:token",resetPassword )
userRouter.get("/me",isAuthenticatedUser,getUserDetails)
userRouter.put("/password/update",isAuthenticatedUser,updatePassword)
userRouter.put("/me/update",isAuthenticatedUser,updateProfile)
userRouter.get("/admin/users",isAuthenticatedUser,authorizeRoles("admin"),getAllUsers )
userRouter.get("/admin/user/:id",isAuthenticatedUser,authorizeRoles("admin"),getSingleUser )
userRouter.put("/admin/user/:id",isAuthenticatedUser,authorizeRoles("admin"),updateUserProfile  )
userRouter.put("/admin/deleteuser/:id",isAuthenticatedUser,authorizeRoles("admin"),deleteUser )

module.exports=userRouter;