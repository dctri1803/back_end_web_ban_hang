const OrderService = require('../services/OrderService')

const createOrder = async (req, res) => {
    try {
        const {
            fullName,
            address,
            city,
            phone,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice,
        } = req.body
        console.log('Body: ', req.body)
        if (!fullName) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The fullName is requied '
            })
        } else if (!address) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The address is requied '
            })
        } else if (!city) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The city is requied '
            })
        } else if (!phone) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The phone is requied '
            })
        } else if (!paymentMethod) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The paymentMethod is requied '
            })
        } else if (itemsPrice === undefined) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The itemsPrice is required'
            });
        } else if (shippingPrice === undefined) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The shippingPrice is required'
            });
        } else if (totalPrice === undefined) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The totalPrice is required'
            });
        }
        const response = await OrderService.createOrder(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllOrder = async (req, res) => {
    try {
        const data = await OrderService.getAllOrder()
        return res.status(200).json(data)
    } catch (e) {
        // console.log(e)
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailsOrder = async (req, res) => {
    try {
        const orderId = req.params.id
        if (!orderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The user id is required'
            })
        }
        const response = await OrderService.getDetailsOrder(orderId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllOrderDetails = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await OrderService.getAllOrderDetails(userId)
        return res.status(200).json(response)
    } catch (e) {
        // console.log(e)
        return res.status(404).json({
            message: e
        })
    }
}

const cancelOrderDetails = async (req, res) => {
    try {
        const data = req.body.orderItems
        const orderId = req.body.orderId
        if (!orderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The orderId is required'
            })
        }
        const response = await OrderService.cancelOrderDetails(orderId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createOrder,
    getAllOrder,
    getDetailsOrder,
    cancelOrderDetails,
    getAllOrderDetails
}