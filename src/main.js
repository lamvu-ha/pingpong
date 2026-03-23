import { generateReadingAPI, fetchWordData } from './services/api.js';
import './styles/main.css';
import { GRAMMAR_QUESTIONS, VOCABULARY, GRAMMAR_LIBRARY } from './utils/data.js';

window.GRAMMAR_QUESTIONS = GRAMMAR_QUESTIONS;
window.VOCABULARY = VOCABULARY;
window.GRAMMAR_LIBRARY = GRAMMAR_LIBRARY;

/**
 * Grammar Ping Pong Lab — script.js
 * Full interactive English learning app
 * Built for Vietnamese TOEIC/IELTS learners
 */

// ============================================================
//  QUESTION BANK — Templates for dynamic generation
// ============================================================

// ============================================================
//  VOCABULARY BANK
// ============================================================

// ============================================================
//  GRAMMAR LIBRARY DATA
// ============================================================

// ============================================================
//  APP STATE
// ============================================================

let state = {
  currentLevel: 1,
  currentMode: 'pingpong', // pingpong | error | builder
  currentQuestion: null,
  currentTopic: null,
  questionIndex: 0,
  sessionScore: 0,
  totalQuestions: 0,
  totalCorrect: 0,
  xp: 0,
  streak: 0,
  bestStreak: 0,
  dailyCompleted: 0,
  dailyGoal: 5,
  topicProgress: {},
  vocabLearned: [],
  isDailyChallenge: false,
  // Sentence builder state
  builderWords: [],
  builtWords: [],
  builderCorrect: '',
  // Error detection state
  errorWordIndex: -1,
  // Flashcard state
  fcIndex: 0,
  filteredVocab: [...VOCABULARY],
  // Grammar modal
  modalTopic: null,
};

// ============================================================
//  LOAD & SAVE PROGRESS
// ============================================================

function loadProgress() {
  try {
    const saved = localStorage.getItem('gpplab_progress');
    if (saved) {
      const data = JSON.parse(saved);
      state.totalQuestions = data.totalQuestions || 0;
      state.totalCorrect = data.totalCorrect || 0;
      state.xp = data.xp || 0;
      state.streak = data.streak || 0;
      state.bestStreak = data.bestStreak || 0;
      state.dailyCompleted = data.dailyCompleted || 0;
      state.topicProgress = data.topicProgress || {};
      state.vocabLearned = data.vocabLearned || [];
    }
  } catch(e) { /* ignore */ }
  updateAllUI();
}

function saveProgress() {
  try {
    localStorage.setItem('gpplab_progress', JSON.stringify({
      totalQuestions: state.totalQuestions,
      totalCorrect: state.totalCorrect,
      xp: state.xp,
      streak: state.streak,
      bestStreak: state.bestStreak,
      dailyCompleted: state.dailyCompleted,
      topicProgress: state.topicProgress,
      vocabLearned: state.vocabLearned,
    }));
  } catch(e) { /* ignore */ }
}

function resetProgress() {
  if (!confirm('Are you sure you want to reset ALL progress? This cannot be undone.')) return;
  localStorage.removeItem('gpplab_progress');
  state.totalQuestions = 0; state.totalCorrect = 0; state.xp = 0;
  state.streak = 0; state.bestStreak = 0; state.dailyCompleted = 0;
  state.topicProgress = {}; state.vocabLearned = [];
  updateAllUI();
  showToast('Progress reset! Start fresh! 💪', 'success');
}

// ============================================================
//  PAGE NAVIGATION
// ============================================================

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const page = document.getElementById('page-' + pageId);
  if (page) { page.classList.add('active'); }
  const navLink = document.querySelector(`[data-page="${pageId}"]`);
  if (navLink) navLink.classList.add('active');
  // Close mobile nav
  document.getElementById('nav').classList.remove('open');
  // Page-specific init
  if (pageId === 'grammar-lib') renderGrammarLib();
  if (pageId === 'vocabulary') renderVocabGrid(state.filteredVocab);
  if (pageId === 'progress') renderProgressPage();
}

// ============================================================
//  QUESTION ENGINE
// ============================================================

function getTopicsByLevel(level) {
  return Object.keys(GRAMMAR_QUESTIONS).filter(k => GRAMMAR_QUESTIONS[k].level <= level);
}

function getRandomTopic(level) {
  const topics = getTopicsByLevel(level);
  return topics[Math.floor(Math.random() * topics.length)];
}

function getRandomQuestion(topic) {
  const qs = GRAMMAR_QUESTIONS[topic].questions;
  return qs[Math.floor(Math.random() * qs.length)];
}

