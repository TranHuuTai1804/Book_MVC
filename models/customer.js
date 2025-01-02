const connection = require("../config/db");

// Tạo hàm query
function runQuery(sql, params) {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, results) => {
      if (err) {
        return reject(err); // Trả về lỗi nếu có
      }
      resolve(results); // Trả về kết quả truy vấn
    });
  });
}

// Lấy ID khách hàng lớn nhất
const getMaxCustomerId = async () => {
  const sql = "SELECT MAX(ID_khach_hang) AS max_id FROM Khach_hang";
  const [result] = await runQuery(sql);
  return result.max_id || 0; // Nếu không có ID, trả về 0
};

// Thêm khách hàng mới vào cơ sở dữ liệu
const addCustomer = async (customer) => {
  const newId = (await getMaxCustomerId()) + 1;

  const sql = `INSERT INTO Khach_hang (ID_khach_hang, Ten_khach_hang, So_dien_thoai, Dia_chi, Email, Gioi_tinh, Tien_no)
               VALUES (?, ?, ?, ?, ?, ?, ?)`;
  await runQuery(sql, [
    newId,
    customer.name,
    customer.phone,
    customer.address,
    customer.email,
    customer.gender,
    0,
  ]);
  return newId;
};

// Lấy tất cả khách hàng
const getAllCustomers = async () => {
  const sql = "SELECT * FROM Khach_hang";
  const customers = await runQuery(sql);
  return customers;
};

module.exports = {
  addCustomer,
  getAllCustomers,
};
