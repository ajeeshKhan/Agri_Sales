/**
 * AgriSales Seller (Farmer) Home Portal Logic & Inventory Manager
 */

let farmerInventory = [
  { id: 101, name: "Organic Shimla Apples", quantity: 450, price: 160, status: "Active" },
  { id: 102, name: "Crisp Baby Spinach", quantity: 180, price: 90, status: "Active" },
  { id: 103, name: "Sweet Hybrid Tomatoes", quantity: 300, price: 45, status: "Active" },
  { id: 104, name: "Sweet Potatoes", quantity: 600, price: 55, status: "Active" }
];

document.addEventListener('DOMContentLoaded', () => {
  const session = requireAuth('seller', 'index.html');
  if (!session) return;

  document.getElementById('farmerProfileName').textContent = session.name || "Robert Green";
  document.getElementById('farmerFarmName').textContent = session.farmName ? `${session.farmName} (${session.farmRegion || 'Organic'})` : "Green Acres Farm";
  if (session.licenseId) {
    document.getElementById('statLicense').textContent = session.licenseId;
  }

  document.getElementById('btnLogout').addEventListener('click', () => {
    clearSession();
    showToast("Logged out from Farmer Portal.", "info");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 600);
  });

  renderInventory();

  const addForm = document.getElementById('addCropForm');
  addForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('cropName');
    const qtyInput = document.getElementById('cropQuantity');
    const priceInput = document.getElementById('cropPrice');

    if (!nameInput.value.trim() || !qtyInput.value || !priceInput.value) {
      showToast("Please fill all produce details.", "error");
      return;
    }

    const newItem = {
      id: Date.now(),
      name: nameInput.value.trim(),
      quantity: parseFloat(qtyInput.value),
      price: parseFloat(priceInput.value),
      status: "Active"
    };

    farmerInventory.unshift(newItem);
    renderInventory();
    showToast(`Successfully listed ${newItem.name} (₹${newItem.price}/kg) on AgriSales marketplace!`, "success");

    nameInput.value = '';
    qtyInput.value = '';
    priceInput.value = '';
  });
});

function renderInventory() {
  const tbody = document.getElementById('inventoryTableBody');
  tbody.innerHTML = '';

  farmerInventory.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>🌾 ${item.name}</strong></td>
      <td>${item.quantity} kg</td>
      <td>₹${item.price.toFixed(2)} / kg</td>
      <td><span class="badge badge-success">${item.status}</span></td>
      <td>
        <button class="btn-secondary" onclick="deleteListing(${item.id})" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; color: #fca5a5;">Remove</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById('statHarvestCount').textContent = `${farmerInventory.length} Active`;
}

function deleteListing(id) {
  farmerInventory = farmerInventory.filter(i => i.id !== id);
  renderInventory();
  showToast("Listing removed.", "info");
}
