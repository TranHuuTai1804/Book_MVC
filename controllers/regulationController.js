const regulationModel = require("../models/regulation");

// Cập nhật quy định trong cơ sở dữ liệu
const updateRegulation = async (req, res) => {
  const {
    min_input,
    low_inventory,
    low_customer_debt,
    stock_after_sale,
    rule,
  } = req.body;

  // Chuyển đổi rule sang số 0 hoặc 1
  const ruleBit = parseInt(rule) === 1 ? 1 : 0;

  try {
    const result = await regulationModel.updateRegulation(
      min_input,
      low_inventory,
      low_customer_debt,
      stock_after_sale,
      ruleBit
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Quy định không tồn tại!" });
    }

    res.redirect("/edit");
  } catch (err) {
    console.error("Lỗi khi cập nhật quy định:", err);
    return res.status(500).json({
      message: "Đã xảy ra lỗi khi cập nhật quy định!",
      error: err.message,
    });
  }
};

// Hiển thị trang chỉnh sửa Quy_định
const renderEditPage = (req, res) => {
  const message = req.query.message || "";

  res.render("edit", { message });
};

// Hàm lấy thông tin quy định
const getRegulations = async (req, res) => {
  try {
    const regulations = await regulationModel.getRegulations();
    res.json(regulations);
  } catch (error) {
    console.error("Lỗi khi lấy quy định:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  updateRegulation,
  renderEditPage,
  getRegulations,
};