function startNewQuestion() {
  // Reset UI
  document.getElementById('explanationPanel').classList.add('hidden');
  document.getElementById('userAnswer').value = '';
  document.getElementById('userAnswer').className = 'answer-input';
  document.getElementById('inputArea').style.display = '';
  document.getElementById('errorDetectArea').style.display = 'none';
  document.getElementById('sentenceBuilderArea').style.display = 'none';

  const topic = state.isDailyChallenge && state.currentTopic ? state.currentTopic : getRandomTopic(state.currentLevel);
  state.currentTopic = topic;
  const q = getRandomQuestion(topic);
  state.currentQuestion = q;
  state.questionIndex++;

  // Update card
  document.getElementById('topicBadge').textContent = topic;
  document.getElementById('structureText').textContent = GRAMMAR_QUESTIONS[topic].structure;

  if (state.currentMode === 'pingpong') {
    document.getElementById('modeLabel').textContent = '❌ Incorrect Sentence:';
    document.getElementById('incorrectSentence').textContent = q.wrong;
    document.getElementById('inputArea').style.display = '';
    document.getElementById('errorDetectArea').style.display = 'none';
    document.getElementById('sentenceBuilderArea').style.display = 'none';
    document.getElementById('userAnswer').focus();
  } else if (state.currentMode === 'error') {
    setupErrorDetection(q);
  } else if (state.currentMode === 'builder') {
    setupSentenceBuilder(q);
  }

  updateScoreBar();
}

// ============================================================
//  PING PONG MODE
// ============================================================

function checkAnswer() {
  const userInput = document.getElementById('userAnswer').value.trim();
  if (!userInput) { showToast('Please type your answer first!', ''); return; }
  const correct = state.currentQuestion.correct;
  const isCorrect = normalizeAnswer(userInput) === normalizeAnswer(correct);
  showExplanation(isCorrect);
}

function normalizeAnswer(str) {
  return str.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
}

function showHint() {
  const correct = state.currentQuestion.correct;
  const words = correct.split(' ');
  const hint = words.map((w, i) => i < 2 ? w : '_'.repeat(w.length)).join(' ');
  showToast('Hint: ' + hint, 'info');
}

function skipQuestion() {
  state.streak = 0;
  updateHeaderStreak();
  showToast('Skipped! Next question...', '');
  setTimeout(startNewQuestion, 600);
}

// ============================================================
//  ERROR DETECTION MODE
// ============================================================

function setupErrorDetection(q) {
  document.getElementById('modeLabel').innerHTML = '<i data-lucide="search"></i> Find the incorrect word:';
  document.getElementById('incorrectSentence').textContent = '';
  document.getElementById('inputArea').style.display = 'none';
  document.getElementById('errorDetectArea').style.display = '';
  document.getElementById('sentenceBuilderArea').style.display = 'none';

  const words = q.wrong.split(' ');
  // Find which word is wrong (compare with correct)
  const correctWords = q.correct.split(' ');
  let errorIdx = -1;
  for (let i = 0; i < words.length; i++) {
    if (normalizeAnswer(words[i]) !== normalizeAnswer(correctWords[i] || '')) { errorIdx = i; break; }
  }
  // fallback: mark last different word
  if (errorIdx === -1) errorIdx = words.length - 1;
  state.errorWordIndex = errorIdx;

  const container = document.getElementById('wordButtons');
  container.innerHTML = '';
  words.forEach((word, i) => {
    const btn = document.createElement('button');
    btn.className = 'word-btn';
    btn.textContent = word;
    btn.onclick = () => selectErrorWord(i, btn, errorIdx);
    container.appendChild(btn);
  });
}

function selectErrorWord(i, btn, correctIdx) {
  if (document.getElementById('explanationPanel').classList.contains('hidden') === false) return;
  document.querySelectorAll('.word-btn').forEach(b => b.classList.remove('selected-error'));
  btn.classList.add('selected-error');
  const isCorrect = i === correctIdx;
  if (!isCorrect) {
    // Show correct
    document.querySelectorAll('.word-btn')[correctIdx].classList.add('correct-word');
  }
  showExplanation(isCorrect);
}

// ============================================================
//  SENTENCE BUILDER MODE
// ============================================================

function setupSentenceBuilder(q) {
  document.getElementById('modeLabel').innerHTML = '<i data-lucide="puzzle"></i> Arrange the words:';
  document.getElementById('incorrectSentence').textContent = '';
  document.getElementById('inputArea').style.display = 'none';
  document.getElementById('errorDetectArea').style.display = 'none';
  document.getElementById('sentenceBuilderArea').style.display = '';

  const words = q.correct.replace(/[?.!]/g, '').split(' ');
  // Shuffle
  state.builderWords = [...words].sort(() => Math.random() - 0.5);
  state.builtWords = [];
  state.builderCorrect = q.correct.replace(/[?.!]/g, '').toLowerCase();

  renderWordBank();
  renderBuiltSentence();
}

