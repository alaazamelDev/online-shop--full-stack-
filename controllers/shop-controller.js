const Product = require("../models/product");

// Index Page
exports.getHomePage = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

// User's Products page
exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Products",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

// Get product by id
exports.getProductById = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      console.log(product);
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

// // Cart Page
// exports.getCart = (req, res, next) => {
//   req.user
//     .getCart()
//     .then((userCart) => {
//       userCart
//         .getProducts()
//         .then((userProducts) => {
//           res.render("shop/cart", {
//             products: userProducts,
//             pageTitle: "My Cart",
//             path: "/cart",
//           });
//         })
//         .catch((err) => console.log(err));
//     })
//     .catch((err) => console.log(err));
// };

// exports.postCart = (req, res, next) => {
//   const productId = req.body.productId;
//   let newQuantity = 1;
//   let fetchedCart;

//   // add the product to the cart
//   req.user
//     .getCart()
//     .then((cart) => {
//       fetchedCart = cart;
//       return cart.getProducts({ where: { id: productId } });
//     })
//     .then((products) => {
//       let product;
//       if (products.length > 0) {
//         product = products[0];
//       }
//       if (product) {
//         // product already in cart
//         const oldQuantity = product.cartItem.quantity;
//         newQuantity = oldQuantity + 1;
//         return product;
//       }
//       return Product.findByPk(productId);
//     })
//     .then((product) => {
//       // add product to cart as new product
//       return fetchedCart.addProduct(product, {
//         through: { quantity: newQuantity },
//       });
//     })
//     .then(() => {
//       res.redirect("/cart");
//     })
//     .catch((err) => console.log(err));
// };

// // Checkout Page
// exports.getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     pageTitle: "Checkout",
//     path: "/checkout",
//   });
// };

// exports.postDeleteCartItem = (req, res, next) => {
//   const productId = req.body.productId;
//   req.user
//     .getCart()
//     .then((cart) => {
//       return cart.getProducts({ where: { id: productId } });
//     })
//     .then((products) => {
//       const product = products[0];
//       return product.cartItem.destroy();
//     })
//     .then(() => {
//       res.redirect("/cart");
//     })
//     .catch((err) => console.log(err));
// };

// // Orders Page
// exports.getOrders = (req, res, next) => {
//   req.user
//     .getOrders({ include: ["products"] })
//     .then((orders) => {
//       res.render("shop/orders", {
//         orders: orders,
//         pageTitle: "Orders",
//         path: "/orders",
//       });
//     })
//     .catch((err) => console.log(err));
// };

// exports.postOrder = (req, res, next) => {
//   let fetchedCart;
//   req.user
//     .getCart()
//     .then((cart) => {
//       fetchedCart = cart;
//       return cart.getProducts();
//     })
//     // products inside of the cart
//     .then((products) => {
//       return req.user
//         .createOrder()
//         .then((order) => {
//           order.addProducts(
//             products.map((product) => {
//               product.orderItem = {
//                 quantity: product.cartItem.quantity,
//               };
//               return product;
//             })
//           );
//         })
//         .then((result) => {
//           fetchedCart.setProducts(null); // empty the cart
//           res.redirect("/orders");
//         })
//         .catch((err) => console.log(err));
//     })
//     .catch((err) => console.log(err));
// };
