/**
 * AgriSales Shared Authentication, Data Repositories & Order Engine
 */

const DEFAULT_USERS = {
  admin: {
    name: "System Admin",
    email: "admin@agrisales.com",
    password: "Admin@1234",
    role: "admin",
    adminKey: "ADMIN-2026-KEY",
    department: "Security & Operations"
  },
  buyer: {
    name: "Alex Johnson",
    email: "buyer@freshmarket.com",
    password: "Buyer@1234",
    role: "buyer",
    businessName: "Fresh Market Retail",
    businessType: "retailer",
    phone: "+91 98765-43210",
    address: "Plot 42, APMC Market, Sector 18, Vashi, Navi Mumbai"
  },
  seller: {
    name: "Ramesh Patil",
    email: "farmer@greenacres.com",
    password: "Farmer@1234",
    role: "seller",
    farmName: "Green Acres Organic Farm",
    farmRegion: "Nashik, Maharashtra",
    cropCategory: "fruits-veg",
    licenseId: "FARM-MH-98741",
    phone: "+91 94221-88900"
  },
  merchant: {
    name: "Rajesh Kumar",
    email: "merchant@agrisupply.com",
    password: "Merchant@1234",
    role: "merchant",
    storeName: "Kisan Agri Supplies & Fertilizers",
    licenseId: "PEST-REG-5542",
    supplyCategory: "pesticides-fertilizers",
    phone: "+91 98220-11223"
  }
};

// Initial Produce Catalog
const INITIAL_PRODUCE_CATALOG = [
  { id: 1, name: "Organic Shimla Apples", category: "fruits", farmer: "Green Acres Organic Farm", price: 160, unit: "kg", stock: 450, tag: "Certified Organic", icon: "🍎" },
  { id: 2, name: "Fresh Hybrid Tomatoes", category: "vegetables", farmer: "Nashik Farms", price: 35, unit: "kg", stock: 300, tag: "Non-GMO", icon: "🍅" },
  { id: 3, name: "Premium Sharbati Wheat Grains", category: "grains", farmer: "Punjab Grain Fields", price: 42, unit: "kg", stock: 800, tag: "Grade A Grain", icon: "🌾" },
  { id: 4, name: "Kolam Raw Rice", category: "rice", farmer: "Godavari Rice Mills", price: 65, unit: "kg", stock: 600, tag: "Fresh Harvest", icon: "🍚" },
  { id: 5, name: "Fresh Baby Spinach", category: "vegetables", farmer: "Green Acres Organic Farm", price: 40, unit: "kg", stock: 180, tag: "Hydroponic", icon: "🥬" },
  { id: 6, name: "Yellow Toor Dal (Lentils)", category: "pulses", farmer: "Vidarbha Agro", price: 140, unit: "kg", stock: 250, tag: "Unpolished", icon: "🫘" },
  { id: 7, name: "Nagpur Sweet Oranges", category: "fruits", farmer: "Sahyadri Orchards", price: 80, unit: "kg", stock: 400, tag: "Export Quality", icon: "🍊" },
  { id: 8, name: "Basmati Rice (1121 Steam)", category: "rice", farmer: "Golden Fields Ltd", price: 120, unit: "kg", stock: 500, tag: "Long Grain", icon: "🍚" }
];

// Initial Agri-Inputs Catalog
const INITIAL_INPUTS_CATALOG = [
  { id: 201, name: "Neem Shield Organic Pesticide", category: "pesticides", merchant: "Kisan Agri Supplies", price: 450, unit: "Liter", stock: 100, icon: "🧪", desc: "Eco-friendly natural pest controller for leaf caterpillars and aphids." },
  { id: 202, name: "VermiCompost Organic Manure", category: "manure", merchant: "Kisan Agri Supplies", price: 320, unit: "50kg Bag", stock: 80, icon: "🌱", desc: "Rich humus fertilizer packed with earthworm castings for soil health." },
  { id: 203, name: "Hybrid Bt-Cotton Seeds", category: "seeds", merchant: "Krishi Seva Kendra", price: 850, unit: "Packet", stock: 150, icon: "🌾", desc: "Bollworm resistant high yield cotton seed hybrid." },
  { id: 204, name: "FungiStop Crop Medicine", category: "medicines", merchant: "Kisan Agri Supplies", price: 580, unit: "500ml", stock: 60, icon: "💊", desc: "Systemic fungicide for powdery mildew and root rot treatment." },
  { id: 205, name: "NPK 19:19:19 Soluble Fertilizer", category: "manure", merchant: "Kisan Agri Supplies", price: 1250, unit: "25kg Bag", stock: 90, icon: "🧪", desc: "100% water soluble plant nutrient booster for rapid crop growth." }
];

