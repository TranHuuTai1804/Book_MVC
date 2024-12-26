// routes/home.js
const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");

// Route trang Home
router.get("/home", homeController.homePage); // Sử dụng controller để xử lý yêu cầu

module.exports = router;
