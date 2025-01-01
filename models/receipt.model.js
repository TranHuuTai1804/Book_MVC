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

    static async checkCustomerPhone(phone) {
        if (isNaN(phone)) {
            return []; // Return an empty array instead of null
        }

        // Query to get the last ID from hoadonbansach
        const query = `SELECT ID_khach_hang FROM Khach_hang WHERE So_dien_thoai = ?`;
        const [rows] = await db.promise().query(query, phone);

        // Check if we have a result
        if (rows.length === 0) {
            return []; // Return an empty array if no customer found
        }

        // Get the customer ID
        const customerId = rows[0].ID_khach_hang; // Ensure the property matches your database schema

        // Return the customer ID in an array
        return [{ ID_khach_hang: customerId }];
    }
}

module.exports = ReceiptModel;