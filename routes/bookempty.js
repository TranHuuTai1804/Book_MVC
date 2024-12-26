const express = require("express");
const router = express.Router();
const bookEmptyController = require("../controllers/bookEmptyController");

router.get("/bookempty", bookEmptyController.renderBookEmptyPage);
router.post("/addBook", bookEmptyController.addBook);

module.exports = router;
