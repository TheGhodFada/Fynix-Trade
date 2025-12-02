// assets/js/auth.js
import { supabase } from "./supabase.js";

// ===============================
// SIGN UP
// ===============================
async function signup(event) {
  event.preventDefault();

  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;
  const fullname = document.getElementById("signupName").value.trim();

  const btn = document.getElementById("signupBtn");
  btn.disabled = true;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { fullname: fullname },
      emailRedirectTo: "https://theghodfada.github.io/Fynix-Trade/"
    }
  });

  if (error) {
    alert(error.message);
    btn.disabled = false;
    return;
  }

  alert("Account created! Check your email to verify.");
  btn.disabled = false;
}


// ===============================
// LOGIN
// ===============================
async function login(event) {
  event.preventDefault();
  const btn = document.getElementById('loginBtn');
  btn.disabled = true;

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    // SUCCESS → redirect
    window.location.href = "dashboard.html";

  } catch (err) {
    alert(err.message);
  }

  btn.disabled = false;
}


// ===============================
// Attach to forms
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  if (signupForm) signupForm.addEventListener("submit", signup);

  const loginForm = document.getElementById("loginForm");
  if (loginForm) loginForm.addEventListener("submit", login);
});

