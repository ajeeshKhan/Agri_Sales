/**
 * Seller (Farmer) Login Validation & Handler
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('sellerLoginForm');
  const emailInput = document.getElementById('sellerEmail');
  const passwordInput = document.getElementById('sellerPassword');
  const autofillBtn = document.getElementById('btnAutofillFarmer');

  emailInput.addEventListener('blur', () => validateEmail());
  emailInput.addEventListener('input', () => {
    if (emailInput.classList.contains('is-invalid')) validateEmail();
  });

  passwordInput.addEventListener('blur', () => validatePassword());
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

  if (autofillBtn) {
    autofillBtn.addEventListener('click', () => {
      emailInput.value = DEFAULT_USERS.seller.email;
      passwordInput.value = DEFAULT_USERS.seller.password;
      clearFieldError(emailInput);
      clearFieldError(passwordInput);
      showToast("Demo Farmer credentials filled!", "info");
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isEmailValid = validateEmail();
    const isPassValid = validatePassword();

    if (!isEmailValid || !isPassValid) {
      showToast("Please correct form errors.", "error");
      return;
    }

    const emailVal = emailInput.value.trim();
    const passVal = passwordInput.value;

    const registeredUsers = getRegisteredUsers();
    const foundUser = registeredUsers.find(
      u => u.email.toLowerCase() === emailVal.toLowerCase() && u.role === 'seller'
    );

    if (!foundUser || foundUser.password !== passVal) {
      showFieldError(emailInput, "Invalid farmer email or password.");
      showFieldError(passwordInput, "Invalid farmer email or password.");
      showToast("Invalid Farmer credentials.", "error");
      return;
    }

    setSession(foundUser);
    showToast("Login successful! Welcome to your Farmer Portal...", "success");

    setTimeout(() => {
      window.location.href = "seller-home.html";
    }, 1000);
  });
});
