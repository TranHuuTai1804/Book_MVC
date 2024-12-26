const bookInvoice = require("../models/bookInvoice");

const renderBookInvoicePage = (req, res) => {
  // Lấy thông điệp nếu có từ query parameters
  const message = req.query.message || "";

  // Render view với message (nếu có)
  res.render("book-invoice", { message });
};

module.exports = { renderBookInvoicePage };