function renderWordBank() {
  const bank = document.getElementById('wordBank');
  bank.innerHTML = '';
  state.builderWords.forEach((word, i) => {
    const btn = document.createElement('button');
    btn.className = 'bank-word' + (state.builtWords.includes(i) ? ' used' : '');
    btn.textContent = word;
    btn.onclick = () => addWordToSentence(i, word, btn);
    bank.appendChild(btn);
  });
}

function addWordToSentence(idx, word, btn) {
  if (state.builtWords.includes(idx)) return;
  state.builtWords.push(idx);
  renderWordBank();
  renderBuiltSentence();
}

function renderBuiltSentence() {
  const built = document.getElementById('builtSentence');
  if (state.builtWords.length === 0) {
    built.innerHTML = '<span class="built-placeholder">Click words above to build the sentence</span>';
    return;
  }
  built.innerHTML = '';
  state.builtWords.forEach((idx, pos) => {
    const span = document.createElement('span');
    span.className = 'built-word';
    span.textContent = state.builderWords[idx];
    span.onclick = () => removeWordFromSentence(pos);
    built.appendChild(span);
  });
}

function removeWordFromSentence(pos) {
  state.builtWords.splice(pos, 1);
  renderWordBank();
  renderBuiltSentence();
}

function clearBuilder() {
  state.builtWords = [];
  renderWordBank();
  renderBuiltSentence();
}

function checkBuilder() {
  const built = state.builtWords.map(i => state.builderWords[i]).join(' ').toLowerCase();
  const isCorrect = built === state.builderCorrect;
  showExplanation(isCorrect);
}

// ============================================================
//  EXPLANATION PANEL (shared)
// ============================================================

function showExplanation(isCorrect) {
  const panel = document.getElementById('explanationPanel');
  const header = document.getElementById('expHeader');
  const q = state.currentQuestion;

  // Update input styling for ping pong mode
  if (state.currentMode === 'pingpong') {
    const input = document.getElementById('userAnswer');
    input.className = 'answer-input ' + (isCorrect ? 'correct' : 'wrong');
  }

  // Header
  header.className = 'exp-header ' + (isCorrect ? 'correct-bg' : 'wrong-bg');
  document.getElementById('expResultIcon').innerHTML = isCorrect ? '<i data-lucide="party-popper"></i>' : '<i data-lucide="frown"></i>';
  document.getElementById('expResultText').textContent = isCorrect ? 'Correct! Well done!' : 'Not quite — check the rule below!';

  // Content
  document.getElementById('expCorrect').textContent = q.correct;
  document.getElementById('expExplanation').textContent = q.explanation;
  document.getElementById('expStructure').textContent = GRAMMAR_QUESTIONS[state.currentTopic].structure;
  panel.classList.remove('hidden');

  // Scoring
  state.totalQuestions++;
  if (isCorrect) {
    state.totalCorrect++;
    state.sessionScore++;
    const xpGain = state.currentLevel * 10;
    state.xp += xpGain;
    state.streak++;
    if (state.streak > state.bestStreak) state.bestStreak = state.streak;
    if (state.isDailyChallenge) {
      state.dailyCompleted++;
      updateDailyRing();
    }
    // Update topic progress
    if (!state.topicProgress[state.currentTopic]) state.topicProgress[state.currentTopic] = { total: 0, correct: 0 };
    state.topicProgress[state.currentTopic].total++;
    state.topicProgress[state.currentTopic].correct++;
    showToast(`+${xpGain} XP! Streak: ${state.streak}`, 'success');
    if (state.streak % 5 === 0) spawnConfetti();
  } else {
    state.streak = 0;
    if (!state.topicProgress[state.currentTopic]) state.topicProgress[state.currentTopic] = { total: 0, correct: 0 };
    state.topicProgress[state.currentTopic].total++;
    showToast('Keep going! Review the rule', 'error');
  }

  updateAllUI();
  saveProgress();
  lucide.createIcons();

  if (state.isDailyChallenge && state.dailyCompleted >= state.dailyGoal) {
    setTimeout(() => {
      showToast('Daily Challenge Complete! Amazing!', 'success');
      spawnConfetti();
      state.isDailyChallenge = false;
    }, 800);
  }
}

function nextQuestion() {
  document.getElementById('explanationPanel').classList.add('hidden');
  if (state.questionIndex >= 10) {
    showEndOfSession();
    return;
  }
  startNewQuestion();
}

