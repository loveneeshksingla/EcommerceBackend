const express=require('express');
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrderStatus, deleteOrder } = require('../controllers/orderController');

const router=express.Router();
const { isAuthenticatedUser,authorizeRoles } = require('../middleware/auth');

router.route("/order/new").post(isAuthenticatedUser,newOrder)
router.route("/order/:id").get(isAuthenticatedUser,authorizeRoles("admin"),getSingleOrder)
router.route("/order/me").get(isAuthenticatedUser,myOrders)
router.route("/admin/orders").get(isAuthenticatedUser,authorizeRoles("admin"),getAllOrders)
router.route("/admin/order/:id")
    .put(isAuthenticatedUser,authorizeRoles("admin"),updateOrderStatus)
    .delete(isAuthenticatedUser,authorizeRoles("admin"),deleteOrder)

module.exports=router;