// // Lưu dữ liệu bảng vào localStorage
// function saveTableToLocalStorage() {
//   const tableBody = document.getElementById("table-body");
//   const rowsData = Array.from(tableBody.children).map((row) => {
//     const inputs = Array.from(row.querySelectorAll("input"));
//     return inputs.map((input) => input.value); // Lưu giá trị của từng ô nhập liệu
//   });
//   localStorage.setItem("tableData", JSON.stringify(rowsData));
// }

// // Khôi phục dữ liệu từ localStorage
// function loadTableFromLocalStorage() {
//   const tableBody = document.getElementById("table-body");
//   const storedData = localStorage.getItem("tableData");

//   if (storedData) {
//     const rowsData = JSON.parse(storedData);

//     tableBody.innerHTML = ""; // Xoá nội dung hiện tại của bảng
//     rowsData.forEach((rowData) => {
//       const newRow = document.createElement("tr");
//       newRow.innerHTML = `
//           <td><input type="text" name="id[]" value="${
//             rowData[0] || ""
//           }" placeholder="ID" class="book-no" required></td>
//           <td class="nameBook">
//             <input type="text" name="name[]" value="${
//               rowData[1] || ""
//             }" placeholder="Book name" class="book-name" oninput="showSuggestions(this)" required>
//             <div class="autocomplete-suggestions" style="display: none;"></div>
//           </td>
//           <td><input type="text" name="category[]" value="${
//             rowData[2] || ""
//           }" placeholder="Category" class="book-category" required></td>
//           <td><input type="text" name="author[]" value="${
//             rowData[3] || ""
//           }" placeholder="Author" class="book-author" required></td>
//           <td><input type="number" name="quantity[]" value="${
//             rowData[4] || ""
//           }" placeholder="Quantity" class="book-quantity" min="1" required data-regulation></td>
//           <td><input type="number" name="price[]" value="${
//             rowData[5] || ""
//           }" placeholder="Price" class="book-price" step="0.01" min="0" required></td>
//         `;
//       tableBody.appendChild(newRow);
//     });
//   }
// }

// Hàm lấy giá trị So_luong_ton_it_nhat từ server
async function fetchSoLuongTonItHon() {
  try {
    const response = await fetch("/regulation");
    if (!response.ok) {
      throw new Error("Failed to fetch regulation");
    }
    const regulations = await response.json();
    const soLuongTonItHon = regulations?.[0]?.So_luong_ton_it_hon;

    // console.log(soLuongTonItHon);

    if (soLuongTonItHon !== undefined) {
      return soLuongTonItHon;
    } else {
      console.error("Không tìm thấy giá trị So_luong_ton_it_hon");
      return 0; // Hoặc một giá trị mặc định nếu không có
    }
  } catch (error) {
    console.error("Error fetching So_luong_ton_it_nhat:", error);
    return 0; // Giá trị mặc định nếu có lỗi
  }
}

let minRemain = 0;
let minIn = 0;
let useRules = false;

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
    let listOfRegulations = [];
    // Phân tích phản hồi dưới dạng JSON
    const regulations = await response.json();
    regulations.forEach((regulation, index) => {
      listOfRegulations.push(regulation.So_luong_nhap_it_nhat);
      listOfRegulations.push(regulation.So_luong_ton_it_hon);
      listOfRegulations.push(regulation.Su_Dung_QD4.data[0]);
    });
    minIn = listOfRegulations[0];
    minRemain = listOfRegulations[1];
    useRules = listOfRegulations[2];
  } catch (error) {
    // Log lỗi chi tiết hơn, bao gồm thông tin về lỗi HTTP, lỗi JSON và lỗi từ backend nếu có
    console.error("Lỗi khi lấy dữ liệu khách hàng:", error.message);

    // Hiển thị thông báo lỗi cho người dùng (nếu cần)
    alert(`Có lỗi xảy ra khi lấy dữ liệu: ${error.message}`);
  }
};

const updateData = async () => {
  await fetchCustomers();
  if (useRules) {
    document.getElementById("min-import").textContent = minIn;
    document.getElementById("min-stock").textContent = minRemain;
  } else {
    document.getElementById("min-import").textContent = "None";
    document.getElementById("min-stock").textContent = "None";
  }
};

updateData();
let minInput = [];
let isMinEnabled = false;

