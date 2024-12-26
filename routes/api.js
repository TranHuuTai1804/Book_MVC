// routes/api.js
const express = require("express");
const router = express.Router();

// Import controllers
const bookController = require("../controllers/bookEmptyController");
const profileController = require("../controllers/profileController");

// Route lấy ra danh sách thông tin bảng sách
router.get("/api/books", bookController.getBooks);

// Route lấy ra thông tin bảng khách hàng
router.get("/profile", profileController.getProfiles);

module.exports = router;
