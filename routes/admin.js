const path = require('path');

const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin-controller');

// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);

// /admin/add-product => POST
router.post('/add-product', adminController.postAddProduct);

// /admin/edit-product => GET
router.get('/edit-product', adminController.postEditProduct);

// /admin/edit-product => GET
router.post('/edit-product', adminController.getEditProduct);

// /admin/admin-products => GET
router.get('/admin-products', adminController.getAdminProducts);


exports.routes = router;
