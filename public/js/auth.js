document.addEventListener('DOMContentLoaded', () => {
  const loginForm    = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const errorMsg     = document.getElementById('errorMsg');

  const showError= (msg) => {
    if (errorMsg) {
      errorMsg.textContent = msg;
    } else {
      alert(msg);
    }
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email    = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) {
          return showError(data.message || 'Login failed');
        }
        localStorage.setItem('token', data.token);
        window.location.href = 'index.html';
      } catch (err) {
        showError('Network error');
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value.trim();
      const email    = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;

      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();
        if (!res.ok) {
          return showError(data.message || 'Registration failed');
        }
        localStorage.setItem('token', data.token);
        window.location.href = 'index.html';
      } catch (err) {
        showError('Network error');
      }
    });
  }
});
