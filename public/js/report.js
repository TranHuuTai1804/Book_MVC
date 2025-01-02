
function showTable(type) {
  const InventoryBtn = document.getElementById("Inventory-btn");
  const debtBtn = document.getElementById("debt-btn");
  const InventoryTable = document.getElementById("Inventory-table");
  const debtTable = document.getElementById("debt-table");

  if (type === "Inventory") {
    // Đổi trạng thái nút
    InventoryBtn.classList.add("active");
    debtBtn.classList.remove("active");

    // Hiển thị bảng Inventory
    InventoryTable.style.display = "block";
    debtTable.style.display = "none";
  } else if (type === "debt") {
    // Đổi trạng thái nút
    debtBtn.classList.add("active");
    InventoryBtn.classList.remove("active");

    // Hiển thị bảng Debt
    debtTable.style.display = "block";
    InventoryTable.style.display = "none";
  }
}

// Lấy thẻ input ngày
const dateInput = document.getElementById("date-report");

// Hàm để lấy ngày hiện tại theo định dạng YYYY-MM-DD
function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
  return `${month}/${year}`;
}

// Gán ngày hiện tại vào thẻ input khi trang được tải lên
dateInput.value = getCurrentDate();


function toggleMenu() {
  const menu = document.getElementById("hero-menu");
  const overlay = document.getElementById("overlay");
  const icon = document.querySelector(".open-menu");
  const body = document.body;

  // Kiểm tra nếu menu đang ẩn
  if (menu.style.display === "none" || menu.style.display === "") {
    menu.style.display = "block"; // Mở menu
    setTimeout(() => {
      menu.style.left = "0"; // Đặt menu vào vị trí mong muốn với hiệu ứng trượt
    }, 10); // Đảm bảo hiệu ứng trượt được áp dụng
    overlay.style.display = "block"; // Hiện overlay
    icon.textContent = "<"; // Đổi icon thành '<'

    // Thêm lớp menu-open để di chuyển icon
    body.classList.add("menu-open");
  } else {
    menu.style.left = "-30%"; // Ẩn menu với hiệu ứng trượt
    overlay.style.display = "none"; // Ẩn overlay
    icon.textContent = ">"; // Đổi icon thành '>'

    // Loại bỏ lớp menu-open để di chuyển icon về vị trí ban đầu
    body.classList.remove("menu-open");

    setTimeout(() => {
      menu.style.display = "none"; // Ẩn menu sau khi trượt hoàn tất
    }, 300); // Thời gian trượt hoàn tất trước khi ẩn menu
  }
}

// Ẩn thanh cuộn khi người dùng lướt lên hoặc xuống
const menuOv = document.getElementById("hero-menu");

menuOv.addEventListener("scroll", function () {
  menuOv.style.scrollbarWidth = "none"; // Ẩn thanh cuộn khi lướt
  clearTimeout(menuOv.scrollTimeout);

  menuOv.scrollTimeout = setTimeout(function () {
    menuOv.style.scrollbarWidth = "thin"; // Hiển thị lại thanh cuộn khi ngừng lướt
  }, 100); // Ẩn thanh cuộn khi lướt và hiển thị lại sau khi ngừng
});


// Lắng nghe sự kiện click trên thẻ <a> với id "get-date"
document.getElementById("get-date").addEventListener("click", async (event) => {
  event.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ <a>

  // Lấy giá trị từ input date-report
  const dateInput = document.getElementById("date-report").value.trim();
  const regex = /^(0[1-9]|1[0-2])\/\d{4}$/; // Kiểm tra định dạng MM/YYYY
  const InventoryBtn = document.getElementById("Inventory-btn");

  if (regex.test(dateInput)) {
    const [month, year] = dateInput.split('/'); // Tách tháng và năm
    const startDate = `${year}-${month}-01`; // Chuyển đổi thành định dạng YYYY-MM-01

    // Kiểm tra xem bảng Inventory có đang active không
    const isInventoryActive = InventoryBtn.classList.contains("active");

    try {
      let url = "";

      if (isInventoryActive) {
        // Nếu Inventory đang active, gọi hàm fetch với URL cho Inventory
        url = `/report/inventory?date=${startDate}`;
      } else {
        // Nếu không, gọi hàm fetch với URL cho Debt (hoặc hàm khác tùy ý)
        url = `/report/debt?date=${startDate}`;
      }

      // Gửi yêu cầu GET đến API server với tham số date
      const response = await fetch(url);

      if (!response.ok) {
        console.error('Lỗi từ server:', response.statusText);
        throw new Error(`Lỗi server: ${response.status}`);
      }

      const data = await response.json(); // Parse JSON từ phản hồi server
      if (isInventoryActive) {
        populateTable(data, "Inventory"); // Gọi hàm populateTable để hiển thị dữ liệu
      }
      else {
        populateTable(data, "debt");
      }
      showToast("success"); // Hiển thị toast thành công
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error.message);
      showToast("error"); // Hiển thị toast lỗi
    }
  } else {
    showToast("error"); // Hiển thị toast lỗi nếu định dạng không hợp lệ
  }
});