function showEndOfSession() {
  document.getElementById('explanationPanel').classList.add('hidden');
  document.getElementById('questionCard').innerHTML = `
    <div style="text-align:center; padding:20px;">
      <div style="font-size:3rem; margin-bottom:12px; color:var(--accent);"><i data-lucide="award" style="width:64px; height:64px;"></i></div>
      <h2 style="font-weight:900; margin-bottom:8px;">Session Complete!</h2>
      <p style="color:var(--text2); margin-bottom:20px;">Score: ${state.sessionScore}/10 — XP earned this session</p>
      <button class="btn-primary btn-lg" onclick="restartSession()"><i data-lucide="refresh-cw"></i> New Session</button>
    </div>
  `;
  lucide.createIcons();
  spawnConfetti();
}

function restartSession() {
  state.sessionScore = 0;
  state.questionIndex = 0;
  document.getElementById('questionCard').innerHTML = `
    <div class="topic-badge" id="topicBadge">Present Simple</div>
    <div class="q-label" id="modeLabel"><i data-lucide="x-circle"></i> Incorrect Sentence:</div>
    <div class="incorrect-sentence" id="incorrectSentence">Loading question...</div>
    <div class="structure-box" id="structureBox">
      <span class="structure-label"><i data-lucide="code"></i> Structure:</span>
      <span class="structure-text" id="structureText"></span>
    </div>
  `;
  lucide.createIcons();
  startNewQuestion();
}

// ============================================================
//  MODES & LEVELS
// ============================================================

function setLevel(level, btn) {
  state.currentLevel = level;
  document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  state.questionIndex = 0;
  state.sessionScore = 0;
  startNewQuestion();
}

function setPracticeMode(mode, btn) {
  state.currentMode = mode;
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  startNewQuestion();
}

function startMode(mode) {
  showPage('practice');
  state.currentMode = mode === 'error-detection' ? 'error' : 'builder';
  document.querySelectorAll('.mode-btn').forEach(b => {
    b.classList.remove('active');
    if (b.dataset.mode === state.currentMode) b.classList.add('active');
  });
  startNewQuestion();
}

// ============================================================
//  DAILY CHALLENGE
// ============================================================

function startDailyChallenge() {
  state.isDailyChallenge = true;
  state.dailyCompleted = 0;
  state.currentTopic = getRandomTopic(state.currentLevel);
  showPage('practice');
  startNewQuestion();
  showToast('Daily Challenge started! Fix 5 in a row!', 'info');
}

function updateDailyRing() {
  const ring = document.getElementById('dailyRing');
  const text = document.getElementById('dailyProgress');
  if (!ring) return;
  const pct = Math.min(state.dailyCompleted / state.dailyGoal, 1);
  const circumference = 251;
  ring.style.strokeDashoffset = circumference * (1 - pct);
  if (text) text.textContent = `${state.dailyCompleted}/${state.dailyGoal}`;
}

// ============================================================
//  VOCABULARY
// ============================================================

function renderVocabGrid(words) {
  const grid = document.getElementById('wordListMode');
  if (!grid) return;
  grid.innerHTML = '';
  words.forEach((word) => {
    const card = document.createElement('div');
    card.className = 'vocab-card';
    card.style.cursor = 'pointer';
    card.style.textAlign = 'center';
    card.style.padding = '30px 20px';
    card.innerHTML = `
      <div class="vc-word" style="font-size:1.5rem; margin-bottom:10px;">${word}</div>
      <div class="vc-hint" style="color:var(--text3);"><i data-lucide="zap" style="width:16px; margin-bottom:-3px;"></i> Click to learn</div>
    `;
    card.onclick = () => {
      // Find the index of this word and start flashcards from there
      state.fcIndex = state.filteredVocab.indexOf(word);
      if(state.fcIndex === -1) state.fcIndex = 0;
      startVocabFlashcard();
    };
    grid.appendChild(card);
  });
  lucide.createIcons();
}

function searchVocab(query) {
  const q = query.toLowerCase();
  state.filteredVocab = VOCABULARY.filter(w => w.toLowerCase().includes(q));
  renderVocabGrid(state.filteredVocab);
}

function markVocabLearned(word) {
  if (!state.vocabLearned.includes(word)) {
    state.vocabLearned.push(word);
    state.xp += 5;
    updateAllUI();
    saveProgress();
    showToast(`"${word}" added to learned! +5 XP`, 'success');
  }
}

function startVocabFlashcard() {
  state.fcIndex = 0;
  document.getElementById('flashcardMode').style.display = 'flex';
  document.getElementById('wordListMode').style.display = 'none';
  renderFlashcard();
}

function stopFlashcard() {
  document.getElementById('flashcardMode').style.display = 'none';
  document.getElementById('wordListMode').style.display = '';
  renderVocabGrid(state.filteredVocab);
}

