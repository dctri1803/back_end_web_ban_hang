const Comment = require('../models/Comment');

const createComment = (newComment) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { productId, userId, content } = newComment;

            const comment = await Comment.create({
                product: productId,
                user: userId,
                content,
            });

            resolve({
                status: 'OK',
                message: 'Comment created successfully',
                data: comment,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const getCommentsByProduct = (productId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const comments = await Comment.find({ product: productId })
                .populate('user', 'name avatar')
                .populate({
                    path: 'replies',
                    populate: {
                        path: 'user',
                        select: 'name avatar'
                    }
                });
            const commentsWithCounts = comments.map(comment => ({
                ...comment.toObject(),
                likesCount: comment.likes.length,
                dislikesCount: comment.dislikes.length
            }));
            resolve({
                status: 'OK',
                message: 'Success',
                data: commentsWithCounts,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const replyToComment = (replyData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { commentId, userId, content } = replyData;

            const reply = await Comment.create({
                product: null,
                user: userId,
                content,
                parentComment: commentId,
            });

            await Comment.findByIdAndUpdate(commentId, {
                $push: { replies: reply._id },
            });

            resolve({
                status: 'OK',
                message: 'Reply added successfully',
                data: reply,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const toggleLikeComment = (toggleData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { commentId, userId } = toggleData;

            const comment = await Comment.findById(commentId);
            if (!comment) {
                return resolve({
                    status: 'ERR',
                    message: 'Comment not found',
                });
            }

            const hasLiked = comment.likes.includes(userId);
            const update = hasLiked
                ? { $pull: { likes: userId } }
                : { $addToSet: { likes: userId }, $pull: { dislikes: userId } };

            const updatedComment = await Comment.findByIdAndUpdate(commentId, update, { new: true });

            resolve({
                status: 'OK',
                message: hasLiked ? 'Like removed successfully' : 'Comment liked successfully',
                data: updatedComment,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const toggleDislikeComment = (toggleData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { commentId, userId } = toggleData;

            const comment = await Comment.findById(commentId);
            if (!comment) {
                return resolve({
                    status: 'ERR',
                    message: 'Comment not found',
                });
            }

            const hasDisliked = comment.dislikes.includes(userId);
            const update = hasDisliked
                ? { $pull: { dislikes: userId } }
                : { $addToSet: { dislikes: userId }, $pull: { likes: userId } };

            const updatedComment = await Comment.findByIdAndUpdate(commentId, update, { new: true });

            resolve({
                status: 'OK',
                message: hasDisliked ? 'Dislike removed successfully' : 'Comment disliked successfully',
                data: updatedComment,
            });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    createComment,
    getCommentsByProduct,
    replyToComment,
    toggleLikeComment,
    toggleDislikeComment,
};
