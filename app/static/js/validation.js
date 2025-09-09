(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function findGroup(el) {
    let p = el.parentElement;
    while (p && !p.classList.contains('form-group')) p = p.parentElement;
    return p;
  }

  function getOrCreateErrorContainer(group) {
    let c = group.querySelector('.form-errors');
    if (!c) {
      c = document.createElement('div');
      c.className = 'form-errors';
      group.appendChild(c);
    }
    return c;
  }

  function clearErrors(group) {
    if (!group) return;
    const c = group.querySelector('.form-errors');
    if (c) c.innerHTML = '';
  }

  function showError(input, message) {
    const group = findGroup(input);
    if (!group) return;
    const container = getOrCreateErrorContainer(group);
    clearErrors(group);
    const span = document.createElement('span');
    span.className = 'helper error';
    span.textContent = message;
    container.appendChild(span);
    input.setAttribute('aria-invalid', 'true');
    try { input.setCustomValidity('Invalid'); } catch (e) { /* noop */ }
  }

  function clearErrorFor(input) {
    const group = findGroup(input);
    if (group) clearErrors(group);
    input.removeAttribute('aria-invalid');
    try { input.setCustomValidity(''); } catch (e) { /* noop */ }
  }

  function validateField(input) {
    const name = (input.name || '').toLowerCase();
    const value = (input.value || '').trim();

    if (input.required && !value) {
      showError(input, 'This field is required.');
      return false;
    }

    if (input.type === 'email' || name.includes('email')) {
      if (value && !isEmail(value)) {
        showError(input, 'Please enter a valid email address.');
        return false;
      }
    }

    if (name.includes('password')) {
      const min = 8;
      if (value && value.length < min) {
        showError(input, 'Password must be at least ' + min + ' characters.');
        return false;
      }
    }

    clearErrorFor(input);
    return true;
  }

  function validateForm(form) {
    const inputs = Array.from(form.querySelectorAll('input, textarea, select')).filter(function (i) { return !i.disabled; });
    let firstInvalid = null;
    let ok = true;
    inputs.forEach(function (input) {
      const valid = validateField(input);
      if (!valid && !firstInvalid) firstInvalid = input;
      ok = ok && valid;
    });

    if (!ok && firstInvalid) {
      try { firstInvalid.focus(); } catch (e) {}
      try { form.reportValidity(); } catch (e) {}
    }

    return ok;
  }

  ready(function () {
    const forms = document.querySelectorAll('.auth-form');
    forms.forEach(function (form) {
      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(function (input) {
        input.addEventListener('input', function () { validateField(input); });
        input.addEventListener('blur', function () { validateField(input); });
      });

      form.addEventListener('submit', function (e) {
        if (!validateForm(form)) {
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      });
    });
  });
})();

// validation.js

document.addEventListener('DOMContentLoaded', () => {
  // Email validation
  const emailInputs = document.querySelectorAll('input[type="email"]');
  
  emailInputs.forEach(input => {
    input.addEventListener('blur', () => {
      validateEmailInput(input);
    });
    
    input.addEventListener('input', () => {
      clearError(input);
    });
  });
  
  // Password validation
  const passwordInputs = document.querySelectorAll('input[type="password"]');
  
  passwordInputs.forEach(input => {
    input.addEventListener('blur', () => {
      validatePasswordInput(input);
    });
    
    input.addEventListener('input', () => {
      clearError(input);
    });
  });
  
  // Form validation on submit
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', (event) => {
      if (!validateForm(form)) {
        event.preventDefault();
      }
    });
  });
  
  function validateEmailInput(input) {
    const email = input.value.trim();
    if (email && !validateEmail(email)) {
      showError(input, 'Please enter a valid email address.');
      return false;
    }
    return true;
  }
  
  function validatePasswordInput(input) {
    const password = input.value;
    if (password && password.length < 6) {
      showError(input, 'Password must be at least 6 characters long.');
      return false;
    }
    return true;
  }
  
  function validateForm(form) {
    let isValid = true;
    
    // Validate email fields
    const emailInputs = form.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
      if (!validateEmailInput(input)) {
        isValid = false;
      }
    });
    
    // Validate password fields
    const passwordInputs = form.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
      if (!validatePasswordInput(input)) {
        isValid = false;
      }
    });
    
    return isValid;
  }
  
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }
  
  function showError(input, message) {
    // Remove any existing error messages
    clearError(input);
    
    // Create error message element
    const errorElement = document.createElement('span');
    errorElement.className = 'helper error';
    errorElement.textContent = message;
    
    // Add error class to input
    input.classList.add('input-error');
    
    // Insert error message after input group
    const inputGroup = input.closest('.input-group');
    if (inputGroup) {
      inputGroup.parentNode.insertBefore(errorElement, inputGroup.nextSibling);
    }
  }
  
  function clearError(input) {
    input.classList.remove('input-error');
    const errorElement = input.closest('.form-group')?.querySelector('.helper.error');
    if (errorElement) {
      errorElement.remove();
    }
  }
});