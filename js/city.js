/* ═══════════════════════════════════════════════════════════════
   city.js — Animated Veridis city skyline that reacts to trust
   TruthQuest | UNESCO Youth Hackathon 2026
═══════════════════════════════════════════════════════════════ */

const CityRenderer = (() => {
  const canvas = document.getElementById('city-canvas');
  if (!canvas) return {};
  const ctx = canvas.getContext('2d');

  let trustLevel = 65; // 0–100
  let targetTrust = 65;
  let animFrame   = null;

  // ── Buildings ──────────────────────────────────────────────────
  const BUILDINGS = [];
  const WINDOW_COLS = 3;
  const WINDOW_ROWS = 5;

  function buildCity() {
    BUILDINGS.length = 0;
    const W = canvas.width;
    const H = canvas.height;
    const count = Math.floor(W / 36) + 2;

    for (let i = 0; i < count; i++) {
      const bw = 24 + Math.random() * 28;
      const bh = 30 + Math.random() * (H * 0.65);
      BUILDINGS.push({
        x:     (i / count) * W + Math.random() * 12 - 6,
        w:     bw,
        h:     bh,
        color: `hsl(${220 + Math.random() * 30},${30 + Math.random() * 20}%,${12 + Math.random() * 10}%)`,
        windows: generateWindows(bw, bh)
      });
    }
  }

  function generateWindows(bw, bh) {
    const wins = [];
    const cols = WINDOW_COLS;
    const rows = WINDOW_ROWS;
    const pw = bw / (cols + 1);
    const ph = bh / (rows + 2);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        wins.push({
          dx: pw * (c + 0.5) - 4,
          dy: ph * (r + 0.5),
          lit: Math.random() > 0.4,
          flicker: Math.random() > 0.8,
          phase: Math.random() * Math.PI * 2
        });
      }
    }
    return wins;
  }

  // ── Particles ─────────────────────────────────────────────────
  const PARTICLES = [];
  function spawnParticles() {
    PARTICLES.length = 0;
    for (let i = 0; i < 60; i++) {
      PARTICLES.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -0.2 - Math.random() * 0.5,
        r: Math.random() * 1.2 + 0.3,
        alpha: Math.random() * 0.4 + 0.05,
        life: Math.random()
      });
    }
  }

  // ── Resize ────────────────────────────────────────────────────
  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    buildCity();
    spawnParticles();
  }

  // ── Draw ──────────────────────────────────────────────────────
  let tick = 0;

  function draw() {
    tick++;
    const W = canvas.width;
    const H = canvas.height;

    // Lerp trust
    trustLevel += (targetTrust - trustLevel) * 0.02;

    // Sky gradient — shifts from dark blue → deep red as trust falls
    const t = trustLevel / 100;
    const r1 = Math.round(5  + (1 - t) * 30);
    const g1 = Math.round(8  + (1 - t) * 0);
    const b1 = Math.round(20 + t * 20);
    ctx.fillStyle = `rgb(${r1},${g1},${b1})`;
    ctx.fillRect(0, 0, W, H);

    // Moon / warning glow
    if (trustLevel < 40) {
      ctx.save();
      const grd = ctx.createRadialGradient(W * 0.8, H * 0.2, 2, W * 0.8, H * 0.2, 80);
      grd.addColorStop(0, `rgba(255,68,68,${0.25 * (1 - t / 0.4)})`);
      grd.addColorStop(1, 'rgba(255,68,68,0)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);
    }

    // Horizon glow
    {
      const grd = ctx.createLinearGradient(0, H * 0.5, 0, H);
      grd.addColorStop(0, 'rgba(0,80,120,0)');
      grd.addColorStop(1, `rgba(0,${Math.round(40 * t)},${Math.round(80 * t)},0.4)`);
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);
    }

    // Buildings
    BUILDINGS.forEach(b => {
      const by = H - b.h;

      // Building body
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x, by, b.w, b.h);

      // Roof accent line
      ctx.fillStyle = trustLevel > 50
        ? `rgba(0,212,255,${0.3 * t})`
        : `rgba(255,68,68,${0.3 * (1 - t)})`;
      ctx.fillRect(b.x, by, b.w, 2);

      // Windows
      b.windows.forEach(w => {
        let bright = w.lit;
        if (w.flicker) bright = bright && ((tick + Math.round(w.phase * 10)) % 80 > 5);

        // Trust lowers lit percentage
        if (trustLevel < 30 && Math.random() > trustLevel / 30) bright = false;

        if (bright) {
          ctx.fillStyle = trustLevel > 50
            ? `rgba(255,230,100,0.9)`
            : `rgba(255,80,60,0.7)`;
          ctx.fillRect(b.x + w.dx, by + w.dy, 7, 5);

          // Window glow
          ctx.shadowBlur  = 4;
          ctx.shadowColor = trustLevel > 50 ? 'rgba(255,220,80,0.4)' : 'rgba(255,60,60,0.4)';
          ctx.fillRect(b.x + w.dx, by + w.dy, 7, 5);
          ctx.shadowBlur = 0;
        } else {
          ctx.fillStyle = 'rgba(0,0,0,0.6)';
          ctx.fillRect(b.x + w.dx, by + w.dy, 7, 5);
        }
      });
    });

    // Ground line
    ctx.fillStyle = trustLevel > 50 ? 'rgba(0,212,255,0.12)' : 'rgba(255,68,68,0.1)';
    ctx.fillRect(0, H - 2, W, 2);

    // Floating particles (data / information)
    PARTICLES.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.002;
      if (p.y < 0 || p.life <= 0) {
        p.x    = Math.random() * W;
        p.y    = H;
        p.life = 1;
      }
      const col = trustLevel > 50 ? `0,212,255` : `255,100,80`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${col},${p.alpha * p.life})`;
      ctx.fill();
    });

    animFrame = requestAnimationFrame(draw);
  }

  // ── Public API ────────────────────────────────────────────────
  function setTrust(value) {
    targetTrust = Math.max(0, Math.min(100, value));
    updateStatusText(targetTrust);
  }

  function updateStatusText(val) {
    const el = document.getElementById('city-status-text');
    if (!el) return;
    if (val >= 80)      el.textContent = 'City Status: Thriving';
    else if (val >= 60) el.textContent = 'City Status: Stable';
    else if (val >= 40) el.textContent = 'City Status: Uneasy';
    else if (val >= 20) el.textContent = 'City Status: Alarmed';
    else                el.textContent = 'City Status: Crisis';
    el.style.color = val >= 50 ? 'rgba(0,212,255,0.8)' : 'rgba(255,100,80,0.8)';
  }

  function init() {
    // On first load: hide canvas, show quotes banner
    const cityCanvas = document.getElementById('city-canvas');
    const cityLabel  = document.querySelector('.city-label');
    if (cityCanvas) cityCanvas.style.display = 'none';
    if (cityLabel)  cityLabel.style.display  = 'none';

    resize();
    draw();
    window.addEventListener('resize', () => { resize(); });
  }

  return { init, setTrust };
})();
