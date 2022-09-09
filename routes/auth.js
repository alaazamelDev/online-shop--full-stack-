const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth-controller");

router.get("/login", authController.getLogin);

router.post("/login", authController.postLogin);

router.get("/sign-up", authController.getSignUp);

router.post("/sign-up", authController.postSignUp);

router.post("/logout", authController.postLogout);

router.get("/reset-password", authController.getResetPassword);

router.post("/reset-password", authController.postResetPassword);

router.get("/reset-password/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