async function renderFlashcard() {
  const vocab = state.filteredVocab;
  if (!vocab.length) return;
  const word = vocab[state.fcIndex];
  const fc = document.getElementById('flashcard');
  fc.classList.remove('flipped');
  
  document.getElementById('fcWord').innerHTML = word + ' <span class="spinner" style="display:inline-block; width:16px; height:16px; border-width:2px; margin-left:10px;"></span>';
  document.getElementById('fcCounter').textContent = `${state.fcIndex + 1}/${vocab.length}`;
  
  // Clear previous
  document.getElementById('fcMeaning').textContent = "Loading meaning...";
  document.getElementById('fcExample').textContent = "";
  document.getElementById('fcSynonyms').textContent = "";

  const data = await fetchWordData(word);
  
  document.getElementById('fcWord').textContent = word; // remove spinner
  
  if (data && data[0] && data[0].meanings.length > 0) {
    const mean = data[0].meanings[0];
    const def = mean.definitions[0];
    document.getElementById('fcMeaning').textContent = `[${mean.partOfSpeech}] ${def.definition}`;
    document.getElementById('fcExample').textContent = def.example ? `"${def.example}"` : '';
    document.getElementById('fcSynonyms').textContent = mean.synonyms && mean.synonyms.length ? '≈ ' + mean.synonyms.slice(0, 3).join(', ') : '';
  } else {
    document.getElementById('fcMeaning').textContent = "Meaning not found in Dictionary API.";
    document.getElementById('fcExample').textContent = "Try another word.";
  }
}

function flipCard() {
  document.getElementById('flashcard').classList.toggle('flipped');
  markVocabLearned(state.filteredVocab[state.fcIndex]);
}

function fcNext() {
  if (state.fcIndex < state.filteredVocab.length - 1) {
    state.fcIndex++;
    renderFlashcard();
  } else { showToast('You\'ve reached the last card!', 'success'); }
}

function fcPrev() {
  if (state.fcIndex > 0) { state.fcIndex--; renderFlashcard(); }
}

// ============================================================
//  GRAMMAR LIBRARY
// ============================================================

function renderGrammarLib() {
  const grid = document.getElementById('grammarGrid');
  if (!grid) return;
  grid.innerHTML = '';
  GRAMMAR_LIBRARY.forEach(topic => {
    const card = document.createElement('div');
    card.className = 'grammar-topic-card';
    const prog = state.topicProgress[topic.title];
    const pct = prog ? Math.round((prog.correct / prog.total) * 100) : 0;
    card.innerHTML = `
      <span class="gtc-level level-${topic.level}">Level ${topic.level}</span>
      <div class="gtc-title">${topic.title}</div>
      <div class="gtc-desc">${topic.desc}</div>
      <div class="gtc-footer">
        <span class="gtc-practice"><i data-lucide="book-open"></i> View & Practice</span>
        <span style="font-size:0.78rem; color:var(--text3);">${pct}% done</span>
      </div>
    `;
    card.onclick = () => openGrammarModal(topic);
    grid.appendChild(card);
  });
  lucide.createIcons();
}

function openGrammarModal(topic) {
  state.modalTopic = topic.title;
  const content = document.getElementById('modalContent');
  content.innerHTML = `
    <div class="modal-level"><span class="gtc-level level-${topic.level}">Level ${topic.level}</span></div>
    <h2>${topic.title}</h2>
    <div class="modal-structure"><i data-lucide="code" style="vertical-align:middle; width:16px; margin-right:4px;"></i> ${topic.structure}</div>
    <div class="modal-explanation">${topic.explanation}</div>
    <strong>Examples:</strong>
    <ul class="modal-examples">
      ${topic.examples.map(e => `<li><i data-lucide="check-circle-2" style="vertical-align:middle; width:14px; margin-right:4px; color:var(--accent2);"></i> ${e}</li>`).join('')}
    </ul>
  `;
  document.getElementById('grammarModal').classList.add('active');
  lucide.createIcons();
}

function closeGrammarModal(e) {
  if (!e || e.target === document.getElementById('grammarModal') || e.target.className === 'modal-close') {
    document.getElementById('grammarModal').classList.remove('active');
  }
}

function practiceGrammar() {
  closeGrammarModal();
  if (state.modalTopic && GRAMMAR_QUESTIONS[state.modalTopic]) {
    showPage('practice');
    state.currentMode = 'pingpong';
    document.querySelectorAll('.mode-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.mode === 'pingpong');
    });
    state.currentTopic = state.modalTopic;
    state.isDailyChallenge = false;
    startNewQuestion();
  }
}

// ============================================================
//  PROGRESS PAGE
// ============================================================

