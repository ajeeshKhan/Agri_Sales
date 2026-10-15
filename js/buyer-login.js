/**
 * Buyer Login Form Handling & Real-time Validation
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('buyerLoginForm');
  const emailInput = document.getElementById('buyerEmail');
  const passwordInput = document.getElementById('buyerPassword');
  const autofillBtn = document.getElementById('btnAutofillBuyer');

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
      emailInput.value = DEFAULT_USERS.buyer.email;
      passwordInput.value = DEFAULT_USERS.buyer.password;
      clearFieldError(emailInput);
      clearFieldError(passwordInput);
      showToast("Demo Buyer credentials filled!", "info");
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isEmailValid = validateEmail();
    const isPassValid = validatePassword();

    if (!isEmailValid || !isPassValid) {
      showToast("Please fix the validation errors.", "error");
      return;
    }

    const emailVal = emailInput.value.trim();
    const passVal = passwordInput.value;

    const registeredUsers = getRegisteredUsers();
    const foundUser = registeredUsers.find(
      u => u.email.toLowerCase() === emailVal.toLowerCase() && u.role === 'buyer'
    );

    if (!foundUser || foundUser.password !== passVal) {
      showFieldError(emailInput, "Invalid buyer email or password.");
      showFieldError(passwordInput, "Invalid buyer email or password.");
      showToast("Invalid Buyer credentials.", "error");
      return;
    }

    setSession(foundUser);
    showToast("Welcome back! Redirecting to Fresh Marketplace...", "success");

    setTimeout(() => {
      window.location.href = "buyer-home.html";
    }, 1000);
  });
});
