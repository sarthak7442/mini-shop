// ---------- 1. Our products (an array of objects) ----------
// To add a new product, just add another line here!
const products = [
  { id: 1, name: "Headphones", price: 1999, emoji: "🎧" },
  { id: 2, name: "Sneakers",   price: 2499, emoji: "👟" },
  { id: 3, name: "Backpack",   price: 1299, emoji: "🎒" },
  { id: 4, name: "Watch",      price: 3499, emoji: "⌚" },
  { id: 5, name: "Sunglasses", price: 799,  emoji: "🕶️" },
  { id: 6, name: "Water Bottle", price: 399, emoji: "🧴" },
];

// ---------- 2. Grab elements from the page ----------
const productGrid = document.getElementById("product-grid");
const cartList = document.getElementById("cart-list");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const emptyMessage = document.getElementById("empty-message");
const clearBtn = document.getElementById("clear-btn");

// ---------- 3. The cart: a list of { id, qty } ----------
// Loaded from the browser's storage so it survives a page refresh.
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ---------- 4. Show the products on the page ----------
function renderProducts() {
  products.forEach(function (product) {
    const card = document.createElement("div");
    card.className = "product-card";

    // Build the card's HTML using a template string (backticks)
    card.innerHTML = `
      <div class="product-emoji">${product.emoji}</div>
      <div class="product-name">${product.name}</div>
      <div class="product-price">₹${product.price}</div>
      <button class="add-btn">Add to Cart</button>
    `;

    // When "Add to Cart" is clicked, add this product
    card.querySelector(".add-btn").addEventListener("click", function () {
      addToCart(product.id);
    });

    productGrid.appendChild(card);
  });
}

// ---------- 5. Cart actions ----------
function addToCart(productId) {
  // Is this product already in the cart?
  const item = cart.find(function (i) {
    return i.id === productId;
  });

  if (item) {
    item.qty++;                       // yes: increase quantity
  } else {
    cart.push({ id: productId, qty: 1 }); // no: add as new
  }

  saveCart();
  renderCart();
}

function changeQty(productId, change) {
  const item = cart.find(function (i) {
    return i.id === productId;
  });
  item.qty += change;

  // If quantity drops to 0, remove the item from the cart
  if (item.qty <= 0) {
    cart = cart.filter(function (i) {
      return i.id !== productId;
    });
  }

  saveCart();
  renderCart();
}

// ---------- 6. Show the cart on the page ----------
function renderCart() {
  cartList.innerHTML = "";
  let total = 0;
  let itemCount = 0;

  cart.forEach(function (item) {
    // Find the full product info using the id
    const product = products.find(function (p) {
      return p.id === item.id;
    });

    total += product.price * item.qty;
    itemCount += item.qty;

    const li = document.createElement("li");
    li.innerHTML = `
      <span>${product.emoji} ${product.name}</span>
      <span class="qty-controls">
        <button class="minus">−</button>
        <span>${item.qty}</span>
        <button class="plus">+</button>
      </span>
    `;

    li.querySelector(".minus").addEventListener("click", function () {
      changeQty(item.id, -1);
    });
    li.querySelector(".plus").addEventListener("click", function () {
      changeQty(item.id, 1);
    });

    cartList.appendChild(li);
  });

  cartTotal.textContent = total;
  cartCount.textContent = itemCount;

  // Show "Your cart is empty" only when there is nothing in the cart
  emptyMessage.style.display = cart.length === 0 ? "block" : "none";
}

// ---------- 7. Clear Cart button ----------
clearBtn.addEventListener("click", function () {
  cart = [];
  saveCart();
  renderCart();
});

// ---------- 8. Start the app ----------
renderProducts();
renderCart();
