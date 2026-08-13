/* ═══════════════════════════════════════════════════════════════
   ui.js — Shared UI utilities (toast, badge pop, trust bar)
   TruthQuest | UNESCO Youth Hackathon 2026
   Used by both landing page (index.html) and game (game.html)
═══════════════════════════════════════════════════════════════ */

/* ── Toast notifications ─────────────────────────────────────── */
const Toast = (() => {
  const container = document.getElementById('toast-container');
  if (!container) return { show: () => {} };

  function show(icon, message, type = 'info', duration = 4000) {
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.setAttribute('role', 'alert');
    el.innerHTML = `
      <span class="toast-icon" aria-hidden="true">${icon}</span>
      <span class="toast-msg">${message}</span>
    `;
    container.appendChild(el);

    setTimeout(() => {
      el.style.animation = 'toast-out 0.35s ease forwards';
      setTimeout(() => el.remove(), 380);
    }, duration);
  }

  return { show };
})();

/* ── Trust bar updater ───────────────────────────────────────── */
const TrustUI = (() => {
  const fill  = document.getElementById('trust-bar-fill');
  const glow  = document.getElementById('trust-bar-glow');
  const value = document.getElementById('trust-value');
  const bar   = document.querySelector('.trust-bar-track');

  function update(pct) {
    if (!fill) return;
    pct = Math.max(0, Math.min(100, pct));
    fill.style.width = pct + '%';
    if (value) value.textContent = Math.round(pct) + '%';

    // Color indicator
    let color, pos;
    if (pct >= 75) { color = '#00ff88'; pos = 'right'; }
    else if (pct >= 50) { color = '#00d4ff'; pos = '60%'; }
    else if (pct >= 30) { color = '#ffd700'; pos = '40%'; }
    else { color = '#ff4444'; pos = 'left'; }

    fill.style.backgroundPosition = pos + ' center';
    if (glow) glow.style.background = color;
    if (bar)  bar.setAttribute('aria-valuenow', String(Math.round(pct)));
  }

  return { update };
})();

/* ── Badges mini-bar ─────────────────────────────────────────── */
const BadgeUI = (() => {
  const container = document.getElementById('badges-mini');
  const earned    = new Set();

  function add(badgeId, badgeDef) {
    if (!container || earned.has(badgeId)) return;
    earned.add(badgeId);

    const el = document.createElement('span');
    el.className = 'badge-mini-item';
    el.textContent = badgeDef.icon;
    el.title = badgeDef.name + ': ' + badgeDef.description;
    el.setAttribute('aria-label', `Earned badge: ${badgeDef.name}`);
    container.appendChild(el);
  }

  function getEarned() { return [...earned]; }

  return { add, getEarned };
})();
