const ReceiptModel = require('../models/receipt.model');
const db = require('../config/db')

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
    const { dateReceipt, invoiceId, customer, phone, email, gender, address, books, total, totalpay } = req.body;
    console.log(books);
    if (books.length === 0 || books === null) {
      return res.status(400).json({ message: 'No books to submit' });
    }

    try {
      // Check if the customer exists
      const result = await ReceiptModel.getCustomerByPhone(phone);

      // Ensure result is an array
      if (!Array.isArray(result)) {
        throw new Error('checkCustomerPhone did not return an array');
      }

      const [existingCustomer] = result;
      let customerId;


      if (existingCustomer) {
        // If customer exists, get the customerId
        customerId = existingCustomer.ID_khach_hang; // Access the property directly
      } else {
        // If customer does not exist, insert new customer
        const [result] = await db.promise().query(
          'INSERT INTO Khach_hang (Ten_khach_hang, So_dien_thoai, Gioi_tinh, Email, Dia_chi) VALUES(?, ?, ?, ?, ?)',
          [customer, phone, gender, email, address]
        );

        // Get the newly created customerId
        customerId = result.insertId;
      }
      // Save receipt info first
      // Insert a new invoice into hoadonbansach
      await db.promise().query(
        'INSERT INTO Hoa_don_ban_sach (ID_Hoa_don, ID_khach_hang, Ngay_lap_hoa_don, Tong_tien) VALUES (?, ?, ?, ?)',
        [invoiceId, customerId, dateReceipt, total] // Initialize Tong_tien to 0.00
      );

      // Save associated books into Chi_tiet_hoa_don
      await db.promise().query(
        'INSERT INTO Chi_tiet_hoa_don (ID_Chi_tiet_hoa_don, ID_Hoa_don, ID_Sach, So_luong, Don_gia, Thanh_tien) VALUES ?',
        [books.map((book, index) => [index + 1, invoiceId, book.ID_sach, book.quantity, book.Gia, book.quantity * book.Gia])] // Assuming book.price is available
      );

      // Update the stock for each book in Sach
      for (const book of books) {
        await db.promise().query(
          'UPDATE Sach SET So_luong = So_luong - ? WHERE ID_sach = ?',
          [book.quantity, book.ID_sach]
        );
      }

      // Save associated books into Chi_tiet_hoa_don
      await db.promise().query(
        'INSERT INTO Phieu_thu_tien (ID_Khach_hang, Ngay_thu_tien,So_tien) VALUES(?, ?, ?)',
        [customerId, dateReceipt, totalpay] // Assuming book.price is available
      );

      return res.status(200).json({ message: 'Receipt submitted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error submitting receipt' });
    }
  };

  static async checkCustomerPhone(req, res) {
    const { phone } = req.body;

    try {
      const rows = await ReceiptModel.getCustomerByPhone(phone);

      if (rows.length > 0) {
        const customer = rows[0];

        res.json({
          exists: true,
          id: customer.ID_khach_hang,
          name: customer.Ten_khach_hang,
          email: customer.Email,
          address: customer.Dia_chi,
          debt: customer.debt,
        });
      } else {
        res.json({ exists: false });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Database error' });
    }
  };

  // Get regulations from the database
  static async getRegulations(req, res) {
    try {
      const rows = await ReceiptModel.getRegulation();
      res.json(rows);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching regulations' });
    }
  }

  // Get customer debt based on phone number
  static async getCustomerDebt(req, res) {
    const phone = req.query.phone;
    try {
      const debt = await ReceiptModel.getCustomerDebt(phone); // Use the model method
      res.json({ debt }); // Respond with the debt amount
    } catch (error) {
      res.status(500).json({ message: 'Error fetching customer debt' });
    }
  }

  // Get remaining stock for a specific book
  static async getRemainingStock(req, res) {
    const bookId = req.query.bookId;
    try {
      const remainingStock = await ReceiptModel.getRemainingStock(bookId);
      res.json(remainingStock);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching remaining stock' });
    }
  }

};
module.exports = ReceiptController;