function renderProgressPage() {
  document.getElementById('statTotal').textContent = state.totalQuestions;
  document.getElementById('statCorrect').textContent = state.totalCorrect;
  document.getElementById('statXP').textContent = state.xp;
  document.getElementById('statStreak').textContent = state.bestStreak;
  document.getElementById('vocabLearned').textContent = state.vocabLearned.length;

  const pct = state.totalQuestions > 0 ? Math.round((state.totalCorrect / state.totalQuestions) * 100) : 0;
  document.getElementById('accuracyBar').style.width = pct + '%';
  document.getElementById('accuracyPct').textContent = pct + '%';

  // Topics
  const grid = document.getElementById('topicsGrid');
  grid.innerHTML = '';
  Object.keys(GRAMMAR_QUESTIONS).forEach(topic => {
    const prog = state.topicProgress[topic];
    const p = prog ? Math.round((prog.correct / prog.total) * 100) : 0;
    const div = document.createElement('div');
    div.className = 'topic-item';
    div.innerHTML = `
      <div class="topic-item-name">${topic}</div>
      <div class="topic-mini-bar"><div class="topic-mini-fill" style="width:${p}%"></div></div>
      <div class="topic-pct">${prog ? prog.correct + '/' + prog.total : '0/0'} (${p}%)</div>
    `;
    grid.appendChild(div);
  });
}

// ============================================================
//  UI UPDATES
// ============================================================

function updateAllUI() {
  // Header
  document.getElementById('xpCount').textContent = state.xp;
  document.getElementById('streakCount').textContent = state.streak;
  // Dashboard
  document.getElementById('dashTotal').textContent = state.totalQuestions;
  document.getElementById('dashCorrect').textContent = state.totalCorrect;
  document.getElementById('dashStreak').textContent = state.bestStreak;
  updateDailyRing();
}

function updateHeaderStreak() {
  document.getElementById('streakCount').textContent = state.streak;
}

function updateScoreBar() {
  document.getElementById('qNum').textContent = Math.min(state.questionIndex, 10);
  document.getElementById('scoreDisplay').textContent = state.sessionScore;
  document.getElementById('xpDisplay').textContent = state.xp;
  const pct = (Math.min(state.questionIndex - 1, 10) / 10) * 100;
  document.getElementById('progressFill').style.width = pct + '%';
}

// ============================================================
//  TOAST NOTIFICATION
// ============================================================

function showToast(msg, type) {
  const toast = document.getElementById('toast');
  toast.innerHTML = (type === 'success' ? '<i data-lucide="check-circle-2" style="vertical-align:middle; width:18px; margin-right:6px;"></i> ' :
                     type === 'error' ? '<i data-lucide="alert-circle" style="vertical-align:middle; width:18px; margin-right:6px;"></i> ' :
                     type === 'info' ? '<i data-lucide="info" style="vertical-align:middle; width:18px; margin-right:6px;"></i> ' : '') + msg;
  toast.className = 'toast show' + (type === 'success' ? ' success-toast' : type === 'error' ? ' error-toast' : type === 'info' ? ' info-toast' : '');
  lucide.createIcons();
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 2800);
}

// ============================================================
//  CONFETTI
// ============================================================

function spawnConfetti() {
  const wrap = document.getElementById('confettiWrap');
  const colors = ['#2563eb', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'];
  for (let i = 0; i < 60; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.cssText = `
      left: ${Math.random() * 100}%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${1.5 + Math.random() * 2}s;
      animation-delay: ${Math.random() * 0.5}s;
      transform: rotate(${Math.random() * 360}deg);
      width: ${6 + Math.random() * 10}px;
      height: ${6 + Math.random() * 10}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
    `;
    wrap.appendChild(piece);
    piece.addEventListener('animationend', () => piece.remove());
  }
}

// ============================================================
//  DARK MODE
// ============================================================

function toggleDarkMode() {
  const isDark = document.documentElement.dataset.theme === 'dark';
  document.documentElement.dataset.theme = isDark ? '' : 'dark';
  document.getElementById('darkToggle').innerHTML = isDark ? '<i data-lucide="moon"></i>' : '<i data-lucide="sun"></i>';
  localStorage.setItem('gpplab_theme', isDark ? 'light' : 'dark');
  lucide.createIcons();
}

// ============================================================
//  KEYBOARD SHORTCUTS
// ============================================================

document.addEventListener('keydown', (e) => {
  // Enter to submit answer
  if (e.key === 'Enter') {
    const panel = document.getElementById('explanationPanel');
    if (!panel.classList.contains('hidden')) {
      nextQuestion();
    } else if (state.currentMode === 'pingpong') {
      checkAnswer();
    } else if (state.currentMode === 'builder') {
      checkBuilder();
    }
  }
  // Escape to close modal
  if (e.key === 'Escape') closeGrammarModal();
});

// ============================================================
//  MOBILE NAV
// ============================================================

document.getElementById('hamburger').onclick = () => {
  document.getElementById('nav').classList.toggle('open');
};

// Nav links
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    showPage(link.dataset.page);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const readingTextArea = document.getElementById('readingText');
  if (readingTextArea) {
    readingTextArea.addEventListener('input', updateReadingWordCount);
  }
});

