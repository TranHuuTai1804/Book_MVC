const connection = require("../config/db");
const diacritics = require("diacritics");

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

function removeVietnameseTones(str) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str.replace(/ + /g, " ");
  str = str.trim();
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    " "
  );
  return str;
}
// Hàm chuyển đổi tên sách thành URL hình ảnh
const formatBookTitleToImageUrl = (bookTitle) => {
  // Loại bỏ dấu tiếng Việt
  const normalizedTitle = removeVietnameseTones(bookTitle);
  // Thay thế khoảng trắng và ký tự không phải chữ cái hoặc số bằng dấu gạch dưới
  return `${normalizedTitle.replace(/[^a-zA-Z0-9]+/g, "_")}.jpg`;
};

// Thêm sách mới vào cơ sở dữ liệu
const addNewBook = async (book) => {
  try {
    // Lấy ID_sach lớn nhất
    const maxIdResult = await runQuery(
      `SELECT MAX(ID_sach) AS max_id FROM Sach`
    );
    const newId = maxIdResult[0]?.max_id ? maxIdResult[0].max_id + 1 : 1;

    // Tạo link từ tên sách
    const link = formatBookTitleToImageUrl(book.name);

    // Thêm sách mới vào cơ sở dữ liệu
    const sql = `INSERT INTO Sach (ID_sach, Ten_sach, The_loai, Ten_tac_gia, So_luong, Gia, Link)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
    await runQuery(sql, [
      newId,
      book.name,
      book.category,
      book.author,
      book.quantity,
      book.price,
      link,
    ]);

    console.log(`Thêm sách mới thành công với ID: ${newId}`);
    return newId;
  } catch (error) {
    console.error("Lỗi khi thêm sách mới:", error.message);
    throw error;
  }
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
