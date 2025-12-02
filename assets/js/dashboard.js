// assets/js/dashboard.js
import { supabase } from "./supabase.js";

// ===============================
// PROTECT ROUTE
// ===============================
async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

async function protect() {
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = "login.html";
  }
  return user;
}

// ===============================
// LOAD PROFILE INFO
// ===============================
async function loadDashboard() {
  const user = await protect();
  if (!user) return;

  // Fetch profile row
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Update UI
  document.getElementById("displayName").textContent =
    profile?.full_name || "Trader";

  document.getElementById("displayEmail").textContent = user.email;
  document.getElementById("balance").textContent =
    Number(profile?.balance || 0).toLocaleString();

  // Portfolio load
  const { data: portfolio } = await supabase
    .from("portfolio")
    .select("*")
    .eq("user_id", user.id);

  renderPortfolio(portfolio || []);
}

function renderPortfolio(items) {
  const list = document.getElementById("portfolioList");
  list.innerHTML = "";

  if (items.length === 0) {
    list.innerHTML = `<li class="empty">No assets yet.</li>`;
    return;
  }

  items.forEach((it) => {
    const li = document.createElement("li");
    li.className = "portfolio-item";
    li.innerHTML = `
      <strong>${it.asset.toUpperCase()}</strong>
      <span>${Number(it.amount).toFixed(6)} units</span>
    `;
    list.appendChild(li);
  });
}

// ===============================
// LOGOUT
// ===============================
async function logout() {
  await supabase.auth.signOut();
  window.location.href = "login.html";
}

// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.addEventListener("click", logout);

  loadDashboard();
});
