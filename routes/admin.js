const express = require("express");

const router = express.Router();

const adminController = require("../controllers/admin-controller");
const isAuthMiddleware = require("../middlewares/is-auth");

// /admin/add-product => GET
router.get("/add-product", isAuthMiddleware, adminController.getAddProduct);

// /admin/add-product => POST
router.post("/add-product", isAuthMiddleware, adminController.postAddProduct);

// /admin/edit-product/id => GET
router.get(
  "/edit-product/:productId",
  isAuthMiddleware,
  adminController.getEditProduct
);

// /admin/edit-product/id => POST
router.post("/edit-product", isAuthMiddleware, adminController.postEditProduct);

// /admin/delete-product/id => POST
router.post(
  "/delete-product/:productId",
  isAuthMiddleware,
  adminController.postDeleteProduct
);

// /admin/products => GET
router.get("/products", isAuthMiddleware, adminController.getAdminProducts);

module.exports = router;
