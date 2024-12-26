// models/userModel.js
const connection = require("../config/db");

const getUserByEmail = (email, callback) => {
  connection.query(
    "SELECT id, password, status FROM users WHERE email = ?",
    [email],
    callback
  );
};

const createUser = (email, hashedPassword, callback) => {
  connection.query(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, hashedPassword],
    callback
  );
};

module.exports = {
  getUserByEmail,
  createUser,
};
