const Product = require('../model/ProductModel');

const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const { name, image, type, price, countInStock, rating, description } = newProduct
        try {
            const checkUser = await Product.findOne({
                name: name
            })
            if (checkUser !== null) {
                resolve({
                    status: 'OK',
                    message: 'The product is already'
                })
            }
            const createdProduct = await Product.create({
                name, image, type, price, countInStock, rating, description
            })
            if (createdProduct) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createdProduct
                })
            }
        } catch (err) {
            reject(err)
        }
    })
}

const updateProduct = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id
            })
            if (checkProduct === null) {
                resolve({
                    status: 'OK',
                    message: 'There is no corresponding product'
                })
            }

            const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: 'OK',
                message: 'The product had been updated',
                data: updatedProduct
            })
        } catch (error) {
            reject(err)
        }
    })

}

const getDetailsProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findOne({
                _id: id
            })

            if (product == null) {
                resolve({
                    status: 'OK',
                    message: 'The product is not found'
                })
            }

            resolve({
                status: 'OK',
                message: 'Details product',
                data: product
            })

        } catch (err) {
            reject(err)
        }
    })
}

const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id
            })

            if (checkProduct == null) {
                resolve({
                    status: 'OK',
                    message: 'The product is not found'
                })
            }

            await Product.findByIdAndDelete(id)

            resolve({
                status: 'OK',
                message: 'Delete product successfully',
            })

        } catch (err) {
            reject(err)
        }
    })
}

const getAllProduct = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allProduct = await Product.find()
            resolve({
                status: 'OK',
                message: 'Success',
                data: allProduct,
            })

        } catch (err) {
            reject(err)
        }
    })
}

module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct,
}