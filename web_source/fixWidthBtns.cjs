const fs = require('fs');
let code = fs.readFileSync('src/components/Notepad.tsx', 'utf8');

// Replace the left button
let leftSearch = `                   <button onClick={(e) => {
                       e.stopPropagation();
                       const ns = [...columnWidths];
                       ns[i] = Math.max(50, (ns[i] || 150) - 20);
                       setColumnWidths(ns);
                       updateActiveDocumentState(title, rows, headers, ns);
                   }} className="text-zinc-400 hover:text-zinc-600 font-bold text-[10px]">&lt;</button>`;

let leftReplace = `                   <button onClick={(e) => {
                       e.stopPropagation();
                       executeProtectedAction(() => {
                           const ns = [...columnWidths];
                           ns[i] = Math.max(50, (ns[i] || 150) - 20);
                           setColumnWidths(ns);
                           updateActiveDocumentState(title, rows, headers, ns);
                       });
                   }} className="text-zinc-400 hover:text-zinc-600 font-bold text-[10px]">&lt;</button>`;

// Replace the right button
let rightSearch = `                   <button onClick={(e) => {
                       e.stopPropagation();
                       const ns = [...columnWidths];
                       ns[i] = Math.min(600, (ns[i] || 150) + 20);
                       setColumnWidths(ns);
                       updateActiveDocumentState(title, rows, headers, ns);
                   }} className="text-zinc-400 hover:text-zinc-600 font-bold text-[10px]">&gt;</button>`;

let rightReplace = `                   <button onClick={(e) => {
                       e.stopPropagation();
                       executeProtectedAction(() => {
                           const ns = [...columnWidths];
                           ns[i] = Math.min(600, (ns[i] || 150) + 20);
                           setColumnWidths(ns);
                           updateActiveDocumentState(title, rows, headers, ns);
                       });
                   }} className="text-zinc-400 hover:text-zinc-600 font-bold text-[10px]">&gt;</button>`;

code = code.replace(leftSearch, leftReplace);
code = code.replace(rightSearch, rightReplace);

fs.writeFileSync('src/components/Notepad.tsx', code, 'utf8');
