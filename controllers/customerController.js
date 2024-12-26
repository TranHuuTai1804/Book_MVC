const customerModel = require("../models/customer");

const renderCustomerPage = (req, res) => {
  // Lấy thông điệp nếu có từ query parameters
  const message = req.query.message || "";

  // Render view với message (nếu có)
  res.render("customer", { message });
};

const addCustomer = async (req, res) => {
  try {
    const { name, phone, address, email, gender } = req.body;

    // Tạo đối tượng khách hàng từ thông tin nhận được
    const customer = { name, phone, address, email, gender };

    // Thêm khách hàng mới vào cơ sở dữ liệu
    await customerModel.addCustomer(customer);

    // Lấy danh sách khách hàng mới và render lại
    const customers = await customerModel.getAllCustomers();
    res.redirect("/customer"); // Hoặc có thể trả về JSON với danh sách khách hàng
  } catch (error) {
    console.error("Error adding customer:", error);
    res.status(500).send("Server error");
  }
};

module.exports = {
  renderCustomerPage,
  addCustomer,
};