// Tải quy định từ server
async function fetchRegulation() {
  try {
    const response = await fetch("/regulation");
    if (!response.ok) throw new Error("Failed to fetch regulations");

    const regulations = await response.json();

    // Xác định trạng thái quy định và cập nhật giá trị
    processRegulations(regulations);

    // Cập nhật input sau khi xử lý xong quy định
    updateInputMinValues();
  } catch (error) {
    console.error("Error fetching regulations:", error);
  }
}

// Xử lý dữ liệu quy định
function processRegulations(regulations) {
  // Kiểm tra xem có quy định hợp lệ không
  if (!regulations || !Array.isArray(regulations) || regulations.length === 0) {
    console.warn("No regulations found"); // Cảnh báo khi không có dữ liệu quy định
    isMinEnabled = false; // Tắt quy định
    minInput = []; // Đặt lại mảng minInput
    return;
  }

  // Kiểm tra giá trị Su_Dung_QD4
  const suDungQD4 = regulations[0]?.Su_Dung_QD4?.data?.[0];

  // Kiểm tra nếu Su_Dung_QD4 = 0
  isMinEnabled = Number(suDungQD4) !== 0;

  if (isMinEnabled) {
    minInput = regulations.map((reg) => reg.So_luong_nhap_it_nhat);
    console.log("Quy định nhập tối thiểu được bật:", minInput);
  } else {
    console.log("Quy định nhập tối thiểu đang tắt.");
    minInput = []; // Làm rỗng mảng minInput khi tắt quy định
  }
}

// Cập nhật giá trị min cho các input
function updateInputMinValues() {
  const inputs = document.querySelectorAll("input[data-regulation]");
  inputs.forEach((input, index) => {
    if (isMinEnabled && minInput[index] !== undefined) {
      input.min = minInput[index];
    } else {
      input.removeAttribute("min");
    }
  });
}

// Gọi hàm tải quy định khi trang được tải
document.addEventListener("DOMContentLoaded", fetchRegulation);

// Toast
const urlParams = new URLSearchParams(window.location.search);
const message = urlParams.get("message");

if (message) {
  const isError =
    message.toLowerCase().includes("vượt quá") ||
    message.toLowerCase().includes("error");

  // Hiển thị Toast
  Toastify({
    text: decodeURIComponent(message),
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    backgroundColor: isError
      ? "linear-gradient(to right, #ff5f6d, #ffc371)" // Màu dành cho lỗi
      : "linear-gradient(to right, #00b09b, #96c93d)", // Màu dành cho thành công
  }).showToast();

  // Xóa chuỗi truy vấn để tránh hiển thị lại khi reload trang
  window.history.replaceState({}, document.title, window.location.pathname);
}

let booksList = [];

// Hàm lấy danh sách sách từ API và cập nhật mảng booksList
async function fetchBookTitles() {
  try {
    const response = await fetch("/api/books");
    if (!response.ok) {
      throw new Error("Failed to fetch books");
    }
    const books = await response.json();

    // Cập nhật mảng booksList với tên sách, thể loại và tác giả
    booksList = books.map((book) => ({
      ID_sach: book.ID_sach,
      Ten_sach: book.Ten_sach,
      The_loai: book.The_loai,
      Ten_tac_gia: book.Ten_tac_gia,
      Gia: book.Gia,
      So_luong: book.So_luong,
    }));

    // console.log("Danh sách sách hiện tại:", booksList);
  } catch (error) {
    console.error("Error fetching books:", error);
  }
}

// Gọi hàm fetchBookTitles và đảm bảo rằng dữ liệu được tải xong trước khi cho phép tìm kiếm
document.addEventListener("DOMContentLoaded", async () => {
  await fetchBookTitles();
});

// Hàm khi người dùng chọn một gợi ý
// Hàm để hiển thị các gợi ý
function showSuggestions(inputElement) {
  const suggestionsBox = inputElement.nextElementSibling; // Lấy thẻ div chứa gợi ý
  const searchTerm = inputElement.value.trim().toLowerCase();

  // Nếu không có gì để tìm, ẩn gợi ý
  if (!searchTerm) {
    suggestionsBox.style.display = "none";
    return;
  }

  // Lọc danh sách sách dựa trên từ khóa người dùng nhập (so sánh tên sách)
  const filteredBooks = booksList.filter(
    (book) => book.Ten_sach.toLowerCase().includes(searchTerm) // Tìm theo tên sách
  );

  // Nếu không tìm thấy gợi ý nào, ẩn gợi ý
  if (filteredBooks.length === 0) {
    suggestionsBox.style.display = "none";
    return;
  }

  // Hiển thị các gợi ý
  suggestionsBox.innerHTML = filteredBooks
    .map(
      (book) =>
        `<div onclick="selectSuggestion('${book.Ten_sach}', this)">${book.Ten_sach}</div>` // Hiển thị tên sách
    )
    .join("");
  suggestionsBox.style.display = "block";
}

