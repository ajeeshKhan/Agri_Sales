/**
 * AgriSales Signup Handler
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('agriSalesSignupForm');
  const roleSelect = document.getElementById('userRole');
  const roleFieldsContainer = document.getElementById('roleSpecificFieldsContainer');
  const bodyEl = document.getElementById('bodyElement');
  const roleBadge = document.getElementById('roleBadge');

  const roleConfigs = {
    buyer: {
      themeClass: 'theme-buyer',
      badgeText: '🛒 Buyer Registration',
      fieldsHTML: `
        <div class="form-group">
          <label for="businessName">Business / Retail Name</label>
          <input type="text" id="businessName" class="form-control" placeholder="Fresh Market Retail" required>
        </div>
        <div class="form-group">
          <label for="businessType">Buyer Type</label>
          <select id="businessType" class="form-control">
            <option value="retailer">Wholesale Retailer</option>
            <option value="hotel">Hotel / Restaurant Chain</option>
            <option value="exporter">Agri Exporter</option>
            <option value="consumer">Bulk Household Buyer</option>
          </select>
        </div>
      `
    },
    seller: {
      themeClass: 'theme-seller',
      badgeText: '🚜 Farmer Registration',
      fieldsHTML: `
        <div class="form-group">
          <label for="farmName">Farm / Estate Name</label>
          <input type="text" id="farmName" class="form-control" placeholder="Green Acres Organic Farm" required>
        </div>
        <div class="form-group">
          <label for="farmRegion">District / State Region</label>
          <input type="text" id="farmRegion" class="form-control" placeholder="Nashik, Maharashtra" required>
        </div>
      `
    },
    merchant: {
      themeClass: 'theme-merchant',
      badgeText: '🧪 Agri-Merchant Registration',
      fieldsHTML: `
        <div class="form-group">
          <label for="storeName">Fertilizer & Seed Store Name</label>
          <input type="text" id="storeName" class="form-control" placeholder="Kisan Agri Supplies" required>
        </div>
        <div class="form-group">
          <label for="licenseId">Fertilizer / Pesticide License No.</label>
          <input type="text" id="licenseId" class="form-control" placeholder="PEST-REG-5542" required>
        </div>
      `
    },
    admin: {
      themeClass: 'theme-admin',
      badgeText: '🛡️ Administrator Registration',
      fieldsHTML: `
        <div class="form-group">
          <label for="adminKey">Master Admin Key</label>
          <input type="password" id="adminKey" class="form-control" placeholder="Enter Key (ADMIN-2026-KEY)" required>
        </div>
        <div class="form-group">
          <label for="department">Security Unit</label>
          <input type="text" id="department" class="form-control" placeholder="Operations" required>
        </div>
      `
    }
  };

  function updateRoleFields() {
    const selectedRole = roleSelect.value;
    const config = roleConfigs[selectedRole] || roleConfigs.buyer;

    bodyEl.className = config.themeClass;
    roleBadge.textContent = config.badgeText;
    roleFieldsContainer.innerHTML = config.fieldsHTML;
  }

  roleSelect.addEventListener('change', updateRoleFields);
  updateRoleFields();

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const selectedRole = roleSelect.value;
    const name = document.getElementById('fullName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('userPassword').value;

    if (!name || !email || !phone || !password) {
      showToast("Please fill in all registration fields.", "error");
      return;
    }

    const newUser = {
      name: name,
      email: email,
      phone: phone,
      password: password,
      role: selectedRole
    };

    registerUser(newUser);
    showToast(`Account created successfully as ${selectedRole.toUpperCase()}! Redirecting to login...`, "success");

    setTimeout(() => {
      window.location.href = "/";
    }, 1200);
  });
});
