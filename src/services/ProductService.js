const Product = require('../models/ProductModel');

const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const { name, image, type, price, countInStock, rating, description, discount } = newProduct
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
            const newProduct = await Product.create({
                name, 
                image, 
                type, 
                countInStock: Number(countInStock), 
                price, 
                rating, 
                description,
                discount: Number(discount),
            })
            if (newProduct) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: newProduct
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
            reject(error)
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

const deleteManyProduct = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            await Product.deleteMany({ _id: ids})

            resolve({
                status: 'OK',
                message: 'Delete product successfully',
            })

        } catch (err) {
            reject(err)
        }
    })
}

const getAllProduct = ( limit, page, sort, filters ) => {
    return new Promise(async (resolve, reject) => {
        try {
            let allProduct = []
            if(!limit) {
                allProduct = await Product.find()
            }
            let filterObject = {};
            if (filters) {
                Object.keys(filters).forEach(key => {
                    filterObject[key] = { $regex: filters[key] }; 
                });
            }

            const totalProduct = await Product.countDocuments(filterObject)
            let query = Product.find(filterObject).limit(limit).skip(page*limit)

            if(sort.field && sort.order) {
                const sortObject = {}
                sortObject[sort.field] = sort.order
                query = query.sort(sortObject)
            }
            else {
                allProduct = await query.exec()
            }
            resolve({
                status: 'OK',
                message: 'Success',
                data: allProduct,
                totalProduct: totalProduct,
                currentPage: Number(page + 1),
                totalPage: Math.ceil(totalProduct / limit)
            })

        } catch (err) {
            reject(err)
        }
    })
}

const getAllType = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allType = await Product.distinct('type')
            resolve({
                status: 'OK',
                message: 'Success',
                data: allType,
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
    deleteManyProduct,
    getAllType,
}