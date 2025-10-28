
const marketData = [
    { name: "Bitcoin", symbol: "BTC", price: 68000, change: 1.8, volume: "45.2B" },
    { name: "Ethereum", symbol: "ETH", price: 3720, change: -0.5, volume: "23.1B" },
    { name: "Solana", symbol: "SOL", price: 145, change: 2.2, volume: "7.8B" },
    { name: "Ripple", symbol: "XRP", price: 0.52, change: -1.1, volume: "3.5B" },
    { name: "Cardano", symbol: "ADA", price: 0.78, change: 0.9, volume: "2.4B" },
  ];
  
  function generateMiniChart() {
    const points = Array.from({ length: 12 }, () => Math.floor(Math.random() * 30) + 10);
    return `<svg viewBox="0 0 100 40" class="mini-chart">
      <polyline fill="none" stroke="#00d9ff" stroke-width="2"
        points="${points.map((p, i) => `${i * 9},${40 - p}`).join(" ")}" />
    </svg>`;
  }
  
  function updateMarketTable() {
    const tbody = document.getElementById("marketData");
    tbody.innerHTML = marketData.map(asset => `
      <tr>
        <td>${asset.name} <span style="color:#00d9ff;">(${asset.symbol})</span></td>
        <td class="price">$${asset.price.toLocaleString()}</td>
        <td class="change ${asset.change >= 0 ? 'positive' : 'negative'}">${asset.change}%</td>
        <td class="volume">${asset.volume}</td>
        <td>${generateMiniChart()}</td>
        <td><button class="action-btn">Trade</button></td>
      </tr>
    `).join("");
  }
  
  // Simulate live updates
  setInterval(() => {
    marketData.forEach(asset => {
      const drift = (Math.random() - 0.5) * 2;
      asset.price = +(asset.price + drift).toFixed(2);
      asset.change = +(asset.change + drift / 10).toFixed(2);
    });
    updateMarketTable();
  }, 2000);
  
  updateMarketTable();
  
  


document.addEventListener("DOMContentLoaded", () => {
  const canvases = document.querySelectorAll(".sparkline");

  canvases.forEach(canvas => {
    const ctx = canvas.getContext("2d");
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;

    // Create random data points
    let points = Array.from({ length: 25 }, () => Math.random() * height * 0.8 + height * 0.1);

    function drawSparkline() {
      ctx.clearRect(0, 0, width, height);

      // Glow effect
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, "#00eaff");
      gradient.addColorStop(1, "#7b2ff7");

      ctx.beginPath();
      ctx.moveTo(0, points[0]);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo((i / (points.length - 1)) * width, points[i]);
      }
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 8;
      ctx.shadowColor = "#00eaff";
      ctx.stroke();

      // Small dots glow
      ctx.fillStyle = "#00eaff";
      for (let i = 0; i < points.length; i += 5) {
        ctx.beginPath();
        ctx.arc((i / (points.length - 1)) * width, points[i], 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Smoothly animate sparkline data
    function updateData() {
      points.shift();
      points.push(Math.random() * height * 0.8 + height * 0.1);
      drawSparkline();
      requestAnimationFrame(updateData);
    }

    drawSparkline();
    requestAnimationFrame(updateData);
  });
});





