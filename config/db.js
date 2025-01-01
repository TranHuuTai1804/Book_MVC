const mysql = require("mysql2"); // Nếu bạn dùng mysql2
const dotenv = require("dotenv");

dotenv.config();

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "QLNhasach",
});

connection.connect((err) => {
  if (err) {
    console.error("Lỗi kết nối cơ sở dữ liệu:", err);
    return;
  }
  console.log("Đã kết nối tới cơ sở dữ liệu");
});

module.exports = connection;
