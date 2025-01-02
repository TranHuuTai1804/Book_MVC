const express = require("express");
const router = express.Router();
const receiptController = require("../controllers/receiptController");

router.get("/receipts", receiptController.renderReceiptPage);
router.get("/api/books/:id", receiptController.getBook);
router.post("/api/submitInfo", receiptController.submitInfo);
router.post("/check-customer", receiptController.checkCustomerPhone);
// Route to get regulations
router.get('/api/getRegulations', receiptController.getRegulations);

// Route to get customer debt
router.get('/api/getCustomerDebt', receiptController.getCustomerDebt);

// Route to get remaining stock
router.get('/api/getRemainingStock', receiptController.getRemainingStock);

module.exports = router;
