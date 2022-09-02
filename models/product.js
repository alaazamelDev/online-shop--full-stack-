const path = require('path');
const fs = require('fs');
const rootDir = require('../util/path');

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
    constructor(title, imageUrl, description, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(storageDir, JSON.stringify(products), (err) => {
                console.log('error while weiting file: ' + err);
            });
        });
    }

    static fetchAll(callBack) {
        getProductsFromFile(callBack);
    }
}