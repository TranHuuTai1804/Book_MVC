const renderReportPage = (req, res) => {
  // Lấy thông điệp nếu có từ query parameters
  const message = req.query.message || "";

  // Render view với message (nếu có)
  res.render("report", { message });
};

module.exports = { renderReportPage };
