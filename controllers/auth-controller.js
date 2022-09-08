const bcrypt = require("bcryptjs");

const User = require("../models/user");

// /login => GET
exports.getLogin = (req, res, next) => {
  console.log(req.session);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.session.isLoggedIn,
  });
};

// /login => POST
exports.postLogin = (req, res, next) => {
  req.session.isLoggedIn = true;
  console.log("Object: ", req.user);
  req.session.user = req.user;
  req.session.save((err) => {
    res.redirect("/");
  });
};

// /sign-up => GET
exports.getSignUp = (req, res, next) => {
  console.log(req.session);
  res.render("auth/sign-up", {
    path: "/sign-up",
    pageTitle: "SignUp",
    isAuthenticated: false,
  });
};

// /sign-up => POST
exports.postSignUp = (req, res, next) => {
  // extract user credentials
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  // find if the user is already exists
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        return res.redirect("/sign-up");
      }
      // Encrypt Password
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            name: name,
            email: email,
            password: hashedPassword,
            cart: {
              items: [],
            },
          });
          return user.save();
        })
        .then((result) => {
          res.redirect("/login");
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
};
