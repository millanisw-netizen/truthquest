/* ═══════════════════════════════════════════════════════════════
   verifier.js — Source Verification Mini-game controller
   TruthQuest | UNESCO Youth Hackathon 2026
═══════════════════════════════════════════════════════════════ */

const Verifier = (() => {
  let currentMG    = null;  // current minigame data
  let toolsUsed    = 0;
  let toolsClicked = {};    // set of tool keys used
  let onComplete   = null;  // callback(wasCorrect, trustDelta, badge)

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

  const toolsUsedCount = document.getElementById('tools-used-count');
  const dots           = document.querySelectorAll('.dot');

  const verdictVerified = document.getElementById('verdict-verified');
  const verdictFalse    = document.getElementById('verdict-false');
  const verdictHint     = document.getElementById('verdict-hint');

  const toolBtns = document.querySelectorAll('.tool-btn');

  // ── Open modal ────────────────────────────────────────────────
  function open(minigameData, completionCallback) {
    currentMG    = minigameData;
    toolsUsed    = 0;
    toolsClicked = {};
    onComplete   = completionCallback;

    const c = minigameData.content;

    // Populate social card
    mgTitle.textContent    = minigameData.title;
    mgAvatar.textContent   = c.avatar;
    mgUsername.textContent = c.username;
    mgHandle.textContent   = c.handle;
    mgText.textContent     = c.text;
    mgImgDesc.textContent  = c.image_desc || '';
    mgTimestamp.textContent = c.timestamp || '';
    mgLikes.textContent    = c.likes !== 'N/A' ? `❤ ${c.likes}` : '';
    mgRetweets.textContent = c.retweets !== 'N/A' ? `🔁 ${c.retweets}` : '';

    // Verified badge
    mgVerified.style.display = c.verified_badge ? 'inline-flex' : 'none';

    // Reset tool UI
    resultPlaceholder.classList.remove('hidden');
    resultContent.classList.add('hidden');
    resultContent.textContent = '';

    dots.forEach(d => d.classList.remove('filled'));
    toolBtns.forEach(b => {
      b.classList.remove('used');
      b.disabled = false;
    });
    toolsUsedCount.textContent = '0';

    verdictVerified.disabled = true;
    verdictFalse.disabled    = true;
    verdictHint.textContent  = 'Use at least 2 tools to unlock verdicts';

    // Show modal
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  // ── Tool click ────────────────────────────────────────────────
  toolBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (!currentMG) return;
      const key = btn.dataset.tool;
      const toolData = currentMG.tools[key];
      if (!toolData) return;

      // Show result
      resultPlaceholder.classList.add('hidden');
      resultContent.classList.remove('hidden');
      resultContent.textContent = toolData.result;

      // Mark as used
      if (!toolsClicked[key]) {
        toolsClicked[key] = true;
        toolsUsed++;
        btn.classList.add('used');

        // Update dots
        const idx = toolsUsed - 1;
        if (dots[idx]) dots[idx].classList.add('filled');
        toolsUsedCount.textContent = String(toolsUsed);

        // Unlock verdicts after 2 tools
        if (toolsUsed >= 2) {
          verdictVerified.disabled = false;
          verdictFalse.disabled    = false;
          verdictHint.textContent  = 'You have enough evidence. Make your verdict!';
        }
      }
    });
  });

  // ── Verdict buttons ───────────────────────────────────────────
  verdictVerified.addEventListener('click', () => handleVerdict('verified'));
  verdictFalse.addEventListener('click',    () => handleVerdict('misinformation'));

  function handleVerdict(choice) {
    if (!currentMG) return;
    const correct = choice === currentMG.correct_verdict;
    const trust   = correct ? currentMG.trustReward : currentMG.trustPenalty;
    const badge   = correct ? currentMG.badge_on_correct : null;

    close();
    if (onComplete) onComplete(correct, trust, badge);
  }

  // ── Close modal ───────────────────────────────────────────────
  function close() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
    currentMG  = null;
    onComplete = null;
  }

  // Close on backdrop click
  modal.addEventListener('click', e => {
    if (e.target === modal) close();
  });

  return { open, close };
})();
