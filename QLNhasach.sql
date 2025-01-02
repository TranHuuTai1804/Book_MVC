-- Tạo cơ sở dữ liệu
CREATE DATABASE QLNhasach;
USE QLNhasach;

-- Tạo bảng Sach
CREATE TABLE Sach (
    ID_sach INT AUTO_INCREMENT PRIMARY KEY, 
    Ten_sach NVARCHAR(45),
    Ten_tac_gia NVARCHAR(45),
    The_loai NVARCHAR(20),
    Nam_xuat_ban INT,
    So_luong INT,
    Gia DECIMAL(10, 2),
    Link NCHAR(40)
);

-- Tạo bảng Phieu_nhap_sach
CREATE TABLE Phieu_nhap_sach (
    ID_Phieu INT AUTO_INCREMENT PRIMARY KEY,
    Ngay_nhap DATETIME,
    Tong_so_luong INT,
    ID_sach INT,
    FOREIGN KEY (ID_sach) REFERENCES Sach(ID_sach)
);

-- Tạo bảng Chi_tiet_phieu_nhap_sach
CREATE TABLE Chi_tiet_phieu_nhap_sach (
    ID_Chi_tiet INT AUTO_INCREMENT PRIMARY KEY,
    ID_Phieu INT,
    ID_Sach INT,
    So_luong INT,
    FOREIGN KEY (ID_Phieu) REFERENCES Phieu_nhap_sach(ID_Phieu),
    FOREIGN KEY (ID_Sach) REFERENCES Sach(ID_sach)
);

-- Tạo bảng Khach_hang
CREATE TABLE Khach_hang (
    ID_khach_hang INT AUTO_INCREMENT PRIMARY KEY,
    Ten_khach_hang NVARCHAR(50),
    So_dien_thoai CHAR(11),
    Gioi_tinh CHAR(1),
    Email VARCHAR(30),
    Dia_chi NVARCHAR(100),
    Tien_no DECIMAL(10, 2),
);

-- Tạo bảng Phieu_thu_tien
CREATE TABLE Phieu_thu_tien (
    ID_Phieu INT AUTO_INCREMENT PRIMARY KEY,
    ID_Khach_hang INT,
    Ngay_thu_tien DATETIME,
    So_tien DECIMAL(10, 2),
    FOREIGN KEY (ID_Khach_hang) REFERENCES Khach_hang(ID_khach_hang)
);

-- Tạo bảng Hoa_don_ban_sach
CREATE TABLE Hoa_don_ban_sach (
    ID_Hoa_don CHAR(5) PRIMARY KEY,
    ID_khach_hang INT,
    Ngay_lap_hoa_don DATETIME,
    Tong_tien DECIMAL(10, 2),
    FOREIGN KEY (ID_khach_hang) REFERENCES Khach_hang(ID_khach_hang)
);

-- Tạo bảng Chi_tiet_hoa_don
CREATE TABLE Chi_tiet_hoa_don (
    ID_Chi_tiet_hoa_don INT AUTO_INCREMENT PRIMARY KEY,
    ID_Hoa_don CHAR(5),
    ID_Sach INT,
    So_luong INT,
    Don_gia DECIMAL(10, 2),
    Thanh_tien DECIMAL(10, 2),
    FOREIGN KEY (ID_Hoa_don) REFERENCES Hoa_don_ban_sach(ID_Hoa_don),
    FOREIGN KEY (ID_Sach) REFERENCES Sach(ID_sach)
);

-- Tạo bảng Quy_dinh
CREATE TABLE Quy_dinh (
    So_luong_nhap_it_nhat INT,
    So_luong_ton_it_hon INT,
    Khach_hang_no_khong_qua DECIMAL(10, 2),
    So_luong_ton_sau_khi_ban_it_nhat INT,
    Su_Dung_QD4 BIT
);

-- Tạo bảng users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('active', 'inactive', 'banned') DEFAULT 'active'
);

