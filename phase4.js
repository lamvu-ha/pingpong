const fs = require('fs');
const path = require('path');

// 1. Update src/utils/data.js
const dataPath = path.join(__dirname, 'src', 'utils', 'data.js');
let dataCode = fs.readFileSync(dataPath, 'utf8');
const vocabArrayStr = `export const VOCABULARY = [
  'treasure', 'ambitious', 'advocate', 'flourish', 'substantial',
  'dedicate', 'innovative', 'perseverance', 'collaborate', 'comprehend',
  'eloquent', 'inevitable', 'prioritize', 'resilient', 'skeptical',
  'sustainable', 'transparent', 'vulnerable', 'accumulate', 'controversial'
];`;
// Find and replace the VOCABULARY array
const startIdx = dataCode.indexOf('export const VOCABULARY = [');
const endIdx = dataCode.indexOf('// ============================================================', startIdx) > -1 ? dataCode.indexOf('// ============================================================', startIdx) : dataCode.indexOf('];', startIdx) + 2;
// Because older script may not have the comments anymore, we just replace until the next export
const exportGrammarLib = dataCode.indexOf('export const GRAMMAR_LIBRARY = [');
dataCode = dataCode.substring(0, startIdx) + vocabArrayStr + '\n\n' + dataCode.substring(exportGrammarLib);
fs.writeFileSync(dataPath, dataCode);

// 2. Update src/services/api.js
const apiPath = path.join(__dirname, 'src', 'services', 'api.js');
let apiCode = fs.readFileSync(apiPath, 'utf8');
const fetchWordDataFn = `
export async function fetchWordData(word) {
  try {
    const response = await fetch(\`https://api.dictionaryapi.dev/api/v2/entries/en/\${word}\`);
    if (!response.ok) throw new Error('Word not found');
    return await response.json();
  } catch (e) {
    return null;
  }
}
`;
if(!apiCode.includes('fetchWordData')) {
  fs.writeFileSync(apiPath, apiCode + fetchWordDataFn);
}

// 3. Update src/main.js
const mainPath = path.join(__dirname, 'src', 'main.js');
let mainCode = fs.readFileSync(mainPath, 'utf8');

// Inject fetchWordData import
if (!mainCode.includes('fetchWordData')) {
  mainCode = mainCode.replace(`import { generateReadingAPI } from './services/api.js';`, `import { generateReadingAPI, fetchWordData } from './services/api.js';`);
}

// Replace renderVocabGrid
const oldRenderVocabGrid = `function renderVocabGrid(words) {
  const grid = document.getElementById('wordListMode');
  if (!grid) return;
  grid.innerHTML = '';
  words.forEach((w, i) => {
    const card = document.createElement('div');
    card.className = 'vocab-card';
    card.innerHTML = \`
      <div class="vc-word">\${w.word}</div>
      <div class="vc-type">\${w.type}</div>
      <div class="vc-meaning">\${w.meaning}</div>
      <div class="vc-example">"\${w.example}"</div>
      <div class="vc-tags">
        \${w.synonyms.map(s => \`<span class="vc-tag"><i data-lucide="git-merge" style="width:12px; height:12px; margin-right:4px; vertical-align:middle;"></i> \${s}</span>\`).join('')}
        \${w.collocations.slice(0,2).map(c => \`<span class="vc-tag"><i data-lucide="paperclip" style="width:12px; height:12px; margin-right:4px; vertical-align:middle;"></i> \${c}</span>\`).join('')}
      </div>
    \`;
    card.onclick = () => markVocabLearned(w.word);
    grid.appendChild(card);
  });
  lucide.createIcons();
}`;

const newRenderVocabGrid = `function renderVocabGrid(words) {
  const grid = document.getElementById('wordListMode');
  if (!grid) return;
  grid.innerHTML = '';
  words.forEach((word) => {
    const card = document.createElement('div');
    card.className = 'vocab-card';
    card.style.cursor = 'pointer';
    card.style.textAlign = 'center';
    card.style.padding = '30px 20px';
    card.innerHTML = \`
      <div class="vc-word" style="font-size:1.5rem; margin-bottom:10px;">\${word}</div>
      <div class="vc-hint" style="color:var(--text3);"><i data-lucide="zap" style="width:16px; margin-bottom:-3px;"></i> Click to learn</div>
    \`;
    card.onclick = () => {
      // Find the index of this word and start flashcards from there
      state.fcIndex = state.filteredVocab.indexOf(word);
      if(state.fcIndex === -1) state.fcIndex = 0;
      startVocabFlashcard();
    };
    grid.appendChild(card);
  });
  lucide.createIcons();
}`;

