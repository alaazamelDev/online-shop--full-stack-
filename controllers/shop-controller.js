const Product = require('../models/product')

// Index Page
exports.getHomePage = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
        });
    });
};

// User's Products page
exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'Products',
            path: '/product-list',
        });
    });
};

// Cart Page
exports.getCart = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/cart', {
            prods: products,
            pageTitle: 'Cart',
            path: '/cart',
        });
    });
};

// Orders Page
exports.getOrders = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/orders', {
            prods: products,
            pageTitle: 'Orders',
            path: '/orders',
        });
    });
};

// Checkout Page
exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout',
    });
};