-- Thêm dữ liệu mẫu vào bảng Sach
INSERT INTO Sach (Ten_sach, The_loai, Ten_tac_gia, Nam_xuat_ban, So_luong, Gia, Link) VALUES  
('Dế Mèn Phiêu Lưu Ký', 'Văn học thiếu nhi', 'Tô Hoài', 1941, 10, 15.99, 'De_Men_Phieu_Luu_Ky.jpg'),  
('Mắt Biếc', 'Tiểu thuyết', 'Nguyễn Nhật Ánh', 1990, 20, 18.50, 'Mat_Biec.jpg'),  
('Truyện Kiều', 'Thơ ca', 'Nguyễn Du', 1820, 12, 25.00, 'Truyen_Kieu.jpg'),  
('Nhật Ký Đặng Thùy Trâm', 'Hồi ký', 'Đặng Thùy Trâm', 2005, 5, 19.99, 'Nhat_Ky_Dang_Thuy_Tram.jpg'),  
('Tôi Thấy Hoa Vàng Trên Cỏ Xanh', 'Tiểu thuyết', 'Nguyễn Nhật Ánh', 2008, 18, 22.00, 'Toi_Thay_Hoa_Vang_Tren_Co_Xanh.png'),  
('Cánh Đồng Bất Tận', 'Tiểu thuyết', 'Nguyễn Ngọc Tư', 2005, 15, 14.99, 'Canh_Dong_Bat_Tan.jpg'),  
('Đất Rừng Phương Nam', 'Văn học thiếu nhi', 'Đoàn Giỏi', 1957, 25, 12.50, 'Dat_Rung_Phuong_Nam.jpg'),  
('Chinh Phụ Ngâm Khúc', 'Thơ ca', 'Đoàn Thị Điểm', 1740, 8, 20.00, 'Chinh_Phu_Ngam_Khuc.jpg'),  
('Quê Nội', 'Văn học thiếu nhi', 'Võ Quảng', 1974, 30, 10.99, 'Que_Noi.jpg'),  
('Lặng Lẽ Sa Pa', 'Hồi ký', 'Nguyễn Thành Long', 1970, 12, 13.50, 'Lang_Le_Sa_Pa.jpg'),  
('Đồi Gió Hú', 'Tiểu thuyết', 'Emily Brontë (Dịch giả: Lê Huy Lâm)', 1847, 6, 17.99, 'Doi_Gio_Hu.jpg'),  
('Vang Bóng Một Thời', 'Thơ ca', 'Nguyễn Tuân', 1940, 10, 16.50, 'Vang_Bong_Mot_Thoi.jpg'),  
('Lịch Sử Việt Nam', 'Hồi ký', 'Nguyễn Văn A', 2020, 4, 14.99, 'Lich_Su_Viet_Nam.jpg'),  
('Quà Tặng Cuộc Sống', 'Văn học thiếu nhi', 'Nhiều Tác Giả', 2010, 20, 12.00, 'Qua_Tang_Cuoc_Song.jpg'),
('Harry Potter', 'Kỳ ảo', 'J.K. Rowling', 1997, 50, 35.00, 'Harry_Potter.jpg'),
('The Hobbit', 'Kỳ ảo', 'J.R.R. Tolkien', 1937, 30, 25.99, 'The_Hobbit.jpg'),
('1984', 'Pháp lý viễn tưởng', 'George Orwell', 1949, 40, 19.99, '1984.jpg'),
('Pride and Prejudice', 'Lãng mạn', 'Jane Austen', 1813, 20, 15.50, 'Pride_and_Prejudice.jpg'),
('The Great Gatsby', 'Tiểu thuyết', 'F. Scott Fitzgerald', 1925, 15, 22.00, 'The_Great_Gatsby.jpg'),
('War and Peace', 'Lịch sử', 'Leo Tolstoy', 1869, 10, 45.00, 'War_and_Peace.jpg'),
('Crime and Punishment', 'Triết học', 'Fyodor Dostoevsky', 1866, 12, 30.00, 'Crime_and_Punishment.jpg'),
('To Kill a Mockingbird', 'Tiểu thuyết', 'Harper Lee', 1960, 25, 20.00, 'To_Kill_a_Mockingbird.jpg'),
('Animal Farm', 'Châm biếm', 'George Orwell', 1945, 30, 18.00, 'Animal_Farm.jpg'),
('The Catcher in the Rye', 'Tiểu thuyết', 'J.D. Salinger', 1951, 20, 25.00, 'The_Catcher_in_the_Rye.jpg'),
('Little Women', 'Tiểu thuyết', 'Louisa May Alcott', 1868, 15, 20.50, 'Little_Women.jpg'),
('The Alchemist', 'Triết học', 'Paulo Coelho', 1988, 35, 18.99, 'The_Alchemist.jpg'),
('The Kite Runner', 'Kịch tính', 'Khaled Hosseini', 2003, 25, 22.50, 'The_Kite_Runner.jpg'),
('Life of Pi', 'Phiêu lưu', 'Yann Martel', 2001, 20, 15.00, 'Life_of_Pi.jpg'),
('A Brief History of Time', 'Khoa học', 'Stephen Hawking', 1988, 18, 28.50, 'A_Brief_History_of_Time.jpg');

