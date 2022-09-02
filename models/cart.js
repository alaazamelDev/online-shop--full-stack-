const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');
const Product = require('./product');

const storageDir = path.join(
    rootDir,
    'data',
    'cart.json'
);

module.exports = class Cart {

    static addProduct(id, productPrice) {
        // Fetch the previous cart
        fs.readFile(storageDir, (err, fileContent) => {
            let cart = {
                products: [],
                totalPrice: 0.0,
            };
            if (!err) {
                cart = JSON.parse(fileContent);
            }
            // Analyze the cart => find the existing product
            const existingProductIndex = cart.products.findIndex(pro => pro.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            if (existingProduct) {
                updatedProduct = { ...existingProduct };
                updatedProduct.quantity += 1;
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id: id, quantity: 1 };
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice += productPrice;
            fs.writeFile(storageDir, JSON.stringify(cart), (err) => {
                console.log(err);
            })
        });
        // increase the quantity of the product
    }
}