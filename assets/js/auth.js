/* ============================================================
   VELOUR SKIN — Authentication JS (frontend-only)
   - Password visibility toggles
   - Login / Signup validation
   - Profile dropdown (navbar, injected via components.js)
   Frontend-only: no backend, no fake OAuth, no fake APIs.
   ============================================================ */
'use strict';

(function () {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const SVG_EYE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
  const SVG_EYE_OFF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /* ── Apply saved theme + direction early (auth pages have no toggle) ── */
  try {
    const theme = JSON.parse(localStorage.getItem('velour-theme')) || 'light';
    document.documentElement.setAttribute('data-theme', theme);
  } catch { /* keep default */ }
  try {
    const dir = JSON.parse(localStorage.getItem('velour-dir')) || 'ltr';
    document.documentElement.setAttribute('dir', dir);
  } catch { /* keep default */ }

  /* ── Password visibility toggles ───────────────────────── */
  $$('[data-password-toggle]').forEach((btn) => {
    const targetId = btn.getAttribute('data-password-toggle');
    const input = targetId ? document.getElementById(targetId) : null;
    if (!input) return;

    btn.innerHTML = SVG_EYE;
    btn.setAttribute('aria-label', 'Show password');
    btn.setAttribute('aria-pressed', 'false');

    btn.addEventListener('click', () => {
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.innerHTML = show ? SVG_EYE_OFF : SVG_EYE;
      btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
      btn.setAttribute('aria-pressed', String(show));
      input.focus();
    });
  });

  /* ── Field error helpers ───────────────────────────────── */
  const setError = (input, message) => {
    if (!input) return;
    input.setAttribute('aria-invalid', 'true');
    const err = document.getElementById(input.id + '-error');
    if (err) {
      err.textContent = message || '';
      err.classList.toggle('visible', Boolean(message));
    }
  };

  const clearError = (input) => {
    if (!input) return;
    input.setAttribute('aria-invalid', 'false');
    const err = document.getElementById(input.id + '-error');
    if (err) {
      err.textContent = '';
      err.classList.remove('visible');
    }
  };

  const setStatus = (form, type, message) => {
    const box = form ? form.querySelector('[data-form-status]') : null;
    if (!box) return;
    box.textContent = message || '';
    box.className = 'auth-status' + (message ? ' visible ' + type : '');
  };

  const getUsers = () => {
    try {
      return JSON.parse(localStorage.getItem('velour-users')) || [];
    } catch {
      return [];
    }
  };

  const saveUsers = (users) => {
    try {
      localStorage.setItem('velour-users', JSON.stringify(users));
    } catch { /* storage unavailable */ }
  };

  /* ── Login ─────────────────────────────────────────────── */
  const loginForm = $('#loginForm');
  if (loginForm) {
    const email = $('#loginEmail');
    const password = $('#loginPassword');

    [email, password].forEach((input) => {
      input && input.addEventListener('input', () => clearError(input));
    });

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      const emailVal = (email.value || '').trim();
      if (!emailVal) {
        setError(email, 'Email address is required.');
        valid = false;
      } else if (!EMAIL_RE.test(emailVal)) {
        setError(email, 'Please enter a valid email address.');
        valid = false;
      } else {
        clearError(email);
      }

      if (!password.value) {
        setError(password, 'Password is required.');
        valid = false;
      } else {
        clearError(password);
      }

      if (!valid) {
        setStatus(loginForm, 'error', 'Please review the highlighted fields and try again.');
        const firstInvalid = loginForm.querySelector('[aria-invalid="true"]');
        firstInvalid && firstInvalid.focus();
        return;
      }

      // Frontend-only: verify against locally registered accounts, if any.
      const users = getUsers();
      const match = users.find((u) => u.email.toLowerCase() === emailVal.toLowerCase());

      if (match) {
        try {
          localStorage.setItem('velour-session', JSON.stringify({ email: match.email, name: match.name || '' }));
          const remember = $('#rememberMe');
          if (!(remember && remember.checked)) sessionStorage.setItem('velour-session-temp', '1');
        } catch { /* ignore */ }
        setStatus(loginForm, 'success', 'Welcome back! Signing you in…');
        setTimeout(() => { window.location.href = 'index.html'; }, 700);
      } else if (users.length === 0) {
        // No registered accounts yet in this demo storefront.
        setStatus(loginForm, 'success', 'Signed in successfully. Redirecting…');
        setTimeout(() => { window.location.href = 'index.html'; }, 700);
      } else {
        setStatus(loginForm, 'error', 'No account found with this email. Please check the address or create a new account.');
        setError(email, 'No account found with this email address.');
      }
    });
  }

  /* ── Signup ────────────────────────────────────────────── */
  const signupForm = $('#signupForm');
  if (signupForm) {
    const name = $('#signupName');
    const email = $('#signupEmail');
    const phone = $('#signupPhone');
    const password = $('#signupPassword');
    const confirm = $('#signupConfirm');
    const terms = $('#termsCheck');

    [name, email, phone, password, confirm, terms].forEach((input) => {
      if (!input) return;
      input.addEventListener(input.type === 'checkbox' ? 'change' : 'input', () => clearError(input));
    });

    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      const nameVal = (name.value || '').trim();
      if (!nameVal) {
        setError(name, 'Full name is required.');
        valid = false;
      } else if (nameVal.length < 2) {
        setError(name, 'Please enter your full name.');
        valid = false;
      } else {
        clearError(name);
      }

      const emailVal = (email.value || '').trim();
      if (!emailVal) {
        setError(email, 'Email address is required.');
        valid = false;
      } else if (!EMAIL_RE.test(emailVal)) {
        setError(email, 'Please enter a valid email address.');
        valid = false;
      } else {
        clearError(email);
      }

      const phoneVal = (phone.value || '').trim();
      if (phoneVal && !/^[+()\-.\s\d]{7,20}$/.test(phoneVal)) {
        setError(phone, 'Please enter a valid phone number.');
        valid = false;
      } else {
        clearError(phone);
      }

      if (!password.value) {
        setError(password, 'Password is required.');
        valid = false;
      } else if (password.value.length < 8) {
        setError(password, 'Password must be at least 8 characters long.');
        valid = false;
      } else {
        clearError(password);
      }

      if (!confirm.value) {
        setError(confirm, 'Please confirm your password.');
        valid = false;
      } else if (confirm.value !== password.value) {
        setError(confirm, 'Passwords do not match.');
        valid = false;
      } else {
        clearError(confirm);
      }

      if (!terms.checked) {
        setError(terms, 'Please accept the Terms & Conditions and Privacy Policy to continue.');
        valid = false;
      } else {
        clearError(terms);
      }

      if (!valid) {
        setStatus(signupForm, 'error', 'Please review the highlighted fields and try again.');
        const firstInvalid = signupForm.querySelector('[aria-invalid="true"]');
        firstInvalid && firstInvalid.focus();
        return;
      }

      const users = getUsers();
      if (users.some((u) => u.email.toLowerCase() === emailVal.toLowerCase())) {
        setStatus(signupForm, 'error', 'An account with this email already exists. Please sign in instead.');
        setError(email, 'This email is already registered.');
        return;
      }

      users.push({ name: nameVal, email: emailVal, phone: phoneVal });
      saveUsers(users);
      setStatus(signupForm, 'success', 'Account created successfully. Redirecting to Sign In…');
      setTimeout(() => { window.location.href = 'login.html'; }, 900);
    });
  }

  /* ── Profile dropdown (navbar, all site pages) ─────────── */
  const initProfileDropdown = () => {
    const wrap = $('#profileWrap');
    const btn = $('#profileBtn');
    const menu = $('#profileMenu');
    if (!wrap || !btn || !menu || wrap.dataset.bound) return;
    wrap.dataset.bound = 'true';

    const links = $$('a', menu);

    const setOpen = (open) => {
      wrap.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
      if (open && links[0]) links[0].focus();
    };

    const isOpen = () => wrap.classList.contains('open');

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      setOpen(!isOpen());
    });

    btn.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && !isOpen()) {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === 'ArrowDown' && !isOpen()) {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === 'Escape' && isOpen()) {
        setOpen(false);
        btn.focus();
      }
    });

    menu.addEventListener('keydown', (e) => {
      const idx = links.indexOf(document.activeElement);
      if (e.key === 'Escape') {
        setOpen(false);
        btn.focus();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        links[(idx + 1) % links.length].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        links[(idx - 1 + links.length) % links.length].focus();
      } else if (e.key === 'Tab' && !e.shiftKey && idx === links.length - 1) {
        setOpen(false);
      }
    });

    document.addEventListener('click', (e) => {
      if (isOpen() && !wrap.contains(e.target)) setOpen(false);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen()) {
        setOpen(false);
        btn.focus();
      }
    });

    links.forEach((link) => {
      link.addEventListener('click', () => setOpen(false));
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProfileDropdown);
  } else {
    initProfileDropdown();
  }
  window.initProfileDropdown = initProfileDropdown;
})();
