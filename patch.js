const fs = require('fs');
const path = require('path');

const mainPath = path.join(__dirname, 'src', 'main.js');
let srcCode = fs.readFileSync(mainPath, 'utf8');

// 1. Inject API import
if (!srcCode.includes("import { generateReadingAPI }")) {
  srcCode = `import { generateReadingAPI } from './services/api.js';\n` + srcCode;
}

// 2. Replace generateReading fetch block with our API service call
const fetchBlock = `const response = await fetch('http://localhost:5000/api/generate-reading', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to generate lesson');
    }`;

const replaceBlock = `const data = await generateReadingAPI(text);`;

srcCode = srcCode.replace(fetchBlock, replaceBlock);

// 3. Attach all functions directly to window object at the end
const functionMatches = [...srcCode.matchAll(/^async function ([a-zA-Z0-9_]+)\(|^function ([a-zA-Z0-9_]+)\(/gm)];
let windowAttachments = '\n// Exposing functions to global scope for HTML inline handlers\n';

for (const match of functionMatches) {
  const funcName = match[1] || match[2];
  if (funcName) {
    windowAttachments += `window.${funcName} = ${funcName};\n`;
  }
}

if (!srcCode.includes('// Exposing functions to global')) {
  srcCode += windowAttachments;
}

fs.writeFileSync(mainPath, srcCode);
console.log('Successfully patched functions to window and injected API service call!');
