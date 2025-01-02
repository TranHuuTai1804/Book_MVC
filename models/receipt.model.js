const db = require('../config/db'); // Assume db is a database connection module

class ReceiptModel {
    static async findById(id) {
        // Check if id is a number
        if (!isNaN(id)) {
            // If id is a number, query by ID_sach
            const query = `SELECT * FROM Sach WHERE ID_sach = ?`;
            const [rows] = await db.promise().query(query, id);
            return rows;
        } else if (typeof id === 'string' && id.trim() !== '') {
            // If id is a valid string (not empty), query by Ten_sach
            const query = `SELECT * FROM Sach WHERE Ten_sach = ?`;
            const [rows] = await db.promise().query(query, id);
            return rows;
        } else {
            // If id is neither a valid number nor a valid string, return an empty array or handle accordingly
            return []; // Or throw an error, as per your requirements
        }
    }

    static async getNextInvoiceId() {
        // Query to get the last ID from hoadonbansach
        const query = `SELECT ID_Hoa_don FROM Hoa_don_ban_sach ORDER BY ID_Hoa_don DESC LIMIT 1`;
        const [rows] = await db.promise().query(query);

        // Check if we have a result
        if (rows.length === 0) {
            return 'HD001'; // Starting point if no invoices exist
        }

        // Get the last invoice ID
        const lastId = rows[0].ID_Hoa_don; // Ensure the property matches your database schema
        const prefix = lastId.slice(0, 2); // Extract the prefix (e.g., "HD")
        const numberPart = parseInt(lastId.slice(2), 10); // Extract the numeric part

        // Increment the numeric part
        const newId = prefix + String(numberPart + 1).padStart(3, '0'); // Format to 3 digits
        return newId;
    }

    static async getRegulation() {
        const query = ` SELECT * FROM Quy_Dinh`;
        const [rows] = await db.promise().query(query);
        return rows;
    }

    static async getCustomerDebt(phone) {
        const query = `SELECT 
    k.ID_khach_hang, 
    k.Ten_khach_hang, 
    k.Email, 
    k.Dia_chi, 
    COALESCE(pt.total_received, 0) AS total_received,
    COALESCE(hb.total_due, 0) AS total_due,
    COALESCE(pt.total_received, 0) - COALESCE(hb.total_due, 0) AS debt  -- Calculate debt
FROM 
    Khach_hang k
LEFT JOIN 
    (SELECT 
         ID_Khach_hang, 
         SUM(So_tien) AS total_received 
     FROM 
         Phieu_thu_tien 
     GROUP BY 
         ID_Khach_hang) pt ON k.ID_khach_hang = pt.ID_khach_hang
LEFT JOIN 
    (SELECT 
         ID_khach_hang, 
         SUM(Tong_tien) AS total_due 
     FROM 
         Hoa_don_ban_sach 
     GROUP BY 
         ID_khach_hang) hb ON k.ID_khach_hang = hb.ID_khach_hang
WHERE 
    k.So_dien_thoai = ?;`; // Adjust according to your DB schema
        const [rows] = await db.promise().query(query, [phone]);
        return rows[0]?.debt || 0; // Return debt amount or 0 if not found
    }

    static async getRemainingStock(bookId) {
        // Query to get the initial stock of the book
        const stockQuery = `SELECT So_luong FROM Sach WHERE ID_sach = ?`;
        const [stockRows] = await db.promise().query(stockQuery, [parseInt(bookId)]);

        const remainingStock = stockRows[0]?.So_luong;

        return remainingStock;
    }

    static async getCustomerByPhone(phone) {
        const query = `
            SELECT 
    k.ID_khach_hang, 
    k.Ten_khach_hang, 
    k.Email, 
    k.Dia_chi, 
    COALESCE(pt.total_received, 0) AS total_received,
    COALESCE(hb.total_due, 0) AS total_due,
    COALESCE(pt.total_received, 0) - COALESCE(hb.total_due, 0) AS debt  -- Calculate debt
FROM 
    Khach_hang k
LEFT JOIN 
    (SELECT 
         ID_Khach_hang, 
         SUM(So_tien) AS total_received 
     FROM 
         Phieu_thu_tien 
     GROUP BY 
         ID_Khach_hang) pt ON k.ID_khach_hang = pt.ID_khach_hang
LEFT JOIN 
    (SELECT 
         ID_khach_hang, 
         SUM(Tong_tien) AS total_due 
     FROM 
         Hoa_don_ban_sach 
     GROUP BY 
         ID_khach_hang) hb ON k.ID_khach_hang = hb.ID_khach_hang
WHERE 
    k.So_dien_thoai = ?`;

        const [rows] = await db.promise().query(query, [phone]);
        return rows;
    }


}

module.exports = ReceiptModel;