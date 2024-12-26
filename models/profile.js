// models/profile.js
const connection = require("../config/db");

const getAllProfiles = (callback) => {
  const sql = "SELECT * FROM Khach_hang";
  connection.query(sql, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

module.exports = {
  getAllProfiles,
};
