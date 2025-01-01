sessionStorage.removeItem('books');

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
  const bookId = document.getElementById('book-id').value.trim(); // Get and trim the input value

  // Check if the input is empty
  if (!bookId) {
    alert('Vui lòng nhập ID sách hoặc tên sách.'); // Alert the user to enter a value
    return; // Exit the function if the input is empty
  }

  // Fetch book data from the API
  try {
    const response = await fetch(`/api/books/${bookId}`);

    // Check if the response indicates that the book was not found
    if (!response.ok) {
      // Show a message if the book does not exist
      alert('Không tìm thấy sách với ID hoặc tên này.'); // Alert the user that the book does not exist
      return; // Exit the function
    }

    const bookDatas = await response.json();

    // Check if bookDatas is empty
    if (bookDatas.length === 0) {
      alert('Không tìm thấy sách với ID hoặc tên này.'); // Alert the user that the book does not exist
      return; // Exit the function
    }

    bookDatas.forEach(bookData => {
      const tableBody = document.getElementById('book-table').getElementsByTagName('tbody')[0];

      // Check if the book is already in session storage
      const currentBooks = JSON.parse(sessionStorage.getItem('books')) || [];
      const existingRow = Array.from(tableBody.rows).find(row => parseInt(row.cells[0].textContent) === bookData.ID_sach);

      if (existingRow) {
        // Update quantity
        const quantityInput = existingRow.getElementsByTagName('input')[0];
        quantityInput.value = parseInt(quantityInput.value) + 1; // Increment quantity
        updateTotal(quantityInput, bookData.Gia, bookData.ID_sach); // Update total price for this book
        updateBooksInSessionStorage(bookData.ID_sach, quantityInput.value); // Update session storage
      } else {
        // Add new book data to the table
        const newRow = tableBody.insertRow();
        newRow.innerHTML = `
                  <td>${bookData.ID_sach}</td>
                  <td>${bookData.Ten_sach}</td>
                  <td>${bookData.Ten_tac_gia}</td>
                  <td>${bookData.Gia}</td>
                  <td>
                      <input type="number" value="1" min="1" onchange="updateTotal(this, ${bookData.Gia}, ${bookData.ID_sach})">
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
    alert('Đã xảy ra lỗi: ' + error.message); // Show a generic error message
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
function updateTotal(input, price, id) {
  const quantity = parseInt(input.value);
  const totalPriceCell = input.closest('tr').getElementsByClassName('total-price')[0];
  const individualTotal = price * quantity;
  totalPriceCell.textContent = individualTotal.toFixed(2); // Update individual total price

  // Update overall total
  updateOverallTotal();

  // Update quantity in session storage
  updateBooksInSessionStorage(id, quantity); // Pass the book ID and updated quantity
}

// Function to update the books in session storage
function updateBooksInSessionStorage(bookId, quantity) {
  // Get the current books from session storage
  const booksString = sessionStorage.getItem('books');
  const books = booksString ? JSON.parse(booksString) : [];

  // Find the book related to this input (by ID)
  const bookIndex = books.findIndex(book => book.ID_sach === bookId);

  if (bookIndex !== -1) {
    // Update the quantity for the specific book
    books[bookIndex].quantity = quantity; // Set the quantity to match the input
  } else {
    console.warn(`Book with ID "${bookId}" not found.`);
  }

  // Save the updated books array back to session storage
  sessionStorage.setItem('books', JSON.stringify(books));
}

function removeBook(button) {
  const row = button.parentNode.parentNode; // Get the row of the book to be removed
  const bookId = row.cells[0].textContent; // Assuming the first cell contains the book ID

  // Remove the row from the table
  row.parentNode.removeChild(row);

  // Update overall total
  updateOverallTotal();

  // Remove the book from session storage
  const currentBooks = JSON.parse(sessionStorage.getItem('books')) || [];

  // Filter out the book to be removed
  const updatedBooks = currentBooks.filter(book => book.ID_sach !== bookId);

  // Update session storage
  sessionStorage.setItem('books', JSON.stringify(updatedBooks));
}
async function submitForm() {
  const form = document.getElementById('receipt-form');
  if (form.checkValidity()) {
    // If the form is valid, submit it
    form.submit();
  } else {
    // If invalid, show validation messages
    form.reportValidity();
  }
  // Gather form data
  const booksString = sessionStorage.getItem('books'); // Get books from session storage
  const formData = {
    dateReceipt: document.getElementById('date-receipt').value,
    invoiceId: document.getElementById('invoice-id').value,
    customer: document.getElementById('customer').value,
    phone: document.getElementById('phone').value,
    email: document.getElementById('email').value,
    gender: document.querySelector('input[name="gender"]:checked')?.value, // Get selected gender
    address: document.getElementById('address').value,
    books: booksString ? JSON.parse(booksString) : [], // Use an empty array if null
    total: document.getElementById('total-amount').textContent,
  };

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

function checkCustomer() {
  const phoneInput = document.getElementById('phone').value;

  // Check if the phone number is 10 digits long
  if (phoneInput.length !== 10 || isNaN(phoneInput)) {
    alert("Vui lòng nhập số điện thoại gồm 10 chữ số.");
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
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}