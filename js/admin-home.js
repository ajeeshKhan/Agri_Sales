/**
 * AgriSales Admin Console - Full User & Marketplace CRUD Management
 */

let selectedRoleFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
  const session = requireAuth('admin', 'index.html');
  if (!session) return;

  document.getElementById('currentAdminName').textContent = session.name || "System Admin";
  document.getElementById('welcomeName').textContent = session.name || "Administrator";
  document.getElementById('currentAdminDept').textContent = session.department || "Security Operations";

  document.getElementById('btnLogout').addEventListener('click', () => {
    clearSession();
    showToast("Logged out successfully.", "info");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 600);
  });

  renderUsersTable();
  renderItemsTable();

  // Add User Form Submission
  const addUserForm = document.getElementById('adminAddUserForm');
  addUserForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const role = document.getElementById('newUserRole').value;
    const name = document.getElementById('newUserName').value.trim();
    const email = document.getElementById('newUserEmail').value.trim();
    const phone = document.getElementById('newUserPhone').value.trim();
    const password = document.getElementById('newUserPassword').value;
    const detail = document.getElementById('newUserDetail').value.trim();

    if (!name || !email || !phone || !password) {
      showToast("Please fill in all required user fields.", "error");
      return;
    }

    const newUser = {
      name: name,
      email: email,
      phone: phone,
      password: password,
      role: role
    };

    if (role === 'seller') newUser.farmName = detail || "Organic Farm";
    if (role === 'buyer') newUser.businessName = detail || "Wholesale Buyer";
    if (role === 'merchant') newUser.storeName = detail || "Agri Supplies Store";
    if (role === 'admin') newUser.department = detail || "Operations";

    registerUser(newUser);
    closeModal('addUserModal');
    addUserForm.reset();
    renderUsersTable();
    showToast(`Registered new ${role.toUpperCase()} account for ${name}!`, "success");
  });

  // Edit User Form Submission
  const editUserForm = document.getElementById('adminEditUserForm');
  editUserForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('editUserTargetEmail').value;
    const name = document.getElementById('editUserName').value.trim();
    const phone = document.getElementById('editUserPhone').value.trim();
    const detail = document.getElementById('editUserDetail').value.trim();

    const updatedData = {
      name: name,
      phone: phone,
      farmName: detail,
      storeName: detail,
      businessName: detail,
      department: detail
    };

    updateUser(email, updatedData);
    closeModal('editUserModal');
    renderUsersTable();
    showToast(`Updated profile details for ${name}!`, "success");
  });

  // Edit Item Form Submission
  const editItemForm = document.getElementById('adminEditItemForm');
  editItemForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const itemId = parseInt(document.getElementById('editItemTargetId').value);
    const name = document.getElementById('editItemName').value.trim();
    const price = parseFloat(document.getElementById('editItemPrice').value);
    const stock = parseInt(document.getElementById('editItemStock').value);

    updateProduceItem(itemId, {
      name: name,
      price: price,
      stock: stock,
      tag: stock > 0 ? "Fresh Harvest" : "Out of Stock"
    });

    closeModal('editItemModal');
    renderItemsTable();
    showToast(`Updated listing for ${name} (₹${price}/unit)!`, "success");
  });
});

