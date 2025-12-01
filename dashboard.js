// assets/js/dashboard.js
import { supabase } from './supabase.js';

// protect route
async function protectRoute() {
  const user = supabase.auth.user();
  if (!user) {
    window.location.href = 'login.html';
    return null;
  }
  return user;
}

// load profile + portfolio
async function loadDashboard() {
  const user = await protectRoute();
  if (!user) return;

  // fetch profile row
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Profile fetch error', error);
  } else {
    document.getElementById('displayName').textContent = profile.full_name || 'Trader';
    document.getElementById('displayEmail').textContent = user.email;
    document.getElementById('balance').textContent = (Number(profile.balance) || 0).toLocaleString();
  }

  // fetch portfolio (simple)
  const { data: portfolio } = await supabase
    .from('portfolio')
    .select('*')
    .eq('user_id', user.id);

  renderPortfolio(portfolio || []);

  // realtime: listen to profile updates
  supabase
    .from(`profiles:id=eq.${user.id}`)
    .on('UPDATE', payload => {
      const p = payload.new;
      document.getElementById('balance').textContent = (Number(p.balance) || 0).toLocaleString();
    })
    .subscribe();
}

function renderPortfolio(items) {
  const ul = document.getElementById('portfolioList');
  if (!ul) return;
  ul.innerHTML = '';
  if (!items.length) {
    ul.innerHTML = '<li class="empty">No assets yet — fund your wallet to start trading.</li>';
    return;
  }
  items.forEach(it => {
    const li = document.createElement('li');
    li.className = 'portfolio-item';
    li.innerHTML = `
      <div class="p-left">
        <strong>${it.asset.toUpperCase()}</strong>
        <small>${(Number(it.amount)||0).toFixed(6)} units</small>
      </div>
      <div class="p-right">
        <small>Value</small>
        <strong>${(Number(it.value_usd)||0).toLocaleString()}</strong>
      </div>
    `;
    ul.appendChild(li);
  });
}

async function logout() {
  await supabase.auth.signOut();
  window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', async () => {
  // handle logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', logout);

  // initial load
  await loadDashboard();
});
