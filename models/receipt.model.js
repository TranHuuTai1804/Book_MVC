const db = require('../config/db'); // Assume db is a database connection module

class ReceiptModel {
    static async findById(id) {
        // Check if id is a number
        if (!isNaN(id)) {
            // If id is a number, query by ID_sach
            const query = `SELECT * FROM Sach WHERE ID_sach = ?`
            const [rows] = await db.promise().query(query, id);
            return rows;
        } else {
            // If id is a number, query by ID_sach
            const query = `SELECT * FROM Sach WHERE Ten_sach = N?`
            const [rows] = await db.promise().query(query, id);
            return rows;
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
}

module.exports = ReceiptModel;