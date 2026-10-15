/**
 * Buyer Sign Up Validation & Handling
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('buyerSignupForm');
  const nameInput = document.getElementById('buyerFullName');
  const emailInput = document.getElementById('buyerEmail');
  const phoneInput = document.getElementById('buyerPhone');
  const typeSelect = document.getElementById('buyerBusinessType');
  const addressInput = document.getElementById('buyerAddress');
  const passInput = document.getElementById('buyerPassword');
  const confirmPassInput = document.getElementById('buyerConfirmPassword');

  nameInput.addEventListener('blur', validateName);
  emailInput.addEventListener('blur', validateEmail);
  phoneInput.addEventListener('blur', validatePhone);
  typeSelect.addEventListener('change', validateType);
  addressInput.addEventListener('blur', validateAddress);
  passInput.addEventListener('blur', validatePass);
  confirmPassInput.addEventListener('blur', validateConfirmPass);

  function validateName() {
    const err = ValidationRules.required(nameInput.value, "Full Name");
    if (err) { showFieldError(nameInput, err); return false; }
    if (nameInput.value.trim().length < 3) {
      showFieldError(nameInput, "Name must be at least 3 characters long.");
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
      showFieldError(emailInput, "This email is already registered. Please login.");
      return false;
    }
    clearFieldError(emailInput);
    return true;
  }

  function validatePhone() {
    const err = ValidationRules.phone(phoneInput.value);
    if (err) { showFieldError(phoneInput, err); return false; }
    clearFieldError(phoneInput);
    return true;
  }

  function validateType() {
    const err = ValidationRules.required(typeSelect.value, "Buyer category");
    if (err) { showFieldError(typeSelect, err); return false; }
    clearFieldError(typeSelect);
    return true;
  }

  function validateAddress() {
    const err = ValidationRules.required(addressInput.value, "Delivery Address");
    if (err) { showFieldError(addressInput, err); return false; }
    clearFieldError(addressInput);
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

    const validName = validateName();
    const validEmail = validateEmail();
    const validPhone = validatePhone();
    const validType = validateType();
    const validAddress = validateAddress();
    const validPass = validatePass();
    const validConfirm = validateConfirmPass();

    if (!validName || !validEmail || !validPhone || !validType || !validAddress || !validPass || !validConfirm) {
      showToast("Please fill out all buyer details correctly.", "error");
      return;
    }

    const newBuyer = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      password: passInput.value,
      role: 'buyer',
      phone: phoneInput.value.trim(),
      businessType: typeSelect.value,
      address: addressInput.value.trim()
    };

    registerUser(newBuyer);
    setSession(newBuyer);

    showToast("Buyer account registered! Welcome to AgriTrade.", "success");

    setTimeout(() => {
      window.location.href = "buyer-home.html";
    }, 1200);
  });
});
