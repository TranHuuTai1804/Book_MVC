const connection = require("../config/db");

class BookInvoiceModel {
  static async getAllBooks(callback) {
    const sql = "SELECT * FROM Sach";
    connection.query(sql, (err, results) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, results);
      }
    });
  };
  static async createReceipt(req, res){
    
  

    db.execute(sql, values, (err, results) => {
        if (err) {
            console.error('Error inserting receipt:', err);
            return res.status(500).json({ message: 'Có lỗi xảy ra. Vui lòng thử lại.' });
        }
        res.status(201).json({ message: 'Thông tin đã được gửi thành công!', data: results });
    });
};
}

module.exports = BookInvoiceModel;