-- Thêm dữ liệu mẫu vào các bảng còn lại
INSERT INTO Phieu_nhap_sach (Ngay_nhap, Tong_so_luong, ID_sach) VALUES  
('2024-01-15 10:30:00', 180, 1),  
('2024-02-20 14:00:00', 150, 2),  
('2024-03-10 16:00:00', 180, 3),  
('2024-03-15 09:00:00', 185, 4),  
('2024-04-05 11:45:00', 160, 5),
('2024-05-10 10:00:00', 170, 8),
('2024-06-15 11:30:00', 150, 9),
('2024-07-20 14:20:00', 160, 10),
('2024-08-25 09:40:00', 140, 11),
('2024-09-10 16:10:00', 155, 12),
('2024-10-01 12:00:00', 150, 13),
('2024-10-05 13:30:00', 160, 14),
('2024-10-15 15:50:00', 245, 15),
('2024-10-29 11:30:00', 150, 16),
('2024-11-20 14:20:00', 160, 17),
('2024-11-25 09:40:00', 170, 18),
('2024-11-30 16:10:00', 155, 19),
('2024-12-05 12:00:00', 150, 20),
('2024-12-09 13:30:00', 170, 21),
('2024-12-16 15:50:00', 245, 22),
('2024-12-16 11:20:00', 180, 23),
('2024-12-16 10:10:00', 185, 24),
('2024-12-16 12:30:00', 195, 25);

INSERT INTO Chi_tiet_phieu_nhap_sach (ID_Phieu, ID_Sach, So_luong) VALUES  
(1, 1, 180),  
(2, 2, 150),  
(3, 3, 180),  
(4, 4, 185),  
(5, 5, 160),  
(6, 6, 170),  
(7, 7, 150),  
(8, 8, 170),  
(9, 9, 150),  
(10, 10, 160),  
(11, 11, 140),  
(12, 12, 155),  
(13, 13, 150),  
(14, 14, 160),  
(15, 15, 245),  
(16, 16, 150),  
(17, 17, 160),  
(18, 18, 170),  
(19, 19, 155),  
(20, 20, 150),  
(21, 21, 170),  
(22, 22, 245),  
(23, 23, 180),  
(24, 24, 185),  
(25, 25, 195);

INSERT INTO Khach_hang (Ten_khach_hang, So_dien_thoai, Gioi_tinh, Email, Dia_chi, Tien_no) VALUES  
('Nguyễn Văn A', '0912345678', 'M', 'nguyenvana@gmail.com', 'Hà Nội'),  
('Trần Thị B', '0987654321', 'F', 'tranthib@yahoo.com', 'TP Hồ Chí Minh'),  
('Lê Văn C', '0932123456', 'M', 'levanc@outlook.com', 'Đà Nẵng'),  
('Phạm Thị D', '0909876543', 'F', 'phamthid@hotmail.com', 'Huế'),  
('Hoàng Văn E', '0911122334', 'M', 'hoangvane@gmail.com', 'Cần Thơ'),
('Phạm Văn G', '0978654321', 'M', 'phamvang@gmail.com', 'Bình Dương'),  
('Lý Thị H', '0967543210', 'F', 'lythih@gmail.com', 'Vũng Tàu'),  
('Nguyễn Văn I', '0938765432', 'M', 'nguyenvani@gmail.com', 'Cần Thơ'),  
('Đặng Thị J', '0912348888', 'F', 'dangthij@gmail.com', 'Nha Trang'),  
('Võ Văn K', '0943216789', 'M', 'vovank@gmail.com', 'Phú Quốc'),
('Trịnh Thị L', '0934567890', 'F', 'trinhtl@gmail.com', 'Quảng Ninh'),  
('Ngô Văn M', '0923456789', 'M', 'ngovanm@gmail.com', 'Hải Phòng'),  
('Phan Thị N', '0901234567', 'F', 'phanthn@gmail.com', 'Thanh Hóa'),  
('Đỗ Văn O', '0912345670', 'M', 'dovano@gmail.com', 'Hà Nam'),  
('Bùi Thị P', '0976543210', 'F', 'buithp@gmail.com', 'Nam Định'),  
('Lê Văn Q', '0987654329', 'M', 'levanq@gmail.com', 'Bắc Giang'),  
('Vũ Thị R', '0954321678', 'F', 'vuthir@gmail.com', 'Hưng Yên'),  
('Dương Văn S', '0932145678', 'M', 'duongvans@gmail.com', 'Ninh Bình'),  
('Lý Thị T', '0911223344', 'F', 'lythit@gmail.com', 'Lào Cai'),  
('Nguyễn Văn U', '0945566778', 'M', 'nguyenvanu@gmail.com', 'Tây Ninh'),  
('Hoàng Thị V', '0967788990', 'F', 'hoangtv@gmail.com', 'Quảng Trị'),  
('Phạm Văn W', '0903344556', 'M', 'phamvw@gmail.com', 'Hòa Bình'),  
('Trần Thị X', '0912233445', 'F', 'tranthx@gmail.com', 'Gia Lai'),  
('Lê Văn Y', '0924455667', 'M', 'levany@gmail.com', 'Kon Tum'),  
('Ngô Thị Z', '0935566778', 'F', 'ngothz@gmail.com', 'Đắk Lắk');