document.getElementById('darkToggle').onclick = toggleDarkMode;

// ============================================================
//  READING MAKER
// ============================================================

let readingState = {
  questions: [],
  userAnswers: {}
};

function updateReadingWordCount() {
  const text = document.getElementById('readingText').value.trim();
  const words = text ? text.split(/[ \n\r\t]+/).filter(w => w.length > 0).length : 0;
  console.log('updateReadingWordCount called. Text:', text, 'Words:', words);
  const counter = document.getElementById('readingWordCount');
  counter.textContent = `${words} / 200 words`;
  if (words > 250) {
    counter.style.color = 'var(--danger)';
  } else {
    counter.style.color = 'var(--text3)';
  }
}

async function generateReading() {
  const text = document.getElementById('readingText').value.trim();
  const words = text ? text.split(/[ \n\r\t]+/).filter(w => w.length > 0).length : 0;
  console.log('generateReading called. Text:', text, 'Words:', words);
  if (words < 10) {
    showToast('Please enter at least 10 words.', 'error');
    return;
  }
  if (words > 300) {
    showToast('Text is too long. Please keep it around 200 words.', 'error');
    return;
  }

  document.getElementById('readingInputArea').style.display = 'none';
  document.getElementById('readingLoading').style.display = 'block';
  document.getElementById('readingLesson').style.display = 'none';
  document.getElementById('generateReadingBtn').disabled = true;

  try {
    const data = await generateReadingAPI(text);

    renderReadingLesson(data);
  } catch (error) {
    showToast('Error: ' + error.message, 'error');
    resetReadingMaker();
  } finally {
    document.getElementById('generateReadingBtn').disabled = false;
  }
}

function renderReadingLesson(data) {
  readingState.questions = data.questions;
  readingState.userAnswers = {};

  document.getElementById('readingLoading').style.display = 'none';
  document.getElementById('readingLesson').style.display = 'flex';
  document.getElementById('readingPassageContent').textContent = data.passage;
  
  const qList = document.getElementById('readingQuestionsList');
  qList.innerHTML = '';
  
  data.questions.forEach((q, index) => {
    let qHtml = `<div class="reading-q-item" id="rq-${index}">
      <div class="reading-q-text">${index + 1}. ${q.question}</div>`;
      
    if (q.type === 'vocabulary') {
      qHtml = `<div class="reading-q-item" id="rq-${index}">
        <div class="reading-q-text">${index + 1}. What does the word <span class="reading-q-word">${q.word}</span> mean in this context?</div>`;
    }
    
    qHtml += `<div class="reading-options">`;
    q.options.forEach((opt, optIndex) => {
      qHtml += `
        <label class="reading-option" id="rlbl-${index}-${optIndex}">
          <input type="radio" name="rq-${index}" value="${optIndex}" onchange="selectReadingOption(${index}, ${optIndex})">
          <span>${opt}</span>
        </label>
      `;
    });
    qHtml += `</div>
      <div id="rexp-${index}" style="display:none; margin-top:12px; font-size:0.95rem; font-weight:700;"></div>
    </div>`;
    
    qList.insertAdjacentHTML('beforeend', qHtml);
  });

  document.getElementById('checkReadingBtn').style.display = 'block';
  document.getElementById('readingResultBox').style.display = 'none';
  lucide.createIcons();
}

function selectReadingOption(qIndex, optIndex) {
  readingState.userAnswers[qIndex] = optIndex;
}

