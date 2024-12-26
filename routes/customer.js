// routes/customerRoutes.js
const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

router.get("/customer", customerController.renderCustomerPage);
router.post("/addCustomer", customerController.addCustomer);

module.exports = router;
