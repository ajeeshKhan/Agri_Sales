/**
 * AgriSales Farmer Post Crop Listing Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const session = requireAuth('seller', '/');
  if (!session) return;

  document.getElementById('farmerProfileName').textContent = session.name || "Farmer Account";
  document.getElementById('farmerFarmName').textContent = session.farmName || "Green Acres Organic Farm";

  document.getElementById('btnLogout').addEventListener('click', () => {
    clearSession();
    showToast("Logged out from Farmer Portal.", "info");
    setTimeout(() => {
      window.location.href = "/";
    }, 600);
  });

  const form = document.getElementById('postCropForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const category = document.getElementById('cropCategory').value;
    const name = document.getElementById('cropName').value.trim();
    const price = parseFloat(document.getElementById('cropPrice').value);
    const stock = parseInt(document.getElementById('cropStock').value);
    const tag = document.getElementById('cropTag').value.trim() || 'Fresh Harvest';

    if (!name || isNaN(price) || isNaN(stock)) {
      showToast("Please fill in all crop details.", "error");
      return;
    }

    const iconMap = { vegetables: '🥦', rice: '🍚', grains: '🌾', fruits: '🍎', pulses: '🫘' };

    const newCrop = {
      id: Date.now(),
      name: name,
      category: category,
      farmer: session.farmName || session.name || "Green Acres Organic Farm",
      price: price,
      unit: "kg",
      stock: stock,
      tag: tag,
      icon: iconMap[category] || '🌾'
    };

    addProduceItem(newCrop);
    showToast(`Published ${name} (${stock}kg @ ₹${price}/kg) to marketplace!`, "success");
    form.reset();

    setTimeout(() => {
      window.location.href = "/seller-home/";
    }, 1200);
  });
});
