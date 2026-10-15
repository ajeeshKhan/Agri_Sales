/**
 * AgriSales Unified Login Handler & Role Dropdown Switcher
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('agriSalesLoginForm');
  const roleSelect = document.getElementById('userRole');
  const emailInput = document.getElementById('userEmail');
  const passwordInput = document.getElementById('userPassword');
  const autofillBtn = document.getElementById('btnAutofill');
  const bodyEl = document.getElementById('bodyElement');
  
  const roleBadge = document.getElementById('roleBadge');
  const demoRoleTitle = document.getElementById('demoRoleTitle');
  const demoDetailsBody = document.getElementById('demoDetailsBody');

  // Role Metadata Config
  const roleConfigs = {
    buyer: {
      themeClass: 'theme-buyer',
      badgeText: '🛒 Buyer Marketplace Portal',
      demoTitle: 'Buyer Demo Account',
      demoDetails: 'Email: <code>buyer@freshmarket.com</code> | Pass: <code>Buyer@1234</code>',
      placeholderEmail: 'buyer@freshmarket.com',
      redirectUrl: 'buyer-home.html',
      defaultCreds: DEFAULT_USERS.buyer
    },
    seller: {
      themeClass: 'theme-seller',
      badgeText: '🚜 Seller / Farmer Portal',
      demoTitle: 'Farmer Demo Account',
      demoDetails: 'Email: <code>farmer@greenacres.com</code> | Pass: <code>Farmer@1234</code>',
      placeholderEmail: 'farmer@greenacres.com',
      redirectUrl: 'seller-home.html',
      defaultCreds: DEFAULT_USERS.seller
    },
    merchant: {
      themeClass: 'theme-merchant',
      badgeText: '🧪 Agri-Merchant / Vendor Portal',
      demoTitle: 'Merchant Demo Account',
      demoDetails: 'Email: <code>merchant@agrisupply.com</code> | Pass: <code>Merchant@1234</code> | Store: <code>Kisan Agri</code>',
      placeholderEmail: 'merchant@agrisupply.com',
      redirectUrl: 'merchant-home.html',
      defaultCreds: DEFAULT_USERS.merchant
    },
    admin: {
      themeClass: 'theme-admin',
      badgeText: '🛡️ Administrator Console',
      demoTitle: 'Admin Demo Account',
      demoDetails: 'Email: <code>admin@agrisales.com</code> | Pass: <code>Admin@1234</code> | Key: <code>ADMIN-2026-KEY</code>',
      placeholderEmail: 'admin@agrisales.com',
      redirectUrl: 'admin-home.html',
      defaultCreds: DEFAULT_USERS.admin
    }
  };

  function updateRoleTheme() {
    const selectedRole = roleSelect.value;
    const config = roleConfigs[selectedRole] || roleConfigs.buyer;

    bodyEl.className = config.themeClass;
    roleBadge.textContent = config.badgeText;
    demoRoleTitle.textContent = config.demoTitle;
    demoDetailsBody.innerHTML = config.demoDetails;
    emailInput.placeholder = config.placeholderEmail;

    clearFieldError(emailInput);
    clearFieldError(passwordInput);
  }

  roleSelect.addEventListener('change', updateRoleTheme);
  updateRoleTheme();

  autofillBtn.addEventListener('click', () => {
    const selectedRole = roleSelect.value;
    const config = roleConfigs[selectedRole];
    
    if (config && config.defaultCreds) {
      emailInput.value = config.defaultCreds.email;
      passwordInput.value = config.defaultCreds.password;
      clearFieldError(emailInput);
      clearFieldError(passwordInput);
      showToast(`Filled ${selectedRole.toUpperCase()} demo credentials!`, "info");
    }
  });

  emailInput.addEventListener('blur', validateEmail);
  emailInput.addEventListener('input', () => {
    if (emailInput.classList.contains('is-invalid')) validateEmail();
  });

  passwordInput.addEventListener('blur', validatePassword);
  passwordInput.addEventListener('input', () => {
    if (passwordInput.classList.contains('is-invalid')) validatePassword();
  });

  function validateEmail() {
    const err = ValidationRules.email(emailInput.value);
    if (err) { showFieldError(emailInput, err); return false; }
    clearFieldError(emailInput);
    return true;
  }

  function validatePassword() {
    const err = ValidationRules.required(passwordInput.value, "Password");
    if (err) { showFieldError(passwordInput, err); return false; }
    clearFieldError(passwordInput);
    return true;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isEmailValid = validateEmail();
    const isPassValid = validatePassword();

    if (!isEmailValid || !isPassValid) {
      showToast("Please correct the form errors.", "error");
      return;
    }

    const selectedRole = roleSelect.value;
    const emailVal = emailInput.value.trim();
    const passVal = passwordInput.value;

    const registeredUsers = getRegisteredUsers(); // Re-syncs database automatically
    const foundUser = registeredUsers.find(
      u => u.email.toLowerCase() === emailVal.toLowerCase() && u.role === selectedRole
    );

    if (!foundUser || foundUser.password !== passVal) {
      showFieldError(emailInput, `Invalid credentials for ${selectedRole.toUpperCase()} role.`);
      showFieldError(passwordInput, `Invalid credentials for ${selectedRole.toUpperCase()} role.`);
      showToast(`Invalid ${selectedRole.toUpperCase()} login details.`, "error");
      return;
    }

    setSession(foundUser);
    const config = roleConfigs[selectedRole];
    showToast(`Login successful! Redirecting to ${selectedRole.toUpperCase()} Portal...`, "success");

    setTimeout(() => {
      window.location.href = config.redirectUrl;
    }, 1000);
  });
});
