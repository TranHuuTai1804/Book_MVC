// controllers/authController.js
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");

// Đăng nhập
const login = (req, res) => {
  const { email, password } = req.body;

  userModel.getUserByEmail(email, (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.status(500).send("Lỗi hệ thống.");
    }

    if (results.length === 0) {
      return res.status(404).send("Email không tồn tại.");
    }

    const user = results[0];

    if (user.status !== "active") {
      return res
        .status(403)
        .send("Tài khoản của bạn đang bị khóa hoặc không hoạt động.");
    }

    if (bcrypt.compareSync(password, user.password)) {
      req.session.user = { id: user.id, email: user.email };
      return res.redirect("/home");
    } else {
      return res.status(401).send("Mật khẩu không chính xác.");
    }
  });
};

// Đăng ký
const signup = (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).send("Mật khẩu và xác nhận mật khẩu không khớp.");
  }

  userModel.getUserByEmail(email, (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.status(500).send("Lỗi hệ thống.");
    }

    if (results.length > 0) {
      return res.status(409).send("Email đã tồn tại.");
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    userModel.createUser(email, hashedPassword, (err) => {
      if (err) {
        console.error("Lỗi khi thêm người dùng:", err);
        return res.status(500).send("Lỗi hệ thống.");
      }

      res.redirect("/home");
    });
  });
};

// Đăng xuất
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Lỗi hệ thống khi đăng xuất.");
    }
    res.redirect("/"); // Trở về trang đăng nhập sau khi đăng xuất
  });
};

module.exports = {
  login,
  signup,
  logout,
};
