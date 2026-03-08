const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getProducts,
  getProductById,
  createProduct,
  deleteProduct,
  createProductReview,
} = require('../controllers/productController');

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/:id/reviews').post(protect, createProductReview);
router
  .route('/:id')
  .get(getProductById)
  .delete(protect, admin, deleteProduct);

module.exports = router;