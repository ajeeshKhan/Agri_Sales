/**
 * Seller (Farmer) Sign Up Form Handling & Validation
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('sellerSignupForm');
  const nameInput = document.getElementById('sellerFullName');
  const emailInput = document.getElementById('sellerEmail');
  const farmInput = document.getElementById('sellerFarmName');
  const regionInput = document.getElementById('sellerFarmRegion');
  const categorySelect = document.getElementById('sellerCropCategory');
  const licenseInput = document.getElementById('sellerLicenseId');
  const phoneInput = document.getElementById('sellerPhone');
  const passInput = document.getElementById('sellerPassword');
  const confirmPassInput = document.getElementById('sellerConfirmPassword');

  nameInput.addEventListener('blur', validateName);
  emailInput.addEventListener('blur', validateEmail);
  farmInput.addEventListener('blur', validateFarm);
  regionInput.addEventListener('blur', validateRegion);
  categorySelect.addEventListener('change', validateCategory);
  licenseInput.addEventListener('blur', validateLicense);
  phoneInput.addEventListener('blur', validatePhone);
  passInput.addEventListener('blur', validatePass);
  confirmPassInput.addEventListener('blur', validateConfirmPass);

  function validateName() {
    const err = ValidationRules.required(nameInput.value, "Farmer Name");
    if (err) { showFieldError(nameInput, err); return false; }
    clearFieldError(nameInput);
    return true;
  }

  function validateEmail() {
    const err = ValidationRules.email(emailInput.value);
    if (err) { showFieldError(emailInput, err); return false; }
    
    const users = getRegisteredUsers();
    if (users.some(u => u.email.toLowerCase() === emailInput.value.trim().toLowerCase())) {
      showFieldError(emailInput, "This email is already registered. Please login.");
      return false;
    }
    clearFieldError(emailInput);
    return true;
  }

  function validateFarm() {
    const err = ValidationRules.required(farmInput.value, "Farm Name");
    if (err) { showFieldError(farmInput, err); return false; }
    clearFieldError(farmInput);
    return true;
  }

  function validateRegion() {
    const err = ValidationRules.required(regionInput.value, "Farm Region");
    if (err) { showFieldError(regionInput, err); return false; }
    clearFieldError(regionInput);
    return true;
  }

  function validateCategory() {
    const err = ValidationRules.required(categorySelect.value, "Crop category");
    if (err) { showFieldError(categorySelect, err); return false; }
    clearFieldError(categorySelect);
    return true;
  }

  function validateLicense() {
    const err = ValidationRules.required(licenseInput.value, "License ID");
    if (err) { showFieldError(licenseInput, err); return false; }
    clearFieldError(licenseInput);
    return true;
  }

  function validatePhone() {
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
      showFieldError(confirmPassInput, "Please confirm your password.");
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

    const v1 = validateName();
    const v2 = validateEmail();
    const v3 = validateFarm();
    const v4 = validateRegion();
    const v5 = validateCategory();
    const v6 = validateLicense();
    const v7 = validatePhone();
    const v8 = validatePass();
    const v9 = validateConfirmPass();

    if (!v1 || !v2 || !v3 || !v4 || !v5 || !v6 || !v7 || !v8 || !v9) {
      showToast("Please fix the validation errors in the form.", "error");
      return;
    }

    const newFarmer = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      password: passInput.value,
      role: 'seller',
      farmName: farmInput.value.trim(),
      farmRegion: regionInput.value.trim(),
      cropCategory: categorySelect.value,
      licenseId: licenseInput.value.trim(),
      phone: phoneInput.value.trim()
    };

    registerUser(newFarmer);
    setSession(newFarmer);

    showToast("Farm registered successfully! Redirecting to Farmer Portal...", "success");

    setTimeout(() => {
      window.location.href = "seller-home.html";
    }, 1200);
  });
});
