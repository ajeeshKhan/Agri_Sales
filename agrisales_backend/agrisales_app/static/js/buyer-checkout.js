/**
 * AgriSales Secure Multi-Step Checkout & Payment Handler
 */

let cart = JSON.parse(localStorage.getItem('agrisales_active_cart')) || [];
let activeStep = 2;
let generatedCaptcha = Math.floor(1000 + Math.random() * 9000).toString();

document.addEventListener('DOMContentLoaded', () => {
  const session = requireAuth('buyer', '/');
  if (!session) return;

  if (cart.length === 0) {
    showToast("Your cart is empty. Redirecting to marketplace...", "error");
    setTimeout(() => window.location.href = "/buyer-home/", 1500);
    return;
  }

  document.getElementById('step1UserEmail').textContent = session.email || "buyer@freshmarket.com";
  document.getElementById('step1Summary').textContent = `${session.name || 'Alex Johnson'} (${session.phone || '+91 98765-43210'})`;

  const captchaSpan = document.getElementById('captchaCodeVal');
  if (captchaSpan) captchaSpan.textContent = generatedCaptcha.split('').join(' ');

  renderCartItemsStep();
  updatePriceSidebar();

  document.querySelectorAll('.address-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.address-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  const form = document.getElementById('paymentAccordionForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const selectedPayMode = document.querySelector('input[name="payMethod"]:checked').value;

    if (selectedPayMode === 'COD') {
      const enteredCaptcha = document.getElementById('captchaInput').value.trim();
      if (enteredCaptcha !== generatedCaptcha) {
        showToast("Invalid security code. Please enter correct 4-digit code.", "error");
        return;
      }
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const tax = subtotal * 0.05;
    const grandTotal = subtotal + tax;

    const orderId = `AGRI-${Math.floor(100000 + Math.random() * 900000)}`;
    const selectedAddrRadio = document.querySelector('input[name="selectedAddr"]:checked');
    const deliveryAddress = selectedAddrRadio ? selectedAddrRadio.value : "APMC Market, Vashi, Navi Mumbai";

    const newOrder = {
      id: orderId,
      timestamp: new Date().toISOString(),
      buyerName: session.name || "Alex Johnson",
      buyerPhone: session.phone || "+91 98765-43210",
      deliveryAddress: deliveryAddress,
      paymentMethod: selectedPayMode,
      items: cart,
      subtotal: subtotal,
      tax: tax,
      totalAmount: grandTotal,
      status: "Confirmed",
      farmerName: cart[0]?.farmer || "Green Acres Organic Farm",
      estimatedDelivery: "Tomorrow by 2:00 PM"
    };

    saveOrder(newOrder);
    localStorage.removeItem('agrisales_active_cart');

    showToast(`Payment of ₹${grandTotal.toFixed(2)} successful via ${selectedPayMode}!`, "success");

    setTimeout(() => {
      window.location.href = `/buyer-tracking/?orderId=${orderId}`;
    }, 1200);
  });
});

function toggleStep(stepNum) {
  activeStep = stepNum;
  document.querySelectorAll('.checkout-step-card').forEach((card, idx) => {
    if (idx + 1 === stepNum) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });
}

function confirmAddressStep() {
  const selectedAddr = document.querySelector('input[name="selectedAddr"]:checked')?.value || "APMC Mandi, Vashi";
  document.getElementById('step2Summary').textContent = selectedAddr;
  
  document.getElementById('stepCard2').classList.add('completed');
  document.getElementById('stepCard2').querySelector('.step-num').textContent = "✓";
  toggleStep(3);
}

function confirmOrderSummaryStep() {
  document.getElementById('stepCard3').classList.add('completed');
  document.getElementById('stepCard3').querySelector('.step-num').textContent = "✓";
  toggleStep(4);
}

function switchPayTab(tabName) {
  document.getElementById('tabUpi').style.display = 'none';
  document.getElementById('tabCard').style.display = 'none';
  document.getElementById('tabNetbanking').style.display = 'none';
  document.getElementById('tabCod').style.display = 'none';

  if (tabName === 'upi') document.getElementById('tabUpi').style.display = 'block';
  if (tabName === 'card') document.getElementById('tabCard').style.display = 'block';
  if (tabName === 'netbanking') document.getElementById('tabNetbanking').style.display = 'block';
  if (tabName === 'cod') document.getElementById('tabCod').style.display = 'block';

  document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('selected'));
  event.target.closest('.payment-option').classList.add('selected');
}

function renderCartItemsStep() {
  const container = document.getElementById('checkoutCartItems');
  container.innerHTML = '';

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.qty;

    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.justifyContent = 'space-between';
    div.style.alignItems = 'center';
    div.style.padding = '0.85rem 0';
    div.style.borderBottom = '1px solid var(--border-color)';
    div.innerHTML = `
      <div>
        <strong style="font-size: 0.95rem;">${item.icon || '🌾'} ${item.name}</strong>
        <div style="font-size: 0.8rem; color: var(--text-muted);">₹${item.price.toFixed(2)} / ${item.unit || 'kg'} | by ${item.farmer || 'Organic Farm'}</div>
      </div>

      <div style="display: flex; align-items: center; gap: 1rem;">
        <div class="qty-stepper">
          <button class="qty-btn" type="button" onclick="modifyCheckoutQty(${index}, -5)">-</button>
          <input type="number" class="qty-input" value="${item.qty}" min="1" readonly>
          <button class="qty-btn" type="button" onclick="modifyCheckoutQty(${index}, 5)">+</button>
        </div>

        <span style="font-weight: 700; font-size: 1rem; min-width: 80px; text-align: right;">₹${itemTotal.toFixed(2)}</span>

        <button type="button" onclick="removeCheckoutItem(${index})" style="background: none; border: none; color: #fca5a5; cursor: pointer; font-size: 0.8rem;">✕</button>
      </div>
    `;
    container.appendChild(div);
  });
}

function modifyCheckoutQty(index, delta) {
  if (cart[index]) {
    cart[index].qty = Math.max(1, cart[index].qty + delta);
    localStorage.setItem('agrisales_active_cart', JSON.stringify(cart));
    renderCartItemsStep();
    updatePriceSidebar();
  }
}

function removeCheckoutItem(index) {
  cart.splice(index, 1);
  localStorage.setItem('agrisales_active_cart', JSON.stringify(cart));
  if (cart.length === 0) {
    window.location.href = "/buyer-home/";
  } else {
    renderCartItemsStep();
    updatePriceSidebar();
  }
}

function updatePriceSidebar() {
  const totalWeight = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const tax = subtotal * 0.05;
  const grandTotal = subtotal + tax;

  document.getElementById('priceItemsCount').textContent = `${cart.length} item(s), ${totalWeight}kg`;
  document.getElementById('subtotalVal').textContent = `₹${subtotal.toFixed(2)}`;
  document.getElementById('taxVal').textContent = `₹${tax.toFixed(2)}`;
  document.getElementById('totalVal').textContent = `₹${grandTotal.toFixed(2)}`;
}
