const UserRouter = require('./UserRouter');
const ProductRouter = require('./ProductRouter')
const OrderRouter = require('./OrderRouter')
const CommentRouter = require('./CommentRouter')

const routes = (app) => {
    app.use('/api/user', UserRouter)
    app.use('/api/product', ProductRouter)
    app.use('/api/order', OrderRouter)
    app.use('/api/comment', CommentRouter);}

module.exports = routes