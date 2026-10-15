/**
 * Agri-Merchant Home Dashboard & Supplies Inventory Manager
 */

const CATEGORY_ICONS = {
  pesticides: "🧪",
  manure: "🌱",
  seeds: "🌾",
  medicines: "💊"
};

document.addEventListener('DOMContentLoaded', () => {
  const session = requireAuth('merchant', 'index.html');
  if (!session) return;

  document.getElementById('merchantName').textContent = session.name || "Rajesh Kumar";
  document.getElementById('merchantStore').textContent = session.storeName || "Kisan Agri Supplies";
  if (session.licenseId) {
    document.getElementById('statMerchantLicense').textContent = session.licenseId;
  }

  document.getElementById('btnLogout').addEventListener('click', () => {
    clearSession();
    showToast("Logged out from Merchant Portal.", "info");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 600);
  });

  renderMerchantInventory();

  // Add Supply Form
  const form = document.getElementById('addMerchantInputForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const catSelect = document.getElementById('inputCategory');
    const nameInput = document.getElementById('inputName');
    const priceInput = document.getElementById('inputPrice');
    const unitInput = document.getElementById('inputUnit');

    if (!nameInput.value.trim() || !priceInput.value || !unitInput.value.trim()) {
      showToast("Please fill out all supply details.", "error");
      return;
    }

    const newItem = {
      id: Date.now(),
      name: nameInput.value.trim(),
      category: catSelect.value,
      merchant: session.storeName || "Kisan Agri Supplies",
      price: parseFloat(priceInput.value),
      unit: unitInput.value.trim(),
      icon: CATEGORY_ICONS[catSelect.value] || "🧪",
      desc: "Licensed quality farming input supply."
    };

    addInputItem(newItem);
    renderMerchantInventory();
    showToast(`Successfully listed ${newItem.name} (₹${newItem.price}) for farmers!`, "success");

    form.reset();
  });
});

function renderMerchantInventory() {
  const catalog = getInputsCatalog();
  const tbody = document.getElementById('merchantInventoryTable');
  tbody.innerHTML = '';

  document.getElementById('statInputCount').textContent = `${catalog.length} Active`;

  catalog.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${item.icon} ${item.name}</strong></td>
      <td><span class="badge badge-cyan">${item.category.toUpperCase()}</span></td>
      <td>${item.unit}</td>
      <td>₹${item.price.toFixed(2)}</td>
      <td>${item.merchant}</td>
      <td>
        <button class="btn-secondary" onclick="deleteInput(${item.id})" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; color: #fca5a5;">Remove</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function deleteInput(id) {
  let catalog = getInputsCatalog();
  catalog = catalog.filter(i => i.id !== id);
  localStorage.setItem('agrisales_inputs_catalog', JSON.stringify(catalog));
  renderMerchantInventory();
  showToast("Supply good removed from store.", "info");
}
