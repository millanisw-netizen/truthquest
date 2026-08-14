/* ═══════════════════════════════════════════════════════════════
   platform.js — Shared state, XP, badges, and progress system
   TruthQuest Platform | UNESCO Youth Hackathon 2026
   All departments read/write from this single source of truth.
═══════════════════════════════════════════════════════════════ */

const TQ = (() => {
  // ── Default state ─────────────────────────────────────────────
  const DEFAULT = {
    xp: 0,
    level: 1,
    accuracy: 0,
    investigationsCompleted: 0,
    factsChecked: 0,
    deepfakesDetected: 0,
    sourcesAnalysed: 0,
    socialCasesResolved: 0,
    lessonsCompleted: 0,
    missionsCompleted: 0,
    evidenceCollected: [],
    badgesEarned: [],
    gameScore: 0,
    gameBadges: [],
    preTestScore: null,
    postTestScore: null,
    joinDate: Date.now(),
    name: 'Anonymous Journalist'
  };

  const BADGE_DEFS = {
    // Game
    critical_thinker:       { icon:'🧠', name:'Critical Thinker',       dept:'game',   xp:50  },
    digital_detective:      { icon:'🔎', name:'Digital Detective',       dept:'game',   xp:75  },
    source_sleuth:          { icon:'🕵️', name:'Source Sleuth',          dept:'game',   xp:100 },
    deepfake_detector:      { icon:'🤖', name:'Deepfake Detector',       dept:'game',   xp:100 },
    evidence_analyst:       { icon:'📊', name:'Evidence Analyst',        dept:'game',   xp:75  },
    truth_teller:           { icon:'📰', name:'Truth Teller',            dept:'game',   xp:100 },
    accountability:         { icon:'⚖️', name:'Accountable',            dept:'game',   xp:50  },
    document_authenticator: { icon:'📄', name:'Document Authenticator',  dept:'game',   xp:125 },
    veridis_defender:       { icon:'🏆', name:'Defender of Veridis',     dept:'game',   xp:200 },
    // Investigation
    first_investigation:    { icon:'🔍', name:'First Investigation',     dept:'invest', xp:50  },
    viral_buster:           { icon:'💥', name:'Viral Buster',            dept:'invest', xp:100 },
    image_investigator:     { icon:'🖼️', name:'Image Investigator',     dept:'invest', xp:75  },
    // Fact Check
    fact_finder:            { icon:'📋', name:'Fact Finder',             dept:'fact',   xp:75  },
    myth_breaker:           { icon:'🔨', name:'Myth Breaker',            dept:'fact',   xp:100 },
    // AI Detection
    ai_spotter:             { icon:'🤖', name:'AI Spotter',              dept:'ai',     xp:75  },
    deepfake_hunter:        { icon:'🎭', name:'Deepfake Hunter',         dept:'ai',     xp:125 },
    // Source Analysis
    source_master:          { icon:'📚', name:'Source Master',           dept:'source', xp:100 },
    bias_detector:          { icon:'⚖️', name:'Bias Detector',          dept:'source', xp:75  },
    // Social Media
    troll_tracker:          { icon:'👾', name:'Troll Tracker',           dept:'social', xp:100 },
    bot_buster:             { icon:'🤖', name:'Bot Buster',              dept:'social', xp:125 },
    // Academy
    mil_student:            { icon:'🎓', name:'MIL Student',             dept:'academy',xp:50  },
    mil_graduate:           { icon:'🏅', name:'MIL Graduate',            dept:'academy',xp:200 },
    // Missions
    mission_complete:       { icon:'✅', name:'Mission Complete',        dept:'mission',xp:150 },
    top_investigator:       { icon:'🌟', name:'Top Investigator',        dept:'mission',xp:300 },
  };

  const XP_PER_LEVEL = 500;

  // ── Load / Save ───────────────────────────────────────────────
  function load() {
    try {
      const raw = localStorage.getItem('tq_platform');
      return raw ? { ...DEFAULT, ...JSON.parse(raw) } : { ...DEFAULT };
    } catch { return { ...DEFAULT }; }
  }

  function save(state) {
    try { localStorage.setItem('tq_platform', JSON.stringify(state)); } catch {}
  }

  // ── XP & Level ────────────────────────────────────────────────
  function addXP(amount, label) {
    const s = load();
    s.xp += amount;
    s.level = Math.floor(s.xp / XP_PER_LEVEL) + 1;
    save(s);
    showXPToast(amount, label);
    return s;
  }

  function showXPToast(amount, label) {
    const existing = document.getElementById('tq-xp-toast');
    if (existing) existing.remove();
    const t = document.createElement('div');
    t.id = 'tq-xp-toast';
    t.innerHTML = `<span>⚡ +${amount} XP</span><span style="opacity:.7;font-size:.8em">${label||''}</span>`;
    t.style.cssText = `
      position:fixed;bottom:80px;right:24px;z-index:9999;
      background:linear-gradient(135deg,#00d4ff,#0099cc);
      color:#0a0e27;font-family:Orbitron,monospace;font-weight:700;
      font-size:.85rem;padding:10px 20px;border-radius:100px;
      display:flex;gap:10px;align-items:center;
      box-shadow:0 4px 20px rgba(0,212,255,.5);
      animation:tq-xp-in .4s cubic-bezier(.34,1.56,.64,1) both;
    `;
    document.body.appendChild(t);
    if (!document.getElementById('tq-xp-style')) {
      const s = document.createElement('style');
      s.id = 'tq-xp-style';
      s.textContent = `@keyframes tq-xp-in{from{transform:translateX(40px) scale(.8);opacity:0}to{transform:none;opacity:1}}`;
      document.head.appendChild(s);
    }
    setTimeout(() => { t.style.opacity='0'; t.style.transition='opacity .4s'; setTimeout(()=>t.remove(),400); }, 2500);
  }

  // ── Award badge ───────────────────────────────────────────────
  function awardBadge(id) {
    const s = load();
    if (s.badgesEarned.includes(id)) return false;
    const def = BADGE_DEFS[id];
    if (!def) return false;
    s.badgesEarned.push(id);
    save(s);
    addXP(def.xp, `Badge: ${def.name}`);
    showBadgeToast(def);
    return true;
  }

  function showBadgeToast(def) {
    const t = document.createElement('div');
    t.innerHTML = `<span style="font-size:1.4rem">${def.icon}</span><div><div style="font-weight:700;font-size:.82rem">Badge Unlocked!</div><div style="font-size:.72rem;opacity:.8">${def.name}</div></div>`;
    t.style.cssText = `
      position:fixed;bottom:130px;right:24px;z-index:9999;
      background:#0d1333;border:1px solid rgba(255,215,0,.35);
      color:#fff;font-family:Inter,sans-serif;
      padding:12px 18px;border-radius:12px;
      display:flex;gap:12px;align-items:center;
      box-shadow:0 8px 30px rgba(0,0,0,.4);
      animation:tq-xp-in .4s cubic-bezier(.34,1.56,.64,1) both;
    `;
    document.body.appendChild(t);
    setTimeout(() => { t.style.opacity='0'; t.style.transition='opacity .4s'; setTimeout(()=>t.remove(),400); }, 3500);
  }

  // ── Evidence ──────────────────────────────────────────────────
  function addEvidence(item) {
    const s = load();
    item.id   = 'ev_' + Date.now();
    item.ts   = Date.now();
    s.evidenceCollected.unshift(item);
    if (s.evidenceCollected.length > 100) s.evidenceCollected = s.evidenceCollected.slice(0,100);
    save(s);
    addXP(20, 'Evidence collected');
  }

  // ── Stat helpers ──────────────────────────────────────────────
  function inc(key, by) {
    const s = load(); s[key] = (s[key]||0) + (by||1); save(s); return s;
  }

  // ── Level title ───────────────────────────────────────────────
  function levelTitle(lvl) {
    const titles = ['','Rookie Reporter','Field Journalist','Senior Journalist','Investigator','Senior Investigator','Lead Analyst','Chief Analyst','Editor','Managing Editor','Editor-in-Chief'];
    return titles[Math.min(lvl, titles.length-1)] || 'Master Journalist';
  }

  // ── Sync game score from game.html ────────────────────────────
  function syncGameScore(score, badges) {
    const s = load();
    if (score > s.gameScore) s.gameScore = score;
    if (badges) badges.forEach(b => {
      if (!s.gameBadges.includes(b)) s.gameBadges.push(b);
      if (!s.badgesEarned.includes(b)) { s.badgesEarned.push(b); }
    });
    s.investigationsCompleted = (s.investigationsCompleted||0) + 1;
    save(s);
    addXP(score, 'Game completed');
  }

  // ── Accuracy calc ─────────────────────────────────────────────
  function updateAccuracy(correct, total) {
    const s = load();
    s.accuracy = total > 0 ? Math.round((correct/total)*100) : 0;
    save(s);
  }

  return {
    load, save, addXP, awardBadge, addEvidence, inc,
    levelTitle, syncGameScore, updateAccuracy,
    BADGE_DEFS, XP_PER_LEVEL
  };
})();
