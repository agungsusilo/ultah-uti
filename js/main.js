let currentPage = 1;
let clicks = 0;
const maxClicks = 10;
let fireworksInterval;

// ── Music ──────────────────────────────────────────
const music = document.getElementById('bgMusic');
let musicPlaying = false;

function startMusic() {
  music.play().then(() => {
    musicPlaying = true;
    document.getElementById('musicBtn').textContent = '🎵';
  }).catch(() => {});
}

function toggleMusic() {
  if (musicPlaying) {
    music.pause();
    musicPlaying = false;
    document.getElementById('musicBtn').textContent = '🔇';
  } else {
    music.play();
    musicPlaying = true;
    document.getElementById('musicBtn').textContent = '🎵';
  }
}

// Autoplay on first interaction
document.addEventListener('click', function startOnce() {
  startMusic();
  document.removeEventListener('click', startOnce);
}, { once: true });

// ── Countdown ──────────────────────────────────────
const BIRTHDAY = new Date('2026-04-12T00:00:00');

function updateCountdown() {
  const now = new Date();
  const diff = BIRTHDAY - now;

  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById('cdDays').textContent    = String(days).padStart(2, '0');
  document.getElementById('cdHours').textContent   = String(hours).padStart(2, '0');
  document.getElementById('cdMinutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('cdSeconds').textContent = String(seconds).padStart(2, '0');
}

function showMainSite() {
  // Reset semua dot & page dulu
  document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  document.getElementById('page1').classList.add('active');
  document.getElementById('dot1').classList.add('active');
  currentPage = 1;
  makeConfetti();
}

function goTo(n) {
  // Hapus active dari semua page & dot
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));

  currentPage = n;
  document.getElementById('page' + n).classList.add('active');
  document.getElementById('dot' + n).classList.add('active');

  if (n === 1) makeConfetti();
  if (n === 2) { makeCats(); makeConfetti(); }
  if (n === 3) makeConfetti();
  if (n === 4) startRunBtn();
  if (n === 5) startFireworks();
}

// ── Confetti ───────────────────────────────────────
function makeConfetti() {
  const container = document.getElementById('confettiContainer');
  container.innerHTML = '';
  const colors = ['#ff6b9d','#c77dff','#ffd166','#06d6a0','#ff9ecd','#a0c4ff'];
  for (let i = 0; i < 80; i++) {
    const el = document.createElement('div');
    el.className = 'confetti';
    el.style.left = Math.random() * 100 + 'vw';
    el.style.background = colors[Math.floor(Math.random() * colors.length)];
    el.style.width = (Math.random() * 8 + 6) + 'px';
    el.style.height = (Math.random() * 8 + 6) + 'px';
    el.style.animationDuration = (Math.random() * 3 + 2) + 's';
    el.style.animationDelay = (Math.random() * 2) + 's';
    el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    container.appendChild(el);
  }
  setTimeout(() => container.innerHTML = '', 5000);
}

// ── 26 Cats ────────────────────────────────────────
function makeCats() {
  const row = document.getElementById('catsRow');
  row.innerHTML = '';

  // Hitung umur otomatis
  const birthYear = 2000;
  const age = BIRTHDAY.getFullYear() - birthYear;
  document.getElementById('ageNum').textContent = age;

  const catEmojis = ['🐱','😺','😸','😹','😻','🙀','😿','😾'];
  for (let i = 0; i < age; i++) {
    const span = document.createElement('span');
    span.className = 'cat-small';
    span.textContent = catEmojis[i % catEmojis.length];
    span.style.animationDuration = (Math.random() * 1 + 1.5) + 's';
    span.style.animationDelay = (Math.random() * 1) + 's';
    row.appendChild(span);
  }
}

// ── Running Button ─────────────────────────────────
function startRunBtn() {
  clicks = 0;
  const btn = document.getElementById('runBtn');
  const msg = document.getElementById('caughtMsg');
  btn.style.display = 'block';
  msg.style.display = 'none';

  // Tunggu area render dulu sebelum place
  requestAnimationFrame(() => placeBtn());
}

function placeBtn() {
  const btn = document.getElementById('runBtn');
  const area = document.getElementById('btnArea');
  if (!area || !btn) return;
  const maxX = area.offsetWidth - btn.offsetWidth - 10;
  const maxY = area.offsetHeight - btn.offsetHeight - 10;
  btn.style.left = Math.max(0, Math.random() * maxX) + 'px';
  btn.style.top = Math.max(0, Math.random() * maxY) + 'px';
}

// Desktop: kabur saat mouse bergerak di atasnya
document.getElementById('runBtn').addEventListener('mousemove', function () {
  placeBtn();
});

// Mobile: kabur saat disentuh, butuh 10x sentuh
document.getElementById('runBtn').addEventListener('touchstart', function (e) {
  e.preventDefault();
  clicks++;
  if (clicks >= maxClicks) { caughtIt(); return; }
  placeBtn();
}, { passive: false });

function caughtIt() {
  const btn = document.getElementById('runBtn');
  const msg = document.getElementById('caughtMsg');
  btn.style.display = 'none';
  msg.style.display = 'flex';
  makeConfetti();
}

// ── Fireworks ──────────────────────────────────────
function startFireworks() {
  const canvas = document.getElementById('fireworks');
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const particles = [];
  const colors = ['#ff6b9d','#ffd166','#c77dff','#06d6a0','#ff9ecd','#ffffff','#a0c4ff'];

  function burst(x, y) {
    for (let i = 0; i < 60; i++) {
      const angle = (Math.PI * 2 / 60) * i;
      const speed = Math.random() * 5 + 2;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 4 + 2
      });
    }
  }

  function loop() {
    ctx.fillStyle = 'rgba(26,0,48,0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.08;
      p.alpha -= 0.015;
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    for (let i = particles.length - 1; i >= 0; i--) {
      if (particles[i].alpha <= 0) particles.splice(i, 1);
    }
    fireworksInterval = requestAnimationFrame(loop);
  }

  loop();
  setInterval(() => {
    burst(Math.random() * canvas.width, Math.random() * canvas.height * 0.7);
  }, 600);
  burst(canvas.width / 2, canvas.height / 2);
}

// ── Init ───────────────────────────────────────────
showMainSite();
makeConfetti();