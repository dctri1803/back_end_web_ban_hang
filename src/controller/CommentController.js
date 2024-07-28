const CommentService = require('../services/CommentService')


const createComment = async (req, res) => {
    try {
        const { productId, userId, content } = req.body;

        console.log("req.body", req.body)

        if (!productId ) {
            return res.status(400).json({
                status: 'ERR',
                message: 'productId  are required',
            });
        }

        if (!userId) {
            return res.status(400).json({
                status: 'ERR',
                message: ' userId are required',
            });
        }
        if (!content) {
            return res.status(400).json({
                status: 'ERR',
                message: 'content  are required',
            });
        }
        const response = await CommentService.createComment(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            message: e.message,
        });
    }
};

const getCommentsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!productId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Product ID is required',
            });
        }

        const response = await CommentService.getCommentsByProduct(productId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            message: e.message,
        });
    }
};

const replyToComment = async (req, res) => {
    try {
        const { commentId, userId, content } = req.body;

        console.log("req.body", req.body);

        if (!commentId || !userId || !content) {
            return res.status(400).json({
                status: 'ERR',
                message: 'All fields are required',
            });
        }

        const response = await CommentService.replyToComment(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            message: e.message,
        });
    }
};

const toggleLikeComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { userId } = req.body;

        console.log("commentId", commentId)
        console.log("userId", userId)


        if (!commentId ) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Comment ID are required',
            });
        }

        if (!userId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'User ID are required',
            });
        }

        const response = await CommentService.toggleLikeComment({ commentId, userId });
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            message: e.message,
        });
    }
};

const toggleDislikeComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { userId } = req.body;

        console.log("commentId", commentId)
        console.log("userId", userId)


        if (!commentId ) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Comment ID are required',
            });
        }

        if (!userId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'User ID are required',
            });
        }

        const response = await CommentService.toggleDislikeComment({ commentId, userId });
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            message: e.message,
        });
    }
};

module.exports = {
    toggleLikeComment,
    toggleDislikeComment,
};

module.exports = {
    createComment,
    getCommentsByProduct,
    replyToComment,
    toggleLikeComment,
    toggleDislikeComment,
};
