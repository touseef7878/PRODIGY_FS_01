(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  /* ========== Theme Toggle ========== */
  const THEME_KEY = 'theme';

  function applyTheme(theme) {
    const html = document.documentElement;
    html.setAttribute('data-theme', theme);
    const btn = document.querySelector('[data-theme-toggle]');
    if (btn) {
      btn.textContent = theme === 'dark' ? '🌙' : '☀️';
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    }
  }

  function initTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    const initial = stored === 'light' || stored === 'dark'
      ? stored
      : (document.documentElement.getAttribute('data-theme') || 'dark');

    applyTheme(initial);

    const toggle = document.querySelector('[data-theme-toggle]');
    if (!toggle) return;

    toggle.addEventListener('click', function () {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });

    toggle.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle.click();
      }
    });
  }

  /* ========== Loading Overlay ========== */
  const OVERLAY_ID = 'loading-overlay';
  let overlayEl;

  function getOverlay() {
    if (!overlayEl) overlayEl = document.getElementById(OVERLAY_ID);
    return overlayEl;
  }

  function showLoading(message) {
    const overlay = getOverlay();
    if (!overlay) return;
    try {
      overlay.hidden = false;
      overlay.style.display = 'flex';
      const p = overlay.querySelector('.loading-content p');
      if (p && message) p.textContent = message;
    } catch (e) { /* noop */ }
  }

  function hideLoading() {
    const overlay = getOverlay();
    if (!overlay) return;
    try {
      overlay.hidden = true;
      overlay.style.display = 'none';
    } catch (e) { /* noop */ }
  }

  function initOverlay() {
    // Always ensure the overlay is hidden on page load and BFCache restore
    hideLoading();
    window.addEventListener('pageshow', function () { hideLoading(); });
  }

  /* ========== Form Handling (prevent double submit) ========== */
  function disableForm(form) {
    Array.from(form.elements).forEach(function (el) {
      if (!el || el.disabled) return;
      const tag = el.tagName;
      if (tag === 'BUTTON') el.disabled = true;
      if (tag === 'INPUT' && (el.type === 'submit' || el.type === 'button')) el.disabled = true;
    });
  }

  function initLoadingForms() {
    // Target forms that should show the loading overlay on submit
    const forms = document.querySelectorAll('form[data-loading], .auth-form');
    forms.forEach(function (form) {
      let submitted = false;
      form.addEventListener('submit', function (e) {
        if (submitted) {
          e.preventDefault();
          return;
        }
        submitted = true;
        disableForm(form);
        showLoading('Signing you in...');
      });
    });
  }

  /* ========== Flash Messages (close and auto-dismiss) ========== */
  function initFlashMessages() {
    // Manual close buttons
    const closeButtons = document.querySelectorAll('.alert .alert-close');
    closeButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const alert = btn.closest('.alert');
        if (!alert) return;
        alert.classList.add('fade-out');
        setTimeout(function () { alert.remove(); }, 320);
      });
    });

    // Auto-dismiss after a timeout; default 5s
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(function (alert) {
      const timeout = parseInt(alert.getAttribute('data-timeout') || '5000', 10);
      if (timeout > 0) {
        setTimeout(function () {
          alert.classList.add('fade-out');
          setTimeout(function () { alert.remove(); }, 320);
        }, timeout);
      }
    });
  }

  /* ========== Password Toggle Enhancement (non-invasive) ========== */
  function initPasswordToggles() {
    const toggles = document.querySelectorAll('.password-toggle');
    toggles.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const parent = btn.parentElement;
        if (!parent) return;
        const input = parent.querySelector('input[type="password"], input[type="text"]');
        if (!input) return;
        if (input.type === 'password') {
          input.type = 'text';
          btn.textContent = '🙈';
        } else {
          input.type = 'password';
          btn.textContent = '👁️';
        }
      });
    });
  }

  /* ========== Init ========== */
  ready(function () {
    initTheme();
    initOverlay();
    initLoadingForms();
    initFlashMessages();
    initPasswordToggles();

    // Final safety: if something left the overlay visible, hide it after a short delay
    setTimeout(hideLoading, 300);
  });
})();

// main.js

document.addEventListener('DOMContentLoaded', () => {
  // Handle loading spinner
  const loadingOverlay = document.getElementById('loading-overlay');
  const mainElement = document.querySelector('main');
  
  // Hide loading spinner when page is fully loaded
  if (loadingOverlay) {
    // Add a small delay to ensure everything is rendered
    setTimeout(() => {
      loadingOverlay.hidden = true;
    }, 500);
  }
  
  // Theme toggle functionality
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const htmlElement = document.documentElement;
  
  if (themeToggle) {
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);
    themeToggle.innerHTML = savedTheme === 'dark' ? '☀️' : '🌙';
    
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      htmlElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      themeToggle.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
    });
  }
  
  // Form loading state handling
  const forms = document.querySelectorAll('form[data-loading]');
  
  forms.forEach(form => {
    form.addEventListener('submit', () => {
      // Show loading spinner when form is submitted
      if (loadingOverlay) {
        loadingOverlay.hidden = false;
      }
      
      // Disable submit button to prevent double submission
      const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.classList.add('btn-disabled');
      }
    });
  });
  
  // Password toggle functionality
  window.togglePassword = function(fieldId) {
    const field = document.getElementById(fieldId);
    const button = field.nextElementSibling;
    
    if (field && button) {
      if (field.type === 'password') {
        field.type = 'text';
        button.textContent = '🙈';
      } else {
        field.type = 'password';
        button.textContent = '👁️';
      }
    }
  };
  
  // Flash message auto-dismiss
  const flashMessages = document.querySelectorAll('.alert');
  flashMessages.forEach(message => {
    setTimeout(() => {
      message.style.opacity = '0';
      setTimeout(() => {
        message.remove();
      }, 300);
    }, 5000);
  });
});