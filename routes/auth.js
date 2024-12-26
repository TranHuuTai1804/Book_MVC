// routes/auth.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Trang đăng nhập (GET)
router.get("/", (req, res) => {
  res.render("sign-in");
});

// Route đăng nhập (POST)
router.post("/login", authController.login);

// Route đăng ký (GET)
router.get("/signup", (req, res) => {
  res.render("sign-up");
});

// Route đăng ký (POST)
router.post("/signup", authController.signup);

// Route đăng xuất
router.get("/logout", authController.logout);

module.exports = router;
