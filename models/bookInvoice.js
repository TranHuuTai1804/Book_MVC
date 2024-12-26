const connection = require("../config/db");

// Lấy tất cả sách
const getAllBooks = (callback) => {
  const sql = "SELECT * FROM Sach";
  connection.query(sql, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

module.exports = {
  getAllBooks,
};
