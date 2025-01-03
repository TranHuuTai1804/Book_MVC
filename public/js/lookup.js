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

// Khởi tạo mảng chứa tên sách
let bookTitles = [];
let authors = [];
let autoInput = [];

// Hàm lấy danh sách sách từ API và cập nhật mảng bookTitles
async function fetchBookTitles() {
  try {
    const response = await fetch("/api/books");
    if (!response.ok) {
      throw new Error("Failed to fetch books");
    }
    const books = await response.json();

    // Cập nhật mảng bookTitles với danh sách tên sách
    bookTitles = books.map((book) => "Book: " + book.Ten_sach);
    const authorsTemp = books.map((book) => "Author: " + book.Ten_tac_gia);
    authors = [...new Set(authorsTemp)];
    autoInput = bookTitles.concat(authors);

    // Đảm bảo rằng kết quả được hiển thị sau khi dữ liệu đã được lấy
    console.log("Danh sách tên sách hiện tại:", bookTitles);
  } catch (error) {
    console.error("Error fetching books:", error);
  }
}

// Gọi hàm fetchBookTitles để lấy dữ liệu và cập nhật mảng ngay khi trang được tải
document.addEventListener("DOMContentLoaded", async () => {
  await fetchBookTitles(); // Đảm bảo dữ liệu được tải trước khi cho phép tìm kiếm
  await showDefaultList(); // Hiển thị tất cả các sách ngay khi trang tải
});

// Định nghĩa các phần tử trong DOM
const resultIp = document.querySelector(".result-ip");
const searchInput = document.querySelector(".search-input");
const iconBtn = document.querySelector(".search-icon");

// Xử lý sự kiện keyup khi người dùng nhập vào ô tìm kiếm
searchInput.onkeyup = function () {
  let result = [];
  let input = searchInput.value;

  // Nếu input có dữ liệu
  if (input.length) {
    result = autoInput.filter((keyword) => {
      return keyword.toLowerCase().includes(input.toLowerCase());
    });

    // Hiển thị kết quả tìm kiếm
    display(result);
  }

  // Nếu không có kết quả, xóa danh sách kết quả
  if (!input.length || !result.length) {
    resultIp.innerHTML = "";
  }
};

searchInput.addEventListener("input", () => {
  if (searchInput.value.trim() !== "") {
    iconBtn.style.opacity = "0";
  } else {
    iconBtn.style.opacity = "1";
  }
});

// Hàm hiển thị kết quả tìm kiếm
function display(result) {
  const content = result.map((list) => {
    const className = list.startsWith("Book:")
      ? "book"
      : list.startsWith("Author:")
      ? "author"
      : "";

    return `<li class="${className}" onclick="selectInput(this)">${list}</li>`;
  });

  // Thêm danh sách vào resultIp
  resultIp.innerHTML = "<ul>" + content.join("") + "</ul>";
}

