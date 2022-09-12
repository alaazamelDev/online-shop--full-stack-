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

// /cart => GET
router.get("/orders", isAuthMiddleware, shopController.getOrders);

router.get("/orders/:orderId", isAuthMiddleware, shopController.getInvoice);

// /checkout => GET
router.get("/checkout", shopController.getCheckout);

// /checkout/success => GET
router.get("/checkout/success", shopController.getCheckoutSuccess);

// /checkout/cancel => GET
router.get("/checkout/cancel", shopController.getCheckout);

module.exports = router;
