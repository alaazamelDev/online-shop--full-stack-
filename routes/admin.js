const express = require("express");
const { body, param, query } = require("express-validator");

const router = express.Router();

const adminController = require("../controllers/admin-controller");
const isAuthMiddleware = require("../middlewares/is-auth");

// /admin/add-product => GET
router.get("/add-product", isAuthMiddleware, adminController.getAddProduct);

// /admin/add-product => POST
router.post(
  "/add-product",
  isAuthMiddleware,
  [
    body("title")
      .notEmpty()
      .withMessage("Title is required")
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body("price").isFloat(),
    body("description").notEmpty().isLength({ min: 5, max: 400 }),
  ],
  adminController.postAddProduct
);

// /admin/edit-product/id => GET
router.get(
  "/edit-product/:productId",
  isAuthMiddleware,
  adminController.getEditProduct
);

// /admin/edit-product/id => POST
router.post(
  "/edit-product",
  isAuthMiddleware,
  [
    body("title")
      .notEmpty()
      .withMessage("Title is required")
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body("price").isFloat(),
    body("description").notEmpty().isLength({ min: 5, max: 400 }),
  ],
  adminController.postEditProduct
);

// /admin/products => GET
router.get("/products", isAuthMiddleware, adminController.getAdminProducts);

// /admin/delete-product/id => POST
router.delete(
  "/product/:productId",
  isAuthMiddleware,
  adminController.deleteProduct
);

module.exports = router;