// Hàm khi người dùng chọn kết quả tìm kiếm
async function selectInput(list) {
  // Cập nhật giá trị ô input với tên sách được chọn
  searchInput.value = list.innerHTML;
  resultIp.innerHTML = ""; // Xóa kết quả sau khi chọn

  // alert(searchInput.value);

  try {
    // Gọi API để lấy danh sách sách
    const response = await fetch("/api/books");
    if (!response.ok) {
      alert("Failed to fetch books");
    }
    const books = await response.json();
    let selectedBook = null;
    if (searchInput.value.includes("Book")) {
      const bookInput = searchInput.value.replace("Book: ", "").trim();
      selectedBook = books.filter((book) => book.Ten_sach === bookInput);
    } else {
      const bookInput = searchInput.value.replace("Author: ", "").trim();
      selectedBook = books.filter((book) => book.Ten_tac_gia === bookInput);
    }
    if (selectedBook) {
      // Hiển thị danh sách mặc định
      const bookContainer = document.querySelector(".book-container");
      bookContainer.innerHTML = ""; // Xóa nội dung cũ nếu có

      selectedBook.forEach((book) => {
        const bookItem = document.createElement("div");
        bookItem.className = "book-item";

        // Sử dụng link từ cơ sở dữ liệu để hiển thị hình ảnh
        const bookImage = book.Link; // Lấy link từ dữ liệu sách

        bookItem.innerHTML = `
          <img src="/img/${bookImage}" alt="${
          book.Ten_sach
        }" class="book-image">
          <h3 class="book-title">${book.Ten_sach}</h3>
          <p class="book-author">${book.Ten_tac_gia}</p>
          <p class="book-category">${book.The_loai}</p>
          <p class="book-price">$${book.Gia}</p>
          <div class="progress-container">
            <span class="progress-text">${book.So_luong}</span>
            <div class="progress-bar" style="width: ${
              (book.So_luong / 100) * 100
            }%;"></div>
          </div>
        `;

        // Thêm sự kiện click để hiển thị chi tiết sách khi người dùng click vào sách
        bookItem.addEventListener("click", () => selectBook(book));
        bookContainer.appendChild(bookItem);
      });
    } else {
      // Hiển thị danh sách mặc định
      const bookContainer = document.querySelector(".book-container");
      bookContainer.innerHTML = ""; // Xóa nội dung cũ nếu có

      const bookItem = document.createElement("div");
      bookItem.className = "book-item";
      bookItem.value = "No book searched!";
    }
  } catch (error) {
    console.error("Error fetching book details:", error);
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

    // Hiển thị danh sách mặc định
    const bookContainer = document.querySelector(".book-container");
    bookContainer.innerHTML = ""; // Xóa nội dung cũ nếu có

    books.forEach((book) => {
      const bookItem = document.createElement("div");
      bookItem.className = "book-item";

      // Sử dụng link từ cơ sở dữ liệu để hiển thị hình ảnh
      const bookImage = book.Link; // Lấy link từ dữ liệu sách

      bookItem.innerHTML = `
        <img src="/img/${bookImage}" alt="${book.Ten_sach}" class="book-image">
        <h3 class="book-title">${book.Ten_sach}</h3>
        <p class="book-author">${book.Ten_tac_gia}</p>
        <p class="book-category">${book.The_loai}</p>
        <p class="book-price">$${book.Gia}</p>
        <div class="progress-container">
          <span class="progress-text">${book.So_luong}</span>
          <div class="progress-bar" style="width: ${
            (book.So_luong / 100) * 100
          }%;"></div>
        </div>
      `;

      // Thêm sự kiện click để hiển thị chi tiết sách khi người dùng click vào sách
      bookItem.addEventListener("click", () => selectBook(book));

      bookContainer.appendChild(bookItem);
    });
  } catch (error) {
    console.error("Error fetching books:", error);
  }
}

const addBookBtn = document.getElementById("addBookBtn");
addBookBtn.addEventListener("click", () => {
  const bookContainer = document.querySelector(".book-container");
  bookContainer.innerHTML = "";

  const bookDetail = document.createElement("div");
  bookDetail.className = "book-detail";
  bookDetail.innerHTML = `
    <div class="book-image-container">
      <img src="/img/book.png" alt="Add book!" class="book-image" id="bookImage">
      <input type="file" id="fileInput" accept="image/*" style="display: none;" />
    </div>
    <div class="book-info">
      <h2 class="book-title">
        <input type="text" class="input-title" placeholder="Enter Book Title" />
      </h2>
      <p class="book-author">
        <input type="text" class="input-author" placeholder="Enter Author" />
      </p>
      <p class="book-category">
        <input type="text" class="input-category" placeholder="Enter Category" />
      </p>
      <p class="book-price">
        <input type="number" class="input-price" placeholder="Enter Price" />
      </p>
    </div>
    <div class="book-actions">
      <button class="save-book-btn" id="saveBookBtn">Save</button>
      <button class="cancel-book-btn" id="cancelBookBtn">Cancel</button>
    </div>
`;
  bookContainer.appendChild(bookDetail);

  const bookImage = document.getElementById("bookImage");
  const fileInput = document.getElementById("fileInput");
  const saveBookBtn = document.getElementById("saveBookBtn");
  const cancelBtn = document.querySelector("#cancelBookBtn");

  cancelBtn.addEventListener("click", () => {
    // Chuyển hướng về trang tìm kiếm khi nhấn nút Cancel
    window.location.href = "/lookup";
  });

  bookImage.addEventListener("click", () => {
    fileInput.click();
  });

  let selectedFile = null;
  fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      selectedFile = file;

      // Hiển thị ảnh vừa chọn
      const reader = new FileReader();
      reader.onload = (e) => {
        bookImage.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  saveBookBtn.addEventListener("click", () => {
    if (!selectedFile) {
      alert("Please select an image before saving!");
      return;
    }

    // Lấy thông tin sách từ các input fields
    const ten_sach = document.querySelector(".input-title").value;
    const ten_tac_gia = document.querySelector(".input-author").value;
    const the_loai = document.querySelector(".input-category").value;
    const gia = document.querySelector(".input-price").value;

    // Lấy tên file ảnh
    const fileName = selectedFile.name;

    // Tạo FormData chứa thông tin sách và file ảnh
    const formData = new FormData();
    formData.append("image", selectedFile); // Thêm ảnh vào FormData
    formData.append("ten_sach", ten_sach);
    formData.append("ten_tac_gia", ten_tac_gia);
    formData.append("the_loai", the_loai);
    formData.append("nam_xuat_ban", 0);
    formData.append("so_luong", 0);
    formData.append("gia", gia);
    formData.append("link", fileName); // Truyền tên file ảnh vào cơ sở dữ liệu

    // Gửi dữ liệu đến server
    fetch("/add-book", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // alert("Book added successfully!");
          window.location.href = "/lookup";
        } else {
          alert("Failed to add book.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error saving book.");
      });
  });
});

