const express = require("express");
const { check, body } = require("express-validator");

const router = express.Router();
const authController = require("../controllers/auth-controller");
const User = require("../models/user");

router.get("/login", authController.getLogin);

router.post(
  "/login",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email address"),
    body("password")
      .isLength({ min: 8 })
      .trim()
      .withMessage("it has to have a minimum length of 8 charachters"),
  ],
  authController.postLogin
);

router.get("/sign-up", authController.getSignUp);

router.post(
  "/sign-up",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .custom(async (userEmail, {}) => {
        const user = await User.findOne({ email: userEmail });
        if (user) {
          // email is already exists
          return Promise.reject(
            "Email is already exists, please choose another one"
          );
        }
        return true;
      }),
    body("password")
      .isLength({ min: 8 })
      .trim()
      .withMessage(
        "your password is weak, as it has to have a minimum length of 8 charachters"
      ),
    body("confirmPassword").custom((value, { req }) => {
      const password = req.body.password;
      if (value !== password) {
        throw Error("Password is not matching");
      }
      return true;
    }),
  ],
  authController.postSignUp
);

router.post("/logout", authController.postLogout);

router.get("/reset-password", authController.getResetPassword);

router.post("/reset-password", authController.postResetPassword);

router.get("/reset-password/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
