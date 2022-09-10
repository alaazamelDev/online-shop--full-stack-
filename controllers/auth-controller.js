const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

// add validation
const { validationResult } = require("express-validator");

const User = require("../models/user");
const configs = require("../configs/configs");

// Initialize nodemailer
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: configs.sendGridApiKey,
    },
  })
);

// /login => GET
exports.getLogin = (req, res, next) => {
  const messages = req.flash("error");
  let message;
  if (messages.length > 0) {
    message = messages[0];
  } else {
    message = null;
  }
  console.log(req.session);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
    validationErrors: [],
    oldInput: {
      email: "",
      password: "",
    },
  });
};

// /login => POST
exports.postLogin = (req, res, next) => {
  // extract user's credentials
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
      oldInput: {
        email: email,
        password: password,
      },
    });
  }
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        // user is found, validate password
        return res.render("auth/login", {
          path: "/login",
          pageTitle: "Login",
          errorMessage: "Invalid Login Cridentials!",
          validationErrors: errors.array(),
          oldInput: {
            email: email,
            password: password,
          },
        }); // email is incorrect
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
        return res.render("auth/login", {
          path: "/login",
          pageTitle: "Login",
          errorMessage: "Wrong Password!",
          validationErrors: errors.array(),
          oldInput: {
            email: email,
            password: password,
          },
        });
      });
    })
    .catch((err) => {
      console.log(err);
      // in any error case,
      // redirect to the same page
      return res.render("auth/login", {
        path: "/login",
        pageTitle: "Login",
        errorMessage: "Unexpected error occurred!",
        validationErrors: errors.array(),
        oldInput: {
          email: email,
          password: password,
        },
      });
    });
};

// /sign-up => GET
exports.getSignUp = (req, res, next) => {
  const messages = req.flash("error");
  let message;
  if (messages.length > 0) {
    message = messages[0];
  } else {
    message = null;
  }
  res.render("auth/sign-up", {
    path: "/sign-up",
    pageTitle: "SignUp",
    errorMessage: message,
    oldInput: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationErrors: [],
  });
};

// /sign-up => POST
exports.postSignUp = (req, res, next) => {
  // extract user credentials
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  // handle thrown errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // print the errors
    console.log(errors.array());
    return res.status(422).render("auth/sign-up", {
      path: "/sign-up",
      pageTitle: "SignUp",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        name: name,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      },
      validationErrors: errors.array(),
    });
  }
  // Encrypt Password
  bcrypt
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
      // send welocming mail to user email
      return transporter.sendMail({
        to: email,
        from: "alaa.zamel23@gmail.com",
        replyTo: "alaa.zamel23@gmail.com",
        subject: "Signing Up succeeded!",
        html: "<h1>Thanks for signing up in our store!</h1>",
      });
    })
    .catch((err) => {
      const error = new Error("Server Error");
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
};

// /login => GET
exports.getResetPassword = (req, res, next) => {
  const messages = req.flash("error");
  let message;
  if (messages.length > 0) {
    message = messages[0];
  } else {
    message = null;
  }
  res.render("auth/reset-password", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message,
  });
};

exports.postResetPassword = (req, res, next) => {
  // send reset password link to the user's email
  const email = req.body.email;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Email doesn't match any record in our system");
        return res.redirect("/reset-password");
      }
      // reset process
      crypto.randomBytes(32, (err, buffer) => {
        if (err) {
          req.flash("error", "Unexpected error occurred, try agian!");
          return res.redirect("/reset-password");
        }
        const token = buffer.toString("hex"); // token has to store in
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600 * Math.pow(10, 3);
        return user.save().then((user) => {
          // after user has been saved and assigned a reset Token
          // send the token with email
          res.redirect("/"); // go to home page
          transporter.sendMail({
            to: user.email,
            from: "alaa.zamel23@gmail.com",
            replyTo: "alaa.zamel23@gmail.com",
            subject: "Reset Password!",
            html: `
            <h1>Reset you password</h1>
            <p>you have requested to reset your account's pasword, So, to reset
            your password please click on the link below
            </p>
            <h5 align="center"><a href="http://localhost:3000/reset-password/${token}">Reset Password</a></h5>
            `,
          });
        });
      });
    })
    .catch((err) => {
      const error = new Error("Server Error");
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      if (user) {
        // token is valid, redirect to reset password page
        const messages = req.flash("error");
        let message;
        if (messages.length > 0) {
          message = messages[0];
        } else {
          message = null;
        }
        res.render("auth/new-password", {
          path: "/new-password",
          pageTitle: "New Password",
          errorMessage: message,
          userId: user._id.toString(),
          resetPasswordToken: token,
        });
      }
      // token has been modified or expired
    })
    .catch((err) => {
      const error = new Error("Server Error");
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const userId = req.body.userId;
  const resetPasswordToken = req.body.resetPasswordToken;

  User.findOne({
    resetToken: resetPasswordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      console.log("user ", user);
      if (user) {
        // hash the new password
        bcrypt.hash(newPassword, 12).then((hashedPassword) => {
          user.password = hashedPassword;
          user.resetToken = null;
          user.resetTokenExpiration = undefined;
          return user.save();
        });
      }
    })
    .then((user) => {
      res.redirect("/login");
    })
    .catch((err) => {
      const error = new Error("Server Error");
      error.httpStatusCode = 500;
      next(error);
    });
};
