const renderReceiptPage = (req, res) => {
  // Lấy thông điệp nếu có từ query parameters
  const message = req.query.message || "";

  // Render view với message (nếu có)
  res.render("receipt", { message });
};

module.exports = { renderReceiptPage };
