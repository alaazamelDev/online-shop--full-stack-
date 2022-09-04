const express = require('express');
const router = express.Router();

const shopController = require('../controllers/shop-controller');

// / => GET
router.get('/', shopController.getHomePage);

// /products => GET
router.get('/products', shopController.getProducts);

// /products/productId => GET
router.get('/products/:productId', shopController.getProductById);

// /cart => GET
router.get('/cart', shopController.getCart);

// /cart => POST
router.post('/cart', shopController.postCart);

router.post('/cart-delete-item', shopController.postDeleteCartItem)

// /cart => GET
router.get('/orders', shopController.getOrders);

// /checkout => GET
router.get('/checkout', shopController.getCheckout);

module.exports = router;
