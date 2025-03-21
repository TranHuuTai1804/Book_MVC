let customers = [];

// Fetch danh sách khách hàng
async function fetchCustomers() {
  try {
    const response = await fetch("/profile");
    if (!response.ok) {
      throw new Error("Failed to fetch customers");
    }
    const data = await response.json();
    if (!data || !Array.isArray(data)) {
      throw new Error("Invalid customer data format");
    }
    customers = data.map((customer) => ({
      name: customer.Ten_khach_hang,
      phone: customer.So_dien_thoai,
      address: customer.Dia_chi,
      email: customer.Email,
      debt: customer.Tien_no,
    }));

    // Đảm bảo rằng `console.log` chỉ được gọi sau khi mảng customers được cập nhật
  } catch (error) {
    alert("err");
    console.error("Error fetching customers:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetchCustomers(); // Gọi hàm khi DOM đã sẵn sàng
});

// Hiển thị gợi ý khách hàng
function showCustomerSuggestions(inputElement) {
  const suggestionsBox = document.querySelector(
    ".autocomplete-suggestions.nameCustomer"
  );
  if (!suggestionsBox || !inputElement) return 0;

  const searchTerm = inputElement.value.trim().toLowerCase();

  if (!searchTerm) {
    suggestionsBox.style.display = "none";
    return;
  }

  // Lọc khách hàng phù hợp
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm)
  );

  if (filteredCustomers.length === 0) {
    suggestionsBox.style.display = "none";
    return;
  }

  // Hiển thị gợi ý
  suggestionsBox.innerHTML = filteredCustomers
    .map((customer) => {
      const regex = new RegExp(`(${searchTerm})`, "gi");
      const highlightedName = customer.name.replace(
        regex,
        "<strong>$1</strong>"
      );
      return `<div class="suggestion-item" onclick="selectCustomer('${encodeURIComponent(
        customer.name
      )}')">${highlightedName}</div>`;
    })
    .join("");

  suggestionsBox.style.display = "block";
}

// Khi chọn một gợi ý hoặc nhập đúng tên khách hàng
function selectCustomer(customerNameEncoded) {
  const customerName = decodeURIComponent(customerNameEncoded);
  const customer = customers.find((c) => c.name === customerName);

  if (customer) {
    const customerInput = document.getElementById("customer-name");
    if (customerInput) customerInput.value = customer.name;
  }

  const suggestionsBox = document.querySelector(
    ".autocomplete-suggestions.nameCustomer"
  );
  if (suggestionsBox) {
    suggestionsBox.style.display = "none";
  }
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

// Hàm để hiển thị các gợi ý
function showSuggestions(inputElement) {
  const suggestionsBox = inputElement.nextElementSibling; // Lấy thẻ div chứa gợi ý
  const searchTerm = inputElement.value.trim().toLowerCase();

  if (!searchTerm) {
    suggestionsBox.style.display = "none";
    return;
  }

  const filteredBooks = booksList.filter((book) =>
    book.Ten_sach.toLowerCase().includes(searchTerm)
  );

  if (filteredBooks.length === 0) {
    suggestionsBox.style.display = "none";
    return;
  }

  suggestionsBox.innerHTML = filteredBooks
    .map(
      (book) =>
        `<div onclick="selectSuggestion('${book.Ten_sach}', '${inputElement.dataset.rowIndex}')">${book.Ten_sach}</div>`
    )
    .join("");
  suggestionsBox.style.display = "block";
}

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
    const idInput = row.querySelector('input[name="id[]"]');
    const categoryInput = row.querySelector('input[name="category[]"]');
    const authorInput = row.querySelector('input[name="author[]"]');
    const priceInput = row.querySelector('input[name="price[]"]');

    if (idInput) idInput.value = selectedBook.ID_sach || "";
    if (categoryInput) categoryInput.value = selectedBook.The_loai || "";
    if (authorInput) authorInput.value = selectedBook.Ten_tac_gia || "";
    if (priceInput) priceInput.value = selectedBook.Gia || "";
  } catch (error) {
    console.error("Lỗi khi chọn gợi ý:", error);
  }
}

function calculatePrice(inputElement) {
  const quantity = parseInt(inputElement.value);
  const row = inputElement.closest("tr");
  const priceInput = row.querySelector("input[name='price[]']");
  const bookName = row.querySelector("input[name='name[]']").value;

  const selectedBook = booksList.find((book) => book.Ten_sach === bookName);
  priceInput.value =
    selectedBook && quantity > 0 ? selectedBook.Gia * quantity : "";
}

//Xoá dòng
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

