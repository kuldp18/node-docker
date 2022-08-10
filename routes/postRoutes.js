const express = require('express');
const postController = require('../controllers/postController');
const router = express.Router();

const protect = require('../middlewares/authMiddlewares');

router
  .route('/')
  .get(protect, postController.getAllPosts) //get all posts
  .post(protect, postController.createPost); // create a post

router
  .route('/:id')
  .get(protect, postController.getOnePost) // get post by id
  .patch(protect, postController.updatePost) // update post by id
  .delete(protect, postController.deletePost); // delete post by id

module.exports = router;
