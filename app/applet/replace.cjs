const fs = require('fs');
let content = fs.readFileSync('src/components/Notepad.tsx', 'utf8');

console.log("Before blueModal has", (content.match(/orangeModal/g) || []).length);
// Replace orange states and variables
content = content.replace(/orangeModal/g, 'blueModal');
content = content.replace(/setOrangeModal/g, 'setBlueModal');
content = content.replace(/orangeText/g, 'blueText');
content = content.replace(/setOrangeText/g, 'setBlueText');
content = content.replace(/grid_notepad_orange/g, 'grid_notepad_blue');
content = content.replace(/status === 'orange'/g, "status === 'blue'");
content = content.replace(/status === "orange"/g, 'status === "blue"');
content = content.replace(/updateSelectedRowsStatus\('orange'\)/g, "updateSelectedRowsStatus('blue')");
content = content.replace(/status\?: 'none' \\| 'ok' \\| 'orange' \\| 'x'/g, "status?: 'none' | 'ok' | 'blue' | 'x'");

// Replace tailwind classes
content = content.replace(/orange-500/g, 'blue-500');
content = content.replace(/orange-600/g, 'blue-600');
content = content.replace(/orange-900/g, 'blue-900');
content = content.replace(/orange-800/g, 'blue-800');
content = content.replace(/orange-300/g, 'blue-300');
content = content.replace(/orange-100/g, 'blue-100');
content = content.replace(/bg-orange-50/g, 'bg-blue-50');
content = content.replace(/text-orange-50/g, 'text-blue-50');

console.log("After blueModal has", (content.match(/blueModal/g) || []).length);
fs.writeFileSync('src/components/Notepad.tsx', content, 'utf8');
console.log("Written!");
