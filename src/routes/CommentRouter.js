const express = require('express');
const router = express.Router();
const CommentController = require('../controller/CommentController');
const { authUserMiddleware } = require('../middleware/authMiddleware');

router.post('/create', authUserMiddleware, CommentController.createComment);
router.get('/product/:productId', CommentController.getCommentsByProduct);
router.post('/reply', CommentController.replyToComment);
router.post('/like/:commentId', CommentController.toggleLikeComment);
router.post('/dislike/:commentId', CommentController.toggleDislikeComment);

module.exports = router;