function checkReadingAnswers() {
  const qs = readingState.questions;
  if (Object.keys(readingState.userAnswers).length < qs.length) {
    showToast('Please answer all questions', 'info');
    return;
  }

  let correctCount = 0;
  qs.forEach((q, index) => {
    const userAns = readingState.userAnswers[index];
    const isCorrect = userAns === q.answer;
    if (isCorrect) correctCount++;
    
    // Style the options
    q.options.forEach((_, optIndex) => {
      const lbl = document.getElementById(`rlbl-${index}-${optIndex}`);
      const input = lbl.querySelector('input');
      input.disabled = true;
      lbl.style.background = 'var(--bg3)';
      lbl.style.borderColor = 'transparent';
      
      if (optIndex === q.answer) {
        lbl.style.background = '#f0fdf4';
        lbl.style.borderColor = 'var(--accent2)';
      } else if (optIndex === userAns && !isCorrect) {
        lbl.style.background = '#fff5f5';
        lbl.style.borderColor = 'var(--danger)';
      }
    });

    const expDiv = document.getElementById(`rexp-${index}`);
    expDiv.style.display = 'block';
    expDiv.style.color = isCorrect ? 'var(--accent2)' : 'var(--danger)';
    expDiv.innerHTML = `<i data-lucide="${isCorrect ? 'check-circle-2' : 'x-circle'}" style="vertical-align:middle; width:18px;"></i> ${isCorrect ? 'Correct' : 'Incorrect'} - ${q.explanation}`;
  });

  document.getElementById('checkReadingBtn').style.display = 'none';
  
  const resBox = document.getElementById('readingResultBox');
  resBox.style.display = 'block';
  resBox.className = 'reading-result-box ' + (correctCount === qs.length ? 'success' : 'warning');
  resBox.textContent = `You got ${correctCount} out of ${qs.length} correct!`;
  
  if (correctCount === qs.length) {
    spawnConfetti();
    state.xp += 50;
    showToast('+50 XP for perfect score!', 'success');
  } else {
    state.xp += correctCount * 10;
    showToast(`+${correctCount * 10} XP earned`, 'success');
  }
  updateAllUI();
  saveProgress();
  lucide.createIcons();
}

function resetReadingMaker() {
  document.getElementById('readingText').value = '';
  document.getElementById('readingWordCount').textContent = '0 / 200 words';
  document.getElementById('readingWordCount').style.color = 'var(--text3)';
  document.getElementById('readingInputArea').style.display = 'block';
  document.getElementById('readingLesson').style.display = 'none';
  readingState = { questions: [], userAnswers: {} };
  showPage('reading');
}

// ============================================================
//  INIT
// ============================================================

function init() {
  // Load saved theme
  const savedTheme = localStorage.getItem('gpplab_theme');
  if (savedTheme === 'dark') {
    document.documentElement.dataset.theme = 'dark';
    document.getElementById('darkToggle').innerHTML = '<i data-lucide="sun"></i>';
  }
  // Load progress
  loadProgress();
  // Render grammar lib
  renderGrammarLib();
  // Show dashboard
  showPage('dashboard');
  
  // Render icons for initial load
  lucide.createIcons();
}

// Start the app!
init();

// Exposing functions to global scope for HTML inline handlers
window.loadProgress = loadProgress;
window.saveProgress = saveProgress;
window.resetProgress = resetProgress;
window.showPage = showPage;
window.getTopicsByLevel = getTopicsByLevel;
window.getRandomTopic = getRandomTopic;
window.getRandomQuestion = getRandomQuestion;
window.startNewQuestion = startNewQuestion;
window.checkAnswer = checkAnswer;
window.normalizeAnswer = normalizeAnswer;
window.showHint = showHint;
window.skipQuestion = skipQuestion;
window.setupErrorDetection = setupErrorDetection;
window.selectErrorWord = selectErrorWord;
window.setupSentenceBuilder = setupSentenceBuilder;
window.renderWordBank = renderWordBank;
window.addWordToSentence = addWordToSentence;
window.renderBuiltSentence = renderBuiltSentence;
window.removeWordFromSentence = removeWordFromSentence;
window.clearBuilder = clearBuilder;
window.checkBuilder = checkBuilder;
window.showExplanation = showExplanation;
window.nextQuestion = nextQuestion;
window.showEndOfSession = showEndOfSession;
window.restartSession = restartSession;
window.setLevel = setLevel;
window.setPracticeMode = setPracticeMode;
window.startMode = startMode;
window.startDailyChallenge = startDailyChallenge;
window.updateDailyRing = updateDailyRing;
window.renderVocabGrid = renderVocabGrid;
window.searchVocab = searchVocab;
window.markVocabLearned = markVocabLearned;
window.startVocabFlashcard = startVocabFlashcard;
window.stopFlashcard = stopFlashcard;
window.renderFlashcard = renderFlashcard;
window.flipCard = flipCard;
window.fcNext = fcNext;
window.fcPrev = fcPrev;
window.renderGrammarLib = renderGrammarLib;
window.openGrammarModal = openGrammarModal;
window.closeGrammarModal = closeGrammarModal;
window.practiceGrammar = practiceGrammar;
window.renderProgressPage = renderProgressPage;
window.updateAllUI = updateAllUI;
window.updateHeaderStreak = updateHeaderStreak;
window.updateScoreBar = updateScoreBar;
window.showToast = showToast;
window.spawnConfetti = spawnConfetti;
window.toggleDarkMode = toggleDarkMode;
window.updateReadingWordCount = updateReadingWordCount;
window.generateReading = generateReading;
window.renderReadingLesson = renderReadingLesson;
window.selectReadingOption = selectReadingOption;
window.checkReadingAnswers = checkReadingAnswers;
window.resetReadingMaker = resetReadingMaker;
window.init = init;
