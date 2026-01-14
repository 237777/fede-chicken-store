// -------------------- ADMIN DASHBOARD -------------------- //
document.addEventListener("DOMContentLoaded", function () {
  let adminOrdersDiv = document.getElementById("adminOrders");
  if (!adminOrdersDiv) return; // Only run on admin.html

  let orders = JSON.parse(localStorage.getItem("orders")) || [];

  if (orders.length === 0) {
    adminOrdersDiv.innerHTML = '<p class="no-orders">No orders yet.</p>';
    return;
  }

  orders.forEach((order, index) => {
    let itemsList = order.items.map(i => `⁠ ${i.name} x${i.quantity}`).join(", ");
    adminOrdersDiv.innerHTML += `
      <div class="box">
        <p><b>Order #${index + 1}</b></p>
        <p><b>Name:</b> ${order.name}</p>
        <p><b>Phone:</b> ${order.phone}</p>
        <p><b>Address:</b> ${order.address}</p>
        <p><b>Items:</b> ${itemsList}</p>
        <p><b>Total:</b> ${order.total} CFA</p>
        <p><b>Date:</b> ${order.date}</p>
      </div>
    `;
  });
});
// Load cart
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Add item to cart
function addToCart(name, price, image) {
  // Check if item exists already
  let existing = cart.find(item => item.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, price, image, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert(name + " added to cart!");
}

// Remove item completely
function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  showCart();
  updateCartCount();
}

// Change quantity
function changeQuantity(index, amount) {
  cart[index].quantity += amount;
  if (cart[index].quantity < 1) cart[index].quantity = 1;
  localStorage.setItem("cart", JSON.stringify(cart));
  showCart();
  updateCartCount();
}

// Display cart items
function showCart() {
  let cartItemsDiv = document.getElementById("cartItems");
  if (!cartItemsDiv) return;

  let total = 0;
  cartItemsDiv.innerHTML = "";

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    cartItemsDiv.innerHTML += `
      <div class="box" style="display:flex;align-items:center;gap:15px;margin-bottom:15px;border-bottom:1px solid #ccc;padding-bottom:10px;">
        <img src="${item.image}" alt="${item.name}" style="width:80px;height:80px;border-radius:8px;">
        <div>
          <p><b>${item.name}</b></p>
          <p>Price: ${item.price} CFA</p>
          <p>Quantity: 
            <button onclick="changeQuantity(${index}, -1)">-</button>
            ${item.quantity}
            <button onclick="changeQuantity(${index}, 1)">+</button>
          </p>
          <button onclick="removeFromCart(${index})" style="background:red;color:white;border:none;padding:5px 10px;border-radius:5px;">Remove</button>
        </div>
      </div>
    `;
  });

  document.getElementById("totalPrice").innerText = "Total: " + total + " CFA";
}

// Update cart count in nav
function updateCartCount() {
  let count = cart.reduce((acc, item) => acc + item.quantity, 0);
  let cartCount = document.getElementById("cartCount");
  if (cartCount) cartCount.innerText = count;
}

// -------------------- CHECKOUT PAGE -------------------- //
document.addEventListener("DOMContentLoaded", function () {
  // Only attach listener if checkoutForm exists
  let checkoutForm = document.getElementById("checkoutForm");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", function (e) {
      e.preventDefault();

      let name = document.getElementById("customerName").value;
      let phone = document.getElementById("customerPhone").value;
      let address = document.getElementById("customerAddress").value;

      if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
      }

      // Save order
      let orders = JSON.parse(localStorage.getItem("orders")) || [];
      let order = {
        items: cart,
        total: cart.reduce((t, i) => t + i.price * i.quantity, 0),
        name: name,
        phone: phone,
        address: address,
        date: new Date().toLocaleString()
      };

      orders.push(order);
      localStorage.setItem("orders", JSON.stringify(orders));

      // Clear cart
      cart = [];
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();

      alert("Thank you! Your order has been confirmed.");
      window.location.href = "index.html";
    });
  }
});