INSERT INTO Phieu_thu_tien (ID_Khach_hang, Ngay_thu_tien, So_tien) VALUES  
(1, '2024-01-20 10:00:00', 150.00),  
(2, '2024-02-15 15:00:00', 200.00),  
(3, '2024-03-05 14:30:00', 100.00),  
(4, '2024-03-25 12:00:00', 180.00),  
(5, '2024-04-10 10:45:00', 250.00),
(6, '2024-05-20 10:30:00', 120.00),  
(7, '2024-06-15 14:00:00', 150.00),  
(8, '2024-07-10 09:15:00', 200.00),  
(9, '2024-08-05 16:30:00', 250.00),  
(10, '2024-09-01 11:45:00', 180.00),
(11, '2024-10-10 08:00:00', 300.00),  
(12, '2024-11-15 13:45:00', 220.00),  
(13, '2024-12-20 15:30:00', 270.00),  
(14, '2025-01-05 10:15:00', 190.00),  
(15, '2025-02-12 09:00:00', 210.00),  
(16, '2025-03-20 14:45:00', 160.00),  
(17, '2025-04-25 11:30:00', 230.00),  
(18, '2025-05-30 08:15:00', 300.00),  
(19, '2025-06-10 12:00:00', 250.00),  
(20, '2025-07-15 16:45:00', 290.00),  
(21, '2025-08-20 09:30:00', 270.00),  
(22, '2025-09-25 14:00:00', 200.00),  
(23, '2025-10-30 15:45:00', 320.00),  
(24, '2025-11-05 10:00:00', 310.00),  
(25, '2025-12-10 08:30:00', 280.00);

INSERT INTO Hoa_don_ban_sach (ID_Hoa_don, ID_khach_hang, Ngay_lap_hoa_don, Tong_tien) VALUES  
('HD001', 20, '2025-01-05 12:30:00', 31.98),  
('HD002', 19, '2025-01-15 09:30:00', 75.00),  
('HD003', 1, '2024-01-22 11:00:00', 92.50),  
('HD004', 10, '2025-01-25 13:15:00', 19.99),  
('HD005', 11, '2025-02-05 10:15:00', 44.00),  
('HD006', 12, '2025-02-15 14:30:00', 44.97),  
('HD007', 2, '2024-02-18 13:45:00', 80.00),  
('HD008', 13, '2025-02-28 11:45:00', 31.00),  
('HD009', 14, '2025-03-05 09:15:00', 25.99),  
('HD010', 3, '2024-03-08 10:30:00', 54.00),  
('HD011', 15, '2025-03-15 13:30:00', 42.00),  
('HD012', 4, '2024-03-28 16:00:00', 19.50),  
('HD013', 5, '2024-04-15 09:30:00', 89.95),  
('HD014', 6, '2024-04-20 14:15:00', 33.00),  
('HD015', 7, '2024-05-05 10:45:00', 83.96),  
('HD016', 8, '2024-05-15 12:30:00', 56.25),  
('HD017', 9, '2024-06-01 15:00:00', 45.00),  
('HD018', 10, '2024-06-10 11:30:00', 14.99),  
('HD019', 11, '2024-06-25 13:15:00', 90.00),  
('HD020', 12, '2024-07-05 09:45:00', 47.00),  
('HD021', 13, '2024-07-15 14:30:00', 60.00),  
('HD022', 14, '2024-08-01 10:30:00', 47.97),  
('HD023', 15, '2024-08-10 16:00:00', 40.00),  
('HD024', 16, '2024-08-20 13:00:00', 74.00),  
('HD025', 17, '2024-09-05 09:30:00', 14.99),  
('HD026', 18, '2024-09-15 11:00:00', 50.00),  
('HD027', 19, '2024-10-01 14:45:00', 100.00),  
('HD028', 20, '2024-10-10 10:15:00', 59.97),  
('HD029', 21, '2024-10-20 15:30:00', 31.00),  
('HD030', 22, '2024-11-05 12:00:00', 25.99),  
('HD031', 23, '2024-11-15 09:45:00', 36.00),  
('HD032', 24, '2024-11-30 13:00:00', 63.00),  
('HD033', 25, '2024-12-05 10:30:00', 19.50),  
('HD034', 22, '2024-12-15 11:45:00', 41.98),  
('HD035', 21, '2024-12-25 16:00:00', 75.00);