//Thêm dòng
function addRow() {
  const tableBody = document.getElementById("table-body");

  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td><input type="text" name="id[]" placeholder="ID" class="book-no" required></td>
    <td class="nameBook">
      <input type="text" name="name[]" placeholder="Book name" class="book-name" oninput="showSuggestions(this)" required>
      <div class="autocomplete-suggestions" style="display: none;"></div>
    </td>
    <td><input type="text" name="category[]" placeholder="Category" class="book-category" required></td>
    <td><input type="number" name="quantity[]" placeholder="Quantity" class="book-quantity" min="1" oninput="calculatePrice(this)" required></td>
    <td><input type="number" name="price[]" placeholder="Price" class="book-price" step="0.01" min="0" required></td>
  `;
  tableBody.appendChild(newRow);
}

function submitBooks() {
  const rows = document.querySelectorAll("#table-body tr");
  const books = [];
  let hasEmptyField = false;

  rows.forEach((row) => {
    const bookData = {
      no: row.querySelector("input[name='id[]']").value.trim(),
      name: row.querySelector("input[name='name[]']").value.trim(),
      category: row.querySelector("input[name='category[]']").value.trim(),
      quantity: row.querySelector("input[name='quantity[]']").value.trim(),
      price: row.querySelector("input[name='price[]']").value.trim(),
    };

    if (Object.values(bookData).some((value) => !value)) {
      hasEmptyField = true;
    }

    books.push(bookData);
  });

  if (hasEmptyField) {
    showToast("error");
    return;
  }

  console.log("Books data:", books);
  showToast("success");
  document.getElementById("table-body").innerHTML = "";
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

function showToast(type) {
  const toast =
    type === "success"
      ? document.getElementById("toastSuccess")
      : document.getElementById("toastError");

  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

function checkCustomer() {
  const phoneInput = document.getElementById('phone').value;

  // Check if the phone number is 10 digits long
  if (phoneInput.length !== 10 || isNaN(phoneInput)) {
    alert("Please enter a 10-digit phone number.");
    return;
  }

  // Call the server to check if the customer exists
  fetch('/check-customer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ phone: phoneInput })
  })
    .then(response => response.json())
    .then(data => {
      if (data.exists) {
        // Populate the form fields with the customer data
        document.getElementById('customer').value = data.name;
        document.getElementById('email').value = data.email;
        document.getElementById('address').value = data.address;
        // Update the amount due based on the debt value
        if (data.debt < 0) {
          document.getElementById('amount-due').innerHTML = data.debt; // Show as 0 for negative debt
          document.querySelector('.form-group label[for="amount-due"]').innerHTML = `Amount Owed by Customer:`;
        } else {
          document.getElementById('amount-due').innerHTML = data.debt; // Show positive debt
          document.querySelector('.form-group label[for="amount-due"]').innerHTML = `Remaining Amount:`;
        }
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

async function submitForm() {
  const form = document.getElementById('receipt-form');

  // Create a FormData object to easily gather form data
  const formData = new FormData(form);

  // Optional: Validate form data here if needed
  const customer = formData.get('customer').trim();
  const address = formData.get('address').trim();
  const phone = formData.get('phone').trim();
  const email = formData.get('email').trim();
  const totalPaid = formData.get('total-paid').trim();

  // Example validation
  if (!customer || !address || !phone || !email || !totalPaid) {
    alert('Please fill in all fields!');
    return; // Exit function if validation fails
  }

  // Prepare the data for submission (you can convert it to JSON if needed)
  const data = {
    customer,
    address,
    phone,
    email,
    dateReceipt: formData.get('date-receipt'), // Assuming this is set somewhere
    totalPaid
  };

  try {
    // Fetch regulations
    const regulationsResponse = await fetch('/api/getRegulations');
    const regulations = await regulationsResponse.json();
    const suDungQD4 = regulations[0].Su_Dung_QD4; // Regulation flag

    // Check customer debt
    const customerDebtResponse = await fetch(`/api/getCustomerDebt?phone=${data.phone}`);
    const customerDebt = await customerDebtResponse.json();
    console.log(customerDebt.debt);
    let positiveDebt = 0;  // Initialize positiveDebt

    // Check if customerDebt.debt is negative
    if (customerDebt.debt < 0) {
      positiveDebt = Math.abs(customerDebt.debt);
    }

    // Mock submission to a server (replace with your actual API endpoint)
    const response = await fetch('/api/receipts/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    // Check totalPay against positiveDebt if Su_Dung_QD4 is true
    if (suDungQD4 && positiveDebt > 0 && parseFloat(data.totalPaid) > positiveDebt) {
      alert(`The total payment cannot exceed the current debt (${positiveDebt} VNĐ).`);
      return;
    }

    // Check if the response is successful
    if (response.ok) {
      const result = await response.json();
      alert('Information has been successfully submitted!');
    } else {
      alert('An error occurred. Please try again.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Có lỗi xảy ra. Vui lòng kiểm tra kết nối mạng và thử lại.');
  }
}