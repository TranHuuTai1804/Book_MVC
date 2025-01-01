document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("table-body");
  const editBtn = document.querySelector(".edit-btn");
  const doneBtn = document.querySelector(".done-btn");

  // Hàm lấy dữ liệu quy định từ máy chủ
  const fetchCustomers = async () => {
    try {
      const response = await fetch("/regulation");

      if (!response.ok) {
        throw new Error(`Lỗi HTTP! Mã lỗi: ${response.status}`);
      }

      const regulations = await response.json();
      populateTable(regulations);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error.message);
    }
  };

  // Function to populate the table with customer data
  const populateTable = (regulations) => {
    tableBody.innerHTML = "";
    regulations.forEach((regulation) => {
      const row = document.createElement("tr");

      row.innerHTML = `
          <td><input type="text"  id="min_input" name="min_input" value="${
            regulation.So_luong_nhap_it_nhat
          }" class="input-field" readonly></td>
          <td><input type="text" id="low_inventory" name="low_inventory" value="${
            regulation.So_luong_ton_it_hon
          }" class="input-field" readonly></td>
          <td><input type="text" id="low_customer_debt" name="low_customer_debt" value="${
            regulation.Khach_hang_no_khong_qua
          }" class="input-field" readonly></td>
          <td><input type="text" id="stock_after_sale" name="stock_after_sale" value="${
            regulation.So_luong_ton_sau_khi_ban_it_nhat
          }" class="input-field" readonly></td>
          <td>
          <select class="input-field" id="rule" name="rule"  disabled>
            <option value="0" ${
              regulation.Su_Dung_QD4.data[0] === 0 ? "selected" : ""
            }>Off</option>
            <option value="1" ${
              regulation.Su_Dung_QD4.data[0] !== 0 ? "selected" : ""
            }>On</option>
          </select>
        </td>
      `;

      tableBody.appendChild(row);
    });
  };

  // Sự kiện khi nút Edit được nhấn
  editBtn.addEventListener("click", (event) => {
    event.preventDefault(); // Ngừng hành động mặc định nếu cần

    // Lấy tất cả các ô input trong bảng và cho phép chỉnh sửa
    const inputs = document.querySelectorAll(".input-field");
    inputs.forEach((input) => {
      input.removeAttribute("readonly");
      input.removeAttribute("disabled");
    });

    // Hiển thị nút Done
    doneBtn.classList.add("active");
  });

  // Sự kiện khi nút Done được nhấn (Lưu thay đổi)
  doneBtn.addEventListener("click", (event) => {
    // Ẩn nút Done sau khi lưu xong
    doneBtn.classList.remove("active");

    // Chỉnh sửa lại trạng thái các ô input (set readonly hoặc disabled)
    const inputs = document.querySelectorAll(".input-field");
    inputs.forEach((input) => {
      input.setAttribute("readonly", "true"); // Đặt lại thành readonly
    });
  });

  // Lấy dữ liệu khi load trang
  fetchCustomers();
});

const editBtn = document.querySelector(".edit-btn");
const doneBtn = document.querySelector(".done-btn");

editBtn.addEventListener("click", (event) => {
  event.preventDefault();
  doneBtn.classList.add("active");
});

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
