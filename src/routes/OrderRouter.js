const express = require("express");
const router = express.Router();
const OrderController = require("../controller/OrderController")
const { authMiddleware, authUserMiddleware } = require("../middleware/authMiddleware");

router.post('/create',authUserMiddleware ,OrderController.createOrder)
router.get('/get-details-order/:id',authUserMiddleware ,OrderController.getDetailsOrder)
router.get('/get-all-order/:id', authUserMiddleware, OrderController.getAllOrderDetails)
router.delete('/cancel-order/:id', authUserMiddleware, OrderController.cancelOrderDetails)
router.get('/get-all-order', authMiddleware, OrderController.getAllOrder)
router.patch('/update-order-status/:id', authMiddleware, OrderController.updateOrderStatus)

module.exports = router