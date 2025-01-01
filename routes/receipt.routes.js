const express = require("express");
const router = express.Router();
const receiptController = require("../controllers/receiptController");

router.get("/receipts", receiptController.renderReceiptPage);
router.get("/api/books/:id", receiptController.getBook);
router.post("/api/submitInfo", receiptController.submitInfo);

module.exports = router;
