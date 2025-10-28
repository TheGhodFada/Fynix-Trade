
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  setTimeout(() => {
    loader.classList.add("fade-out");
  }, 3000); // loader visible for 3 seconds
});






const header = document.querySelector(".header");
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
const overlay = document.getElementById("menuOverlay");

// Scroll blur effect
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 50);
});

// Mobile menu toggle
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navLinks.classList.toggle("show");
  overlay.classList.toggle("active");
});

// Close menu when overlay clicked
overlay.addEventListener("click", () => {
  hamburger.classList.remove("active");
  navLinks.classList.remove("show");
  overlay.classList.remove("active");
});


// Infinite ticker loop without duplicating
const ticker = document.querySelector('.ticker');
ticker.innerHTML += ticker.innerHTML; // just doubles content once for loop illusion

// ===== Scroll Reveal Animation =====
const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
  const triggerPoint = window.innerHeight * 0.85;
  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < triggerPoint) el.classList.add("active");
  });
}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll(); // run once on load



/* ===== Reveal trigger for testimonials (re-uses existing reveal code) ===== */
const trustReveals = document.querySelectorAll('.testimonial.reveal');
function revealTrust() {
  const trigger = window.innerHeight * 0.9;
  trustReveals.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < trigger) el.classList.add('active');
  });
}
window.addEventListener('scroll', revealTrust);
revealTrust(); // run on load

/* ===== Partners track pause on hover (optional nicety) ===== */
const partners = document.getElementById('partnersTrack');
if (partners) {
  partners.addEventListener('mouseenter', () => partners.style.animationPlayState = 'paused');
  partners.addEventListener('mouseleave', () => partners.style.animationPlayState = 'running');
}

/* ===== Footer year ===== */
const yearFooter = document.getElementById('yearFooter');
if (yearFooter) yearFooter.textContent = new Date().getFullYear();





// ===== Hero Particles =====
const canvas = document.getElementById("heroParticles");
const ctx = canvas.getContext("2d");

let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;

const particles = [];
const particleCount = 80;

// Particle class
class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.size = Math.random() * 2 + 1;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.alpha = Math.random() * 0.6 + 0.2;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if(this.x < 0 || this.x > w || this.y < 0 || this.y > h) {
      this.reset();
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
    ctx.fillStyle = `rgba(0, 255, 238, ${this.alpha})`;
    ctx.fill();
  }
}

// Initialize particles
for(let i=0; i<particleCount; i++){
  particles.push(new Particle());
}

// Animate particles
function animateParticles(){
  ctx.clearRect(0, 0, w, h);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}

animateParticles();

// Resize handling
window.addEventListener('resize', () => {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
});



/* ===== PLATFORM OVERVIEW JS ===== */

// animate counters when section visible
(function(){
  const section = document.getElementById('platform');
  const statEls = section ? section.querySelectorAll('.stat-value') : [];
  let countersStarted = false;

  function startCounters() {
    if (countersStarted) return;
    countersStarted = true;
    statEls.forEach(el => {
      const target = +el.getAttribute('data-target') || 0;
      const duration = 1600;
      const start = performance.now();
      const initial = 0;
      function tick(now) {
        const t = Math.min(1, (now - start) / duration);
        const ease = t * (2 - t); // easeOutQuad
        const value = Math.floor(initial + (target - initial) * ease);
        // if it's AUM, format with commas
        if (target >= 1000000) el.textContent = value.toLocaleString();
        else el.textContent = value;
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  function checkPlatformInView(){
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      startCounters();
      section.classList.add('revealed');
    }
  }
  window.addEventListener('scroll', checkPlatformInView);
  checkPlatformInView();
})();

// sparkline mini chart (simple moving line)
(function(){
  const canvas = document.getElementById('sparkline');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = Math.floor(w * ratio);
    canvas.height = Math.floor(h * ratio);
    ctx.setTransform(ratio,0,0,ratio,0,0);
  }
  window.addEventListener('resize', resize);
  resize();

  // create a simple data array and animate changes
  const points = 60;
  const data = new Array(points).fill(0).map((_,i) => 50 + Math.sin(i/6)*10 + Math.random()*6 );

  function draw() {
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;
    ctx.clearRect(0,0,cw,ch);

    // gradient fill
    const grad = ctx.createLinearGradient(0,0,0,ch);
    grad.addColorStop(0, 'rgba(123,47,247,0.12)');
    grad.addColorStop(1, 'rgba(0,188,212,0.03)');

    // path
    ctx.beginPath();
    for (let i=0;i<data.length;i++){
      const x = (i / (data.length - 1)) * (cw - 20) + 10;
      const y = ch - ( (data[i] - 20) / 100 ) * (ch - 30 ) - 10;
      if (i === 0) ctx.moveTo(x,y);
      else ctx.lineTo(x,y);
    }
    ctx.strokeStyle = '#00ffee';
    ctx.lineWidth = 2;
    ctx.stroke();

    // gradient area under line
    ctx.lineTo(cw - 10, ch - 10);
    ctx.lineTo(10, ch - 10);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // draw a glow for last point
    const lastX = ( (data.length-1)/(data.length -1) ) * (cw - 20) + 10;
    const lastY = ch - ( (data[data.length-1] - 20) / 100 ) * (ch - 30 ) - 10;
    ctx.beginPath();
    ctx.arc(lastX, lastY, 4, 0, Math.PI*2);
    ctx.fillStyle = '#00ffee';
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#00ffee';
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // animate pseudo-live updates
  function tick() {
    // shift left and push a new value
    data.shift();
    const last = data[data.length-1];
    const next = Math.max(20, Math.min(100, last + (Math.random() - 0.45) * 4));
    data.push(next);
    draw();
    requestAnimationFrame(tick);
  }
  tick();
})();


// === Animated Stats Counter ===
const counters = document.querySelectorAll('.num');
let statsStarted = false;

const startCounters = () => {
  counters.forEach(counter => {
    const updateCount = () => {
      const target = +counter.getAttribute('data-target');
      const current = +counter.innerText.replace(/,/g, '');
      const increment = target / 200;

      if (current < target) {
        counter.innerText = Math.ceil(current + increment).toLocaleString();
        requestAnimationFrame(updateCount);
      } else {
        counter.innerText = target.toLocaleString();
      }
    };
    updateCount();
  });
};

window.addEventListener('scroll', () => {
  const statsSection = document.querySelector('.stats');
  const sectionTop = statsSection.getBoundingClientRect().top;
  if (sectionTop < window.innerHeight * 0.8 && !statsStarted) {
    statsStarted = true;
    startCounters();
  }
});


// Robust equal-height fallback for .stat cards
(function equalizeStatHeights(){
  const resizeAndEqualize = () => {
    const stats = Array.from(document.querySelectorAll('.stat'));
    if (!stats.length) return;
    // clear inline heights first
    stats.forEach(s => s.style.minHeight = '');
    // compute max height
    const heights = stats.map(s => s.getBoundingClientRect().height);
    const max = Math.max(...heights, 0);
    // apply max as minHeight to each (only if > 0)
    if (max > 0) stats.forEach(s => s.style.minHeight = Math.ceil(max) + 'px');
  };

  // run after load (fonts/images)
  window.addEventListener('load', resizeAndEqualize);
  // and on resize (debounced)
  let t;
  window.addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(resizeAndEqualize, 120);
  });

  // if you dynamically change content, call resizeAndEqualize() again
})();


document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.querySelector(".sparkline");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = canvas.offsetHeight;

  // Generate initial points
  let points = Array.from({ length: 40 }, () => height / 2 + (Math.random() - 0.5) * 40);

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Move the data
    points.shift();
    const last = points[points.length - 1];
    let next = last + (Math.random() - 0.5) * 10;
    next = Math.max(10, Math.min(height - 10, next));
    points.push(next);

    // Create gradient glow
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "rgba(0,255,198,0.4)");
    gradient.addColorStop(1, "rgba(0,255,198,0)");

    // Draw glowing line
    ctx.beginPath();
    ctx.moveTo(0, points[0]);
    for (let i = 1; i < points.length; i++) {
      const x = (i / (points.length - 1)) * width;
      ctx.lineTo(x, points[i]);
    }
    ctx.strokeStyle = "#00ffc6";
    ctx.lineWidth = 2;
    ctx.shadowColor = "#00ffc6";
    ctx.shadowBlur = 8;
    ctx.stroke();

    // Fill under curve
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    requestAnimationFrame(draw);
  }

  draw();
});

