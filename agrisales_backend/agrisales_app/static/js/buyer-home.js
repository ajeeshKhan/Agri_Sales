/**
 * AgriSales Buyer Marketplace Logic & Interactive Quantity Picker
 */

let buyerCart = JSON.parse(localStorage.getItem('agrisales_active_cart')) || [];
let currentCategory = 'all';

document.addEventListener('DOMContentLoaded', () => {
  const session = requireAuth('buyer', '/');
  if (!session) return;

  document.getElementById('buyerProfileName').textContent = session.name || "Buyer Account";
  document.getElementById('buyerProfileAddress').textContent = session.businessType ? `Category: ${session.businessType}` : "Wholesale Buyer";

  document.getElementById('btnLogout').addEventListener('click', () => {
    clearSession();
    showToast("Logged out from Buyer Portal.", "info");
    setTimeout(() => {
      window.location.href = "/";
    }, 600);
  });

  checkRecentOrders();
  renderProducts();
  updateCartUI();
});

function checkRecentOrders() {
  const orders = getOrders();
  const activeBanner = document.getElementById('activeOrdersBanner');
  const recentInfo = document.getElementById('recentOrderInfo');

  if (orders.length > 0) {
    const latest = orders[0];
    recentInfo.textContent = `Order #${latest.id} - ${latest.items.length} produce item(s) (₹${latest.totalAmount.toFixed(2)}) | Status: ${latest.status}`;
    activeBanner.style.display = 'flex';
  }
}

function filterProduce(cat) {
  currentCategory = cat;
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  renderProducts();
}

function renderProducts() {
  const catalog = getProduceCatalog();
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = '';

  const filtered = currentCategory === 'all' 
    ? catalog 
    : catalog.filter(p => p.category === currentCategory);

  if (filtered.length === 0) {
    grid.innerHTML = '<p style="color: var(--text-muted); grid-column: 1/-1; text-align: center; padding: 2rem;">No produce listings found in this category.</p>';
    return;
  }

  filtered.forEach(prod => {
    const card = document.createElement('article');
    card.className = 'product-card';
    const initialQty = Math.min(10, prod.stock || 500);
    const initialTotal = prod.price * initialQty;

    const isOutOfStock = (prod.stock <= 0 || prod.tag === "Out of Stock");
    const stockDisplay = isOutOfStock ? `<span style="color: #fca5a5; font-weight:700;">Out of Stock</span>` : `<span style="color: #34d399;">Stock: ${prod.stock} kg</span>`;

    card.innerHTML = `
      <div>
        <span class="product-tag">${prod.tag || 'Fresh Harvest'}</span>
        <span class="stock-badge">${stockDisplay}</span>
        <h3 class="product-title" style="clear: both; margin-top: 0.25rem;">${prod.icon || '🌾'} ${prod.name}</h3>
        <p class="product-farmer">Farmer: <strong>${prod.farmer}</strong></p>
      </div>
      <div>
        <div class="product-price-row">
          <span class="product-price">₹${prod.price.toFixed(2)} <small>/ ${prod.unit}</small></span>
          <span style="font-weight: 700; color: #34d399; font-size: 0.95rem;" id="calc-price-${prod.id}">₹${initialTotal.toFixed(2)}</span>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem;">
          <span style="font-size: 0.8rem; color: var(--text-muted);">Select Quantity:</span>
          <div class="qty-stepper">
            <button class="qty-btn" onclick="adjustQty(${prod.id}, -5)" ${isOutOfStock ? 'disabled' : ''}>-</button>
            <input type="number" class="qty-input" id="qty-${prod.id}" value="${initialQty}" min="1" max="${prod.stock}" step="5" onchange="updateCalcPrice(${prod.id}, ${prod.price})" ${isOutOfStock ? 'disabled' : ''}>
            <button class="qty-btn" onclick="adjustQty(${prod.id}, 5)" ${isOutOfStock ? 'disabled' : ''}>+</button>
          </div>
        </div>

        <button class="btn-primary" style="font-size: 0.85rem;" onclick="addToCart(${prod.id})" ${isOutOfStock ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
          ${isOutOfStock ? 'Out of Stock ✕' : 'Add to Order Cart 🛒'}
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function adjustQty(id, delta) {
  const input = document.getElementById(`qty-${id}`);
  if (input && !input.disabled) {
    let val = parseFloat(input.value) || 0;
    const maxStock = parseFloat(input.max) || 9999;
    val = Math.min(maxStock, Math.max(1, val + delta));
    input.value = val;
    
    const catalog = getProduceCatalog();
    const item = catalog.find(p => p.id === id);
    if (item) updateCalcPrice(id, item.price);
  }
}

function updateCalcPrice(id, unitPrice) {
  const input = document.getElementById(`qty-${id}`);
  const calcSpan = document.getElementById(`calc-price-${id}`);
  if (input && calcSpan) {
    const qty = Math.max(1, parseFloat(input.value) || 1);
    const total = qty * unitPrice;
    calcSpan.textContent = `₹${total.toFixed(2)}`;
  }
}

function addToCart(productId) {
  const catalog = getProduceCatalog();
  const item = catalog.find(p => p.id === productId);
  const qtyInput = document.getElementById(`qty-${productId}`);
  const qty = qtyInput ? Math.max(1, parseFloat(qtyInput.value) || 1) : 1;

  if (item && item.stock > 0) {
    const existingIndex = buyerCart.findIndex(c => c.id === item.id);
    if (existingIndex > -1) {
      buyerCart[existingIndex].qty += qty;
    } else {
      buyerCart.push({ ...item, qty: qty });
    }
    
    localStorage.setItem('agrisales_active_cart', JSON.stringify(buyerCart));
    updateCartUI();
    showToast(`Added ${qty}kg of ${item.name} to order cart!`, "success");
  }
}

function updateCartUI() {
  const countEl = document.getElementById('cartItemCount');
  const total = buyerCart.reduce((sum, item) => sum + (item.price * item.qty), 0).toFixed(2);
  const totalWeight = buyerCart.reduce((sum, item) => sum + item.qty, 0);
  countEl.textContent = `${buyerCart.length} item(s) (${totalWeight} kg total) - ₹${total}`;
}
