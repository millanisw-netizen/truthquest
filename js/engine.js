/* ═══════════════════════════════════════════════════════════════
   engine.js — Core game logic & narrative engine
   TruthQuest | UNESCO Youth Hackathon 2026
═══════════════════════════════════════════════════════════════ */

const Game = (() => {
  // ── State ──────────────────────────────────────────────────────
  const state = {
    trust:       65,
    sceneId:     null,
    chapter:     1,
    badgesEarned: [],
    evidenceLog: [],
    storyData:   null
  };

  // ── Scene lookup map ──────────────────────────────────────────
  const sceneMap = {};

  // ── DOM refs ──────────────────────────────────────────────────
  const screens = {
    intro:  document.getElementById('intro-screen'),
    game:   document.getElementById('game-screen'),
    end:    document.getElementById('end-screen')
  };

  const el = {
    chapterNum:    document.getElementById('chapter-num'),
    chapterTitle:  document.getElementById('chapter-title'),
    speakerAvatar: document.getElementById('speaker-avatar'),
    speakerName:   document.getElementById('speaker-name'),
    speakerRole:   document.getElementById('speaker-role'),
    dialogueText:  document.getElementById('dialogue-text'),
    typingIndicator: document.getElementById('typing-indicator'),
    feedbackBox:   document.getElementById('feedback-box'),
    feedbackIcon:  document.getElementById('feedback-icon'),
    feedbackText:  document.getElementById('feedback-text'),
    choicesGrid:   document.getElementById('choices-grid'),
    evidenceGrid:  document.getElementById('evidence-grid'),
    evidenceEmpty: document.getElementById('evidence-empty'),
    btnBegin:      document.getElementById('btn-begin'),
    btnPlayAgain:  document.getElementById('btn-play-again'),
    introTypewriter: document.getElementById('intro-typewriter')
  };

  // ── Speaker roles ─────────────────────────────────────────────
  const ROLES = {
    'Editor Maya':       'Veridis Tribune',
    'Tech Analyst Jordan': 'Digital Forensics',
    'Colleague Sam':     'Investigative Reporter',
    'Citizen Rania':     'Veridis Resident',
    'Mayor Chen':        'Mayor of Veridis',
    'Unknown Caller':    'Anonymous Source',
    'Social Media Wave': 'Public Opinion',
    'You':               'Chief Journalist',
    'Veridis':           'The City'
  };

  // ── Load story data ───────────────────────────────────────────
  // Tries fetch first (works on a server), falls back to inline data
  // so the game works when opened as a local file:// too.
  async function loadStory() {
    let data = null;

    // Try fetch (works on localhost / any web server)
    try {
      const res = await fetch('data/story.json');
      if (res.ok) data = await res.json();
    } catch (e) { /* file:// protocol blocks fetch — use inline fallback */ }

    // Inline fallback — always available, no server needed
    if (!data) data = STORY_FALLBACK;

    state.storyData = data;

    // Build scene lookup
    data.chapters.forEach(ch => {
      ch.scenes.forEach(sc => {
        sceneMap[sc.id] = { ...sc, chapterId: ch.id, chapterTitle: ch.title, chapterIntro: ch.intro };
      });
    });
  }

  // ── Typewriter ────────────────────────────────────────────────
  function typeWriter(targetEl, text, speed = 22, cb) {
    targetEl.textContent = '';
    let i = 0;
    function step() {
      if (i < text.length) {
        targetEl.textContent += text[i++];
        setTimeout(step, speed);
      } else if (cb) cb();
    }
    step();
  }

  // ── Intro typewriter ──────────────────────────────────────────
  const INTRO_LINES = [
    'You are the last honest journalist in Veridis City.',
    'A disinformation storm is sweeping the streets.',
    'The truth is yours to find — if you\'re brave enough to look.'
  ];

  function runIntroTypewriter() {
    const target = el.introTypewriter;
    if (!target) return;
    let lineIdx = 0;

    function nextLine() {
      if (lineIdx >= INTRO_LINES.length) return;
      typeWriter(target, INTRO_LINES[lineIdx++], 28, () => {
        setTimeout(nextLine, 1600);
      });
    }
    nextLine();
  }

  // ── Show screen ───────────────────────────────────────────────
  function showScreen(name) {
    Object.values(screens).forEach(s => {
      if (s) s.classList.add('hidden');
    });
    if (screens[name]) screens[name].classList.remove('hidden');
  }

  // ── Chapter transition overlay ────────────────────────────────
  function showChapterTransition(chapter, cb) {
    const overlay = document.getElementById('chapter-transition');
    const numEl   = document.getElementById('transition-chapter-num');
    const titleEl = document.getElementById('transition-title');
    const introEl = document.getElementById('transition-intro');

    // If any element is missing, skip the transition and go straight to cb
    if (!overlay || !numEl || !titleEl || !introEl) {
      if (cb) cb();
      return;
    }

    numEl.textContent   = `Chapter ${chapter.id}`;
    titleEl.textContent = chapter.title;
    introEl.textContent = chapter.intro;

    // Make sure game screen is visible before showing transition
    showScreen('game');

    overlay.classList.remove('hidden');
    setTimeout(() => {
      overlay.classList.add('hidden');
      if (cb) cb();
    }, 3200);
  }

  // ── Update trust ──────────────────────────────────────────────
  function changeTrust(delta) {
    state.trust = Math.max(0, Math.min(100, state.trust + delta));
    TrustUI.update(state.trust);
    if (typeof CityRenderer !== 'undefined') CityRenderer.setTrust(state.trust);

    if (delta > 0) {
      Toast.show('📈', `City trust +${delta}`, 'good', 3000);
      if (window.SFX) window.SFX.good();
    } else if (delta < 0) {
      Toast.show('📉', `City trust ${delta}`, 'bad', 3000);
      if (window.SFX) window.SFX.bad();
    }
  }

  // ── Add badge ──────────────────────────────────────────────────
  function awardBadge(badgeId) {
    if (!badgeId) return;
    if (state.badgesEarned.includes(badgeId)) return;
    const def = state.storyData.badges[badgeId];
    if (!def) return;

    state.badgesEarned.push(badgeId);
    BadgeUI.add(badgeId, def);
    Toast.show(def.icon, `Badge earned: <strong>${def.name}</strong>`, 'badge', 4500);
    if (window.SFX) window.SFX.badge();
  }

  // ── Add evidence ───────────────────────────────────────────────
  const EVIDENCE_MAP = {
    'source_sleuth':        { icon: '🕵️', label: 'Fake Account\nExposed' },
    'deepfake_detector':    { icon: '🤖', label: 'Deepfake\nAudio' },
    'document_authenticator': { icon: '📄', label: 'Authentic\nMemo' },
    'digital_detective':    { icon: '🔎', label: 'Digital\nTrail' },
    'critical_thinker':     { icon: '🧠', label: 'Source\nVetted' }
  };

  function addEvidence(badgeId, sceneId) {
    const def = EVIDENCE_MAP[badgeId] || EVIDENCE_MAP['critical_thinker'];
    const item = { icon: def.icon, label: def.label, scene: sceneId };
    state.evidenceLog.push(item);
    renderEvidence();
  }

  function renderEvidence() {
    const grid  = el.evidenceGrid;
    const empty = el.evidenceEmpty;
    if (!grid) return;

    if (state.evidenceLog.length === 0) {
      if (empty) empty.style.display = '';
      return;
    }

    if (empty) empty.style.display = 'none';

    // Only add the latest item (avoid re-rendering all)
    const item = state.evidenceLog[state.evidenceLog.length - 1];
    const div  = document.createElement('div');
    div.className = 'evidence-item';
    div.setAttribute('role', 'listitem');
    div.innerHTML = `<span class="evidence-icon" aria-hidden="true">${item.icon}</span>
                     <span class="evidence-label">${item.label}</span>`;
    grid.appendChild(div);
  }

  // ── Scene progress bar ────────────────────────────────────────
  function updateSceneProgress(scene) {
    const fill  = document.getElementById('scene-progress-fill');
    const label = document.getElementById('scene-progress-label');
    if (!fill || !state.storyData) return;

    // Count total scenes and current index
    let totalScenes = 0, currentIndex = 0;
    state.storyData.chapters.forEach(ch => {
      ch.scenes.forEach(sc => {
        totalScenes++;
        if (sc.id === scene.id) currentIndex = totalScenes;
      });
    });

    const pct = Math.round((currentIndex / totalScenes) * 100);
    fill.style.width = pct + '%';
    if (label) label.textContent = `Ch.${scene.chapterId} · Scene ${currentIndex}/${totalScenes}`;
  }

  // ── Render scene ──────────────────────────────────────────────
  function renderScene(sceneId) {
    const scene = sceneMap[sceneId];
    if (!scene) { console.error('Scene not found:', sceneId); return; }

    state.sceneId = sceneId;

    // Update scene progress bar
    updateSceneProgress(scene);

    // Chapter header
    const chapterDef = state.storyData.chapters.find(c => c.id === scene.chapterId);
    if (el.chapterNum)   el.chapterNum.textContent   = `Chapter ${scene.chapterId}`;
    if (el.chapterTitle) el.chapterTitle.textContent = chapterDef ? chapterDef.title : '';

    // Speaker
    if (el.speakerAvatar) el.speakerAvatar.textContent = scene.avatar || '🎙️';
    if (el.speakerName)   el.speakerName.textContent   = scene.speaker || '';
    if (el.speakerRole)   el.speakerRole.textContent   = ROLES[scene.speaker] || 'Veridis Tribune';

    // Hide feedback
    if (el.feedbackBox) {
      el.feedbackBox.classList.add('hidden');
      el.feedbackBox.className = 'feedback-box hidden';
    }

    // Typing animation → text
    if (el.typingIndicator) el.typingIndicator.style.display = 'flex';
    if (el.dialogueText)    el.dialogueText.textContent = '';
    if (el.choicesGrid)     el.choicesGrid.innerHTML = '';

    setTimeout(() => {
      if (el.typingIndicator) el.typingIndicator.style.display = 'none';
      if (el.dialogueText) {
        typeWriter(el.dialogueText, scene.text, 18, () => {
          // If scene has a minigame, open it
          if (scene.minigame) {
            setTimeout(() => {
              Verifier.open(scene.minigame, (correct, trustDelta, badge) => {
                handleMinigameResult(scene, correct, trustDelta, badge);
              });
            }, 500);
          } else {
            renderChoices(scene.choices);
          }
        });
      }
    }, 900);
  }

  // ── Minigame result ───────────────────────────────────────────
  function handleMinigameResult(scene, correct, trustDelta, badge) {
    changeTrust(trustDelta);
    if (badge) {
      awardBadge(badge);
      addEvidence(badge, scene.id);
    }

    const feedbackMsg = correct
      ? '✅ Correct verdict! You identified the content accurately using the verification tools.'
      : '⚠️ Wrong verdict. Careful analysis of the tools would have revealed the truth. Stay sharp!';

    showFeedback(correct ? 'good' : 'bad', correct ? '✅' : '⚠️', feedbackMsg);

    // Figure out where to go next:
    // 1. minigame.choices[0].next  (set in story-data.js fallback)
    // 2. scene.choices[0].next     (set in story.json)
    const nextId =
      (scene.minigame && scene.minigame.choices && scene.minigame.choices[0]?.next) ||
      (scene.choices  && scene.choices[0]?.next) ||
      null;

    setTimeout(() => {
      if (nextId && nextId !== '') {
        advance(nextId, null);
      } else {
        // Shouldn't happen but render empty choices as safe fallback
        renderChoices([]);
      }
    }, 2200);
  }

  // ── Show feedback ─────────────────────────────────────────────
  function showFeedback(type, icon, text) {
    if (!el.feedbackBox) return;
    el.feedbackBox.className = `feedback-box feedback-${type}`;
    el.feedbackIcon.textContent = icon;
    el.feedbackText.textContent = text;
    el.feedbackBox.classList.remove('hidden');
  }

  // ── Render choices ────────────────────────────────────────────
  function renderChoices(choices) {
    if (!el.choicesGrid) return;
    el.choicesGrid.innerHTML = '';
    if (!choices || choices.length === 0) return;

    choices.forEach((choice, i) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = choice.text;
      btn.setAttribute('aria-label', `Choice ${i + 1}: ${choice.text}`);
      btn.setAttribute('data-key', String(i + 1));
      btn.addEventListener('click', () => onChoiceClick(choice, choices));
      el.choicesGrid.appendChild(btn);
    });
  }

  // ── Choice click ──────────────────────────────────────────────
  function onChoiceClick(choice, allChoices) {
    // Disable all choices
    el.choicesGrid.querySelectorAll('.choice-btn').forEach(b => b.disabled = true);

    // Apply trust delta
    if (choice.trustDelta) changeTrust(choice.trustDelta);

    // Award badge
    if (choice.badge) {
      awardBadge(choice.badge);
      addEvidence(choice.badge, state.sceneId);
    }

    // Show feedback only if there is content to show
    const hasFeedback = choice.feedback && choice.feedback.trim() !== '';
    if (hasFeedback) {
      const type = choice.trustDelta > 0 ? 'good' : choice.trustDelta < 0 ? 'bad' : 'neutral';
      const icon = choice.trustDelta > 0 ? '✅' : choice.trustDelta < 0 ? '❌' : '💡';
      showFeedback(type, icon, choice.feedback);
    }

    // If no feedback and no trust change (pure transition choice), advance immediately
    // Otherwise wait 2200ms so the player can read the feedback
    const delay = hasFeedback ? 2200 : 400;
    setTimeout(() => advance(choice.next, choice), delay);
  }

  // ── Advance ───────────────────────────────────────────────────
  function advance(nextId, choice) {
    if (nextId === 'END') {
      showEndScreen();
      return;
    }

    const nextScene = sceneMap[nextId];
    if (!nextScene) { console.error('No scene:', nextId); return; }

    // Chapter transition?
    if (nextScene.chapterId !== sceneMap[state.sceneId]?.chapterId) {
      const chapter = state.storyData.chapters.find(c => c.id === nextScene.chapterId);
      if (chapter) {
        showChapterTransition(chapter, () => {
          if (window.SFX) window.SFX.chapter();
          renderScene(nextId);
        });
        return;
      }
    }

    renderScene(nextId);
  }

  // ── End screen ────────────────────────────────────────────────
  function showEndScreen() {
    showScreen('end');

    // Score = trust capped 0–100
    const score = Math.round(Math.max(0, Math.min(100, state.trust)));

    // Animate score ring
    const arc    = document.getElementById('score-arc');
    const numEl  = document.getElementById('score-number');
    const gradeEl = document.getElementById('score-grade');
    const shareText = document.getElementById('share-text');
    const endIcon   = document.getElementById('end-city-icon');

    if (arc) {
      const circumference = 314;
      const offset = circumference - (score / 100) * circumference;
      setTimeout(() => { arc.style.transition = 'stroke-dashoffset 1.5s ease'; arc.style.strokeDashoffset = String(offset); }, 200);
    }

    if (numEl) {
      let current = 0;
      const interval = setInterval(() => {
        current = Math.min(current + 2, score);
        numEl.textContent = String(current);
        if (current >= score) clearInterval(interval);
      }, 30);
    }

    // Grade
    let grade, gradeColor, cityEmoji;
    if (score >= 85)      { grade = 'Truth Champion';    gradeColor = '#00ff88'; cityEmoji = '🌟'; }
    else if (score >= 70) { grade = 'Reliable Reporter'; gradeColor = '#00d4ff'; cityEmoji = '🏙️'; }
    else if (score >= 50) { grade = 'Cautious Journalist'; gradeColor = '#ffd700'; cityEmoji = '⚠️'; }
    else if (score >= 30) { grade = 'Needs More Training'; gradeColor = '#ff8800'; cityEmoji = '😰'; }
    else                  { grade = 'Disinformation Won'; gradeColor = '#ff4444'; cityEmoji = '💔'; }

    if (gradeEl) { gradeEl.textContent = grade; gradeEl.style.color = gradeColor; }
    if (endIcon) endIcon.textContent = cityEmoji;
    if (shareText) shareText.textContent = `I scored ${score}/100 in TruthQuest — Can you save Veridis? #TruthQuest #UNESCO2026 #MIL`;

    // Save to leaderboard (localStorage)
    try {
      const prev = JSON.parse(localStorage.getItem('tq_scores') || '[]');
      prev.push({
        id:      'you_' + Date.now(),
        name:    'You',
        avatar:  '🎙️',
        country: '🌍 Your Country',
        score:   score,
        badges:  state.badgesEarned,
        ts:      Date.now(),
        isYou:   true
      });
      localStorage.setItem('tq_scores', JSON.stringify(prev.slice(-50)));
    } catch (e) { /* storage unavailable */ }

    // Also post to leaderboard page if it's open
    try { window.opener && window.opener.postMessage({ type: 'TQ_SCORE', score, badges: state.badgesEarned }, '*'); } catch (e) {}

    // Sync to platform.js shared state
    try {
      if (typeof TQ !== 'undefined') {
        TQ.syncGameScore(score, state.badgesEarned);
      }
      // Also fire a custom event for any listeners
      window.dispatchEvent(new CustomEvent('tq:gamecomplete', { detail: { score, badges: state.badgesEarned } }));
    } catch (e) { /* platform not loaded on this page */ }

    // Badges
    const badgesGrid = document.getElementById('badges-earned-grid');
    if (badgesGrid) {
      badgesGrid.innerHTML = '';
      state.badgesEarned.forEach((id, i) => {
        const def = state.storyData.badges[id];
        if (!def) return;
        const card = document.createElement('div');
        card.className = 'badge-card';
        card.setAttribute('role', 'listitem');
        card.style.animationDelay = `${i * 0.12}s`;
        card.innerHTML = `
          <span class="badge-icon" aria-hidden="true">${def.icon}</span>
          <div>
            <div class="badge-info-name">${def.name}</div>
            <div class="badge-info-desc">${def.description}</div>
          </div>
        `;
        badgesGrid.appendChild(card);
      });

      if (state.badgesEarned.length === 0) {
        badgesGrid.innerHTML = '<p style="color:var(--text-muted);font-size:0.85rem">No badges earned this run. Try again!</p>';
      }
    }
  }

  // ── Init ──────────────────────────────────────────────────────
  async function init() {
    // Init city
    if (typeof CityRenderer !== 'undefined') CityRenderer.init();

    // Load story
    try {
      await loadStory();
    } catch (e) {
      console.error('Failed to load story.json:', e);
      return;
    }

    // Intro typewriter
    runIntroTypewriter();

    // Initial trust
    TrustUI.update(state.trust);
    if (typeof CityRenderer !== 'undefined') CityRenderer.setTrust(state.trust);

    // Begin button
    if (el.btnBegin) {
      el.btnBegin.addEventListener('click', () => {
        // Switch city bar from quotes → canvas
        const quotesBanner = document.getElementById('quotes-banner');
        const cityCanvas   = document.getElementById('city-canvas');
        const cityLabel    = document.querySelector('.city-label');
        if (quotesBanner) quotesBanner.style.display = 'none';
        if (cityCanvas)   cityCanvas.style.display   = 'block';
        if (cityLabel)    cityLabel.style.display     = 'flex';
        if (window._quoteBannerTimer) clearInterval(window._quoteBannerTimer);

        const chapter1 = state.storyData.chapters[0];
        showChapterTransition(chapter1, () => {
          showScreen('game');
          renderScene('1-1');
        });
      });
    }

    // Play again
    if (el.btnPlayAgain) {
      el.btnPlayAgain.addEventListener('click', () => {
        state.trust        = 65;
        state.sceneId      = null;
        state.chapter      = 1;
        state.badgesEarned = [];
        state.evidenceLog  = [];

        // Rebuild evidence grid cleanly
        if (el.evidenceGrid) {
          el.evidenceGrid.innerHTML = '';
          const emptyDiv = document.createElement('div');
          emptyDiv.className = 'evidence-empty';
          emptyDiv.id = 'evidence-empty';
          emptyDiv.setAttribute('aria-label', 'No evidence collected yet');
          emptyDiv.innerHTML = '<span aria-hidden="true">🔍</span><p>No evidence collected yet</p>';
          el.evidenceGrid.appendChild(emptyDiv);
          el.evidenceEmpty = emptyDiv;
        }

        // Clear badges mini-bar
        const mini = document.getElementById('badges-mini');
        if (mini) mini.innerHTML = '';

        TrustUI.update(65);
        if (typeof CityRenderer !== 'undefined') CityRenderer.setTrust(65);

        // Restore quotes banner, hide city canvas
        const quotesBanner = document.getElementById('quotes-banner');
        const cityCanvas   = document.getElementById('city-canvas');
        const cityLabel    = document.querySelector('.city-label');
        if (quotesBanner) quotesBanner.style.display = '';
        if (cityCanvas)   cityCanvas.style.display   = 'none';
        if (cityLabel)    cityLabel.style.display     = 'none';

        showScreen('intro');
        runIntroTypewriter();
      });
    }
  }

  return { init };
})();

// ── Bootstrap ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => Game.init());
