// Toast Handling
const urlParams = new URLSearchParams(window.location.search);
const message = urlParams.get("message");

if (message) {
  const isError =
    message.toLowerCase().includes("lỗi") ||
    message.toLowerCase().includes("không") ||
    message.toLowerCase().includes("sai") ||
    message.toLowerCase().includes("khớp") ||
    message.toLowerCase().includes("tồn tại");

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
