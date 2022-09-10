const express = require("express");
const router = express.Router();

const shopController = require("../controllers/shop-controller");
const isAuthMiddleware = require("../middlewares/is-auth");

// / => GET
router.get("/", shopController.getHomePage);

// /products => GET
router.get("/products", shopController.getProducts);

// /products/productId => GET
router.get("/products/:productId", shopController.getProductById);

// /cart => GET
router.get("/cart", isAuthMiddleware, shopController.getCart);

// /cart => POST
router.post("/cart", isAuthMiddleware, shopController.postCart);

// /cart-delete-item => POST
router.post(
  "/cart-delete-item",
  isAuthMiddleware,
  shopController.postDeleteCartItem
);

// /create-order =>POST
router.post("/create-order", isAuthMiddleware, shopController.postOrder);

// /cart => GET
router.get("/orders", isAuthMiddleware, shopController.getOrders);

// // /checkout => GET
// router.get('/checkout', shopController.getCheckout);

router.get("/orders/:orderId", isAuthMiddleware, shopController.getInvoice);

module.exports = router;