// Initialize Registered Users DB
function initUserDatabase() {
  let storedUsers = [];
  try {
    storedUsers = JSON.parse(localStorage.getItem('agrisales_registered_users')) || [];
  } catch(e) {
    storedUsers = [];
  }

  const defaultKeys = Object.keys(DEFAULT_USERS);
  let updated = false;

  defaultKeys.forEach(key => {
    const defUser = DEFAULT_USERS[key];
    const exists = storedUsers.some(u => u.email.toLowerCase() === defUser.email.toLowerCase() && u.role === defUser.role);
    if (!exists) {
      storedUsers.push(defUser);
      updated = true;
    }
  });

  if (updated || storedUsers.length === 0) {
    localStorage.setItem('agrisales_registered_users', JSON.stringify(storedUsers));
  }

  if (!localStorage.getItem('agrisales_produce_catalog')) {
    localStorage.setItem('agrisales_produce_catalog', JSON.stringify(INITIAL_PRODUCE_CATALOG));
  }

  if (!localStorage.getItem('agrisales_inputs_catalog')) {
    localStorage.setItem('agrisales_inputs_catalog', JSON.stringify(INITIAL_INPUTS_CATALOG));
  }

  if (!localStorage.getItem('agrisales_orders')) {
    localStorage.setItem('agrisales_orders', JSON.stringify([]));
  }
}

initUserDatabase();

// USER CRUD OPERATIONS
function getRegisteredUsers() {
  initUserDatabase();
  return JSON.parse(localStorage.getItem('agrisales_registered_users')) || [];
}

function registerUser(newUser) {
  const users = getRegisteredUsers();
  users.push(newUser);
  localStorage.setItem('agrisales_registered_users', JSON.stringify(users));
}

function updateUser(email, updatedData) {
  let users = getRegisteredUsers();
  const index = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
  if (index > -1) {
    users[index] = { ...users[index], ...updatedData };
    localStorage.setItem('agrisales_registered_users', JSON.stringify(users));
    return true;
  }
  return false;
}

function deleteUser(email) {
  let users = getRegisteredUsers();
  users = users.filter(u => u.email.toLowerCase() !== email.toLowerCase());
  localStorage.setItem('agrisales_registered_users', JSON.stringify(users));
}

// PRODUCE CATALOG CRUD & STOCK DEDUCTION
function getProduceCatalog() {
  return JSON.parse(localStorage.getItem('agrisales_produce_catalog')) || INITIAL_PRODUCE_CATALOG;
}

function addProduceItem(item) {
  const catalog = getProduceCatalog();
  catalog.unshift(item);
  localStorage.setItem('agrisales_produce_catalog', JSON.stringify(catalog));
}

function updateProduceItem(id, updatedData) {
  let catalog = getProduceCatalog();
  const index = catalog.findIndex(i => i.id === id);
  if (index > -1) {
    catalog[index] = { ...catalog[index], ...updatedData };
    localStorage.setItem('agrisales_produce_catalog', JSON.stringify(catalog));
    return true;
  }
  return false;
}

function deleteProduceItem(id) {
  let catalog = getProduceCatalog();
  catalog = catalog.filter(i => i.id !== id);
  localStorage.setItem('agrisales_produce_catalog', JSON.stringify(catalog));
}

// Stock Deduction Engine upon Order Purchase
function deductInventoryStock(purchasedItems) {
  let catalog = getProduceCatalog();
  let inputsCatalog = getInputsCatalog();

  purchasedItems.forEach(item => {
    // Check produce catalog
    const prodIndex = catalog.findIndex(p => p.id === item.id || p.name === item.name);
    if (prodIndex > -1) {
      const currentStock = catalog[prodIndex].stock || 500;
      const newStock = Math.max(0, currentStock - (item.qty || 1));
      catalog[prodIndex].stock = newStock;
      if (newStock === 0) {
        catalog[prodIndex].tag = "Out of Stock";
      }
    }

    // Check inputs catalog
    const inputIndex = inputsCatalog.findIndex(i => i.id === item.id || i.name === item.name);
    if (inputIndex > -1) {
      const currentStock = inputsCatalog[inputIndex].stock || 100;
      const newStock = Math.max(0, currentStock - (item.qty || 1));
      inputsCatalog[inputIndex].stock = newStock;
    }
  });

  localStorage.setItem('agrisales_produce_catalog', JSON.stringify(catalog));
  localStorage.setItem('agrisales_inputs_catalog', JSON.stringify(inputsCatalog));
}

