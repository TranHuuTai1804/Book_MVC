// Hàm hiển thị trang home
const homePage = (req, res) => {
  // Kiểm tra session của người dùng
  console.log(req.session); // Kiểm tra session để xác minh người dùng đã đăng nhập hay chưa
  if (!req.session.user) {
    return res.redirect("/"); // Nếu chưa đăng nhập, chuyển hướng về trang đăng nhập
  }

  res.render("home"); // Render trang home.ejs
};

module.exports = {
  homePage,
};
