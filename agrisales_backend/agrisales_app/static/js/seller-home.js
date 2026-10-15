/**
 * AgriSales Seller / Farmer Overview Handler
 */

document.addEventListener('DOMContentLoaded', () => {
  const session = requireAuth('seller', '/');
  if (!session) return;

  document.getElementById('farmerProfileName').textContent = session.name || "Farmer Account";
  document.getElementById('welcomeFarmerName').textContent = session.name || "Farmer Account";
  document.getElementById('farmerFarmName').textContent = session.farmName || "Green Acres Organic Farm";

  document.getElementById('btnLogout').addEventListener('click', () => {
    clearSession();
    showToast("Logged out from Farmer Portal.", "info");
    setTimeout(() => {
      window.location.href = "/";
    }, 600);
  });

  renderFarmerProduceTable();
});

function renderFarmerProduceTable() {
  const catalog = getProduceCatalog();
  const tbody = document.getElementById('farmerProduceTable');
  tbody.innerHTML = '';

  const farmerCrops = catalog.filter(p => p.farmer.toLowerCase().includes("green acres") || p.farmer.toLowerCase().includes(getSession()?.name?.toLowerCase() || ""));
  const displayList = farmerCrops.length > 0 ? farmerCrops : catalog.slice(0, 4);

  document.getElementById('statProduceCount').textContent = displayList.length;

  displayList.forEach(crop => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${crop.icon || '🌾'} ${crop.name}</strong></td>
      <td><span class="badge badge-warning">${crop.category.toUpperCase()}</span></td>
      <td>₹${crop.price.toFixed(2)} / ${crop.unit}</td>
      <td><strong>${crop.stock} ${crop.unit}</strong></td>
      <td><span class="badge badge-success">${crop.tag || 'Certified Organic'}</span></td>
      <td>
        <button class="btn-secondary" style="font-size: 0.75rem; padding: 0.2rem 0.5rem;" onclick="showToast('Edit crop stock feature opened.', 'info')">Edit Stock ✏️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}
