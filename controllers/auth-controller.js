const bcrypt = require("bcryptjs");

const User = require("../models/user");

// /login => GET
exports.getLogin = (req, res, next) => {
  console.log(req.session);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
  });
};

// /login => POST
exports.postLogin = (req, res, next) => {
  // extract user's credentials
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        // user is found, validate password
        return res.redirect("/login"); // email is incorrect
      }
      bcrypt.compare(password, user.password).then((doMatch) => {
        if (doMatch) {
          // password matched
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save((err) => {
            res.redirect("/");
          });
        }
        // password is incorrect
        res.redirect("/login");
      });
    })
    .catch((err) => {
      console.log(err);
      // in any error case,
      // redirect to the same page
      res.redirect("/login");
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
