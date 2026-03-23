const fs = require('fs');
const path = require('path');

const srcCode = fs.readFileSync(path.join(__dirname, 'src', 'legacy.js'), 'utf8');

const sections = srcCode.split(/\/\/\s*============================================================\s*\n\/\/\s*(.*?)\s*\n\/\/\s*============================================================\s*\n/);

const modules = {
  'utils/data.js': [],
  'utils/store.js': [],
  'pages/navigation.js': [],
  'pages/Dashboard.js': [],
  'pages/Practice.js': [],
  'pages/Reading.js': [],
  'pages/Vocab.js': [],
  'pages/Grammar.js': [],
  'pages/Progress.js': [],
  'components/UI.js': [],
  'components/ErrorDetection.js': [],
  'components/SentenceBuilder.js': [],
  'components/ExplanationPanel.js': [],
  'main.js': [`import './styles/main.css';`]
};

let currentHeading = 'Header';
// 0 is the start before any heading, 1 is the first heading string, 2 is its content, etc.
for(let i = 1; i < sections.length; i += 2) {
  const heading = sections[i];
  const content = sections[i+1];
  
  if(heading.includes('QUESTION BANK') || heading.includes('VOCABULARY BANK') || heading.includes('GRAMMAR LIBRARY DATA')) {
    modules['utils/data.js'].push(content);
  } else if(heading.includes('APP STATE') || heading.includes('LOAD & SAVE PROGRESS')) {
    modules['utils/store.js'].push(content);
  } else if(heading.includes('PAGE NAVIGATION') || heading.includes('KEYBOARD SHORTCUTS') || heading.includes('MOBILE NAV')) {
    modules['pages/navigation.js'].push(content);
  } else if(heading.includes('QUESTION ENGINE') || heading.includes('PING PONG MODE') || heading.includes('MODES & LEVELS')) {
    modules['pages/Practice.js'].push(content);
  } else if(heading.includes('ERROR DETECTION MODE')) {
    modules['components/ErrorDetection.js'].push(content);
  } else if(heading.includes('SENTENCE BUILDER MODE')) {
    modules['components/SentenceBuilder.js'].push(content);
  } else if(heading.includes('EXPLANATION PANEL')) {
    modules['components/ExplanationPanel.js'].push(content);
  } else if(heading.includes('DAILY CHALLENGE')) {
    modules['pages/Dashboard.js'].push(content);
  } else if(heading.includes('VOCABULARY')) {
    modules['pages/Vocab.js'].push(content);
  } else if(heading.includes('GRAMMAR LIBRARY')) {
    modules['pages/Grammar.js'].push(content);
  } else if(heading.includes('PROGRESS PAGE')) {
    modules['pages/Progress.js'].push(content);
  } else if(heading.includes('UI UPDATES') || heading.includes('TOAST') || heading.includes('CONFETTI') || heading.includes('DARK MODE')) {
    modules['components/UI.js'].push(content);
  } else if(heading.includes('READING MAKER')) {
    modules['pages/Reading.js'].push(content);
  } else if(heading.includes('INIT')) {
    modules['main.js'].push(content);
  }
}

// Since global variables and functions from legacy.js are used directly via HTML onclick handlers, 
// we will export everything using ES6, then inside main.js we import everything and attach to window
// to ensure the HTML remains functional without changing every inline handler.

