let regulationData = [];

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

  regulationData = [
    regulation.So_luong_nhap_it_nhat,
    regulation.So_luong_ton_it_hon,
    regulation.Khach_hang_no_khong_qua,
    regulation.So_luong_ton_sau_khi_ban_it_nhat,
    regulation.Su_Dung_QD4.data[0],
  ];

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

document.getElementById("updateButton").addEventListener("click", function () {
  // Tạo toast message
  let toast = document.createElement("div");
  toast.innerText = "Update Successfully!";
  toast.style.position = "fixed";
  toast.style.bottom = "120px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.backgroundColor = "#333";
  toast.style.color = "#fff";
  toast.style.padding = "20px 40px"; // Tăng padding để toast lớn hơn
  toast.style.borderRadius = "8px"; // Làm góc tròn hơn
  toast.style.zIndex = "9999";
  toast.style.fontSize = "15px"; // Tăng kích thước font chữ // Làm chữ đậm

  // Thêm hiệu ứng CSS cho toast
  toast.style.opacity = "0";
  toast.style.transition = "opacity 0.5s, transform 0.5s";
  toast.style.transform = "translateX(-50%) translateY(20px)"; // Đặt vị trí ban đầu

  // Thêm toast vào body
  document.body.appendChild(toast);

  updateButton.style.opacity = 0.3;
  updateButton.style.pointerEvents = "none";

  // Hiển thị toast với hiệu ứng fade-in
  setTimeout(function () {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(0)"; // Hiệu ứng di chuyển lên
  }, 10);

  // Tự động ẩn toast sau 3 giây với hiệu ứng fade-out
  setTimeout(function () {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(20px)"; // Di chuyển xuống
  }, 2500);

  // Xóa toast khỏi DOM sau khi hiệu ứng hoàn thành
  setTimeout(function () {
    toast.remove();
  }, 3000);
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

// Lắng nghe sự kiện thay đổi trên các trường nhập liệu
const minInputField = document.getElementById("min_input");
const lowInventoryField = document.getElementById("low_inventory");
const lowCustomerDebtField = document.getElementById("low_customer_debt");
const stockAfterSaleField = document.getElementById("stock_after_sale");
const ruleYesRadio = document.getElementById("rule_yes");
const ruleNoRadio = document.getElementById("rule_no");

const updateButton = document.getElementById("updateButton");

const checkIfFieldsChanged = () => {
  // Lấy giá trị ban đầu của các trường (có thể từ server)
  const initialRegulation = {
    min_input: document.getElementById("min_input").defaultValue,
    low_inventory: document.getElementById("low_inventory").defaultValue,
    low_customer_debt:
      document.getElementById("low_customer_debt").defaultValue,
    stock_after_sale: document.getElementById("stock_after_sale").defaultValue,
    rule: document.querySelector("input[name='rule']:checked")?.value,
  };

  // Kiểm tra xem có trường nào bị thay đổi hay không
  if (
    minInputField.value !== initialRegulation.min_input ||
    lowInventoryField.value !== initialRegulation.low_inventory ||
    lowCustomerDebtField.value !== initialRegulation.low_customer_debt ||
    stockAfterSaleField.value !== initialRegulation.stock_after_sale ||
    (ruleYesRadio.checked && initialRegulation.rule !== "Yes") ||
    (ruleNoRadio.checked && initialRegulation.rule !== "No")
  ) {
    updateButton.style.opacity = 1;
    updateButton.style.pointerEvents = "auto"; // Nếu có thay đổi, set opacity = 1
  } else {
    updateButton.style.opacity = 0.3;
    updateButton.style.pointerEvents = "none"; // Nếu không thay đổi, set opacity = 0.3
  }
};

[
  minInputField,
  lowInventoryField,
  lowCustomerDebtField,
  stockAfterSaleField,
  ruleYesRadio,
  ruleNoRadio,
].forEach((field) => {
  field.addEventListener("change", checkIfFieldsChanged); // Khi có thay đổi, kiểm tra
});

checkIfFieldsChanged();

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
