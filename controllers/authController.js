// controllers/authController.js
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");

// Đăng nhập
const login = (req, res) => {
  const { email, password } = req.body;

  userModel.getUserByEmail(email, (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.redirect(
        "/?message=" + encodeURIComponent("Lỗi hệ thống. Vui lòng thử lại sau.")
      );
    }

    if (results.length === 0) {
      return res.redirect(
        "/?message=" + encodeURIComponent("Email không tồn tại.")
      );
    }

    const user = results[0];

    if (user.status !== "active") {
      return res.redirect(
        "/?message=" +
          encodeURIComponent(
            "Tài khoản của bạn đang bị khóa hoặc không hoạt động."
          )
      );
    }

    if (bcrypt.compareSync(password, user.password)) {
      req.session.user = { id: user.id, email: user.email };
      return res.redirect(
        "/home?message=" + encodeURIComponent("Đăng nhập thành công!")
      );
    } else {
      return res.redirect(
        "/?message=" + encodeURIComponent("Mật khẩu không chính xác.")
      );
    }
  });
};

// Đăng ký
const signup = (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.redirect(
      "/signup?message=" +
        encodeURIComponent("Mật khẩu và xác nhận mật khẩu không khớp.")
    );
  }

  userModel.getUserByEmail(email, (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.redirect(
        "/signup?message=" +
          encodeURIComponent("Lỗi hệ thống. Vui lòng thử lại sau.")
      );
    }

    if (results.length > 0) {
      return res.redirect(
        "/signup?message=" + encodeURIComponent("Email đã tồn tại.")
      );
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    userModel.createUser(email, hashedPassword, (err) => {
      if (err) {
        console.error("Lỗi khi thêm người dùng:", err);
        return res.redirect(
          "/signup?message=" +
            encodeURIComponent("Lỗi hệ thống. Vui lòng thử lại sau.")
        );
      }

      res.redirect(
        "/home?message=" + encodeURIComponent("Đăng ký thành công!")
      );
    });
  });
};

// Đăng xuất
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect(
        "/home?message=" +
          encodeURIComponent("Lỗi hệ thống khi đăng xuất. Vui lòng thử lại.")
      );
    }
    res.redirect("/?message=" + encodeURIComponent("Đăng xuất thành công!"));
  });
};

module.exports = {
  login,
  signup,
  logout,
};