// Hàm khi người dùng chọn một gợi ý
function selectSuggestion(bookName, suggestionElement) {
  try {
    // Lấy thẻ input chứa gợi ý
    const inputElement = suggestionElement.closest("td").querySelector("input");
    inputElement.value = bookName; // Gán giá trị gợi ý vào ô input

    // Ẩn hộp gợi ý
    const suggestionsBox = suggestionElement.parentElement;
    suggestionsBox.style.display = "none";

    // Tìm sách trong danh sách để lấy thông tin chi tiết
    const selectedBook = booksList.find((b) => b.Ten_sach === bookName);
    if (!selectedBook) {
      console.error(`Không tìm thấy sách: ${bookName}`);
      return;
    }

    // Tự động điền thông tin vào các ô input liên quan
    const row = inputElement.closest("tr");
    const categoryInput = row.querySelector('input[name="category[]"]');
    const authorInput = row.querySelector('input[name="author[]"]');
    const priceInput = row.querySelector('input[name="price[]"]');
    const remainsInput = row.querySelector('input[name="remains[]"]');
    const statusInput = row.querySelector('input[name="status[]"]');

    if (categoryInput) categoryInput.value = selectedBook.The_loai || "";
    if (authorInput) authorInput.value = selectedBook.Ten_tac_gia || "";
    if (priceInput) priceInput.value = selectedBook.Gia || "";
    if (remainsInput) remainsInput.value = selectedBook.So_luong || "";
    // Gắn sự kiện blur cho tất cả các trường quantity
    const quantityInputs = document.querySelectorAll(
      'input[name="quantity[]"]'
    );
    quantityInputs.forEach((input) => {
      input.addEventListener("blur", function () {
        checkQuantityInput(input);
      });
    });
    if (remainsInput.value >= minRemain) {
      remainsInput.style.borderColor = "#d17069";
      remainsInput.style.backgroundColor = "#e8b5a7";
    }

    // Thêm ảnh bìa vào ô tương ứng
    if (remainsInput.value > 0) statusInput.value = "In stock";
    else statusInput.value = "Out of stock";
  } catch (error) {
    console.error("Lỗi khi chọn gợi ý:", error);
  }
}

const quantityInputs = document.querySelectorAll('input[name="quantity[]"]');
quantityInputs.forEach((input) => {
  input.addEventListener("blur", function () {
    checkQuantityInput(input);
  });
});

function checkQuantityInput(input) {
  if (input.value <= minIn) {
    input.style.borderColor = "red";
    input.style.backgroundColor = "#e8b5a7"; // Tô viền đỏ nếu chưa điền hoặc giá trị không hợp lệ
  } else {
    input.style.borderColor = ""; // Xóa viền đỏ nếu giá trị hợp lệ
  }
}

//Xoá hàng
function deleteRow() {
  const tableBody = document.getElementById("table-body");
  // Kiểm tra nếu bảng có ít nhất một hàng
  if (tableBody.children.length > 0) {
    // Xoá hàng cuối cùng
    tableBody.removeChild(tableBody.lastElementChild);
  } else {
    // Hiển thị thông báo nếu không còn hàng
    alert("Không còn hàng nào để xoá!");
  }
}

// Hàm thêm hàng mới
function addRow() {
  const tableBody = document.getElementById("table-body");
  const rowIndex = tableBody.children.length;

  const newRow = document.createElement("tr");
  newRow.classList.add("table-row");
  newRow.innerHTML = `
      <td class="nameBook">
          <input type="text" name="name[]" placeholder="Book name" class="book-name" data-row-index="${rowIndex}" oninput="showSuggestions(this)" required>
          <div class="autocomplete-suggestions" style="display: none;"></div>
      </td>
      <td><input type="text" name="category[]" placeholder="Category" class="book-category" data-row-index="${rowIndex}" required></td>
      <td><input type="text" name="author[]" placeholder="Author" class="book-author" data-row-index="${rowIndex}" required></td>
      <td><input type="number" name="quantity[]" placeholder="Quantity" class="book-quantity" min="1" data-row-index="${rowIndex}" required></td>
      <td><input type="number" name="price[]" placeholder="Price" class="book-price" step="0.01" min="0" data-row-index="${rowIndex}" required></td>
      <td><input type="number" name="remains[]" placeholder="Remains" class="book-remains" data-row-index="${rowIndex}" required></td>
      <td><input type="text" name="status[]" placeholder="Status" placeholder="Status" class="book-status" data-row-index="${rowIndex}" required></td>
      <td class="delete-cell"><img src="img/delete.png" alt="Delete" class="delete-btn" onclick="deleteRow(this)" style="cursor: pointer; width: 20px; height: 20px" required/></td>
    `;
  tableBody.appendChild(newRow);
}

