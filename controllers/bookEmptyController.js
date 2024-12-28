// controllers/bookController.js
const bookEmpty = require("../models/bookEmpty");

const renderBookEmptyPage = (req, res) => {
  // Lấy thông điệp nếu có từ query parameters
  const message = req.query.message || "";

  // Render view với message (nếu có)
  res.render("book-empty", { message });
};

const getBooks = (req, res) => {
  bookEmpty.getAllBooks((err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

const addBook = async (req, res) => {
  try {
    // Lấy quy định từ bảng Quy_dinh
    const regulation = await bookEmpty.getRegulation();

    if (!regulation) {
      return res.redirect(
        "/bookempty?message=" +
          encodeURIComponent(
            "Không tìm thấy quy định về số lượng tồn tối thiểu."
          )
      );
    }

    const suDungQD4Buffer = regulation.Su_Dung_QD4;
    if (!Buffer.isBuffer(suDungQD4Buffer)) {
      return res.redirect(
        "/bookempty?message=" +
          encodeURIComponent(
            "Error: Su_Dung_QD4 không phải là một Buffer hợp lệ."
          )
      );
    }

    const suDungQD4Value = suDungQD4Buffer.readUInt8(0);
    const suDungQD4Number = Number(suDungQD4Value);
    const minStockLimit =
      suDungQD4Number !== 0 ? regulation.So_luong_ton_it_hon : null;
    const minImportQuantity =
      suDungQD4Number !== 0 ? regulation.So_luong_nhap_it_nhat : null;

    // Tạo danh sách sách từ req.body
    const books = req.body.id.map((id, index) => ({
      id,
      name: req.body.name[index],
      category: req.body.category[index],
      author: req.body.author[index],
      quantity: parseInt(req.body.quantity[index], 10),
      price: parseFloat(req.body.price[index]),
      img: req.body.img[index], // Thêm URL hình ảnh
    }));

    for (const book of books) {
      const rows = await bookEmpty.findBook(book);

      let id_sach;

      if (rows.length > 0) {
        const currentQuantity = parseInt(rows[0].So_luong, 10);
        const newQuantity = currentQuantity + book.quantity;

        if (minStockLimit !== null && newQuantity > minStockLimit) {
          return res.redirect(
            `/bookempty?message=${encodeURIComponent(
              `Số lượng tồn của sách "${book.name}" vượt quá số lượng tối đa cho phép (${minStockLimit}).`
            )}`
          );
        }

        // Cập nhật số lượng sách
        await Book.updateBookQuantity(rows[0].ID_sach, newQuantity);
        id_sach = rows[0].ID_sach;
      } else {
        if (minStockLimit !== null && book.quantity > minStockLimit) {
          return res.redirect(
            `/bookempty?message=${encodeURIComponent(
              `Số lượng tồn của sách mới "${book.name}" vượt quá số lượng tối đa cho phép (${minStockLimit}).`
            )}`
          );
        }

        // Thêm sách mới
        id_sach = await Book.addNewBook(book);
      }

      // Lấy ID phiếu nhập lớn nhất và tạo mới
      const maxPhieuId = await bookEmpty.getMaxImportInvoiceId();
      const newPhieuId = maxPhieuId + 1;

      // Thêm phiếu nhập và chi tiết phiếu nhập
      const invoiceId = await bookEmpty.addImportInvoice(
        newPhieuId,
        book.quantity,
        id_sach
      );
      await Book.addImportInvoiceDetail(invoiceId, id_sach, book.quantity);
    }

    res.redirect(
      "/bookempty?message=" + encodeURIComponent("Book added successfully!")
    );
  } catch (error) {
    console.error("Error in addBook:", error);
    res.redirect(
      "/bookempty?message=" + encodeURIComponent("Error processing books")
    );
  }
};

module.exports = {
  renderBookEmptyPage,
  getBooks,
  addBook,
};
