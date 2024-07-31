const express = require('express');
const router = express.Router();
const CommentController = require('../controller/CommentController');
const { authUserMiddleware } = require("../middleware/authMiddleware");

router.post('/create', authUserMiddleware, CommentController.createComment);
router.get('/product/:productId', CommentController.getCommentsByProduct);
router.post('/reply', authUserMiddleware, CommentController.replyToComment);
router.post('/like/:commentId', authUserMiddleware,CommentController.toggleLikeComment);
router.post('/dislike/:commentId', authUserMiddleware, CommentController.toggleDislikeComment);
router.delete('/delete/:commentId', authUserMiddleware, CommentController.deleteComment);

module.exports = router;