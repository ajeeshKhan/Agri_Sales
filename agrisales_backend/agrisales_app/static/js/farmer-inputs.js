/**
 * AgriSales Farmer Inputs Store Logic (Pesticides, Manure, Seeds, Medicines)
 */

let inputCart = [];
let currentCategory = 'all';

document.addEventListener('DOMContentLoaded', () => {
  const session = requireAuth('seller', '/');
  if (!session) return;

  document.getElementById('farmerProfileName').textContent = session.name || "Farmer Account";
  document.getElementById('farmerFarmName').textContent = session.farmName || "Green Acres Farm";

  document.getElementById('btnLogout').addEventListener('click', () => {
    clearSession();
    showToast("Logged out from Farmer Portal.", "info");
    setTimeout(() => {
      window.location.href = "/";
    }, 600);
  });

  renderInputs();

  document.getElementById('btnCheckoutInputs').addEventListener('click', () => {
    if (inputCart.length === 0) {
      showToast("Your supplies basket is empty!", "error");
      return;
    }
    const total = inputCart.reduce((sum, item) => sum + (item.price * item.qty), 0).toFixed(2);
    showToast(`Order placed for ${inputCart.length} supply package(s)! Total: ₹${total}. Merchant notified for farm gate dispatch.`, "success");
    inputCart = [];
    updateInputCartUI();
  });
});

function filterInputs(cat) {
  currentCategory = cat;
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  renderInputs();
}

function renderInputs() {
  const catalog = getInputsCatalog();
  const grid = document.getElementById('inputsGrid');
  grid.innerHTML = '';

  const filtered = currentCategory === 'all' 
    ? catalog 
    : catalog.filter(i => i.category === currentCategory);

  if (filtered.length === 0) {
    grid.innerHTML = '<p style="color: var(--text-muted); grid-column: 1/-1; text-align: center; padding: 2rem;">No products found in this category.</p>';
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement('article');
    card.className = 'input-card';
    const initialQty = 1;
    const initialTotal = item.price * initialQty;

    card.innerHTML = `
      <div>
        <span class="vendor-badge">Merchant: ${item.merchant}</span>
        <h3 class="product-title">${item.icon} ${item.name}</h3>
        <p class="product-farmer" style="margin-bottom: 0.5rem;">${item.desc}</p>
      </div>
      <div>
        <div class="product-price-row">
          <span class="product-price">₹${item.price.toFixed(2)} <small>/ ${item.unit}</small></span>
          <span style="font-weight: 700; color: #fbbf24; font-size: 0.95rem;" id="calc-input-${item.id}">₹${initialTotal.toFixed(2)}</span>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem;">
          <span style="font-size: 0.8rem; color: var(--text-muted);">Packages:</span>
          <div class="qty-stepper">
            <button class="qty-btn" onclick="adjustInputQty(${item.id}, -1)">-</button>
            <input type="number" class="qty-input" id="input-qty-${item.id}" value="${initialQty}" min="1" onchange="updateCalcInputPrice(${item.id}, ${item.price})">
            <button class="qty-btn" onclick="adjustInputQty(${item.id}, 1)">+</button>
          </div>
        </div>

        <button class="btn-primary" style="background: #f59e0b; color: #000; font-size: 0.85rem;" onclick="addInputToCart(${item.id})">Add to Basket 🛒</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function adjustInputQty(id, delta) {
  const input = document.getElementById(`input-qty-${id}`);
  if (input) {
    let val = parseFloat(input.value) || 0;
    val = Math.max(1, val + delta);
    input.value = val;
    
    const catalog = getInputsCatalog();
    const item = catalog.find(i => i.id === id);
    if (item) updateCalcInputPrice(id, item.price);
  }
}

function updateCalcInputPrice(id, unitPrice) {
  const input = document.getElementById(`input-qty-${id}`);
  const calcSpan = document.getElementById(`calc-input-${id}`);
  if (input && calcSpan) {
    const qty = Math.max(1, parseFloat(input.value) || 1);
    const total = qty * unitPrice;
    calcSpan.textContent = `₹${total.toFixed(2)}`;
  }
}

function addInputToCart(id) {
  const catalog = getInputsCatalog();
  const item = catalog.find(i => i.id === id);
  const qtyInput = document.getElementById(`input-qty-${id}`);
  const qty = qtyInput ? Math.max(1, parseFloat(qtyInput.value) || 1) : 1;

  if (item) {
    const existingIndex = inputCart.findIndex(c => c.id === item.id);
    if (existingIndex > -1) {
      inputCart[existingIndex].qty += qty;
    } else {
      inputCart.push({ ...item, qty: qty });
    }
    
    updateInputCartUI();
    showToast(`Added ${qty} package(s) of ${item.name} to basket!`, "success");
  }
}

function updateInputCartUI() {
  const countEl = document.getElementById('inputCartCount');
  const total = inputCart.reduce((sum, item) => sum + (item.price * item.qty), 0).toFixed(2);
  const totalPkgs = inputCart.reduce((sum, item) => sum + item.qty, 0);
  countEl.textContent = `${inputCart.length} supply item(s) (${totalPkgs} packages) - ₹${total}`;
}
