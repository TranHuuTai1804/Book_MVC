const connection = require('../config/db'); // Kết nối database

class ReportModel {
    // Truy vấn tồn kho
  static async getInventoryReport(year, month) {
    const query = `
      -- Tính toán tồn đầu kỳ, nhập trong kỳ, bán trong kỳ, và tồn cuối kỳ
      WITH Thong_ke_nhap_truoc AS (
        SELECT s.ID_Sach, COALESCE(SUM(ct.So_luong), 0) AS Tong_nhap_truoc
        FROM Sach s
        LEFT JOIN Chi_tiet_phieu_nhap_sach ct ON s.ID_Sach = ct.ID_Sach
        LEFT JOIN Phieu_nhap_sach pn ON ct.ID_Phieu = pn.ID_Phieu
        WHERE pn.Ngay_nhap < DATE(CONCAT(?, '-', ?, '-01'))
        GROUP BY s.ID_Sach
      ),
      Thong_ke_ban_truoc AS (
        SELECT s.ID_Sach, COALESCE(SUM(cthd.So_luong), 0) AS Tong_ban_truoc
        FROM Sach s
        LEFT JOIN Chi_tiet_hoa_don cthd ON s.ID_Sach = cthd.ID_Sach
        LEFT JOIN Hoa_don_ban_sach hd ON cthd.ID_Hoa_don = hd.ID_Hoa_don
        WHERE hd.Ngay_lap_hoa_don < DATE(CONCAT(?, '-', ?, '-01'))
        GROUP BY s.ID_Sach
      ),
      Thong_ke_nhap_trong_ky AS (
        SELECT s.ID_Sach, COALESCE(SUM(ct.So_luong), 0) AS Tong_nhap
        FROM Sach s
        LEFT JOIN Chi_tiet_phieu_nhap_sach ct ON s.ID_Sach = ct.ID_Sach
        LEFT JOIN Phieu_nhap_sach pn ON ct.ID_Phieu = pn.ID_Phieu
        WHERE MONTH(pn.Ngay_nhap) = ? AND YEAR(pn.Ngay_nhap) = ?
        GROUP BY s.ID_Sach
      ),
      Thong_ke_ban_trong_ky AS (
        SELECT s.ID_Sach, COALESCE(SUM(cthd.So_luong), 0) AS Tong_ban
        FROM Sach s
        LEFT JOIN Chi_tiet_hoa_don cthd ON s.ID_Sach = cthd.ID_Sach
        LEFT JOIN Hoa_don_ban_sach hd ON cthd.ID_Hoa_don = hd.ID_Hoa_don
        WHERE MONTH(hd.Ngay_lap_hoa_don) = ? AND YEAR(hd.Ngay_lap_hoa_don) = ?
        GROUP BY s.ID_Sach
      )
      SELECT 
        s.ID_Sach,
        s.Ten_Sach,
        COALESCE(Tong_nhap_truoc.Tong_nhap_truoc, 0) AS Tong_nhap_truoc,
        COALESCE(Tong_ban_truoc.Tong_ban_truoc, 0) AS Tong_ban_truoc,
        COALESCE(Tong_nhap_trong_ky.Tong_nhap, 0) AS Tong_nhap,
        COALESCE(Tong_ban_trong_ky.Tong_ban, 0) AS Tong_ban,
        (COALESCE(s.So_luong, 0) + COALESCE(Tong_nhap_truoc.Tong_nhap_truoc, 0) - COALESCE(Tong_ban_truoc.Tong_ban_truoc, 0)) AS Ton_dau_ky,
        (COALESCE(s.So_luong, 0) 
          + COALESCE(Tong_nhap_truoc.Tong_nhap_truoc, 0) 
          - COALESCE(Tong_ban_truoc.Tong_ban_truoc, 0)
          + COALESCE(Tong_nhap_trong_ky.Tong_nhap, 0)
          - COALESCE(Tong_ban_trong_ky.Tong_ban, 0)) AS Ton_cuoi_ky
      FROM Sach s
      LEFT JOIN Thong_ke_nhap_truoc Tong_nhap_truoc ON s.ID_Sach = Tong_nhap_truoc.ID_Sach
      LEFT JOIN Thong_ke_ban_truoc Tong_ban_truoc ON s.ID_Sach = Tong_ban_truoc.ID_Sach
      LEFT JOIN Thong_ke_nhap_trong_ky Tong_nhap_trong_ky ON s.ID_Sach = Tong_nhap_trong_ky.ID_Sach
      LEFT JOIN Thong_ke_ban_trong_ky Tong_ban_trong_ky ON s.ID_Sach = Tong_ban_trong_ky.ID_Sach;
    `;
  
    const [rows] = await connection.promise().query(query, [year, month, year, month, month, year, month, year]);
    return rows;
  }
  
