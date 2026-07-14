const fs = require('fs');
let code = fs.readFileSync('src/components/Notepad.tsx', 'utf8');
code = code.replace(/-blue-/g, '-accent-');
code = code.replace(/-indigo-/g, '-accent-');
fs.writeFileSync('src/components/Notepad.tsx', code);
