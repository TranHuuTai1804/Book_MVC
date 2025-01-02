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

// Thêm sách vào cơ sở dữ liệu
const insertBook = async (
  ten_sach_,
  ten_tac_gia_,
  the_loai_,
  nam_xuat_ban_,
  so_luong_,
  gia_,
  link_
) => {
  const insertQuery = `
    INSERT INTO sach (
      Ten_sach, 
      Ten_tac_gia, 
      The_loai, 
      Nam_xuat_ban, 
      So_luong, 
      Gia, 
      Link
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    const result = await runQuery(insertQuery, [
      ten_sach_,
      ten_tac_gia_,
      the_loai_,
      nam_xuat_ban_,
      so_luong_,
      gia_,
      link_, // Link là tên file ảnh
    ]);
    console.log(result); // In ra kết quả
    return result; // Trả về kết quả sau khi insert
  } catch (err) {
    console.error("Error inserting book:", err);
    throw err; // Nếu có lỗi, ném ra ngoài
  }
};

module.exports = {
  insertBook,
};
