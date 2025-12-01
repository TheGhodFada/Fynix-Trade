// assets/js/auth.js
import { supabase } from './supabase.js';

async function signup(event) {
  event.preventDefault();
  const btn = document.getElementById('signupBtn');
  btn.disabled = true;

  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const fullname = document.getElementById('signupName').value.trim();

  try {
    // create user
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    // create profile row (we'll use the auth user id once available via onAuthStateChange)
    // For now create a placeholder profile (we'll later patch it after verification)
    // Wait a beat and then fetch user to get id
    setTimeout(async () => {
      const user = supabase.auth.user();
      if (user) {
        await supabase.from('profiles').upsert({
          id: user.id,
          full_name: fullname || null,
          balance: 0,
          created_at: new Date().toISOString()
        });
      }
    }, 800);

    // show next steps
    alert('Signup successful — check your email for confirmation (if enabled). Redirecting to login.');
    window.location.href = 'login.html';
  } catch (err) {
    console.error(err);
    alert(err.message || 'Signup failed');
  } finally {
    btn.disabled = false;
  }
}

async function login(event) {
  event.preventDefault();
  const btn = document.getElementById('loginBtn');
  btn.disabled = true;

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  try {
    const { user, session, error } = await supabase.auth.signIn({ email, password });
    if (error) throw error;
    // redirect to dashboard
    window.location.href = 'dashboard.html';
  } catch (err) {
    console.error(err);
    alert(err.message || 'Login failed');
  } finally {
    btn.disabled = false;
  }
}

// Attach events when DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');
  if (signupForm) signupForm.addEventListener('submit', signup);

  const loginForm = document.getElementById('loginForm');
  if (loginForm) loginForm.addEventListener('submit', login);
});
