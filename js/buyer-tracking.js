/**
 * AgriSales Order Tracking & Status Renderer
 */

document.addEventListener('DOMContentLoaded', () => {
  const session = requireAuth('buyer', 'index.html');
  if (!session) return;

  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('orderId');

  let order = null;
  if (orderId) {
    order = getOrderById(orderId);
  }

  // Fallback demo order if none found
  if (!order) {
    order = {
      id: "AGRI-89421",
      buyerName: session.name || "Alex Johnson",
      buyerPhone: session.phone || "+91 98765-43210",
      deliveryAddress: session.address || "Plot 42, APMC Market, Sector 18, Vashi, Navi Mumbai",
      paymentMethod: "UPI / Instant Pay",
      farmerName: "Green Acres Organic Farm",
      estimatedDelivery: "Tomorrow by 2:00 PM",
      totalAmount: 1848.00,
      items: [
        { name: "Organic Shimla Apples", icon: "🍎", qty: 10, price: 160 },
        { name: "Kolam Raw Rice", icon: "🍚", qty: 20, price: 65 }
      ]
    };
  }

  document.getElementById('orderIdHeader').textContent = `Order #${order.id} | Payment Mode: ${order.paymentMethod} (Paid)`;
  document.getElementById('estDeliveryBadge').textContent = `Est. Delivery: ${order.estimatedDelivery || 'Tomorrow, 2:00 PM'}`;
  document.getElementById('trackBuyerName').textContent = order.buyerName;
  document.getElementById('trackPhone').textContent = order.buyerPhone;
  document.getElementById('trackAddress').textContent = order.deliveryAddress;
  document.getElementById('trackFarmerName').textContent = order.farmerName || "Green Acres Organic Farm";
  document.getElementById('trackTotalPaid').textContent = `₹${order.totalAmount.toFixed(2)}`;

  const itemsContainer = document.getElementById('trackItemsList');
  itemsContainer.innerHTML = '';

  order.items.forEach(item => {
    const itemTotal = item.price * item.qty;
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.justifySpaceBetween = 'space-between';
    row.style.justifyContent = 'space-between';
    row.style.padding = '0.5rem 0';
    row.style.borderBottom = '1px solid var(--border-color)';
    row.innerHTML = `
      <div>
        <strong>${item.icon || '🌾'} ${item.name}</strong>
        <div style="font-size: 0.8rem; color: var(--text-muted);">${item.qty} kg × ₹${item.price}/kg</div>
      </div>
      <div style="font-weight: 700;">₹${itemTotal.toFixed(2)}</div>
    `;
    itemsContainer.appendChild(row);
  });
});