// ===== ANIMATED STATS COUNTERS =====
document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(".stat-value");
  const speed = 180; // lower = faster

  const animateCounters = () => {
    counters.forEach(counter => {
      const target = +counter.getAttribute("data-target");
      const count = +counter.innerText;
      const increment = target / speed;

      if (count < target) {
        counter.innerText = Math.ceil(count + increment);
        setTimeout(animateCounters, 20);
      } else {
        counter.innerText = target.toLocaleString();
      }
    });
  };

  // Reveal-triggered animation
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(document.querySelector(".platform-overview"));
});


44// ==== HOW IT WORKS SCROLL ANIMATION ====
document.addEventListener("DOMContentLoaded", () => {
  const steps = document.querySelectorAll(".how-it-works .step");

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          setTimeout(() => el.classList.add("revealed"), i * 180); // stagger reveal
          observer.unobserve(el);
        }
      });
    },
    {
      threshold: 0.3,
    }
  );

  steps.forEach(step => observer.observe(step));
});


// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  if (window.scrollY > 60) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});


document.querySelectorAll('.faq-question').forEach(button => {
  button.addEventListener('click', () => {
    const faqItem = button.parentElement;
    faqItem.classList.toggle('active');

    // Close others
    document.querySelectorAll('.faq-item').forEach(item => {
      if (item !== faqItem) item.classList.remove('active');
    });
  });
});

// ===== FAQ SCROLL REVEAL =====
const faqItems = document.querySelectorAll(".faq-item");

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // only animate once
      }
    });
  },
  {
    threshold: 0.15,
  }
);

faqItems.forEach(item => {
  observer.observe(item);
});

// Horizontal drag scroll for roadmap
const roadmap = document.querySelector('.roadmap-track');
if (roadmap) {
  let isDown = false;
  let startX;
  let scrollLeft;
  roadmap.addEventListener('mousedown', e => {
    isDown = true;
    startX = e.pageX - roadmap.offsetLeft;
    scrollLeft = roadmap.scrollLeft;
  });
  roadmap.addEventListener('mouseleave', () => isDown = false);
  roadmap.addEventListener('mouseup', () => isDown = false);
  roadmap.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - roadmap.offsetLeft;
    const walk = (x - startX) * 1.2;
    roadmap.scrollLeft = scrollLeft - walk;
  });
}

// ===========================
// Scroll Reveal Animations
// ===========================

document.addEventListener("DOMContentLoaded", () => {
  const reveals = document.querySelectorAll(".scroll-reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // reveal once
        }
      });
    },
    { threshold: 0.2 }
  );

  reveals.forEach((el) => observer.observe(el));
});



  // set current year in footer
  const y = new Date().getFullYear();
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = y;


  const contactForm = document.querySelector('.contact-form');
const contactLoader = document.getElementById('contactLoader');

if (contactForm) {
  contactForm.addEventListener('submit', () => {
    contactLoader.classList.add('active');
  });
}