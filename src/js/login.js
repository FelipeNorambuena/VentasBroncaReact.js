// login.js
// Validación de formulario de login, manejo accesible de errores, mock de autenticación y redirección.

(function () {
  'use strict';

  function $(selector, root = document) {
    return root.querySelector(selector);
  }

  function showInvalid(input, message) {
    input.classList.add('is-invalid');
    const feedback = input.parentElement.querySelector('.invalid-feedback');
    if (feedback) feedback.textContent = message || feedback.textContent;
    input.setAttribute('aria-invalid', 'true');
  }

  function clearInvalid(input) {
    input.classList.remove('is-invalid');
    input.removeAttribute('aria-invalid');
  }

  function setProcessing(button, isProcessing) {
    if (!button) return;
    if (isProcessing) {
      button.disabled = true;
      button.dataset.origText = button.textContent;
      button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Cargando...';
    } else {
      button.disabled = false;
      if (button.dataset.origText) button.textContent = button.dataset.origText;
    }
  }

  async function mockAuthenticate(email, password) {
    // Simula una petición a servidor: rechaza si credenciales no válidas
    await new Promise((r) => setTimeout(r, 700));
    // Credenciales de ejemplo para pruebas
    const validEmail = 'demo@ventasbronca.local';
    const validPassword = 'ventas123';
    if (email === validEmail && password === validPassword) {
      return {
        ok: true,
        token: 'demo-token-ventasbronca-2025',
        user: { name: 'Demo Usuario', email },
      };
    }

    // Acepta cualquier email válido y contraseña >= 6 caracteres como "ok" en modo desarrollo
    if (email && password && password.length >= 6) {
      return {
        ok: true,
        token: 'dev-token-' + btoa(email + ':' + password).slice(0, 24),
        user: { name: email.split('@')[0], email },
      };
    }

    return { ok: false, error: 'Credenciales incorrectas' };
  }

  function saveSession(result) {
    try {
      localStorage.setItem('ventasbronca_token', result.token);
      localStorage.setItem('ventasbronca_user', JSON.stringify(result.user));
      // Guardamos fecha de expiración de ejemplo (1 día)
      const expires = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem('ventasbronca_token_expires', String(expires));
    } catch (err) {
      console.warn('No se pudo guardar la sesión en localStorage', err);
    }
  }

  function handleLoginForm(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const emailInput = $('#loginEmail', form);
    const passwordInput = $('#loginPassword', form);
  const submitBtn = form.querySelector('button[type="submit"]');
  console.debug('[src/js/login.js] submit capturado', { email: form.querySelector('#loginEmail') && form.querySelector('#loginEmail').value });

  // Limpia estados previos
    clearInvalid(emailInput);
    clearInvalid(passwordInput);

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Validaciones básicas
    let hasError = false;
    if (!email) {
      showInvalid(emailInput, 'Ingrese su correo electrónico.');
      hasError = true;
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      showInvalid(emailInput, 'Ingrese un correo con formato válido.');
      hasError = true;
    }

    if (!password) {
      showInvalid(passwordInput, 'Ingrese su contraseña.');
      hasError = true;
    } else if (password.length < 6) {
      showInvalid(passwordInput, 'La contraseña debe tener al menos 6 caracteres.');
      hasError = true;
    }

    if (hasError) {
      // Mueve el foco al primer campo con error
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Modo procesamiento
    setProcessing(submitBtn, true);

    // Llamada mock
    mockAuthenticate(email, password)
      .then((res) => {
        if (res.ok) {
          saveSession(res);
          // Mensaje accesible
          const alert = document.createElement('div');
          alert.className = 'alert alert-success mt-3';
          alert.setAttribute('role', 'status');
          alert.textContent = 'Inicio de sesión exitoso. Redirigiendo...';
          form.appendChild(alert);

          setTimeout(() => {
            // Redirigir a la página principal o a la que venga en query param 'next'
            const params = new URLSearchParams(window.location.search);
            const next = params.get('next') || '/index.html';
            window.location.href = next;
          }, 900);
        } else {
          const alert = document.createElement('div');
          alert.className = 'alert alert-danger mt-3';
          alert.setAttribute('role', 'alert');
          alert.textContent = res.error || 'Error al iniciar sesión.';
          form.appendChild(alert);
          setProcessing(submitBtn, false);
        }
      })
      .catch((err) => {
        console.error(err);
        const alert = document.createElement('div');
        alert.className = 'alert alert-danger mt-3';
        alert.setAttribute('role', 'alert');
        alert.textContent = 'Error de red. Intente nuevamente.';
        form.appendChild(alert);
        setProcessing(submitBtn, false);
      });
  }

  function init() {
    const form = document.getElementById('loginForm');
    if (!form) return;
    form.addEventListener('submit', handleLoginForm);

    // Mejoras de accesibilidad: submit con Enter en inputs y limpiar feedback al escribir
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    [emailInput, passwordInput].forEach((el) => {
      if (!el) return;
      el.addEventListener('input', () => clearInvalid(el));
    });

    // If already logged, redirect
    try {
      const token = localStorage.getItem('ventasbronca_token');
      const expires = Number(localStorage.getItem('ventasbronca_token_expires') || 0);
      if (token && expires && Date.now() < expires) {
        // Already logged in: quick redirect
        const params = new URLSearchParams(window.location.search);
        const next = params.get('next') || '/index.html';
        window.location.href = next;
      }
    } catch (err) {
      // ignore
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();