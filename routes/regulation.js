const express = require("express");
const router = express.Router();
const regulationController = require("../controllers/regulationController");

// Route lấy ra thông tin bảng quy định
router.get("/regulation", regulationController.getRegulations);
router.get("/edit", regulationController.renderEditPage);
router.post("/editRegulation", regulationController.updateRegulation);

module.exports = router;