// Hàm hiển thị dữ liệu lên bảng
// Hàm hiển thị dữ liệu lên bảng
function populateTable(data, type) {
  const tableBody = document.getElementById("table-body");
  const tableBodyDebt = document.getElementById("table-body-debt");

  // Xóa nội dung bảng trước khi thêm dữ liệu mới
  tableBody.innerHTML = "";
  tableBodyDebt.innerHTML = "";

  // Kiểm tra nếu dữ liệu không phải là mảng
  if (!Array.isArray(data)) {
    console.warn("Dữ liệu không phải mảng, chuyển thành mảng:", data);
    data = data ? [data] : []; // Nếu data không hợp lệ, chuyển thành mảng rỗng
  }

  // Hiển thị dữ liệu trong bảng
  data.forEach(row => {
    // Tạo dòng mới trong bảng
    const newRow = document.createElement("tr");

    // Nếu là bảng Inventory
    if (type === "Inventory") {
      // Kiểm tra các giá trị trong row trước khi sử dụng
      const idSach = row.ID_Sach || "N/A";  // Nếu ID_Sach không hợp lệ, gán "N/A"
      const tenSach = row.Ten_Sach || "Không có tên";  // Nếu Ten_Sach không hợp lệ, gán "Không có tên"

      // Chuyển đổi các giá trị sang số
      const tonDauKy = parseInt(row.Ton_dau_ky) || 0;  // Chuyển thành số, nếu không hợp lệ gán 0
      const tongNhap = parseInt(row.Tong_nhap) || 0;  // Chuyển thành số, nếu không hợp lệ gán 0
      const tongBan = parseInt(row.Tong_ban) || 0;  // Chuyển thành số, nếu không hợp lệ gán 0
      const tonCuoiKy = parseInt(row.Ton_cuoi_ky) || 0;  // Chuyển thành số, nếu không hợp lệ gán 0
      const remainingI = tongNhap - tongBan;

      if (remainingI !== 0) {
        newRow.innerHTML = `
        <td>${idSach}</td>
        <td>${tenSach}</td>
        <td>${tonDauKy}</td>
        <td>${remainingI}</td>
        <td>${tonCuoiKy}</td>
      `;
        tableBody.appendChild(newRow);
      }
    }
    // Nếu là bảng Debt
    else if (type === "debt") {
      const idKH = row.ID_Khach_hang || "N/A";  // Nếu ID_Khach_hang không hợp lệ, gán "N/A"
      const tenKH = row.Ten_khach_hang || "Không có tên";  // Nếu Ten_Khach_hang không hợp lệ, gán "Không có tên"

      const noDauKy = parseInt(row.Cong_no_dau_ky) || 0; // Giá trị nợ đầu kỳ
      const Tongthuthang = parseInt(row.Tong_thu_tien);
      const Tonghoadonthang = parseInt(row.Tong_hoa_don);

      const remainingDebt = Tongthuthang - Tonghoadonthang;
      const totalDebt = noDauKy + remainingDebt;

      // Only add a new row if remainingDebt is not 0
      if (remainingDebt !== 0) {
        newRow.innerHTML = `
              <td>${idKH}</td>
              <td>${tenKH}</td>
              <td>${noDauKy}</td>
              <td>${remainingDebt}</td>
              <td>${totalDebt}</td>
          `;
        tableBodyDebt.appendChild(newRow);
      }
    }

  });
}



// Hàm hiển thị thông báo toast
function showToast(type) {
  const toast = type === "success"
    ? document.getElementById("toastSuccess")
    : document.getElementById("toastError");

  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000); // Ẩn sau 3 giây
}

function printTable() {
  // Get the display status of the tables
  const InventoryTable = document.getElementById("Inventory-table");
  const debtTable = document.getElementById("debt-table");


  // Determine which table is currently displayed
  let tableBody;
  if (debtTable.style.display === "block") {
    tableBody = document.getElementById('table-body-debt').innerHTML; // Modify to the correct ID for the debt table body
    nametable = "Debt Report";
  } else {
    tableBody = document.getElementById('table-body').innerHTML; // Modify to the correct ID for the inventory table body
    nametable = "Inventory Report";
  }

  // Create a new iframe
  const iframe = document.createElement('iframe');
  document.body.appendChild(iframe);

  // Set the iframe styles to hide it
  iframe.style.position = 'absolute';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = 'none';

  // Write the content to the iframe
  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(`
      <html>
          <head>
              <title>Print Table</title>
              <style>
                  body { font-family: Arial, sans-serif; }
                  table { width: 100%; border-collapse: collapse; }
                  th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                  th { background-color: #f2f2f2; }
                  h2 { text-align: center;}
              </style>
          </head>
          <body>
          <h2>${nametable}</h2>
              <h3>${getCurrentDate()}</h3>
              <table>
                  <thead>
                      <tr>
                          <th>No.</th>
                          <th>Book</th>
                          <th>First Existence</th>
                          <th>Arise</th>
                          <th>Last Existence</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${tableBody}
                  </tbody>
              </table>
          </body>
      </html>
  `);
  doc.close();

  // Print the iframe content
  iframe.contentWindow.focus();
  iframe.contentWindow.print();

  // Remove the iframe after printing
  iframe.parentNode.removeChild(iframe);
}