INSERT INTO Chi_tiet_hoa_don (ID_Hoa_don, ID_Sach, So_luong, Don_gia, Thanh_tien) VALUES  
(1, 1, 2, 15.99, 31.98),  
(2, 3, 3, 25.00, 75.00),  
(3, 2, 5, 18.50, 92.50),  
(4, 4, 1, 19.99, 19.99),  
(5, 5, 2, 22.00, 44.00),  
(6, 6, 3, 14.99, 44.97),
(7, 7, 4, 20.00, 80.00),  
(8, 8, 2, 15.50, 31.00),  
(9, 9, 1, 25.99, 25.99),  
(10, 10, 3, 18.00, 54.00),  
(11, 11, 2, 21.00, 42.00),  
(12, 12, 1, 19.50, 19.50),  
(13, 13, 5, 17.99, 89.95),  
(14, 14, 2, 16.50, 33.00),  
(15, 15, 4, 20.99, 83.96),  
(16, 16, 3, 18.75, 56.25),  
(17, 17, 2, 22.50, 45.00),  
(18, 18, 1, 14.99, 14.99),  
(19, 19, 6, 15.00, 90.00),  
(20, 20, 2, 23.50, 47.00),  
(21, 21, 3, 20.00, 60.00),
(22, 1, 3, 15.99, 47.97),  
(23, 5, 2, 20.00, 40.00),  
(24, 2, 4, 18.50, 74.00),  
(25, 6, 1, 14.99, 14.99),  
(26, 3, 2, 25.00, 50.00),  
(27, 7, 5, 20.00, 100.00),  
(28, 4, 3, 19.99, 59.97),  
(29, 8, 2, 15.50, 31.00),  
(30, 9, 1, 25.99, 25.99),  
(31, 10, 2, 18.00, 36.00),  
(32, 11, 3, 21.00, 63.00),  
(33, 12, 1, 19.50, 19.50),
(34, 13, 2, 20.99, 41.98),  
(35, 14, 4, 18.75, 75.00);  

INSERT INTO Quy_dinh (So_luong_nhap_it_nhat, So_luong_ton_it_hon, Khach_hang_no_khong_qua, So_luong_ton_sau_khi_ban_it_nhat, Su_Dung_QD4) VALUES  
(150, 300, 20000, 20, 1);

INSERT INTO users (email, password, status) VALUES  
('admin@example.com', 'admin_password_hash', 'active'),  
('nguyenvana@gmail.com', 'user1_password_hash', 'active'),  
('tranthib@yahoo.com', 'user2_password_hash', 'inactive'),  
('levanc@outlook.com', 'user3_password_hash', 'banned'),  
('phamthid@hotmail.com', 'user4_password_hash', 'active'),  
('hoangvane@gmail.com', 'user5_password_hash', 'active'),  
('phamvang@gmail.com', 'user6_password_hash', 'inactive'),  
('lythih@gmail.com', 'user7_password_hash', 'banned'),  
('nguyenvani@gmail.com', 'user8_password_hash', 'active'),  
('dangthij@gmail.com', 'user9_password_hash', 'inactive'),  
('vovank@gmail.com', 'user10_password_hash', 'banned'),  
('trinhtl@gmail.com', 'user11_password_hash', 'active'),  
('ngovanm@gmail.com', 'user12_password_hash', 'inactive'),  
('phanthn@gmail.com', 'user13_password_hash', 'banned'),  
('dovano@gmail.com', 'user14_password_hash', 'active'),  
('buithp@gmail.com', 'user15_password_hash', 'inactive'),  
('levanq@gmail.com', 'user16_password_hash', 'banned'),  
('vuthir@gmail.com', 'user17_password_hash', 'active'),  
('duongvans@gmail.com', 'user18_password_hash', 'inactive'),  
('lythit@gmail.com', 'user19_password_hash', 'banned'),  
('nguyenvanu@gmail.com', 'user20_password_hash', 'active'),  
('hoangtv@gmail.com', 'user21_password_hash', 'inactive'),  
('phamvw@gmail.com', 'user22_password_hash', 'banned'),  
('tranthx@gmail.com', 'user23_password_hash', 'active'),
('levany@gmail.com', 'user24_password_hash', 'banned'),
('ngothz@gmail.com', 'user25_password_hash', 'active');