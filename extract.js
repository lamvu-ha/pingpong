const fs = require('fs');
const path = require('path');

const mainPath = path.join(__dirname, 'src', 'main.js');
let srcCode = fs.readFileSync(mainPath, 'utf8');

// Extract GRAMMAR_QUESTIONS
const grammarQStart = srcCode.indexOf('const GRAMMAR_QUESTIONS = {');
const grammarQEnd = srcCode.indexOf('// ============================================================', grammarQStart);
const grammarQuestions = srcCode.substring(grammarQStart, grammarQEnd).trim();

// Extract VOCABULARY
const vocabStart = srcCode.indexOf('const VOCABULARY = [');
const vocabEnd = srcCode.indexOf('// ============================================================', vocabStart);
const vocabulary = srcCode.substring(vocabStart, vocabEnd).trim();

// Extract GRAMMAR_LIBRARY
const grammarLibStart = srcCode.indexOf('const GRAMMAR_LIBRARY = [');
const grammarLibEnd = srcCode.indexOf('// ============================================================', grammarLibStart);
const grammarLibrary = srcCode.substring(grammarLibStart, grammarLibEnd).trim();

// Create data.js
const dataJsPath = path.join(__dirname, 'src', 'utils', 'data.js');
let dataJsContent = grammarQuestions.replace('const GRAMMAR_QUESTIONS', 'export const GRAMMAR_QUESTIONS') + '\n\n';
dataJsContent += vocabulary.replace('const VOCABULARY', 'export const VOCABULARY') + '\n\n';
dataJsContent += grammarLibrary.replace('const GRAMMAR_LIBRARY', 'export const GRAMMAR_LIBRARY') + '\n';
fs.writeFileSync(dataJsPath, dataJsContent);

// Remove extracted sections from main.js
srcCode = srcCode.substring(0, grammarQStart) + 
          srcCode.substring(grammarQEnd, vocabStart) + 
          srcCode.substring(vocabEnd, grammarLibStart) + 
          srcCode.substring(grammarLibEnd);

// Add imports and window assignments to main.js
const imports = `import './styles/main.css';\nimport { GRAMMAR_QUESTIONS, VOCABULARY, GRAMMAR_LIBRARY } from './utils/data.js';\n\nwindow.GRAMMAR_QUESTIONS = GRAMMAR_QUESTIONS;\nwindow.VOCABULARY = VOCABULARY;\nwindow.GRAMMAR_LIBRARY = GRAMMAR_LIBRARY;\n\n`;

srcCode = imports + srcCode;

fs.writeFileSync(mainPath, srcCode);
console.log('Successfully extracted data to utils/data.js and updated main.js');