// AGRI-INPUTS CATALOG DB OPERATIONS
function getInputsCatalog() {
  return JSON.parse(localStorage.getItem('agrisales_inputs_catalog')) || INITIAL_INPUTS_CATALOG;
}

function addInputItem(item) {
  const catalog = getInputsCatalog();
  catalog.unshift(item);
  localStorage.setItem('agrisales_inputs_catalog', JSON.stringify(catalog));
}

// ORDER MANAGEMENT
function saveOrder(order) {
  const orders = JSON.parse(localStorage.getItem('agrisales_orders')) || [];
  orders.unshift(order);
  localStorage.setItem('agrisales_orders', JSON.stringify(orders));

  // Deduct purchased inventory stock automatically!
  if (order.items && order.items.length > 0) {
    deductInventoryStock(order.items);
  }
}

function getOrders() {
  return JSON.parse(localStorage.getItem('agrisales_orders')) || [];
}

function getOrderById(orderId) {
  const orders = getOrders();
  return orders.find(o => o.id === orderId) || null;
}

// SESSION MANAGEMENT
function setSession(user) {
  localStorage.setItem('agrisales_active_session', JSON.stringify({
    ...user,
    loginTimestamp: new Date().toISOString()
  }));
}

function getSession() {
  const sessionData = localStorage.getItem('agrisales_active_session');
  return sessionData ? JSON.parse(sessionData) : null;
}

function clearSession() {
  localStorage.removeItem('agrisales_active_session');
}

function requireAuth(allowedRole, loginUrl = "index.html") {
  const session = getSession();
  if (!session || (allowedRole && session.role !== allowedRole)) {
    window.location.href = loginUrl;
    return null;
  }
  return session;
}

// VALIDATION RULES
const ValidationRules = {
  email: (val) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val || !val.trim()) return "Email address is required.";
    if (!re.test(val.trim())) return "Please enter a valid email address.";
    return null;
  },
  password: (val) => {
    if (!val) return "Password is required.";
    if (val.length < 8) return "Password must be at least 8 characters long.";
    if (!/[A-Z]/.test(val)) return "Include at least one uppercase letter (A-Z).";
    if (!/[a-z]/.test(val)) return "Include at least one lowercase letter (a-z).";
    if (!/[0-9]/.test(val)) return "Include at least one number (0-9).";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(val)) return "Include at least one special character (!@#$%^&*).";
    return null;
  },
  required: (val, fieldName = "This field") => {
    if (!val || !val.trim()) return `${fieldName} is required.`;
    return null;
  },
  phone: (val) => {
    if (!val || !val.trim()) return "Phone number is required.";
    const cleanPhone = val.replace(/[\s\-\(\)\+]/g, '');
    if (!/^\d{10,15}$/.test(cleanPhone)) return "Enter a valid phone number (10 to 15 digits).";
    return null;
  },
  adminKey: (val) => {
    if (!val || !val.trim()) return "Admin Access Key is required.";
    if (val.trim() !== "ADMIN-2026-KEY") return "Invalid Admin Key. (Demo Key: ADMIN-2026-KEY)";
    return null;
  }
};

function showFieldError(inputElement, errorMessage) {
  const group = inputElement.closest('.form-group');
  if (!group) return;
  
  inputElement.classList.add('is-invalid');
  inputElement.classList.remove('is-valid');
  
  let feedback = group.querySelector('.error-feedback');
  if (!feedback) {
    feedback = document.createElement('span');
    feedback.className = 'error-feedback';
    group.appendChild(feedback);
  }
  feedback.textContent = errorMessage;
  group.classList.add('has-error');
}

function clearFieldError(inputElement) {
  const group = inputElement.closest('.form-group');
  if (!group) return;
  
  inputElement.classList.remove('is-invalid');
  inputElement.classList.add('is-valid');
  group.classList.remove('has-error');
}

// TOAST NOTIFICATIONS
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  toast.innerHTML = `<span>${icon}</span> <div>${message}</div>`;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// SETUP PASSWORD TOGGLES
function setupPasswordToggles() {
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling || btn.parentElement.querySelector('input');
      if (input) {
        if (input.type === 'password') {
          input.type = 'text';
          btn.textContent = 'Hide';
        } else {
          input.type = 'password';
          btn.textContent = 'Show';
        }
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', setupPasswordToggles);
