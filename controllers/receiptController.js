const ReceiptModel = require('../models/receipt.model');

class ReceiptController {
  static async renderReceiptPage(req, res) {
    // Lấy thông điệp nếu có từ query parameters
    const message = req.query.message || "";

    // Get the next invoice ID
    const nextInvoiceId = await ReceiptModel.getNextInvoiceId(); // Replace with your actual model

    // Render view với message và nextInvoiceId
    res.render("receipt", { message, nextInvoiceId });
  };

  static async getBook(req, res) {
    const { id } = req.params;
    try {
      const book = await ReceiptModel.findById(id);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
      res.json(book);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  static async submitInfo(req, res) {
    const { dateReceipt, invoiceId, customerId, customer, phone, email, address, books, total } = req.body;
    console.log(books);
    // if (books.length === 0 || books === null) {
    //   return res.status(400).json({ message: 'No books to submit' });
    // }

    // try {
    //   // Assuming you have a function to save the receipt and books to the database
    //   // Save receipt info first
    //   // Insert a new invoice into hoadonbansach
    //   await db.promise().query(
    //     'INSERT INTO Hoa_don_ban_sach (ID_Hoa_don, ID_khach_hang, Ngay_lap_hoa_don, Tong_tien) VALUES (?, ?, ?, ?)',
    //     [invoiceId, customerId, dateReceipt, total] // Initialize Tong_tien to 0.00
    //   );

    //   // Save associated books into Chi_tiet_hoa_don
    //   await db.promise().query(
    //     'INSERT INTO Chi_tiet_hoa_don (ID_Hoa_don, ID_Sach, So_luong, Don_gia, Thanh_tien) VALUES ?',
    //     [books.map(book => [invoiceId, book.ID_sach, book.quantity, book.price, book.quantity * book.price])] // Assuming book.price is available
    //   );

    //   return res.status(200).json({ message: 'Receipt submitted successfully' });
    // } catch (error) {
    //   console.error(error);
    //   return res.status(500).json({ message: 'Error submitting receipt' });
    // }
  };
}

module.exports = ReceiptController;