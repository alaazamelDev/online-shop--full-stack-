const express = require('express');
const router = express.Router();

const shopController = require('../controllers/shop-controller');

// / => GET
router.get('/', shopController.getHomePage);

// /product-list => GET
router.get('/product-list', shopController.getProducts);

// /cart => GET
router.get('/cart', shopController.getCart);

// /checkout => GET
router.get('/checkout', shopController.getCheckout);

module.exports = router;
