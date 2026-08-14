/* ═══════════════════════════════════════════════════════════════
   nav.js — Injects platform nav + XP bar into every dept page
   TruthQuest Platform | UNESCO Youth Hackathon 2026
═══════════════════════════════════════════════════════════════ */

(function () {
  const PAGES = [
    { href:'hub.html',          icon:'🏛️', label:'HQ'           },
    { href:'game.html',         icon:'🎮', label:'Mission Ctr'  },
    { href:'investigation.html',icon:'🔍', label:'Investigate'  },
    { href:'factcheck.html',    icon:'📋', label:'Fact Check'   },
    { href:'aidetection.html',  icon:'🤖', label:'AI Detect'    },
    { href:'sourceanalysis.html',icon:'📚',label:'Sources'      },
    { href:'social.html',       icon:'📱', label:'Social Media' },
    { href:'academy.html',      icon:'🎓', label:'MIL Academy'  },
    { href:'evidence.html',     icon:'🗂️', label:'Evidence'     },
    { href:'leaderboard.html',  icon:'🏆', label:'Leaderboard'  },
    { href:'impact.html',       icon:'📊', label:'Impact'       },
  ];

  function inject() {
    // Apply saved theme
    const theme = localStorage.getItem('tq_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', theme);

    // Build header HTML
    const state = typeof TQ !== 'undefined' ? TQ.load() : { xp:0, level:1, name:'Journalist' };
    const xpInLevel = state.xp % (typeof TQ !== 'undefined' ? TQ.XP_PER_LEVEL : 500);
    const xpPct = Math.min(100, Math.round(xpInLevel / (typeof TQ !== 'undefined' ? TQ.XP_PER_LEVEL : 500) * 100));
    const current = location.pathname.split('/').pop() || 'hub.html';

    const navLinks = PAGES.map(p => {
      const active = current === p.href ? ' active' : '';
      return `<a href="${p.href}" class="plat-nav-btn${active}" aria-label="${p.label}">${p.icon} ${p.label}</a>`;
    }).join('');

    const header = document.createElement('header');
    header.className = 'plat-header';
    header.innerHTML = `
      <a href="hub.html" class="plat-logo" aria-label="TruthQuest HQ">🔍 Truth<span>Quest</span></a>
      <nav class="plat-nav" aria-label="Department navigation">${navLinks}</nav>
      <div class="plat-xp-bar" aria-label="XP progress">
        <span class="plat-xp-label">Lv.${state.level}</span>
        <div class="plat-xp-track"><div class="plat-xp-fill" id="nav-xp-fill" style="width:${xpPct}%"></div></div>
        <span style="font-size:.65rem">${state.xp} XP</span>
      </div>
      <button class="plat-theme-btn" id="plat-theme-btn" aria-label="Toggle theme">
        ${theme === 'dark' ? '🌙' : '☀️'}
      </button>
    `;
    document.body.insertBefore(header, document.body.firstChild);

    // Scroll progress
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.id = 'scroll-progress';
    document.body.insertBefore(bar, document.body.firstChild);
    window.addEventListener('scroll', () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = max > 0 ? (window.scrollY / max * 100) + '%' : '0%';
    }, { passive: true });

    // Theme toggle
    document.getElementById('plat-theme-btn').addEventListener('click', () => {
      const t = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', t);
      localStorage.setItem('tq_theme', t);
      document.getElementById('plat-theme-btn').textContent = t === 'dark' ? '🌙' : '☀️';
    });

    // Inject footer
    const footer = document.createElement('footer');
    footer.className = 'plat-footer';
    footer.innerHTML = `
      <p>
        <a href="hub.html">HQ</a>
        <a href="index.html">Landing Page</a>
        <a href="https://www.unesco.org/en/media-information-literacy" target="_blank" rel="noopener">UNESCO MIL</a>
      </p>
      <p style="margin-top:8px">© ${new Date().getFullYear()} TruthQuest — UNESCO Youth Hackathon 2026</p>
    `;
    document.body.appendChild(footer);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
