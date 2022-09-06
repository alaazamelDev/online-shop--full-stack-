const { getDatabase } = require("../util/database");
const mongodb = require("mongodb");

class Product {
  constructor({ _id, title, imageUrl, price, description, userId }) {
    this._id = _id ? new mongodb.ObjectId(_id) : null;
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
    this.userId = userId;
  }

  save() {
    let dbOp;
    if (this._id) {
      // We are in update mode
      dbOp = getDatabase()
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = getDatabase().collection("products").insertOne(this);
    }
    return dbOp
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static fetchAll() {
    const db = getDatabase();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        console.log(products);
        return products;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static findById(prodId) {
    const db = getDatabase();
    return db
      .collection("products")
      .find({ _id: new mongodb.ObjectId(prodId) })
      .next()
      .then((product) => {
        console.log(product);
        return product;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static deleteById(prodId) {
    const db = getDatabase();
    return db
      .collection("products")
      .deleteOne({ _id: new mongodb.ObjectId(prodId) })
      .then((result) => {
        console.log(result);
        return result;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = Product;
