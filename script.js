const whatsappNumber = "917011282410";
const menuPrices = {
  "Plain Omelette": 50,
  "Veg Omelette": 50,
  "Paneer Omelette": 50,
  "Masala Omelette": 50,
  "Chocolate Omelette": 50,
  "Oats Omelette": 80
};

const orderForm = document.querySelector("#order-form");
const orderItem = document.querySelector("#order-item");
const orderQuantity = document.querySelector("#order-quantity");
const midnightDelivery = document.querySelector("#midnight-delivery");
const orderTotal = document.querySelector("#order-total");
const orderStatus = document.querySelector("#order-status");

function getOrderTotal() {
  const itemPrice = menuPrices[orderItem.value] || 0;
  const quantity = Number(orderQuantity.value) || 0;
  return itemPrice * quantity + (midnightDelivery.checked && itemPrice ? 10 : 0);
}

function updateOrderTotal() {
  orderTotal.textContent = `₹${getOrderTotal()}`;
}

function openWhatsApp(message, statusElement, successMessage) {
  statusElement.textContent = successMessage;
  window.location.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

orderItem.addEventListener("change", updateOrderTotal);
orderQuantity.addEventListener("input", updateOrderTotal);
midnightDelivery.addEventListener("change", updateOrderTotal);

document.querySelectorAll(".add-to-order").forEach((button) => {
  button.addEventListener("click", () => {
    orderItem.value = button.dataset.menuItem;
    updateOrderTotal();
    document.querySelector("#order").scrollIntoView({ behavior: "smooth" });
    orderItem.focus({ preventScroll: true });
  });
});

orderForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!orderForm.reportValidity()) return;

  const formData = new FormData(orderForm);
  const item = formData.get("item");
  const quantity = Number(formData.get("quantity"));
  const midnight = formData.has("midnight");
  const total = getOrderTotal();
  const message = [
    "Hi ANDAAZ! I'd like to place an order:",
    `• ${item} × ${quantity} — ₹${menuPrices[item] * quantity}`,
    `• Delivery: ${midnight ? "Midnight delivery requested (+₹10; please confirm availability)" : "Doorstep delivery (free)"}`,
    `• Estimated total: ₹${total}`,
    `• Name: ${formData.get("name")}`,
    `• Phone: ${formData.get("phone")}`,
    `• Address: ${formData.get("address")}`,
    "",
    "Please confirm my order. Thank you!"
  ].join("\n");

  openWhatsApp(message, orderStatus, "Opening WhatsApp with your order details. Review the message and tap send to confirm with ANDAAZ.");
});

document.querySelector("#feedback-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;

  const formData = new FormData(form);
  const message = [
    "Hi ANDAAZ! Here's my feedback:",
    `• Name: ${formData.get("name")}`,
    `• Rating: ${formData.get("rating")}`,
    `• Feedback: ${formData.get("message")}`
  ].join("\n");

  openWhatsApp(message, document.querySelector("#feedback-status"), "Opening WhatsApp with your feedback. Review the message and tap send to share it with ANDAAZ.");
});

document.querySelector("#current-year").textContent = new Date().getFullYear();
updateOrderTotal();
