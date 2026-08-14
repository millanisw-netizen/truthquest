/* ═══════════════════════════════════════════════════════════════
   verifier.js — Source Verification Mini-game controller
   TruthQuest | UNESCO Youth Hackathon 2026
   Fixed: all DOM queries are now lazy (inside open()) so they
   work even when the modal starts as hidden.
═══════════════════════════════════════════════════════════════ */

const Verifier = (() => {
  let currentMG    = null;
  let toolsUsed    = 0;
  let toolsClicked = {};
  let onComplete   = null;

  // ── Open modal ────────────────────────────────────────────────
  function open(minigameData, completionCallback) {
    // Lazy DOM lookup — safe even if called before DOMContentLoaded
    const modal      = document.getElementById('minigame-modal');
    const mgTitle    = document.getElementById('mg-title-text');
    const mgAvatar   = document.getElementById('mg-avatar');
    const mgUsername = document.getElementById('mg-username');
    const mgHandle   = document.getElementById('mg-handle');
    const mgVerified = document.getElementById('mg-verified');
    const mgText     = document.getElementById('mg-text');
    const mgImgDesc  = document.getElementById('mg-image-desc');
    const mgTimestamp= document.getElementById('mg-timestamp');
    const mgLikes    = document.getElementById('mg-likes');
    const mgRetweets = document.getElementById('mg-retweets');
    const resultPlaceholder = document.getElementById('tool-result-placeholder');
    const resultContent     = document.getElementById('tool-result-content');
    const toolsUsedCount    = document.getElementById('tools-used-count');
    const verdictVerified   = document.getElementById('verdict-verified');
    const verdictFalse      = document.getElementById('verdict-false');
    const verdictHint       = document.getElementById('verdict-hint');

    if (!modal) {
      console.error('Verifier: minigame-modal not found in DOM');
      return;
    }

    currentMG    = minigameData;
    toolsUsed    = 0;
    toolsClicked = {};
    onComplete   = completionCallback;

    const c = minigameData.content;

    // Populate social card
    if (mgTitle)     mgTitle.textContent     = minigameData.title;
    if (mgAvatar)    mgAvatar.textContent    = c.avatar;
    if (mgUsername)  mgUsername.textContent  = c.username;
    if (mgHandle)    mgHandle.textContent    = c.handle;
    if (mgText)      mgText.textContent      = c.text;
    if (mgImgDesc)   mgImgDesc.textContent   = c.image_desc || '';
    if (mgTimestamp) mgTimestamp.textContent = c.timestamp || '';
    if (mgLikes)     mgLikes.textContent     = c.likes !== 'N/A' ? `❤ ${c.likes}` : '';
    if (mgRetweets)  mgRetweets.textContent  = c.retweets !== 'N/A' ? `🔁 ${c.retweets}` : '';

    // Verified badge
    if (mgVerified) mgVerified.style.display = c.verified_badge ? 'inline-flex' : 'none';

    // Reset tool UI
    if (resultPlaceholder) resultPlaceholder.classList.remove('hidden');
    if (resultContent)     { resultContent.classList.add('hidden'); resultContent.textContent = ''; }

    document.querySelectorAll('.dot').forEach(d => d.classList.remove('filled'));
    document.querySelectorAll('.tool-btn').forEach(b => {
      b.classList.remove('used');
      b.disabled = false;
    });
    if (toolsUsedCount) toolsUsedCount.textContent = '0';

    if (verdictVerified) verdictVerified.disabled = true;
    if (verdictFalse)    verdictFalse.disabled    = true;
    if (verdictHint)     verdictHint.textContent  = 'Use at least 2 tools to unlock verdicts';

    // Show modal
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Focus first tool button for accessibility
    const firstTool = modal.querySelector('.tool-btn');
    if (firstTool) setTimeout(() => firstTool.focus(), 100);
  }

  // ── Tool click handler (attached once via event delegation) ──
  document.addEventListener('click', e => {
    const btn = e.target.closest('.tool-btn');
    if (!btn || !currentMG) return;
    // Only fire if modal is open
    const modal = document.getElementById('minigame-modal');
    if (!modal || modal.classList.contains('hidden')) return;

    const key      = btn.dataset.tool;
    const toolData = currentMG.tools[key];
    if (!toolData) return;

    const resultPlaceholder = document.getElementById('tool-result-placeholder');
    const resultContent     = document.getElementById('tool-result-content');
    if (resultPlaceholder) resultPlaceholder.classList.add('hidden');
    if (resultContent)     { resultContent.classList.remove('hidden'); resultContent.textContent = toolData.result; }

    if (!toolsClicked[key]) {
      toolsClicked[key] = true;
      toolsUsed++;
      btn.classList.add('used');

      const dots = document.querySelectorAll('.dot');
      const idx  = toolsUsed - 1;
      if (dots[idx]) dots[idx].classList.add('filled');

      const counter = document.getElementById('tools-used-count');
      if (counter) counter.textContent = String(toolsUsed);

      if (toolsUsed >= 2) {
        const vv = document.getElementById('verdict-verified');
        const vf = document.getElementById('verdict-false');
        const vh = document.getElementById('verdict-hint');
        if (vv) vv.disabled = false;
        if (vf) vf.disabled = false;
        if (vh) vh.textContent = 'You have enough evidence. Make your verdict!';
      }
    }
  });

  // ── Verdict button handler (event delegation) ─────────────────
  document.addEventListener('click', e => {
    const vBtn = e.target.closest('#verdict-verified, #verdict-false');
    if (!vBtn || !currentMG) return;
    const modal = document.getElementById('minigame-modal');
    if (!modal || modal.classList.contains('hidden')) return;

    const choice  = vBtn.id === 'verdict-verified' ? 'verified' : 'misinformation';
    const correct = choice === currentMG.correct_verdict;
    const trust   = correct ? currentMG.trustReward : currentMG.trustPenalty;
    const badge   = correct ? currentMG.badge_on_correct : null;

    close();
    if (onComplete) onComplete(correct, trust, badge);
  });

  // ── Close modal ───────────────────────────────────────────────
  function close() {
    const modal = document.getElementById('minigame-modal');
    if (modal) modal.classList.add('hidden');
    document.body.style.overflow = '';
    currentMG  = null;
    onComplete = null;
  }

  // Close on backdrop click
  document.addEventListener('click', e => {
    const modal = document.getElementById('minigame-modal');
    if (modal && !modal.classList.contains('hidden') && e.target === modal) {
      close();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('minigame-modal');
      if (modal && !modal.classList.contains('hidden')) close();
    }
  });

  return { open, close };
})();
