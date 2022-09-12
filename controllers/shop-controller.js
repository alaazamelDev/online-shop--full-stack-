const fs = require("fs");
const path = require("path");
const stripe = require("stripe")(
  "sk_test_51HMhFAA3qSFwIzsU4zELawchbaxbBbLa4yHs4Lvj2DpvY7WMMqat80EjYfqbX4fAY3PgGEBlAIRbjdD6UA8b93xP00aVSvGJvo"
);

const PDFDocument = require("pdfkit");
const Product = require("../models/product");
const Order = require("../models/order");

// Pagination constants
const ITEMS_PER_PAGE = 1;

// Index Page
exports.getHomePage = (req, res, next) => {
  // get current page index from query params
  const page = +req.query.page || 1;
  let productsCount;

  Product.find()
    .countDocuments()
    .then((count) => {
      productsCount = count;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        currentPage: page,
        hasNextPage: page * ITEMS_PER_PAGE < productsCount,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(productsCount / ITEMS_PER_PAGE),
      });
    })
    .catch((err) => {
      next(err);
    });
};

// User's Products page
exports.getProducts = (req, res, next) => {
  // get current page index from query params
  const page = +req.query.page || 1;
  let productsCount;

  Product.find()
    .countDocuments()
    .then((count) => {
      productsCount = count;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Products",
        path: "/products",
        currentPage: page,
        hasNextPage: page * ITEMS_PER_PAGE < productsCount,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(productsCount / ITEMS_PER_PAGE),
      });
    })
    .catch((err) => {
      next(err);
    });
};

// Get product by id
exports.getProductById = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => {
      const error = new Error("Server Error");
      error.httpStatusCode = 500;
      next(error);
    });
};

// Cart Page
exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      res.render("shop/cart", {
        products: user.cart.items,
        pageTitle: "My Cart",
        path: "/cart",
      });
    })
    .catch((err) => {
      const error = new Error("Server Error");
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId)
    .then((product) => {
      req.user.addToCart(product);
    })
    .then(() => {
      res.redirect("/cart");
    });
};

exports.postDeleteCartItem = (req, res, next) => {
  const productId = req.body.productId;
  req.user
    .removeFromCart(productId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error("Server Error");
      error.httpStatusCode = 500;
      next(error);
    });
};

// Orders Page
exports.getOrders = (req, res, next) => {
  Order.find({ "user._id": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        orders: orders,
        pageTitle: "Orders",
        path: "/orders",
      });
    })
    .catch((err) => {
      const error = new Error("Server Error");
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.getInvoice = (req, res, next) => {
  // return the invoice
  const orderId = req.params.orderId;

  Order.findById(orderId).then((order) => {
    if (order.user._id.toString() !== req.user._id.toString()) {
      return next(new Error("UnAuthorized"));
    }

    const invoiceName = "invoice-" + orderId + ".pdf";
    const invoicePath = path.join("data", "invoices", invoiceName);
    const pdf = new PDFDocument({ autoFirstPage: true });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="' + invoiceName + '"'
    );

    // Create a new Pdf Document
    pdf.pipe(res);
    pdf.pipe(fs.createWriteStream(invoicePath));

    // start writing
    pdf.fontSize(18).text("Order Summary");
    pdf.fontSize(18).text("_____________");

    // calculate total price:
    let totalPrice = 0;
    order.products.forEach((item) => {
      totalPrice += item.quantity * item.product.price;
      // add each product to the summary
      pdf
        .fontSize(16)
        .text(
          "Product Name: (" +
            item.product.title +
            ") ,  Quantity: (" +
            item.quantity +
            ") Unit Price: (" +
            item.product.price +
            ")"
        );
    });

    pdf.fontSize(18).text("____________________________");
    pdf.fontSize(18).text("totalPrice: ($" + totalPrice + ")");

    // close the stream
    pdf.end();
  });
};

exports.getCheckout = (req, res, next) => {
  let products;
  let total = 0;

  req.user
    .populate("cart.items.productId")
    .then((user) => {
      products = user.cart.items;

      products.forEach((product) => {
        total += product.quantity * product.productId.price;
      });

      return stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: products.map((p) => {
          return {
            name: p.productId.title,
            description: p.productId.description,
            amount: p.productId.price * 100,
            currency: "usd",
            quantity: p.quantity,
          };
        }),
        success_url:
          req.protocol + "://" + req.get("host") + "/checkout/success", // http://localhost:3000/checkout/success
        cancel_url: req.protocol + "://" + req.get("host") + "/checkout/cancel", // http://localhost:3000/checkout/cancel
      });
    })
    .then((session) => {
      res.render("shop/checkout", {
        products: products,
        pageTitle: "Checkout",
        path: "/checkout",
        totalPrice: total,
        sessionId: session.id,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCheckoutSuccess = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((pro) => {
        return {
          quantity: pro.quantity,
          product: { ...pro.productId._doc },
        };
      });
      const order = new Order({
        user: req.user,
        products: products,
      });
      return order.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      const error = new Error("Server Error");
      error.httpStatusCode = 500;
      next(error);
    });
};