  // Truy vấn công nợ
  static async getDebtReport(endDatePrevMonth, month, year) {
    const debtStartQuery = `
      SELECT 
        kh.ID_Khach_hang,
        kh.Ten_khach_hang,
        COALESCE(SUM(pt.So_tien), 0) AS Tong_thu_tien,
        COALESCE(SUM(hd.Tong_tien), 0) AS Tong_hoa_don,
        (COALESCE(SUM(pt.So_tien), 0) - COALESCE(SUM(hd.Tong_tien), 0)) AS Cong_no_dau_ky
      FROM Khach_hang kh
      LEFT JOIN Phieu_thu_tien pt ON kh.ID_Khach_hang = pt.ID_Khach_hang AND pt.Ngay_thu_tien < ?
      LEFT JOIN Hoa_don_ban_sach hd ON kh.ID_Khach_hang = hd.ID_khach_hang AND hd.Ngay_lap_hoa_don < ?
      GROUP BY kh.ID_Khach_hang, kh.Ten_khach_hang;
    `;
    const debtCurrentQuery = `
      SELECT 
        kh.ID_Khach_hang,
        kh.Ten_khach_hang,
        COALESCE(SUM(pt.So_tien), 0) AS Tong_thu_tien,
        COALESCE(SUM(hd.Tong_tien), 0) AS Tong_hoa_don,
        (COALESCE(SUM(pt.So_tien), 0) - COALESCE(SUM(hd.Tong_tien), 0)) AS Cong_no_phat_sinh
      FROM Khach_hang kh
      LEFT JOIN Phieu_thu_tien pt ON kh.ID_Khach_hang = pt.ID_Khach_hang AND MONTH(pt.Ngay_thu_tien) = ? AND YEAR(pt.Ngay_thu_tien) = ?
      LEFT JOIN Hoa_don_ban_sach hd ON kh.ID_Khach_hang = hd.ID_khach_hang AND MONTH(hd.Ngay_lap_hoa_don) = ? AND YEAR(hd.Ngay_lap_hoa_don) = ?
      GROUP BY kh.ID_Khach_hang, kh.Ten_khach_hang;
    `;
  
    const [debtStartResult] = await connection.promise().query(debtStartQuery, [endDatePrevMonth, endDatePrevMonth]);
    const [debtCurrentResult] = await connection.promise().query(debtCurrentQuery, [month, year, month, year]);
  
    const debtEndResult = debtStartResult.map((start) => {
      const current = debtCurrentResult.find((item) => item.ID_Khach_hang === start.ID_Khach_hang);
      const debtEnd = current ? start.Cong_no_dau_ky + current.Cong_no_phat_sinh : start.Cong_no_dau_ky;
      return {
        ID_Khach_hang: start.ID_Khach_hang,
        Ten_khach_hang: start.Ten_khach_hang,
        Cong_no_dau_ky: start.Cong_no_dau_ky,
        Cong_no_cuoi_ky: debtEnd,
        Tong_thu_tien: current ? current.Tong_thu_tien : 0,
        Tong_hoa_don: current ? current.Tong_hoa_don : 0,
      };
    });
  
    return debtEndResult;
  }
  }
  
  module.exports = ReportModel;
  