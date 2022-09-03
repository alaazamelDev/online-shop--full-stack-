const db = require('../util/database');
module.exports = class Product {
    constructor({ id, title, imageUrl, description, price } = {}) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        // create new product mode
        return db.execute('INSERT INTO products (title, imageUrl, price, description) VALUES (?, ?, ?, ?)',
            [
                this.title,
                this.imageUrl,
                this.price,
                this.description,
            ]);
    }

    update() {
        // we are in update mode
        return db.execute('UPDATE products SET title = ? , imageUrl = ?, price = ?, description = ? WHERE id = ?',
            [
                this.title,
                this.imageUrl,
                this.price,
                this.description,
                this.id,
            ]);
    }



    static fetchAll() {
        return db.execute('SELECT * FROM products');
    }

    static findById(id) {
        return db.execute('SELECT * FROM products WHERE id = ?', [id]);
    }

    static deleteById(id) {
        return db.execute('DELETE FROM products WHERE id = ?', [id]);
    }
};