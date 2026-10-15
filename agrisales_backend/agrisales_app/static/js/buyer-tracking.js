/**
 * AgriSales Live Order Tracking Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const session = requireAuth('buyer', '/');
  if (!session) return;

  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('orderId');

  const orders = getOrders();
  let order = orders.find(o => o.id === orderId) || orders[0];

  if (!order) {
    document.getElementById('trackOrderId').textContent = "No Recent Orders";
    return;
  }

  document.getElementById('trackOrderId').textContent = `Order #${order.id}`;
  document.getElementById('trackOrderDate').textContent = `Placed on: ${new Date(order.timestamp).toLocaleString('en-IN')}`;
  document.getElementById('trackStatusBadge').textContent = `Status: ${order.status}`;
  document.getElementById('trackFarmerName').textContent = order.farmerName || "Green Acres Organic Farm";
  document.getElementById('trackDeliveryAddr').textContent = order.deliveryAddress;
  document.getElementById('trackPayMethod').textContent = order.paymentMethod;
  document.getElementById('trackEstDelivery').textContent = order.estimatedDelivery || "Tomorrow by 2:00 PM";

  const container = document.getElementById('orderItemsSummary');
  container.innerHTML = '';

  order.items.forEach(item => {
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.justifyContent = 'space-between';
    div.style.padding = '0.5rem 0';
    div.style.borderBottom = '1px solid var(--border-color)';
    div.style.fontSize = '0.875rem';
    div.innerHTML = `
      <span>${item.icon || '🌾'} <strong>${item.name}</strong> (${item.qty} ${item.unit || 'kg'})</span>
      <span style="font-weight: 700;">₹${(item.price * item.qty).toFixed(2)}</span>
    `;
    container.appendChild(div);
  });

  const totalDiv = document.createElement('div');
  totalDiv.style.display = 'flex';
  totalDiv.style.justifyContent = 'space-between';
  totalDiv.style.paddingTop = '0.75rem';
  totalDiv.style.fontWeight = '800';
  totalDiv.style.color = '#34d399';
  totalDiv.innerHTML = `
    <span>Total Amount Paid (incl. Tax):</span>
    <span>₹${order.totalAmount.toFixed(2)}</span>
  `;
  container.appendChild(totalDiv);
});