// Ẩn gợi ý khi người dùng nhấp bên ngoài
document.addEventListener("click", function (e) {
  if (
    !e.target.matches(".book-name") &&
    !e.target.matches(".autocomplete-suggestions div")
  ) {
    document
      .querySelectorAll(".autocomplete-suggestions")
      .forEach((suggestion) => {
        suggestion.style.display = "none";
      });
  }
});

// Hàm toggle menu
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
    }, 10);
    overlay.style.display = "block";
    icon.textContent = "<";

    // Thêm lớp menu-open để di chuyển icon
    body.classList.add("menu-open");
  } else {
    menu.style.left = "-30%"; // Ẩn menu với hiệu ứng trượt
    overlay.style.display = "none";
    icon.textContent = ">";

    // Loại bỏ lớp menu-open để di chuyển icon về vị trí ban đầu
    body.classList.remove("menu-open");

    setTimeout(() => {
      menu.style.display = "none";
    }, 300);
  }
}

// Lấy thẻ input ngày
const dateInput = document.getElementById("date-receipt");

// Hàm để lấy ngày hiện tại theo định dạng YYYY-MM-DD
function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Gán ngày hiện tại vào thẻ input khi trang được tải lên
dateInput.value = getCurrentDate();

// Cập nhật ngày khi người dùng nhấp vào thẻ input
dateInput.addEventListener("focus", function () {
  dateInput.value = getCurrentDate(); // Gán lại ngày hiện tại nếu có thay đổi
});

async function submitBooks() {
  const rows = document.querySelectorAll("#table-body tr");
  const books = [];
  let hasEmptyField = false;
  let totalQuantity = 0;

  // Lặp qua từng dòng sách trong bảng
  rows.forEach((row) => {
    const cells = row.querySelectorAll("input");
    const bookData = {
      no: cells[0].value.trim(),
      name: cells[1].value.trim(),
      category: cells[2].value.trim(),
      author: cells[3].value.trim(),
      quantity: parseInt(cells[4].value.trim()) || 0,
      price: parseFloat(cells[5].value.trim()) || 0,
    };

    // Kiểm tra nếu bất kỳ trường nào bị bỏ trống
    if (
      !bookData.name ||
      !bookData.category ||
      !bookData.author ||
      bookData.quantity <= 0
    ) {
      hasEmptyField = true;
    }

    totalQuantity += bookData.quantity;
    books.push(bookData);
  });

  try {
    // Làm mới bảng sau khi nhấn Done
    document.getElementById("table-body").innerHTML = `
        <tr>
          <td class="nameBook">
            <input type="text" name="name[]" placeholder="Book name" class="book-name" oninput="showSuggestions(this)" required>
            <div class="autocomplete-suggestions" style="display: none;"></div>
          </td>
          <td><input type="text" name="category[]" placeholder="Category" class="book-category" required></td>
          <td><input type="text" name="author[]" placeholder="Author" class="book-author" required></td>
          <td><input type="number" name="quantity[]" placeholder="Quantity" class="book-quantity" min="1" required></td>
          <td><input type="number" name="price[]" placeholder="Price" class="book-price" step="0.01" min="0" required></td>
          <td><input type="number" name="remains[]" placeholder="Remains" class="book-remains" required></td>
          <td><input type="text" name="status[]" placeholder="Status" class="book-status" required></td>
        </tr>
      `;
  } catch (error) {
    // Hiển thị lỗi nếu xảy ra vấn đề khi gọi API
    console.error("Error in submitBooks:", error);
  }
}

