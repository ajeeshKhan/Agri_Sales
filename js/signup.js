/**
 * AgriSales Unified Sign Up Handler & Dynamic Role Fields Switcher
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('agriSalesSignupForm');
  const roleSelect = document.getElementById('userRole');
  const bodyEl = document.getElementById('bodyElement');
  const roleBadge = document.getElementById('roleBadge');

  // Sections
  const buyerSection = document.getElementById('buyerFieldsSection');
  const sellerSection = document.getElementById('sellerFieldsSection');
  const merchantSection = document.getElementById('merchantFieldsSection');
  const adminSection = document.getElementById('adminFieldsSection');
  const phoneGroup = document.getElementById('phoneGroup');

  // Shared Inputs
  const nameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('userEmail');
  const phoneInput = document.getElementById('userPhone');
  const passInput = document.getElementById('userPassword');
  const confirmPassInput = document.getElementById('confirmPassword');

  // Role Inputs
  const buyerCatSelect = document.getElementById('buyerCategory');
  const buyerAddressInput = document.getElementById('buyerAddress');
  
  const farmNameInput = document.getElementById('farmName');
  const farmRegionInput = document.getElementById('farmRegion');
  const cropCatSelect = document.getElementById('cropCategory');
  const licenseInput = document.getElementById('licenseId');

  const storeNameInput = document.getElementById('storeName');
  const merchantLicenseInput = document.getElementById('merchantLicense');
  const supplyCatSelect = document.getElementById('supplyCategory');
  
  const adminDeptSelect = document.getElementById('adminDepartment');
  const adminKeyInput = document.getElementById('adminKey');

  function updateRoleSections() {
    const role = roleSelect.value;
    
    buyerSection.style.display = 'none';
    sellerSection.style.display = 'none';
    merchantSection.style.display = 'none';
    adminSection.style.display = 'none';
    phoneGroup.style.display = 'flex';

    if (role === 'buyer') {
      bodyEl.className = 'theme-buyer';
      roleBadge.textContent = '🛒 Register Buyer Account';
      buyerSection.style.display = 'grid';
    } else if (role === 'seller') {
      bodyEl.className = 'theme-seller';
      roleBadge.textContent = '🚜 Register Farmer / Producer Account';
      sellerSection.style.display = 'grid';
    } else if (role === 'merchant') {
      bodyEl.className = 'theme-merchant';
      roleBadge.textContent = '🧪 Register Agri-Merchant Vendor Account';
      merchantSection.style.display = 'grid';
    } else if (role === 'admin') {
      bodyEl.className = 'theme-admin';
      roleBadge.textContent = '🛡️ Register Admin Account';
      adminSection.style.display = 'grid';
      phoneGroup.style.display = 'none';
    }

    [nameInput, emailInput, phoneInput, passInput, confirmPassInput, buyerCatSelect, buyerAddressInput, farmNameInput, farmRegionInput, cropCatSelect, licenseInput, storeNameInput, merchantLicenseInput, supplyCatSelect, adminDeptSelect, adminKeyInput].forEach(inp => {
      if (inp) clearFieldError(inp);
    });
  }

  roleSelect.addEventListener('change', updateRoleSections);
  updateRoleSections();

  function validateName() {
    const err = ValidationRules.required(nameInput.value, "Full Name");
    if (err) { showFieldError(nameInput, err); return false; }
    if (nameInput.value.trim().length < 3) {
      showFieldError(nameInput, "Name must be at least 3 characters.");
      return false;
    }
    clearFieldError(nameInput);
    return true;
  }

  function validateEmail() {
    const err = ValidationRules.email(emailInput.value);
    if (err) { showFieldError(emailInput, err); return false; }
    
    const users = getRegisteredUsers();
    if (users.some(u => u.email.toLowerCase() === emailInput.value.trim().toLowerCase())) {
      showFieldError(emailInput, "This email is already registered. Please sign in.");
      return false;
    }
    clearFieldError(emailInput);
    return true;
  }

  function validatePhone() {
    if (roleSelect.value === 'admin') return true;
    const err = ValidationRules.phone(phoneInput.value);
    if (err) { showFieldError(phoneInput, err); return false; }
    clearFieldError(phoneInput);
    return true;
  }

  function validatePass() {
    const err = ValidationRules.password(passInput.value);
    if (err) { showFieldError(passInput, err); return false; }
    clearFieldError(passInput);
    return true;
  }

  function validateConfirmPass() {
    if (!confirmPassInput.value) {
      showFieldError(confirmPassInput, "Please confirm password.");
      return false;
    }
    if (confirmPassInput.value !== passInput.value) {
      showFieldError(confirmPassInput, "Passwords do not match.");
      return false;
    }
    clearFieldError(confirmPassInput);
    return true;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const role = roleSelect.value;
    let isValid = validateName() && validateEmail() && validatePhone() && validatePass() && validateConfirmPass();

    const newUser = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      password: passInput.value,
      role: role
    };

    if (role === 'buyer') {
      const catErr = ValidationRules.required(buyerCatSelect.value, "Buyer Category");
      const addrErr = ValidationRules.required(buyerAddressInput.value, "Delivery Address");

      if (catErr) { showFieldError(buyerCatSelect, catErr); isValid = false; } else clearFieldError(buyerCatSelect);
      if (addrErr) { showFieldError(buyerAddressInput, addrErr); isValid = false; } else clearFieldError(buyerAddressInput);

      newUser.businessType = buyerCatSelect.value;
      newUser.address = buyerAddressInput.value.trim();
      newUser.phone = phoneInput.value.trim();
    } else if (role === 'seller') {
      const farmErr = ValidationRules.required(farmNameInput.value, "Farm Name");
      const regErr = ValidationRules.required(farmRegionInput.value, "Farm Region");
      const cropErr = ValidationRules.required(cropCatSelect.value, "Crop Category");
      const licErr = ValidationRules.required(licenseInput.value, "License ID");

      if (farmErr) { showFieldError(farmNameInput, farmErr); isValid = false; } else clearFieldError(farmNameInput);
      if (regErr) { showFieldError(farmRegionInput, regErr); isValid = false; } else clearFieldError(farmRegionInput);
      if (cropErr) { showFieldError(cropCatSelect, cropErr); isValid = false; } else clearFieldError(cropCatSelect);
      if (licErr) { showFieldError(licenseInput, licErr); isValid = false; } else clearFieldError(licenseInput);

      newUser.farmName = farmNameInput.value.trim();
      newUser.farmRegion = farmRegionInput.value.trim();
      newUser.cropCategory = cropCatSelect.value;
      newUser.licenseId = licenseInput.value.trim();
      newUser.phone = phoneInput.value.trim();
    } else if (role === 'merchant') {
      const storeErr = ValidationRules.required(storeNameInput.value, "Store Name");
      const licErr = ValidationRules.required(merchantLicenseInput.value, "License ID");
      const supErr = ValidationRules.required(supplyCatSelect.value, "Supplies Category");

      if (storeErr) { showFieldError(storeNameInput, storeErr); isValid = false; } else clearFieldError(storeNameInput);
      if (licErr) { showFieldError(merchantLicenseInput, licErr); isValid = false; } else clearFieldError(merchantLicenseInput);
      if (supErr) { showFieldError(supplyCatSelect, supErr); isValid = false; } else clearFieldError(supplyCatSelect);

      newUser.storeName = storeNameInput.value.trim();
      newUser.licenseId = merchantLicenseInput.value.trim();
      newUser.supplyCategory = supplyCatSelect.value;
      newUser.phone = phoneInput.value.trim();
    } else if (role === 'admin') {
      const deptErr = ValidationRules.required(adminDeptSelect.value, "Department");
      const keyErr = ValidationRules.adminKey(adminKeyInput.value);

      if (deptErr) { showFieldError(adminDeptSelect, deptErr); isValid = false; } else clearFieldError(adminDeptSelect);
      if (keyErr) { showFieldError(adminKeyInput, keyErr); isValid = false; } else clearFieldError(adminKeyInput);

      newUser.department = adminDeptSelect.value;
      newUser.adminKey = adminKeyInput.value.trim();
    }

    if (!isValid) {
      showToast("Please fix the validation errors in the form.", "error");
      return;
    }

    registerUser(newUser);
    setSession(newUser);

    const redirectMap = {
      buyer: 'buyer-home.html',
      seller: 'seller-home.html',
      merchant: 'merchant-home.html',
      admin: 'admin-home.html'
    };

    showToast(`Account registered successfully! Redirecting to ${role.toUpperCase()} Portal...`, "success");

    setTimeout(() => {
      window.location.href = redirectMap[role];
    }, 1200);
  });
});
