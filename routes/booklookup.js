const express = require("express");
const router = express.Router();
const bookLookUpController = require("../controllers/lookupController");

router.get("/lookup", bookLookUpController.renderLookUpPage);

module.exports = router;
