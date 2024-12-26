const renderLookUpPage = (req, res) => {
  // Lấy thông điệp nếu có từ query parameters
  const message = req.query.message || "";

  // Render view với message (nếu có)
  res.render("book-lookup", { message });
};

module.exports = { renderLookUpPage };
