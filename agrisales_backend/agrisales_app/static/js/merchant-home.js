/**
 * AgriSales Merchant Store & Inventory Handler
 */

document.addEventListener('DOMContentLoaded', () => {
  const session = requireAuth('merchant', '/');
  if (!session) return;

  document.getElementById('merchantName').textContent = session.name || "Agri Merchant";
  document.getElementById('merchantStore').textContent = session.storeName || "Kisan Agri Supplies Store";

  document.getElementById('btnLogout').addEventListener('click', () => {
    clearSession();
    showToast("Logged out from Merchant Portal.", "info");
    setTimeout(() => {
      window.location.href = "/";
    }, 600);
  });

  renderMerchantTable();

  const form = document.getElementById('addInputProductForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const category = document.getElementById('inputCat').value;
    const name = document.getElementById('inputTitle').value.trim();
    const price = parseFloat(document.getElementById('inputPrice').value);
    const unit = document.getElementById('inputUnit').value.trim();
    const desc = document.getElementById('inputDesc').value.trim();

    if (!name || isNaN(price) || !unit) {
      showToast("Please fill in all product fields.", "error");
      return;
    }

    const iconMap = { pesticides: '🧪', manure: '🌱', seeds: '🌾', medicines: '💊' };

    const newItem = {
      id: Date.now(),
      name: name,
      category: category,
      merchant: session.storeName || session.name || "Kisan Agri Supplies",
      price: price,
      unit: unit,
      stock: 100,
      icon: iconMap[category] || '🧪',
      desc: desc
    };

    addInputItem(newItem);
    showToast(`Added ${name} to Farmer Inputs Store!`, "success");
    form.reset();
    renderMerchantTable();
  });
});

function renderMerchantTable() {
  const catalog = getInputsCatalog();
  const tbody = document.getElementById('merchantTableBody');
  tbody.innerHTML = '';

  document.getElementById('merchantGoodsCount').textContent = catalog.length;

  catalog.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${item.icon} ${item.name}</strong></td>
      <td><span class="badge badge-cyan">${item.category.toUpperCase()}</span></td>
      <td>${item.unit}</td>
      <td><strong>₹${item.price.toFixed(2)}</strong></td>
      <td><small style="color: var(--text-muted);">${item.desc}</small></td>
    `;
    tbody.appendChild(tr);
  });
}
