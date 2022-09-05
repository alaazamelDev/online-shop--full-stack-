const { getDatabase } = require("../util/database");
const mongodb = require("mongodb");

class User {
  constructor({ name, email }) {
    this.name = name;
    this.email = email;
  }

  save() {
    const db = getDatabase();
    return db.collection("users").insertOne(this);
  }

  static findById(userId) {
    const db = getDatabase();
    return db
      .collection("users")
      .findOne({ _id: new mongodb.ObjectId(userId) });
  }
}

module.exports = User;
