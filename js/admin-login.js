/**
 * Admin Login Form Handling & Real-time Validation
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('adminLoginForm');
  const emailInput = document.getElementById('adminEmail');
  const passwordInput = document.getElementById('adminPassword');
  const autofillBtn = document.getElementById('btnAutofillAdmin');

  // Real-time input validation on blur / input
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
    if (err) {
      showFieldError(emailInput, err);
      return false;
    }
    clearFieldError(emailInput);
    return true;
  }

  function validatePassword() {
    const err = ValidationRules.required(passwordInput.value, "Password");
    if (err) {
      showFieldError(passwordInput, err);
      return false;
    }
    clearFieldError(passwordInput);
    return true;
  }

  // Auto-fill demo credentials
  if (autofillBtn) {
    autofillBtn.addEventListener('click', () => {
      emailInput.value = DEFAULT_USERS.admin.email;
      passwordInput.value = DEFAULT_USERS.admin.password;
      clearFieldError(emailInput);
      clearFieldError(passwordInput);
      showToast("Demo Admin credentials filled!", "info");
    });
  }

  // Form submission handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isEmailValid = validateEmail();
    const isPassValid = validatePassword();

    if (!isEmailValid || !isPassValid) {
      showToast("Please correct the errors in the form.", "error");
      return;
    }

    const emailVal = emailInput.value.trim();
    const passVal = passwordInput.value;

    const registeredUsers = getRegisteredUsers();
    const foundUser = registeredUsers.find(
      u => u.email.toLowerCase() === emailVal.toLowerCase() && u.role === 'admin'
    );

    if (!foundUser || foundUser.password !== passVal) {
      showFieldError(emailInput, "Invalid admin email or password.");
      showFieldError(passwordInput, "Invalid admin email or password.");
      showToast("Invalid Admin credentials.", "error");
      return;
    }

    // Auth Success
    setSession(foundUser);
    showToast("Login successful! Redirecting to Admin Dashboard...", "success");

    setTimeout(() => {
      window.location.href = "admin-home.html";
    }, 1000);
  });
});