// Also, all files must use the same `state` object, so they need to import it.
const addExportsAndImports = () => {
  // data.js
  let dataStr = modules['utils/data.js'].join('\n');
  dataStr = dataStr.replace(/const GRAMMAR_QUESTIONS/, 'export const GRAMMAR_QUESTIONS');
  dataStr = dataStr.replace(/const VOCABULARY/, 'export const VOCABULARY');
  dataStr = dataStr.replace(/const GRAMMAR_LIBRARY/, 'export const GRAMMAR_LIBRARY');
  fs.writeFileSync(path.join(__dirname, 'src', 'utils', 'data.js'), dataStr);

  // Convert function declarations to exports in all files
  for (let [filepath, contentArray] of Object.entries(modules)) {
    if (filepath === 'main.js' || filepath === 'utils/data.js') continue;
    let fileContent = contentArray.join('\n');
    
    // Add imports at top
    let imports = `import { state, loadProgress, saveProgress, resetProgress } from '../utils/store.js';\n`;
    imports += `import { GRAMMAR_QUESTIONS, VOCABULARY, GRAMMAR_LIBRARY } from '../utils/data.js';\n`;
    
    if (filepath === 'utils/store.js') {
      fileContent = fileContent.replace(/let state/, 'export let state');
      fileContent = fileContent.replace(/function loadProgress/, 'export function loadProgress');
      fileContent = fileContent.replace(/function saveProgress/, 'export function saveProgress');
      fileContent = fileContent.replace(/function resetProgress/, 'export function resetProgress');
      fs.writeFileSync(path.join(__dirname, 'src', filepath), fileContent);
      continue;
    }

    // Export all functions
    fileContent = fileContent.replace(/^(\s*)function\s+([a-zA-Z0-9_]+)/gm, '$1export function $2');
    // Export let/const/var at top level (simple heuristic)
    fileContent = fileContent.replace(/^let\s+([a-zA-Z0-9_]+)/gm, 'export let $1');
    fileContent = fileContent.replace(/^const\s+([a-zA-Z0-9_]+)/gm, 'export const $1');
    
    fs.writeFileSync(path.join(__dirname, 'src', filepath), imports + '\n' + fileContent);
  }

  // Create main.js that imports everything and attaches to window
  let mainCode = `import './styles/main.css';\n`;
  mainCode += `import { state, loadProgress, saveProgress, resetProgress } from './utils/store.js';\n`;
  mainCode += `import { GRAMMAR_QUESTIONS, VOCABULARY, GRAMMAR_LIBRARY } from './utils/data.js';\n`;
  mainCode += `import * as ui from './components/UI.js';\n`;
  mainCode += `import * as errDetect from './components/ErrorDetection.js';\n`;
  mainCode += `import * as sentenceBuild from './components/SentenceBuilder.js';\n`;
  mainCode += `import * as expPanel from './components/ExplanationPanel.js';\n`;
  mainCode += `import * as nav from './pages/navigation.js';\n`;
  mainCode += `import * as dashboard from './pages/Dashboard.js';\n`;
  mainCode += `import * as practice from './pages/Practice.js';\n`;
  mainCode += `import * as readMaker from './pages/Reading.js';\n`;
  mainCode += `import * as vocab from './pages/Vocab.js';\n`;
  mainCode += `import * as grammar from './pages/Grammar.js';\n`;
  mainCode += `import * as progPage from './pages/Progress.js';\n`;
  
  mainCode += `\n// Attach to window so HTML inline handlers work\n`;
  mainCode += `window.state = state;\nwindow.GRAMMAR_QUESTIONS = GRAMMAR_QUESTIONS;\nwindow.VOCABULARY = VOCABULARY;\nwindow.GRAMMAR_LIBRARY = GRAMMAR_LIBRARY;\n`;
  
  [
    'loadProgress', 'saveProgress', 'resetProgress',
    'ui', 'errDetect', 'sentenceBuild', 'expPanel', 'nav', 'dashboard', 'practice', 'readMaker', 'vocab', 'grammar', 'progPage'
  ].forEach(mod => {
    if(['loadProgress', 'saveProgress', 'resetProgress'].includes(mod)) {
       mainCode += \`window.\${mod} = \${mod};\\n\`;
    } else {
       mainCode += \`Object.assign(window, \${mod});\\n\`;
    }
  });

  mainCode += `\n` + modules['main.js'].join('\n');
  fs.writeFileSync(path.join(__dirname, 'src', 'main.js'), mainCode);
};

addExportsAndImports();
console.log('Successfully refactored modular files!');
