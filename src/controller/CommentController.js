const CommentService = require('../services/CommentService')


const createComment = async (req, res) => {
    try {
        const { productId, userId, content } = req.body;

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
        const { limit, page } = req.query
        if (!productId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Product ID is required',
            });
        }

        const response = await CommentService.getCommentsByProduct(productId, Number(limit) || null, Number(page) || 0);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            message: e.message,
        });
    }
};

const replyToComment = async (req, res) => {
    try {
        const { productId, commentId, userId, content } = req.body;

        if (!productId || !commentId || !userId || !content) {
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

const deleteComment = async (req, res) => {
    try {
        const {commentId}  = req.params;
        if (!commentId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Comment ID is required',
            });
        }

        const response = await CommentService.deleteComment(commentId);
        return res.status(200).json(response);
    } catch (e) {
        res.status(500).json({
            message: e.message,
        });
    }
};


module.exports = {
    createComment,
    getCommentsByProduct,
    replyToComment,
    toggleLikeComment,
    toggleDislikeComment,
    deleteComment
};
