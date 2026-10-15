/**
 * Admin Sign Up Form Handling & Validation
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('adminSignupForm');
  const nameInput = document.getElementById('adminFullName');
  const emailInput = document.getElementById('adminEmail');
  const deptSelect = document.getElementById('adminDepartment');
  const keyInput = document.getElementById('adminKey');
  const passInput = document.getElementById('adminPassword');
  const confirmPassInput = document.getElementById('adminConfirmPassword');

  // Input listeners for real-time validation
  nameInput.addEventListener('blur', validateName);
  emailInput.addEventListener('blur', validateEmail);
  deptSelect.addEventListener('change', validateDept);
  keyInput.addEventListener('blur', validateKey);
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
    
    // Check if email already registered
    const users = getRegisteredUsers();
    if (users.some(u => u.email.toLowerCase() === emailInput.value.trim().toLowerCase())) {
      showFieldError(emailInput, "This email is already registered. Please login.");
      return false;
    }

    clearFieldError(emailInput);
    return true;
  }

  function validateDept() {
    const err = ValidationRules.required(deptSelect.value, "Department");
    if (err) { showFieldError(deptSelect, err); return false; }
    clearFieldError(deptSelect);
    return true;
  }

  function validateKey() {
    const err = ValidationRules.adminKey(keyInput.value);
    if (err) { showFieldError(keyInput, err); return false; }
    clearFieldError(keyInput);
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
    const validDept = validateDept();
    const validKey = validateKey();
    const validPass = validatePass();
    const validConfirm = validateConfirmPass();

    if (!validName || !validEmail || !validDept || !validKey || !validPass || !validConfirm) {
      showToast("Please fill out all fields correctly.", "error");
      return;
    }

    const newAdmin = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      password: passInput.value,
      role: 'admin',
      adminKey: keyInput.value.trim(),
      department: deptSelect.value
    };

    registerUser(newAdmin);
    setSession(newAdmin);

    showToast("Admin account registered successfully! Redirecting...", "success");

    setTimeout(() => {
      window.location.href = "admin-home.html";
    }, 1200);
  });
});
