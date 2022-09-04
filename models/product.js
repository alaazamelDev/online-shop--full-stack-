const path = require('path');
const fs = require('fs');
const rootDir = require('../util/path');
const Cart = require('./cart');

const storageDir = path.join(
    rootDir,
    'data',
    'products.json'
);

const getProductsFromFile = cb => {
    fs.readFile(storageDir, (err, fileContent) => {
        if (err) {
            return cb([]);
        }
        return cb(JSON.parse(fileContent));
    });
}

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile(products => {
            if (this.id) {
                // we are in update mode
                const existingProductIndex = products.findIndex(
                    pro => pro.id === this.id
                );
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;

                // write the info to the file
                fs.writeFile(storageDir, JSON.stringify(updatedProducts), (err) => {
                    console.log('error while weiting file: ' + err);
                });
            } else {
                this.id = Math.random().toString();
                products.push(this);
                fs.writeFile(storageDir, JSON.stringify(products), (err) => {
                    console.log('error while weiting file: ' + err);
                });
            }
        });
    }



    static fetchAll(callBack) {
        getProductsFromFile(callBack);
    }

    static findById(id, cb) {
        getProductsFromFile(products => {
            const product = products.find(pro => pro.id === id);
            if (product) {
                cb(product);
            }
        });
    }

    static deleteById(id, cb) {
        getProductsFromFile(products => {

            // delete product from cart 
            Cart.removeProduct(id, products.find(pro => pro.id === id).price);

            const updatedProducts = products.filter(pro => pro.id !== id);
            
            // write the new products to the file
            fs.writeFile(storageDir, JSON.stringify(updatedProducts), (err) => {
                console.log(err);
            });
        });
    }
}