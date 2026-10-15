/**
 * AgriSales Farmer Produce Selling Portal Logic
 */

const CATEGORY_ICONS = {
  vegetables: "🥦",
  rice: "🍚",
  grains: "🌾",
  fruits: "🍎",
  pulses: "🫘"
};

document.addEventListener('DOMContentLoaded', () => {
  const session = requireAuth('seller', 'index.html');
  if (!session) return;

  document.getElementById('farmerProfileName').textContent = session.name || "Robert Green";
  document.getElementById('farmerFarmName').textContent = session.farmName || "Green Acres Organic Farm";

  document.getElementById('btnLogout').addEventListener('click', () => {
    clearSession();
    showToast("Logged out from Farmer Portal.", "info");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 600);
  });

  renderFarmerListings();

  // Form Handler
  const form = document.getElementById('sellProduceForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const catSelect = document.getElementById('produceCategory');
    const nameInput = document.getElementById('produceName');
    const stockInput = document.getElementById('produceStock');
    const priceInput = document.getElementById('producePrice');
    const dateInput = document.getElementById('produceHarvestDate');
    const tagSelect = document.getElementById('produceQualityTag');

    const catErr = ValidationRules.required(catSelect.value, "Category");
    const nameErr = ValidationRules.required(nameInput.value, "Produce Name");
    const stockErr = ValidationRules.required(stockInput.value, "Stock");
    const priceErr = ValidationRules.required(priceInput.value, "Price");

    if (catErr || nameErr || stockErr || priceErr) {
      showToast("Please fill out all crop listing details.", "error");
      return;
    }

    const icon = CATEGORY_ICONS[catSelect.value] || "🌾";

    const newProduce = {
      id: Date.now(),
      name: nameInput.value.trim(),
      category: catSelect.value,
      farmer: session.farmName || session.name,
      price: parseFloat(priceInput.value),
      unit: "kg",
      stock: parseFloat(stockInput.value),
      tag: tagSelect.value,
      icon: icon
    };

    addProduceItem(newProduce);
    renderFarmerListings();
    showToast(`Successfully published ${newProduce.name} (₹${newProduce.price}/kg) to Marketplace!`, "success");

    form.reset();
  });
});

function renderFarmerListings() {
  const session = getSession();
  const catalog = getProduceCatalog();
  const tbody = document.getElementById('farmerListingsTable');
  tbody.innerHTML = '';

  const farmerItems = catalog.filter(item => 
    item.farmer === (session.farmName || session.name) || item.farmer === "Green Acres Organic Farm"
  );

  document.getElementById('activeListingBadge').textContent = `${farmerItems.length} Live Items`;

  farmerItems.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${item.icon} ${item.name}</strong></td>
      <td><span class="badge badge-info">${item.category.toUpperCase()}</span></td>
      <td>${item.stock || 500} kg</td>
      <td>₹${item.price.toFixed(2)} / kg</td>
      <td><span class="badge badge-success">${item.tag}</span></td>
      <td>
        <button class="btn-secondary" onclick="deleteProduce(${item.id})" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; color: #fca5a5;">Remove</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function deleteProduce(id) {
  let catalog = getProduceCatalog();
  catalog = catalog.filter(i => i.id !== id);
  localStorage.setItem('agrisales_produce_catalog', JSON.stringify(catalog));
  renderFarmerListings();
  showToast("Listing removed from Marketplace.", "info");
}
