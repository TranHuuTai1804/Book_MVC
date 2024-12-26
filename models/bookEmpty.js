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

// Lấy quy định về sách
const getRegulation = async () => {
  const sql =
    "SELECT Su_Dung_QD4, So_luong_ton_it_hon, So_luong_nhap_it_nhat FROM Quy_dinh";
  const [regulation] = await runQuery(sql);
  return regulation;
};

// Kiểm tra sách có tồn tại trong cơ sở dữ liệu không
const findBook = async (book) => {
  const sql = `SELECT ID_sach, So_luong FROM Sach WHERE Ten_sach = ? AND The_loai = ? AND Ten_tac_gia = ?`;
  const rows = await runQuery(sql, [book.name, book.category, book.author]);
  return rows;
};

// Cập nhật số lượng sách
const updateBookQuantity = async (id_sach, newQuantity) => {
  const sql = `UPDATE Sach SET So_luong = ? WHERE ID_sach = ?`;
  await runQuery(sql, [newQuantity, id_sach]);
};

// Thêm sách mới vào cơ sở dữ liệu
const addNewBook = async (book) => {
  const maxIdResult = await runQuery(`SELECT MAX(ID_sach) AS max_id FROM Sach`);
  const newId = maxIdResult[0].max_id ? maxIdResult[0].max_id + 1 : 1;

  const sql = `INSERT INTO Sach (ID_sach, Ten_sach, The_loai, Ten_tac_gia, So_luong, Gia)
               VALUES (?, ?, ?, ?, ?, ?)`;
  await runQuery(sql, [
    newId,
    book.name,
    book.category,
    book.author,
    book.quantity,
    book.price,
  ]);
  return newId;
};

// Lấy ID sách lớn nhất
const getMaxBookId = async () => {
  const sql = `SELECT MAX(ID_sach) AS max_book_id FROM Sach`;
  const [result] = await runQuery(sql);
  return result.max_book_id || 0; // Nếu không có ID, trả về 0.
};

// Thêm phiếu nhập sách
const addImportInvoice = async (newPhieuId, quantity, id_sach) => {
  const sql = `INSERT INTO phieu_nhap_sach (ID_Phieu, Ngay_nhap, Tong_so_luong, ID_sach) VALUES (?, NOW(), ?, ?)`;
  const insertPhieuResult = await runQuery(sql, [
    newPhieuId,
    quantity,
    id_sach,
  ]);
  return insertPhieuResult.insertId; // Trả về ID của phiếu nhập vừa thêm
};

// Thêm chi tiết phiếu nhập sách
const addImportInvoiceDetail = async (id_phieu, id_sach, quantity) => {
  const sql = `INSERT INTO Chi_tiet_phieu_nhap_sach (ID_Phieu, ID_Sach, So_luong) VALUES (?, ?, ?)`;
  await runQuery(sql, [id_phieu, id_sach, quantity]);
};

// Lấy ID phiếu nhập lớn nhất
const getMaxImportInvoiceId = async () => {
  const sql = `SELECT MAX(ID_Phieu) AS max_phieu_id FROM phieu_nhap_sach`;
  const [result] = await runQuery(sql);
  return result.max_phieu_id || 0; // Nếu không có ID, trả về 0.
};

module.exports = {
  getAllBooks,
  getMaxBookId,
  getRegulation,
  findBook,
  updateBookQuantity,
  addNewBook,
  addImportInvoice,
  addImportInvoiceDetail,
  getMaxImportInvoiceId,
};