// Hàm khi người dùng chọn sách từ danh sách
async function selectBook(book) {
  const bookContainer = document.querySelector(".book-container");
  bookContainer.innerHTML = ""; // Xóa nội dung cũ nếu có

  // Lấy giá trị So_luong_ton_it_nhat từ quy định
  const soLuongTonItHon = await fetchSoLuongTonItHon();

  // Sử dụng link từ cơ sở dữ liệu để hiển thị hình ảnh
  const bookImage = book.Link; // Lấy link từ dữ liệu sách

  const bookDetail = document.createElement("div");
  bookDetail.className = "book-detail";
  bookDetail.innerHTML = `
    <div class="book-image-container">
      <img src="/img/${bookImage}" alt="${book.Ten_sach}" class="book-image">
    </div>
    <div class="book-info">
      <h2 class="book-title">${book.Ten_sach}</h2>
      <p class="book-author">Tác giả: ${book.Ten_tac_gia}</p>
      <p class="book-category">Thể loại: ${book.The_loai}</p>
      <p class="book-price">Giá: $${book.Gia}</p>
      <div class="progress-container">
        <span class="progress-text">${book.So_luong}/${soLuongTonItHon}</span>
        <div class="progress-bar" style="width: ${
          (book.So_luong / soLuongTonItHon) * 100
        }%;"></div>
      </div>
    </div>
  `;
  bookContainer.appendChild(bookDetail);
}
// Khi trang được tải, hiển thị danh sách mặc định
document.addEventListener("DOMContentLoaded", () => {
  showDefaultList(); // Hiển thị tất cả các sách ngay khi trang tải
});

// Hàm để tải danh sách thể loại từ server và hiển thị trong dropdown
function loadCategory() {
  fetch("/api/books")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      return response.json();
    })
    .then((books) => {
      // Lấy danh sách thể loại duy nhất
      const categories = [...new Set(books.map((book) => book.The_loai))];

      const categoryDropdown = document.getElementById("categoryDropdown");
      categoryDropdown.innerHTML = ""; // Xóa danh sách cũ

      categories.forEach((category) => {
        const categoryButton = document.createElement("button");
        categoryButton.classList.add("filter-btn");
        categoryButton.textContent = category;
        categoryButton.onclick = () =>
          filterByCategory(category, categoryButton);
        categoryDropdown.appendChild(categoryButton);
      });
    })
    .catch((error) => console.error("Lỗi khi lấy danh sách thể loại:", error));
}

// Hàm hiển thị danh sách sách theo thể loại
async function filterByCategory(category, button) {
  try {
    // Gọi API để lấy tất cả sách
    const response = await fetch("/api/books");
    if (!response.ok) {
      throw new Error("Failed to fetch books");
    }
    const books = await response.json();

    // Lọc sách theo thể loại
    const filteredBooks = books.filter((book) => book.The_loai === category);

    const bookContainer = document.querySelector(".book-container");
    bookContainer.innerHTML = ""; // Xóa nội dung cũ nếu có

    // Kiểm tra nếu không có sách nào
    if (filteredBooks.length === 0) {
      const noBooksMessage = document.createElement("p");
      noBooksMessage.textContent = "Không có sách trong danh mục này.";
      bookContainer.appendChild(noBooksMessage);
      return;
    }

    // Tạo bảng danh sách sách
    filteredBooks.forEach((book) => {
      const bookItem = document.createElement("div");
      bookItem.className = "book-item";

      // Sử dụng link từ cơ sở dữ liệu để hiển thị hình ảnh
      const bookImage = book.Link; // Lấy link từ dữ liệu sách

      bookItem.innerHTML = `
        <img src="/img/${bookImage}" alt="${book.Ten_sach}" class="book-image">
        <h3 class="book-title">${book.Ten_sach}</h3>
        <p class="book-author">${book.Ten_tac_gia}</p>
        <p class="book-category">${book.The_loai}</p>
        <p class="book-price">$${book.Gia}</p>
        <div class="progress-container">
          <span class="progress-text">${book.So_luong}</span>
          <div class="progress-bar" style="width: ${
            (book.So_luong / 100) * 100
          }%;"></div>
        </div>
      `;

      // Thêm sự kiện click để hiển thị chi tiết sách khi người dùng click vào sách
      bookItem.addEventListener("click", () => selectBook(book));

      bookContainer.appendChild(bookItem);
    });

    // Cập nhật nút active
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    button.classList.add("active");
  } catch (error) {
    console.error("Error fetching books by category:", error);
  }
}

