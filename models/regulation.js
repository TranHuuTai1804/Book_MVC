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

// Cập nhật thông tin quy định trong cơ sở dữ liệu
const updateRegulation = async (
  min_input,
  low_inventory,
  low_customer_debt,
  stock_after_sale,
  ruleBit
) => {
  const updateQuery = `
    UPDATE Quy_dinh SET
      So_luong_nhap_it_nhat = ?,
      So_luong_ton_it_hon = ?,
      Khach_hang_no_khong_qua = ?,
      So_luong_ton_sau_khi_ban_it_nhat = ?,
      Su_Dung_QD4 = ?
  `;

  const result = await runQuery(updateQuery, [
    min_input,
    low_inventory,
    low_customer_debt,
    stock_after_sale,
    ruleBit,
  ]);
  return result; // Trả về kết quả sau khi cập nhật
};

// Lấy thông tin quy định
const getRegulations = async () => {
  const sql = "SELECT * FROM Quy_dinh";
  const regulations = await runQuery(sql);
  return regulations;
};

module.exports = {
  getRegulations,
  updateRegulation,
};
