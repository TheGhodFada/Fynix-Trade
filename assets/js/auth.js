// assets/js/auth.js
import { supabase } from "./supabase.js";

/* Inline error helpers */
function showError(id, message) {
  const el = document.getElementById(id);
  if (!el) {
    alert(message); // fallback
    return;
  }
  el.textContent = message || "";
  el.style.display = message ? "block" : "none";
}
function clearError(id) { showError(id, ""); }

/* Small loading helper for buttons */
function setBtnLoading(btn, loading, label) {
  if (!btn) return;
  if (loading) {
    btn.dataset.origText = btn.textContent;
    btn.disabled = true;
    btn.textContent = label || "Please wait...";
  } else {
    btn.disabled = false;
    btn.textContent = btn.dataset.origText || btn.textContent;
  }
}

/* SIGN UP */
async function signup(event) {
  event.preventDefault();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;
  const fullname = document.getElementById("signupName").value.trim();
  const btn = document.getElementById("signupBtn");
  const errId = "signupError";

  clearError(errId);
  setBtnLoading(btn, true, "Creating...");

  if (!email || !password || !fullname) {
    showError(errId, "Please fill in all fields.");
    setBtnLoading(btn, false);
    return;
  }
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email)) {
    showError(errId, "Please enter a valid email address.");
    setBtnLoading(btn, false);
    return;
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { fullname } }
    });

    if (error) {
      showError(errId, error.message || "Failed to create account.");
      setBtnLoading(btn, false);
      return;
    }

    if (data?.session) {
      // logged in immediately
      window.location.href = "dashboard.html";
    } else {
      // confirmation required
      showError(errId, "Account created. Please check your email to confirm your account.");
      setBtnLoading(btn, false);
    }
  } catch (err) {
    showError(errId, err?.message || "An unexpected error occurred.");
    setBtnLoading(btn, false);
  }
}

/* LOGIN */
async function login(event) {
  event.preventDefault();
  const btn = document.getElementById("loginBtn");
  const errId = "loginError";

  clearError(errId);
  setBtnLoading(btn, true, "Signing in...");

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    showError(errId, "Please enter both email and password.");
    setBtnLoading(btn, false);
    return;
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      showError(errId, error.message || "Sign in failed.");
      setBtnLoading(btn, false);
      return;
    }
    window.location.href = "dashboard.html";
  } catch (err) {
    showError(errId, err?.message || "An unexpected error occurred.");
    setBtnLoading(btn, false);
  }
}

/* Password show/hide toggle (expects .input-toggle inside same .input-group) */
function initPasswordToggles() {
  document.querySelectorAll(".input-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      const group = btn.closest(".input-group");
      if (!group) return;
      const input = group.querySelector("input");
      if (!input) return;
      if (input.type === "password") {
        input.type = "text";
        btn.textContent = "Hide";
        btn.setAttribute("aria-pressed", "true");
      } else {
        input.type = "password";
        btn.textContent = "Show";
        btn.setAttribute("aria-pressed", "false");
      }
      input.focus();
    });
  });
}

/* Attach listeners */
document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  if (signupForm) signupForm.addEventListener("submit", signup);

  const loginForm = document.getElementById("loginForm");
  if (loginForm) loginForm.addEventListener("submit", login);

  initPasswordToggles();
});