if(mainCode.includes('function renderVocabGrid(words)')) {
  // Use a regex to replace the whole function in case of slight spacing differences
  mainCode = mainCode.replace(/function renderVocabGrid\(words\)\s*\{[\s\S]*?lucide\.createIcons\(\);\s*\}/, newRenderVocabGrid);
}

// Replace searchVocab
const oldSearchVocab = `function searchVocab(query) {
  const q = query.toLowerCase();
  state.filteredVocab = VOCABULARY.filter(w =>
    w.word.toLowerCase().includes(q) ||
    w.meaning.toLowerCase().includes(q) ||
    w.synonyms.some(s => s.toLowerCase().includes(q))
  );
  renderVocabGrid(state.filteredVocab);
}`;
const newSearchVocab = `function searchVocab(query) {
  const q = query.toLowerCase();
  state.filteredVocab = VOCABULARY.filter(w => w.toLowerCase().includes(q));
  renderVocabGrid(state.filteredVocab);
}`;
mainCode = mainCode.replace(/function searchVocab\(query\)\s*\{[\s\S]*?renderVocabGrid\(state\.filteredVocab\);\s*\}/, newSearchVocab);

// Replace renderFlashcard
const oldRenderFlashcard = `function renderFlashcard() {
  const vocab = state.filteredVocab;
  if (!vocab.length) return;
  const w = vocab[state.fcIndex];
  const fc = document.getElementById('flashcard');
  fc.classList.remove('flipped');
  document.getElementById('fcWord').textContent = w.word;
  document.getElementById('fcMeaning').textContent = w.meaning;
  document.getElementById('fcExample').textContent = \`"\${w.example}"\`;
  document.getElementById('fcSynonyms').textContent = '≈ ' + w.synonyms.join(', ');
  document.getElementById('fcCounter').textContent = \`\${state.fcIndex + 1}/\${vocab.length}\`;
}`;

const newRenderFlashcard = `async function renderFlashcard() {
  const vocab = state.filteredVocab;
  if (!vocab.length) return;
  const word = vocab[state.fcIndex];
  const fc = document.getElementById('flashcard');
  fc.classList.remove('flipped');
  
  document.getElementById('fcWord').innerHTML = word + ' <span class="spinner" style="display:inline-block; width:16px; height:16px; border-width:2px; margin-left:10px;"></span>';
  document.getElementById('fcCounter').textContent = \`\${state.fcIndex + 1}/\${vocab.length}\`;
  
  // Clear previous
  document.getElementById('fcMeaning').textContent = "Loading meaning...";
  document.getElementById('fcExample').textContent = "";
  document.getElementById('fcSynonyms').textContent = "";

  const data = await fetchWordData(word);
  
  document.getElementById('fcWord').textContent = word; // remove spinner
  
  if (data && data[0] && data[0].meanings.length > 0) {
    const mean = data[0].meanings[0];
    const def = mean.definitions[0];
    document.getElementById('fcMeaning').textContent = \`[\${mean.partOfSpeech}] \${def.definition}\`;
    document.getElementById('fcExample').textContent = def.example ? \`"\${def.example}"\` : '';
    document.getElementById('fcSynonyms').textContent = mean.synonyms && mean.synonyms.length ? '≈ ' + mean.synonyms.slice(0, 3).join(', ') : '';
  } else {
    document.getElementById('fcMeaning').textContent = "Meaning not found in Dictionary API.";
    document.getElementById('fcExample').textContent = "Try another word.";
  }
}`;
mainCode = mainCode.replace(/function renderFlashcard\(\)\s*\{[\s\S]*?fcCounter'\)\.textContent[\s\S]*?;[\s\n]*\}/, newRenderFlashcard);

// markVocabLearned needs to know the word string
const oldMarkVocabLearnedObj = `markVocabLearned(state.filteredVocab[state.fcIndex].word)`;
mainCode = mainCode.replace('markVocabLearned(state.filteredVocab[state.fcIndex].word)', 'markVocabLearned(state.filteredVocab[state.fcIndex])');

fs.writeFileSync(mainPath, mainCode);
console.log('Successfully applied Phase 4 updates to logic files!');
