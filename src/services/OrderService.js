const Order = require('../models/OrderProduct')
const Product = require('../models/ProductModel')
const EmailService = require('../services/EmailService')

const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        const {
            orderItems,
            fullName,
            address,
            city,
            phone,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice,
            user,
            isPaid,
            paidAt,
            email
        } = newOrder
        try {
            const promises = orderItems.map(async (order) => {
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: order.product,
                        countInStock: { $gte: order.amount }
                    },
                    {
                        $inc: {
                            countInStock: -order.amount,
                            sold: +order.amount
                        }
                    },
                    { new: true }
                )
                if (productData) {
                    const createdOrder = await Order.create({
                        orderItems,
                        shippingAddress: {
                            fullName,
                            address,
                            city,
                            phone,
                        },
                        paymentMethod,
                        itemsPrice,
                        shippingPrice,
                        totalPrice,
                        user: user,
                        isPaid,
                        paidAt
                    })
                    if (createdOrder) {
                        await EmailService.sendEmailCreateOrder(email, orderItems)
                        return {
                            status: 'OK',
                            message: 'SUCCESS',
                        }
                    }
                } else {
                    return {
                        status: 'OK',
                        message: 'ERR',
                        id: [order.product]
                    }
                }
            })
            const results = await Promise.all(promises)
            const newData = results && results.filter((item) => item.id)
            if (newData.length) {
                resolve({
                    status: 'ERR',
                    message: `Sản phẩm với id ${newData.join(',')} không đủ số lượng`
                })
            }
            resolve({
                status: 'OK',
                message: 'SUCCESS'
            })
        } catch (error) {
            reject(error)
        }
    })
}

const getDetailsOrder = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findOne({
                _id: id
            })

            if (order == null) {
                resolve({
                    status: 'OK',
                    message: 'The order is not found'
                })
            }

            resolve({
                status: 'OK',
                message: 'Details order',
                data: order
            })

        } catch (err) {
            reject(err)
        }
    })
}

const getAllOrderDetails = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.find({
                user: id
            }).sort({ createdAt: -1, updatedAt: -1 })
            if (order === null) {
                resolve({
                    status: 'ERR',
                    message: 'The order is not defined'
                })
            }

            resolve({
                status: 'OK',
                message: 'SUCESSS',
                data: order
            })
        } catch (e) {
            reject(e)
        }
    })
}

const cancelOrderDetails = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let order = []
            const promises = data.map(async (order) => {
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: order.product,
                        sold: { $gte: order.amount }
                    },
                    {
                        $inc: {
                            countInStock: +order.amount,
                            sold: -order.amount
                        }
                    },
                    { new: true }
                )
                if (productData) {
                    order = await Order.findByIdAndDelete(id)
                    if (order === null) {
                        resolve({
                            status: 'ERR',
                            message: 'The order is not defined'
                        })
                    }
                } else {
                    return {
                        status: 'OK',
                        message: 'ERR',
                        id: order.product
                    }
                }
            })
            const results = await Promise.all(promises)
            const newData = results && results[0] && results[0].id

            if (newData) {
                resolve({
                    status: 'ERR',
                    message: `San pham voi id: ${newData} khong ton tai`
                })
            }
            resolve({
                status: 'OK',
                message: 'success',
                data: order
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllOrder = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allOrder = await Order.find().sort({ createdAt: -1, updatedAt: -1 })
            resolve({
                status: 'OK',
                message: 'Success',
                data: allOrder
            })
        } catch (e) {
            reject(e)
        }
    })
}

const updateOrderStatus = async (id, data) => {
    try {
        // Find the order by ID
        const order = await Order.findOne({ _id: id });
        if (!order) {
            throw new Error('Order not found');
        }

        // Prepare the update data object
        const updateData = {};
        if (data.hasOwnProperty('isPaid')) {
            updateData.isPaid = data.isPaid;
        }
        if (data.hasOwnProperty('isDelivered')) {
            updateData.isDelivered = data.isDelivered;
        }

        // Update the order and return the result
        const updatedOrder = await Order.findByIdAndUpdate(id, updateData, { new: true });

        return {
            status: 'OK',
            message: 'The order has been updated',
            data: updatedOrder
        };
    } catch (e) {
        console.error('Error updating order:', e);
        throw e; // Rethrow the error to be handled by the controller
    }
}


module.exports = {
    createOrder,
    getDetailsOrder,
    getAllOrderDetails,
    cancelOrderDetails,
    getAllOrder,
    updateOrderStatus
}