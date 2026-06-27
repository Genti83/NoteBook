const fs = require('fs');
let code = fs.readFileSync('src/components/Notepad.tsx', 'utf8');

code = code.replace(/onClick=\{\(e\) => \(e\) => \{ e\.stopPropagation\(\); setDocToDelete\(doc\.id\); \}\}/, "onClick={(e) => { e.stopPropagation(); setDocToDelete(doc.id); }}");

fs.writeFileSync('src/components/Notepad.tsx', code, 'utf8');
