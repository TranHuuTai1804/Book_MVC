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

// Hàm lấy dữ liệu quy định từ máy chủ

// Function to populate the table with customer data
const populateTable = (regulations) => {
  const regulation = regulations[0];
  document.getElementById("min_input").value = regulation.So_luong_nhap_it_nhat;
  document.getElementById("low_inventory").value =
    regulation.So_luong_ton_it_hon;
  document.getElementById("low_customer_debt").value =
    regulation.Khach_hang_no_khong_qua;
  document.getElementById("stock_after_sale").value =
    regulation.So_luong_ton_sau_khi_ban_it_nhat;

  if (regulation.Su_Dung_QD4.data[0] === 1) {
    document.getElementById("rule_yes").checked = true;
  } else {
    document.getElementById("rule_no").checked = true;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  fetchCustomers(); // Gọi hàm khi DOM đã sẵn sàng
});

const showToast = (message) => {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;

  document.body.appendChild(toast);

  // Thêm hiệu ứng fade-in và fade-out
  setTimeout(() => {
    toast.style.animation = "fade-out 1s forwards";
    toast.addEventListener("animationend", () => {
      toast.remove(); // Xóa `toast` khỏi DOM sau khi hiệu ứng kết thúc
    });
  }, 3000); // Toast tồn tại trong 3 giây trước khi biến mất
};

document.getElementById("updateButton").addEventListener("click", () => {
  // event.preventDefault();
  console.log("Clicked"); // Debug: Kiểm tra sự kiện click
  showToast("Update Successfully!");
});

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

function toggleMenu() {
  const menu = document.getElementById("hero-menu");
  const overlay = document.getElementById("overlay");
  const icon = document.querySelector(".open-menu");
  const body = document.body;

  if (menu.style.display === "none" || menu.style.display === "") {
    menu.style.display = "block";
    setTimeout(() => {
      menu.style.left = "0";
    }, 10);
    overlay.style.display = "block";
    icon.textContent = "<";
    body.classList.add("menu-open");
  } else {
    menu.style.left = "-30%";
    overlay.style.display = "none";
    icon.textContent = ">";
    body.classList.remove("menu-open");

    setTimeout(() => {
      menu.style.display = "none";
    }, 300);
  }
}

const menuOv = document.getElementById("hero-menu");

menuOv.addEventListener("scroll", function () {
  menuOv.style.overflow = "hidden";
  clearTimeout(menuOv.scrollTimeout);

  menuOv.scrollTimeout = setTimeout(function () {
    menuOv.style.overflow = "auto";
  }, 100);
});