// Hàm để tải danh sách tác giả từ server và hiển thị trong dropdown
function loadAuthors() {
  // Giả sử bạn có một API để lấy danh sách tác giả
  fetch("/api/books")
    .then((response) => response.json())
    .then((authors) => {
      const authorDropdown = document.getElementById("authorDropdown");
      authorDropdown.innerHTML = ""; // Xóa danh sách cũ

      authors.forEach((author) => {
        const authorButton = document.createElement("button");
        authorButton.classList.add("filter-btn");
        authorButton.textContent = author.Ten_tac_gia;
        authorButton.onclick = () => selectAuthor(author.Ten_tac_gia); // Gọi selectAuthor khi nhấp vào tác giả
        authorDropdown.appendChild(authorButton);
      });
    })
    .catch((error) => console.error("Lỗi khi lấy danh sách tác giả:", error));
}

// Hàm toggle dropdown cho tác giả
function toggleAuthorDropdown() {
  const authorDropdown = document.getElementById("authorDropdown");
  authorDropdown.classList.toggle("show"); // Thêm hoặc xóa lớp 'show' để hiển thị/ẩn dropdown
}

// Hàm chọn tác giả và hiển thị tên tác giả đã chọn
async function selectAuthor(authorName) {
  // Đóng dropdown khi đã chọn tác giả
  const authorDropdown = document.getElementById("authorDropdown");
  authorDropdown.classList.remove("show");

  // Gọi API để lấy tất cả sách
  try {
    const response = await fetch("/api/books");
    if (!response.ok) {
      throw new Error("Failed to fetch books");
    }
    const books = await response.json();

    // Lọc sách theo tác giả đã chọn
    const filteredBooks = books.filter(
      (book) => book.Ten_tac_gia === authorName
    );

    // Lấy giá trị So_luong_ton_it_nhat từ quy định
    const soLuongTonItHon = await fetchSoLuongTonItHon();

    // Hiển thị danh sách sách của tác giả
    const bookContainer = document.querySelector(".book-container");
    bookContainer.innerHTML = ""; // Xóa nội dung cũ nếu có

    filteredBooks.forEach((book) => {
      const bookItem = document.createElement("div");
      bookItem.className = "book-item";
      bookItem.innerHTML = `
        <img src="${book.img || "/book/book1.png"}" alt="${
        book.Ten_sach
      }" class="book-image">
        <h3 class="book-title">${book.Ten_sach}</h3>
        <p class="book-author">${book.Ten_tac_gia}</p>
        <p class="book-price">$${book.Gia}</p>
        <div class="progress-container">
          <span class="progress-text">${book.So_luong}/${soLuongTonItHon}</span>
          <div class="progress-bar" style="width: ${
            (book.So_luong / soLuongTonItHon) * 100
          }%;"></div>
        </div>
      `;

      // Thêm sự kiện click để hiển thị chi tiết sách khi người dùng click vào sách
      bookItem.addEventListener("click", () => selectBook(book));

      bookContainer.appendChild(bookItem);
    });
  } catch (error) {
    console.error("Error fetching books:", error);
  }
}

// Hàm gọi khi trang web được tải
window.onload = () => {
  loadCategory(); // Tải danh sách thể loại khi trang web tải
};

// Hàm toggle dropdown cho thể loại
function toggleDropdown() {
  const categoryDropdown = document.getElementById("categoryDropdown");
  categoryDropdown.classList.toggle("show");
}

// Hàm ẩn các dropdown khi người dùng click ra ngoài
document.addEventListener("click", function (e) {
  const categoryDropdown = document.getElementById("categoryDropdown");

  if (!e.target.closest(".dropdown")) {
    categoryDropdown.classList.remove("show");
  }
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