const Cart = require('../models/cart');
const Product = require('../models/product')

// Index Page
exports.getHomePage = (req, res, next) => {
    Product.fetchAll()
        .then(
            ([rows, fieldData]) => {
                res.render('shop/index', {
                    prods: rows,
                    pageTitle: 'Shop',
                    path: '/',
                });
            }
        )
        .catch(err => console.log(err));
};

// User's Products page
exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(
            ([rows, fieldData]) => {
                res.render('shop/product-list', {
                    prods: rows,
                    pageTitle: 'Products',
                    path: '/products',
                });
            }
        ).catch(err => console.log(err));
};

// Get product by id
exports.getProductById = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
        res.render('shop/product-detail', {
            product: product,
            pageTitle: product.title,
            path: '/products',
        });
    });
};

// Cart Page
exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (let product of products) {
                const cartProductData = cart.products.find(
                    pro => pro.id === product.id
                );
                if (cartProductData) {
                    cartProducts.push({
                        productData: product,
                        qty: cartProductData.quantity
                    });
                }
            }
            res.render('shop/cart', {
                products: cartProducts,
                pageTitle: 'My Cart',
                path: '/cart',
            });
        });
    });

};

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId, product => {
        Cart.addProduct(product.id, product.price);
    });
    res.redirect('/cart');
};

// Orders Page
exports.getOrders = (req, res, next) => {
    Product.fetchAll()
        .then(
            ([rows, fieldData]) => {
                res.render('shop/orders', {
                    prods: rows,
                    pageTitle: 'Orders',
                    path: '/orders',
                });
            }
        ).catch(err => console.log(err));
};

// Checkout Page
exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout',
    });
};

exports.postDeleteCartItem = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId, product => {
        Cart.removeProduct(productId, product.price);
        res.redirect('/cart');
    });

};