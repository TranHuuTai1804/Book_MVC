document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("table-body");

  // Hàm lấy dữ liệu quy định từ máy chủ
  const fetchCustomers = async () => {
    try {
      const response = await fetch("/regulation");

      // Kiểm tra mã trạng thái HTTP (200-299)
      if (!response.ok) {
        const errorMessage = `Lỗi HTTP! Mã lỗi: ${response.status}`;

        // Kiểm tra xem có thông báo lỗi từ phía backend không
        const errorResponse = await response.text(); // Lấy toàn bộ nội dung phản hồi lỗi
        throw new Error(`${errorMessage}. Nội dung lỗi: ${errorResponse}`);
      }

      // Kiểm tra xem phản hồi có phải là JSON không
      const contentType = response.headers.get("Content-Type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Dự kiến là JSON, nhưng nhận được loại khác");
      }

      // Phân tích phản hồi dưới dạng JSON
      const regulations = await response.json();

      // Kiểm tra dữ liệu nhận được
      if (!Array.isArray(regulations)) {
        throw new Error("Dữ liệu nhận được không phải là mảng JSON hợp lệ");
      }

      // Gọi hàm để hiển thị dữ liệu lên bảng
      populateTable(regulations);
    } catch (error) {
      // Log lỗi chi tiết hơn, bao gồm thông tin về lỗi HTTP, lỗi JSON và lỗi từ backend nếu có
      console.error("Lỗi khi lấy dữ liệu khách hàng:", error.message);

      // Hiển thị thông báo lỗi cho người dùng (nếu cần)
      alert(`Có lỗi xảy ra khi lấy dữ liệu: ${error.message}`);
    }
  };

  // Function to populate the table with customer data
  const populateTable = (regulations) => {
    tableBody.innerHTML = ""; // Clear existing rows

    regulations.forEach((regulation, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
                  <td>${regulation.So_luong_nhap_it_nhat}</td>
                  <td>${regulation.So_luong_ton_it_hon}</td>
                  <td>${regulation.Khach_hang_no_khong_qua}</td>
                  <td>${regulation.So_luong_ton_sau_khi_ban_it_nhat}</td>
                  <td>${
                    regulation.Su_Dung_QD4.data[0] === 1 ? "On" : "Off"
                  }</td>
              `;

      tableBody.appendChild(row);
    });
  };

  const addCustomerForm = document.getElementById("addCustomerForm");

  function showAddCustomerForm() {
    addCustomerForm.style.display = "block";
  }

  function hideAddCustomerForm() {
    addCustomerForm.style.display = "none";
  }

  const cancelButton = document.getElementById("cancelButton");
  if (cancelButton) {
    cancelButton.addEventListener("click", hideAddCustomerForm);
  }

  const addRowButton = document.querySelector(".add-row-btn");
  addRowButton.addEventListener("click", showAddCustomerForm);

  // Initial data fetch
  fetchCustomers();
});

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
