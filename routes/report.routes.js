const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");

router.get("/report", reportController.renderReportPage);
router.get('/report/inventory',reportController.inventoryReport);
router.get('/report/debt',reportController.debtReport);

module.exports = router;
