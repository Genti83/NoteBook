const fs = require('fs');
let code = fs.readFileSync('src/components/Notepad.tsx', 'utf8');

// Remove states
code = code.replace("  const [orangeModal, setOrangeModal] = useState(false);\n  const [orangeText, setOrangeText] = useState('');\n", "");

// Remove localstorage init
code = code.replace("    const savedOrange = localStorage.getItem('grid_notepad_orange');\n    if (savedOrange) {\n       setOrangeText(savedOrange);\n    }\n", "");

// Remove header button from Catalog View
const catalogBtnRegex = /<button onClick=\{\(\) => executeProtectedAction\(\(\) => setOrangeModal\(true\)\)\}[\s\S]*?Shënime Sekrete\s*<\/button>\s*/;
code = code.replace(catalogBtnRegex, "");

// Remove button from Active Doc View
const docBtnRegex = /<button onClick=\{\(\) => executeProtectedAction\(\(\) => setOrangeModal\(true\)\)\}[\s\S]*?Sekrete\s*<\/button>\s*/;
code = code.replace(docBtnRegex, "");

// Remove modal block
const modalRegex = /\{\/\* ORANGE NOTES MODAL \*\/\}[\s\S]*?\{\/\* PIN MODAL \*\/\}/;
code = code.replace(modalRegex, "{/* PIN MODAL */}");

fs.writeFileSync('src/components/Notepad.tsx', code);
console.log('Removed orange secret modal functionality and variables.');
