const ReportModel = require('../models/report.model')

class ReportController {
  static async renderReportPage(req, res) {
    // Lấy thông điệp nếu có từ query parameters
    const message = req.query.message || "";

    // Render view với message (nếu có)
    res.render("report", { message });
  };
  static async inventoryReport(req, res) {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Ngày không được cung cấp.' });
    }

    const [year, month] = date.split('-');
    try {
      const result = await ReportModel.getInventoryReport(year, month);
      res.json(result);
    } catch (error) {
      console.error('Lỗi khi lấy báo cáo tồn kho:', error);
      res.status(500).json({ error: 'Đã có lỗi xảy ra.' });
    }
  }

  // Xử lý công nợ
  static async debtReport(req, res) {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Ngày không được cung cấp.' });
    }

    const [year, month] = date.split('-');
    const endDatePrevMonth = date; // Giả định tạm thời
    try {
      const result = await ReportModel.getDebtReport(endDatePrevMonth, month, year);
      res.json(result);
    } catch (error) {
      console.error('Lỗi khi lấy báo cáo công nợ:', error);
      res.status(500).json({ error: 'Đã có lỗi xảy ra.' });
    }
  }

}

module.exports = ReportController;
