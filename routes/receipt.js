const express = require("express");
const router = express.Router();
const receiptController = require("../controllers/receiptController");

router.get("/receipts", receiptController.renderReceiptPage);

module.exports = router;
