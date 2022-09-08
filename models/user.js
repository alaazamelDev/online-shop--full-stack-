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
  password: {
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