// Modal Controls
function openAddUserModal() {
  document.getElementById('addUserModal').style.display = 'flex';
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

function toggleAddUserRoleFields() {
  const role = document.getElementById('newUserRole').value;
  const label = document.getElementById('detailFieldLabel');
  const input = document.getElementById('newUserDetail');

  if (role === 'seller') { label.textContent = "Farm Name & Region"; input.placeholder = "e.g. Green Acres Farm, Nashik"; }
  else if (role === 'buyer') { label.textContent = "Business / Purchasing Entity"; input.placeholder = "e.g. Fresh Market Retail"; }
  else if (role === 'merchant') { label.textContent = "Store / Vendor Name"; input.placeholder = "e.g. Kisan Agri Supplies"; }
  else if (role === 'admin') { label.textContent = "Department Unit"; input.placeholder = "e.g. Security & Compliance"; }
}

// User Filter Tabs
function filterUserRole(role) {
  selectedRoleFilter = role;
  document.querySelectorAll('.filter-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  renderUsersTable();
}

// Render User Accounts Table
function renderUsersTable() {
  const users = getRegisteredUsers();
  const tbody = document.getElementById('userTableBody');
  tbody.innerHTML = '';

  let farmersCount = 0;
  let buyersCount = 0;
  let merchantsCount = 0;

  const filtered = selectedRoleFilter === 'all'
    ? users
    : users.filter(u => u.role === selectedRoleFilter);

  users.forEach(u => {
    if (u.role === 'seller') farmersCount++;
    if (u.role === 'buyer') buyersCount++;
    if (u.role === 'merchant') merchantsCount++;
  });

  document.getElementById('statUserCount').textContent = users.length;
  document.getElementById('statFarmerCount').textContent = farmersCount;
  document.getElementById('statBuyerCount').textContent = buyersCount;
  document.getElementById('statMerchantCount').textContent = merchantsCount;

  filtered.forEach(user => {
    const tr = document.createElement('tr');
    
    let roleBadge = '<span class="badge badge-info">Admin</span>';
    let detail = user.department || user.adminKey || 'SuperAdmin';

    if (user.role === 'buyer') {
      roleBadge = '<span class="badge badge-success">Buyer</span>';
      detail = user.businessName || 'Wholesale Buyer';
    } else if (user.role === 'seller') {
      roleBadge = '<span class="badge badge-warning">Farmer (Seller)</span>';
      detail = user.farmName || user.farmRegion || 'Organic Farm';
    } else if (user.role === 'merchant') {
      roleBadge = '<span class="badge badge-cyan">Agri-Merchant</span>';
      detail = user.storeName || 'Kisan Agri Supplies';
    }

    tr.innerHTML = `
      <td><strong>${user.name}</strong></td>
      <td>${user.email}</td>
      <td>${roleBadge}</td>
      <td>${user.phone || '+91 98765-43210'}</td>
      <td>${detail}</td>
      <td>
        <button class="btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; color: #38bdf8;" onclick="triggerEditUser('${user.email}')">Edit ✏️</button>
        <button class="btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; color: #fca5a5;" onclick="triggerDeleteUser('${user.email}')">Delete 🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Edit & Delete User Actions
function triggerEditUser(email) {
  const users = getRegisteredUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (user) {
    document.getElementById('editUserTargetEmail').value = user.email;
    document.getElementById('editUserName').value = user.name || '';
    document.getElementById('editUserPhone').value = user.phone || '';
    document.getElementById('editUserDetail').value = user.farmName || user.storeName || user.businessName || user.department || '';
    document.getElementById('editUserModal').style.display = 'flex';
  }
}

function triggerDeleteUser(email) {
  if (confirm(`Are you sure you want to delete account: ${email}?`)) {
    deleteUser(email);
    renderUsersTable();
    showToast(`Account ${email} removed.`, "info");
  }
}

// Render Marketplace Produce & Items Table
function renderItemsTable() {
  const catalog = getProduceCatalog();
  const tbody = document.getElementById('itemsTableBody');
  tbody.innerHTML = '';

  document.getElementById('liveItemCountBadge').textContent = `${catalog.length} Items Live`;

  catalog.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${item.icon || '🌾'} ${item.name}</strong></td>
      <td><span class="badge badge-info">${(item.category || 'produce').toUpperCase()}</span></td>
      <td>${item.farmer || item.merchant || 'Certified Vendor'}</td>
      <td>${item.stock || 500} ${item.unit || 'kg'}</td>
      <td>₹${item.price.toFixed(2)}</td>
      <td>
        <button class="btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; color: #34d399;" onclick="triggerEditItem(${item.id})">Edit ✏️</button>
        <button class="btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; color: #fca5a5;" onclick="triggerDeleteItem(${item.id})">Remove 🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function triggerEditItem(id) {
  const catalog = getProduceCatalog();
  const item = catalog.find(i => i.id === id);
  if (item) {
    document.getElementById('editItemTargetId').value = item.id;
    document.getElementById('editItemName').value = item.name;
    document.getElementById('editItemPrice').value = item.price;
    document.getElementById('editItemStock').value = item.stock || 500;
    document.getElementById('editItemModal').style.display = 'flex';
  }
}

function triggerDeleteItem(id) {
  if (confirm("Are you sure you want to remove this produce item from the marketplace?")) {
    deleteProduceItem(id);
    renderItemsTable();
    showToast("Produce listing removed from marketplace.", "info");
  }
}
