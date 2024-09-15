// script.js

// Sample product data
const products = [
  { id: 1, name: "Smartphone", price: 50, category: "electronics" },
  { id: 2, name: "T-Shirt", price: 20, category: "fashion" },
  { id: 3, name: "Novel", price: 10, category: "books" },
  { id: 4, name: "Laptop", price: 80, category: "electronics" },
  { id: 5, name: "Jeans", price: 40, category: "fashion" },
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to render products
function renderProducts(filter = {}) {
  const productList = document.getElementById('product-list');
  productList.innerHTML = '';

  const filteredProducts = products.filter(product => {
      let meetsCriteria = true;

      if (filter.category && filter.category !== 'all') {
          meetsCriteria = product.category === filter.category;
      }

      if (filter.price && filter.price < 100) {
          meetsCriteria = product.price <= filter.price;
      }

      return meetsCriteria;
  });

  filteredProducts.forEach(product => {
      const productElement = `
          <div class="product" data-id="${product.id}">
              <img src="https://www.bing.com/images/search?q=Smartphone+Samsung+Galaxy+A52&form=IRTRRL&first=1/150" alt="${product.name}">
              <h3>${product.name}</h3>
              <p>$${product.price.toFixed(2)}</p>
              <button class="add-to-cart">Add to Cart</button>
          </div>
      `;
      productList.insertAdjacentHTML('beforeend', productElement);
  });

  // Add event listeners for "Add to Cart" buttons
  document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', () => {
          const productId = parseInt(button.closest('.product').dataset.id);
          addToCart(productId);
      });
  });
}

// Function to add item to cart
function addToCart(productId) {
  const product = products.find(p => p.id === productId);

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
      existingItem.quantity++;
  } else {
      cart.push({ ...product, quantity: 1 });
  }

  updateCart();
}

// Function to update cart count and summary
function updateCart() {
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
  document.getElementById('cart-count').innerText = cartCount;

  const cartItems = document.getElementById('cart-items');
  cartItems.innerHTML = '';

  let totalPrice = 0;
  cart.forEach(item => {
      const li = document.createElement('li');
      li.innerText = `${item.name} x${item.quantity} - $${item.price * item.quantity}`;
      cartItems.appendChild(li);
      totalPrice += item.price * item.quantity;
  });

  document.getElementById('total-price').innerText = `Total: $${totalPrice.toFixed(2)}`;

  localStorage.setItem('cart', JSON.stringify(cart));
}

// Filter products by category and price
document.getElementById('category-filter').addEventListener('change', (e) => {
  const category = e.target.value;
  renderProducts({ category });
});

document.getElementById('price-filter').addEventListener('input', (e) => {
  const price = parseInt(e.target.value);
  document.getElementById('price-range-value').innerText = `Up to $${price}`;
  renderProducts({ price });
});

// Checkout button action
document.getElementById('checkout-btn').addEventListener('click', () => {
  if (cart.length === 0) {
      alert("Your cart is empty!");
  } else {
      alert("Proceeding to checkout...");
      cart = [];
      updateCart();
      localStorage.removeItem('cart');
  }
});

// Initial render
renderProducts();
updateCart();
