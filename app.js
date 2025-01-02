const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");
const session = require("express-session");
dotenv.config();

const app = express();

// Cấu hình middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json()); // This is important for parsing JSON data

//middleware
app.use(
  session({
    secret: "abc", // Đặt khóa bí mật cho session
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Đặt cookie cho session
  })
);

// Cấu hình view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Định tuyến
const authRoutes = require("./routes/auth");
app.use(authRoutes);

const homeRoutes = require("./routes/home");
app.use(homeRoutes);

const bookEmptyRoutes = require("./routes/bookempty");
app.use(bookEmptyRoutes);

const apiRoutes = require("./routes/api");
app.use(apiRoutes);

const bookInvoiceRoutes = require("./routes/bookinvoice.routes");
app.use(bookInvoiceRoutes);

const lookUpRoutes = require("./routes/booklookup");
app.use(lookUpRoutes);

const receiptRoutes = require("./routes/receipt.routes");
app.use(receiptRoutes);

const reportRoutes = require("./routes/report.routes");
app.use(reportRoutes);

const editRoutes = require("./routes/regulation");
app.use(editRoutes);

const customerRoutes = require("./routes/customer");
app.use(customerRoutes);

const staffRoutes = require("./routes/staff");
app.use(staffRoutes);

// Route mặc định (điều hướng về trang đăng nhập)
app.get("/", (req, res) => {
  res.redirect("/"); // Điều hướng tới trang đăng nhập
});

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});
