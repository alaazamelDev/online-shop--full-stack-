const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

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
        req.flash("error", "Invalid Login Cridentials");
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
        req.flash("error", "Wrong Password!");
        res.redirect("/login");
      });
    })
    .catch((err) => {
      console.log(err);
      // in any error case,
      // redirect to the same page
      req.flash("error", "Unexpected error occurred");
      res.redirect("/login");
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
        req.flash("error", "Email is already exists, please login");
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
          return transporter.sendMail({
            to: email,
            from: "alaa.zamel23@gmail.com",
            replyTo: "alaa.zamel23@gmail.com",
            subject: "Signing Up succeeded!",
            html: "<h1>Thanks for signing up in our store!</h1>",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .then((result) => {
      console.log("E-Mail sent successfully");
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
      console.log(err);
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
      console.log(err);
      res.redirect("/");
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
      console.log(err);
    });
};
