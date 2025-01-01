let customers = [];

// Hàm fetch danh sách khách hàng
async function fetchCustomers() {
  try {
    const response = await fetch("receipts/profile");
    if (!response.ok) {
      throw new Error("Failed to fetch customers");
    }
    const data = await response.json();
    customers = data.map((customer) => ({
      name: customer.Ten_khach_hang,
      phone: customer.So_dien_thoai,
      address: customer.Dia_chi,
      email: customer.Email,
    }));
  } catch (error) {
    console.error("Error fetching customers:", error);
  }
}

// Gọi fetch khi trang tải
document.addEventListener("DOMContentLoaded", fetchCustomers);

// Hiển thị gợi ý khách hàng
function showCustomerSuggestions(inputElement) {
  const suggestionsBox = document.querySelector(".customerSuggestions");
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
    .map(
      (customer) =>
        `<div onclick="selectCustomer('${customer.name}')">${customer.name}</div>`
    )
    .join("");
  suggestionsBox.style.display = "block";
}

// // Khi chọn một gợi ý hoặc nhập đúng tên khách hàng
// function selectCustomer(customerName) {
//   const customer = customers.find((c) => c.name === customerName);

//   if (customer) {
//     // Tự động điền thông tin khách hàng
//     document.getElementById("customer").value = customer.name;
//     document.getElementById("phone").value = customer.phone || "";
//     document.getElementById("address").value = customer.address || "";
//     document.getElementById("email").value = customer.email || "";
//   }

//   // Ẩn gợi ý
//   document.querySelector(".customerSuggestions").style.display = "none";
// }

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

// Hiển thị toast
function showToast(type) {
  // Lấy phần tử toast tương ứng
  const toast =
    type === "success"
      ? document.getElementById("toastSuccess")
      : document.getElementById("toastError");

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

async function addBook() {
  const bookId = document.getElementById('book-id').value;

  // Fetch book data from the API
  try {
    const response = await fetch(`/api/books/${bookId}`);
    if (!response.ok) {
      throw new Error('Book not found');
    }
    const bookDatas = await response.json();

    bookDatas.forEach(bookData => {
      const tableBody = document.getElementById('book-table').getElementsByTagName('tbody')[0];
      // Check if the book is already in session storage
      const currentBooks = JSON.parse(sessionStorage.getItem('books')) || [];
      const existingBook = currentBooks.find(book => book.ID_sach === bookData.ID_sach);

      // Check if the book already exists in the table
      const existingRow = Array.from(tableBody.rows).find(row => parseInt(row.cells[0].textContent) === bookData.ID_sach);

      if (existingRow) {
        // Update quantity
        const quantityInput = existingRow.getElementsByTagName('input')[0];
        quantityInput.value = parseInt(quantityInput.value) + 1; // Increment quantity
        updateTotal(quantityInput, bookData.Gia); // Update total price for this book

        // Update session storage quantity
        if (existingBook) {
          existingBook.quantity += 1; // Increment quantity in session storage
        }
      } else {
        // Add new book data to the table
        const newRow = tableBody.insertRow();
        newRow.innerHTML = `
                  <td>${bookData.ID_sach}</td>
                  <td>${bookData.Ten_sach}</td>
                  <td>${bookData.Ten_tac_gia}</td>
                  <td>${bookData.Gia}</td>
                  <td>
                      <input type="number" value="1" min="1" onchange="updateTotal(this, ${bookData.Gia})">
                  </td>
                  <td class="total-price">${bookData.Gia}</td>
                  <td><button type="button" onclick="removeBook(this)">Xóa</button></td>
              `;
        tableBody.appendChild(newRow);

        // Store book data in session storage

        currentBooks.push({
          ID_sach: bookData.ID_sach,
          Ten_sach: bookData.Ten_sach,
          Ten_tac_gia: bookData.Ten_tac_gia,
          Gia: bookData.Gia,
          quantity: 1 // Default quantity
        });
        sessionStorage.setItem('books', JSON.stringify(currentBooks));
      }
    });
  } catch (error) {
    alert(error.message);
  }
  updateOverallTotal();
}

// Function to calculate and update the overall total amount
function updateOverallTotal() {
  const totalPriceCells = document.getElementsByClassName('total-price');
  let grandTotal = 0;

  for (let cell of totalPriceCells) {
    grandTotal += parseFloat(cell.textContent);
  }

  // Update the total amount displayed
  document.getElementById('total-amount').textContent = grandTotal.toFixed(2);
}

// Function to update the total price based on quantity
function updateTotal(input, price) {
  const quantity = parseInt(input.value);
  const totalPriceCell = input.closest('tr').getElementsByClassName('total-price')[0];
  const individualTotal = price * quantity;
  totalPriceCell.textContent = individualTotal.toFixed(2); // Update individual total price

  // Update overall total
  updateOverallTotal();
  // Update quantity in session storage
  updateBooksInSessionStorage(input, quantity);
}

// Function to update the books in session storage
function updateBooksInSessionStorage(input, quantity) {
  // Get the current books from session storage
  const booksString = sessionStorage.getItem('books');
  const books = booksString ? JSON.parse(booksString) : [];

  // Find the book related to this input
  // Get the book ID from the input field
  const bookId = document.getElementById('book-id').value.trim(); // Use the input field's value

  const bookIndex = books.findIndex(book => book.ID_sach === bookId); // Adjust to match the property name

  console.log('Current books in session storage:', books);
  console.log('Book ID:', bookId);
  console.log('Book Index:', bookIndex);
  console.log('Updated Quantity:', quantity);

  if (bookIndex !== -1) {
    // Update the quantity for the specific book
    books[bookIndex].quantity = quantity;
    console.log(`Updated quantity for ${bookId}:`, books[bookIndex].quantity);
  } else {
    console.warn(`Book with ID ${bookId} not found.`);
  }

  // Save the updated books array back to session storage
  sessionStorage.setItem('books', JSON.stringify(books));
}

function removeBook(button) {
  const row = button.parentNode.parentNode;
  row.parentNode.removeChild(row);
  updateOverallTotal();
  sessionStorage.removeItem('books');
}

async function submitForm() {
  // const form = document.getElementById('receipt-form');
  // if (form.checkValidity()) {
  //   // If the form is valid, submit it
  //   form.submit();
  // } else {
  //   // If invalid, show validation messages
  //   form.reportValidity();
  // }
  // Gather form data
  // Gather form data
  const booksString = sessionStorage.getItem('books'); // Get books from session storage
  console.log(booksString);
  const formData = {
    dateReceipt: document.getElementById('date-receipt').value,
    invoiceId: document.getElementById('invoice-id').value,
    customerId: document.getElementById('customer-id').value,
    customer: document.getElementById('customer').value,
    phone: document.getElementById('phone').value,
    email: document.getElementById('email').value,
    address: document.getElementById('address').value,
    books: booksString ? JSON.parse(booksString) : [], // Use an empty array if null
    total: document.getElementById('total-amount').textContent,
  };
  console.log(formData.books);

  // Send the data to the server
  try {
    const response = await fetch('/api/submitInfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error('Failed to submit the form');
    }

    const result = await response.json();
    alert(result.message); // Show success message

    // Optionally reset the form
    document.getElementById('receipt-form').reset();
    sessionStorage.removeItem('books'); // Clear session storage after submitting
  } catch (error) {
    alert(error.message); // Show error message
  }
}