// Hàm hiển thị danh sách mặc định (tất cả các loại sách)
async function showDefaultList() {
  try {
    // Gọi API để lấy tất cả sách
    const response = await fetch("/api/books");
    if (!response.ok) {
      throw new Error("Failed to fetch books");
    }
    const books = await response.json();

    const filteredBooks = books.filter((book) => book.So_luong < minRemain);

    // Hiển thị danh sách mặc định
    const bookContainer = document.querySelector(".book-container");
    bookContainer.innerHTML = ""; // Xóa nội dung cũ nếu có

    filteredBooks.forEach((book) => {
      const bookItem = document.createElement("div");
      bookItem.className = "book-item";

      // Sử dụng link từ cơ sở dữ liệu để hiển thị hình ảnh
      const bookImage = book.Link; // Lấy link từ dữ liệu sách

      bookItem.innerHTML = `
        <img src="/img/${bookImage}" alt="${book.Ten_sach}" class="book-image">
        <h3 class="book-title-img">${book.Ten_sach}</h3>
        <p class="book-author-img">${book.Ten_tac_gia}</p>
        <p class="book-category-img">${book.The_loai}</p>
        <p class="book-price-img">$${book.Gia}</p>
        <div class="progress-container">
          <span class="progress-text">${book.So_luong}</span>
          <div class="progress-bar" style="width: ${
            (book.So_luong / 100) * 100
          }%;"></div>
        </div>
      `;

      // Thêm sự kiện click để hiển thị chi tiết sách khi người dùng click vào sách
      bookItem.addEventListener("click", () => {
        selectBook(book);
        // Xóa sách đã chọn khỏi danh sách hiển thị
        bookItem.remove();
      });

      bookContainer.appendChild(bookItem);
    });
  } catch (error) {
    console.error("Error fetching books:", error);
  }
}

function selectBook(book) {
  // alert("here");
  const tableBody = document.getElementById("table-body");
  let emptyRow = null;
  for (let row of tableBody.rows) {
    const inputs = row.querySelectorAll("input");
    if (
      Array.from(inputs).some((input, index) => {
        // Bỏ qua ô "quantity" (thường là ô thứ 3 trong bảng)
        return index !== 3 && input.value === "";
      })
    ) {
      emptyRow = row;
      break;
    }
  }

  if (emptyRow) {
    const inputs = emptyRow.querySelectorAll("input");
    inputs[0].value = book.Ten_sach; // Tên sách
    inputs[1].value = book.The_loai; // Thể loại
    inputs[2].value = book.Ten_tac_gia; // Tác giả // Số lượng, có thể để trống để người dùng nhập
    inputs[4].value = book.Gia; // Giá
    inputs[5].value = book.So_luong; // Số lượng còn lại
    inputs[6].value = book.So_luong > 0 ? "In stock" : "Out of stock"; // Trạng thái
  } else {
    // Tạo một hàng mới trong bảng
    const newRow = document.createElement("tr");
    const status = book.So_luong > 0 ? "In stock" : "Out of stock";

    // Thêm các ô vào hàng
    newRow.innerHTML = `
    <td class="nameBook">
      <input type="text" name="name[]" value="${book.Ten_sach}" class="book-name" required />
    </td>
    <td>
      <input type="text" name="category[]" value="${book.The_loai}" class="book-category" required />
    </td>
    <td>
      <input type="text" name="author[]" value="${book.Ten_tac_gia}" class="book-author" required />
    </td>
    <td>
      <input type="number" name="quantity[]" placeholder="Quantity" class="book-quantity" min="1" required />
    </td>
    <td>
      <input type="number" name="price[]" value="${book.Gia}" class="book-price" step="0.01" min="0" required />
    </td>
    <td>
      <input type="number" name="remains[]" value="${book.So_luong}" class="book-remains" />
    </td>
    <td>
      <input type="text" name="status[]" value="${status}" class="book-status" />
    </td>
    <td class="delete-cell"> <img src="img/delete.png" alt="Delete" class="delete-btn" onclick="deleteRow(this)" style="cursor: pointer; width: 20px; height: 20px" required/></td>
  `;

    // Thêm hàng mới vào bảng
    tableBody.appendChild(newRow);

    const quantityInput = newRow.querySelector(".book-quantity");
    quantityInput.addEventListener("input", () => {
      const value = quantityInput.value;
      // Kiểm tra giá trị quantity, nếu nhỏ hơn 50 thì tô đỏ
      if (value < 50) {
        quantityInput.style.backgroundColor = "red";
      } else {
        quantityInput.style.backgroundColor = ""; // Khôi phục màu nền khi giá trị >= 50
      }
    });
  }
}

function deleteRowDetail(img) {
  const row = img.closest("tr"); // Lấy dòng chứa hình ảnh dấu "x"
  row.remove(); // Xóa dòng
}

document.addEventListener("DOMContentLoaded", async () => {
  await fetchBookTitles(); // Đảm bảo dữ liệu được tải trước khi cho phép tìm kiếm
  await showDefaultList(); // Hiển thị tất cả các sách ngay khi trang tải
});
