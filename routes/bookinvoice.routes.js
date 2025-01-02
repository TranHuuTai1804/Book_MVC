const express = require("express");
const router = express.Router();
const bookInvoiceController = require("../controllers/bookInvoiceController");

router.get("/bookinvoice", bookInvoiceController.renderBookInvoicePage);
router.post("/api/receipts/submit", bookInvoiceController.HandleSubmitReceipt);

module.exports = router;
