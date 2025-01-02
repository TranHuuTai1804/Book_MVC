const express = require("express");
const router = express.Router();
const bookLookUpController = require("../controllers/lookupController");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { insertBook } = require("../models/lookup");

router.get("/lookup", bookLookUpController.renderLookUpPage);

module.exports = router;

// Cấu hình multer để lưu ảnh vào thư mục 'img/'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../public/img");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath); // Lưu vào thư mục 'public/img'
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Lưu với tên gốc
  },
});

const upload = multer({ storage: storage });

// Xử lý thêm sách mới
router.post("/add-book", upload.single("image"), async (req, res) => {
  const { ten_sach, ten_tac_gia, the_loai, nam_xuat_ban, so_luong, gia, link } =
    req.body;
  const fileName = req.file ? req.file.originalname : null; // Lấy tên file ảnh

  try {
    // Chèn thông tin sách vào cơ sở dữ liệu, bao gồm tên ảnh (link) đã lưu
    const result = await insertBook(
      ten_sach,
      ten_tac_gia,
      the_loai,
      nam_xuat_ban,
      so_luong,
      gia,
      fileName // Lưu tên ảnh vào cơ sở dữ liệu
    );

    // Trả về thông báo thành công
    res.json({ success: true, message: "Book added successfully!" });
  } catch (err) {
    console.error("Error adding book:", err);
    res.json({ success: false, message: "Failed to add book." });
  }
});

module.exports = router;
