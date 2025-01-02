const bookInvoice = require("../models/bookInvoice.model");
const ReceiptModel = require("../models/receipt.model");
const db = require('../config/db')

class BookInvoiceController {
  static async renderBookInvoicePage(req, res) {
    // Lấy thông điệp nếu có từ query parameters
    const message = req.query.message || "";

    // Render view với message (nếu có)
    res.render("book-invoice", { message });
  };

  static async HandleSubmitReceipt(req, res) {
    const { customer, address, phone, email, dateReceipt, totalPaid } = req.body;
    // Validate input data
    if (!customer || !address || !phone || !email || !totalPaid) {
      return res.status(400).json({ message: 'Vui lòng điền tất cả các trường!' });
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
          'INSERT INTO Khach_hang (Ten_khach_hang, So_dien_thoai, Email, Dia_chi) VALUES(?, ?, ?, ?)',
          [customer, phone, email, address]
        );

        // Get the newly created customerId
        customerId = result.insertId;
      }

      // Save associated books into Chi_tiet_hoa_don
      await db.promise().query(
        'INSERT INTO Phieu_thu_tien (ID_Khach_hang, Ngay_thu_tien,So_tien) VALUES(?, ?, ?)',
        [customerId, dateReceipt, totalPaid] // Assuming book.price is available
      );

      return res.status(200).json({ message: 'Receipt submitted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error inserting receipt' });
    }
  };
}

module.exports = BookInvoiceController;
