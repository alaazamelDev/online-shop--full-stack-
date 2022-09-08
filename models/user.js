const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  let newQuantity = 1;
  const updatedItems = [...this.cart.items];
  const cartProductIndex = this.cart.items.findIndex((pro) => {
    return pro.productId.toString() === product._id.toString();
  });

  if (updatedItems[cartProductIndex]) {
    // already exists, fetch quantity
    newQuantity = updatedItems[cartProductIndex].quantity + 1;
    updatedItems[cartProductIndex] = {
      quantity: newQuantity,
      productId: product._id,
    };
  } else {
    updatedItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }

  // perform update operation
  const updatedCart = {
    items: updatedItems,
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.removeFromCart = function (proId) {
  const updatedItems = this.cart.items.filter((pro) => {
    return pro.productId.toString() !== proId.toString();
  });
  this.cart.items = updatedItems;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
// const { getDatabase } = require("../util/database");
// const mongodb = require("mongodb");

// class User {
//   constructor({ _id, name, email, cart }) {
//     this._id = _id;
//     this.name = name;
//     this.email = email;
//     this.cart = cart;
//   }

//   save() {
//     const db = getDatabase();
//     return db.collection("users").insertOne(this);
//   }

//   static findById(userId) {
//     const db = getDatabase();
//     return db
//       .collection("users")
//       .findOne({ _id: new mongodb.ObjectId(userId) });
//   }

//   getCart() {
//     const productIds = this.cart.items.map((pro) => {
//       return pro.productId;
//     });
//     let cartProducts = [];

//     const db = getDatabase();
//     return db
//       .collection("products")
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then((products) => {
//         products.map((p) => {
//           cartProducts.push({
//             ...p,
//             quantity: this.cart.items.find((item) => {
//               return item.productId.toString() === p._id.toString();
//             }).quantity,
//           });
//         });
//         return cartProducts;
//       });
//   }

//   getOrders() {
//     const db = getDatabase();
//     return db
//       .collection("orders")
//       .find({ "user._id": new mongodb.ObjectId(this._id) })
//       .toArray();
//   }

//   addOrder() {
//     const db = getDatabase();
//     return this.getCart()
//       .then((products) => {
//         const order = {
//           items: products,
//           user: {
//             _id: new mongodb.ObjectId(this._id),
//             name: this.name,
//             email: this.email,
//           },
//         };
//         return db.collection("orders").insertOne(order);
//       })
//       .then((result) => {
//         this.cart = { items: [] };
//         return db
//           .collection("users")
//           .updateOne(
//             { _id: new mongodb.ObjectId(this._id) },
//             { $set: { cart: { items: [] } } }
//           );
//       });
//   }

//   // Implement adding an already exists product to the cart
//   addToCart(product) {
//     let newQuantity = 1;
//     const updatedItems = [...this.cart.items];
//     const cartProductIndex = this.cart.items.findIndex((pro) => {
//       return pro.productId.toString() === product._id.toString();
//     });

//     if (updatedItems[cartProductIndex]) {
//       // already exists, fetch quantity
//       newQuantity = updatedItems[cartProductIndex].quantity + 1;
//       updatedItems[cartProductIndex] = {
//         quantity: newQuantity,
//         productId: product._id,
//       };
//     } else {
//       updatedItems.push({
//         productId: new mongodb.ObjectId(product._id),
//         quantity: newQuantity,
//       });
//     }

//     // perform update operation
//     const db = getDatabase();
//     return db.collection("users").updateOne(
//       { _id: new mongodb.ObjectId(this._id) },
//       {
//         $set: {
//           cart: { items: updatedItems },
//         },
//       }
//     );
//   }

//   removeFromCart(proId) {
//     let updatedItems = [...this.cart.items];
//     const cartProductIndex = this.cart.items.findIndex((pro) => {
//       return pro.productId.toString() === proId.toString();
//     });

//     if (updatedItems[cartProductIndex]) {
//       // already exists, delete it
//       updatedItems = updatedItems.filter(
//         (item) => item.productId.toString() !== proId.toString()
//       );
//       const db = getDatabase();
//       return db
//         .collection("users")
//         .updateOne(
//           { _id: new mongodb.ObjectId(this._id) },
//           { $set: { cart: { items: updatedItems } } }
//         );
//     }
//   }
// }

// module.exports = User;
