const fs = require('fs');

let code = fs.readFileSync('src/components/Notepad.tsx', 'utf8');

// The issue is that the cells weren't using the width! Let's find the cell map.
let cellSearch = `{headers.map((_, i) => \`col\${i+1}\`).map((colKey, cIndex) => (
                    <div key={cIndex} className={\`flex-1 border-r relative last:border-r-0 p-0.5 group/cell \${
                      isDark ? "border-zinc-800" : "border-zinc-200"
                    }\`}>`;

let cellReplace = `{headers.map((_, i) => \`col\${i+1}\`).map((colKey, cIndex) => (
                    <div key={cIndex} style={{ width: columnWidths[cIndex] || 150, minWidth: columnWidths[cIndex] || 150, maxWidth: columnWidths[cIndex] || 150 }} className={\`shrink-0 border-r relative p-0.5 group/cell \${
                      isDark ? "border-zinc-800" : "border-zinc-200"
                    }\`}>`;

if (code.includes(cellSearch)) {
    code = code.replace(cellSearch, cellReplace);
    console.log("Successfully replaced the grid cells layout to use the widths.");
} else {
    console.log("Could not find cellSearch block!");
}

let headerSearch = `style={{ width: columnWidths[i] || 150, minWidth: columnWidths[i] || 150 }}`;
let headerReplace = `style={{ width: columnWidths[i] || 150, minWidth: columnWidths[i] || 150, maxWidth: columnWidths[i] || 150 }}`;
code = code.replace(headerSearch, headerReplace); // apply to all header cols

fs.writeFileSync('src/components/Notepad.tsx', code, 'utf8');
