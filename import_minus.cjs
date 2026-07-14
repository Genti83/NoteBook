const fs = require('fs');
let code = fs.readFileSync('src/components/Notepad.tsx', 'utf8');

code = code.replace(/import \{ Trash2/, 'import { Trash2, Minus');
fs.writeFileSync('src/components/Notepad.tsx', code, 'utf8');
console.log('added minus import');
