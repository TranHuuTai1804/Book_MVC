const renderStaffPage = (req, res) => {
  const message = req.query.message || "";

  res.render("staff", { message });
};

module.exports = { renderStaffPage };
