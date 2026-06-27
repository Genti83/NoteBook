const fs = require('fs');

let code = fs.readFileSync('src/components/Notepad.tsx', 'utf8');

// 1. Move Column Buttons out of Grid Header
let badGridHeaderBlock = `<div className="flex gap-1 items-center justify-center rounded bg-zinc-500/10 p-0.5 mb-0.5 mt-1">
                  <button onClick={() => {
                     if(headers.length > 1) {
                         const newH = [...headers];
                         newH.pop(); // remove last
                         setHeaders(newH);
                         updateActiveDocumentState(title, rows, newH);
                     }
                  }} title={t("Hiq Kolonë", "Remove Column")} className="hover:text-red-500"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg></button>
                  <span className="text-[9px] w-2 text-center leading-none">{headers.length}</span>
                  <button onClick={() => {
                     if(headers.length < 8) {
                         const newH = [...headers, \`\${t('Kolona', 'Col')} \${headers.length + 1}\`];
                         setHeaders(newH);
                         updateActiveDocumentState(title, rows, newH);
                     }
                  }} title={t("Shto Kolonë", "Add Column")} className="hover:text-green-500"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></button>
               </div>`;
code = code.replace(badGridHeaderBlock, '');

// 2. Insert new Column Buttons block after Sekrete
let sekreteBlock = `<Lock className="w-3.5 h-3.5" /> Sekrete
             </button>
             </div>`;
let newColsBlock = `<Lock className="w-3.5 h-3.5" /> Sekrete
             </button>
             </div>
             
             <div className="flex items-center gap-1 border-l pl-2 border-zinc-500/30">
                  <span className="text-[10px] text-zinc-500 font-medium tracking-wide uppercase mr-1 hidden sm:inline">{t('Kolonat', 'Cols')}:</span>
                  <button onClick={() => {
                     if(headers.length > 1) {
                         const newH = [...headers];
                         newH.pop();
                         setHeaders(newH);
                         const newW = [...columnWidths];
                         newW.pop();
                         setColumnWidths(newW);
                         updateActiveDocumentState(title, rows, newH, newW);
                     }
                  }} title={t("Hiq Kolonë", "Remove Column")} className={\`p-1.5 rounded transition-colors \${isDark ? "text-zinc-400 hover:text-red-500 hover:bg-red-500/10" : "text-zinc-500 hover:text-red-600 hover:bg-red-50"}\`}>
                     <Minus className="w-3.5 h-3.5 border border-current rounded-full" />
                  </button>
                  <span className={\`text-[11px] font-bold min-w-[12px] text-center \${isDark ? "text-zinc-300" : "text-zinc-700"}\`}>{headers.length}</span>
                  <button onClick={() => {
                     if(headers.length < 8) {
                         const newH = [...headers, \`\${t('Kolona', 'Col')} \${headers.length + 1}\`];
                         setHeaders(newH);
                         const newW = [...columnWidths, 150]; // default new column width
                         setColumnWidths(newW);
                         updateActiveDocumentState(title, rows, newH, newW);
                     }
                  }} title={t("Shto Kolonë", "Add Column")} className={\`p-1.5 rounded transition-colors \${isDark ? "text-zinc-400 hover:text-green-500 hover:bg-green-500/10" : "text-zinc-500 hover:text-green-600 hover:bg-green-50"}\`}>
                     <Plus className="w-3.5 h-3.5 border border-current rounded-full" />
                  </button>
             </div>`;
code = code.replace(sekreteBlock, newColsBlock);

// 3. Update headers render to use exact width and width controls
// Warning: we need to replace the flex-1 with dynamic style width for EACH column including cells!
let headerMapBlock = `{headers.map((h, i) => (
              <div key={i} className={\`flex-1 border-r py-2 px-1 last:border-r-0 \${isDark ? "border-zinc-800" : "border-zinc-200"}\`}>
                <input`;
let newHeaderMapBlock = `{headers.map((h, i) => (
              <div key={i} style={{ width: columnWidths[i] || 150, minWidth: columnWidths[i] || 150 }} className={\`shrink-0 border-r py-1 px-1 last:border-r-0 flex flex-col justify-center relative group \${isDark ? "border-zinc-800" : "border-zinc-200"}\`}>
                <div className="flex gap-1 justify-between w-full opacity-0 px-1 group-hover:opacity-100 transition-opacity absolute top-0.5 left-0">
                   <button onClick={(e) => {
                       e.stopPropagation();
                       const ns = [...columnWidths];
                       ns[i] = Math.max(50, (ns[i] || 150) - 20);
                       setColumnWidths(ns);
                       updateActiveDocumentState(title, rows, headers, ns);
                   }} className="text-zinc-400 hover:text-zinc-600 font-bold text-[10px]">&lt;</button>
                   <button onClick={(e) => {
                       e.stopPropagation();
                       const ns = [...columnWidths];
                       ns[i] = Math.min(600, (ns[i] || 150) + 20);
                       setColumnWidths(ns);
                       updateActiveDocumentState(title, rows, headers, ns);
                   }} className="text-zinc-400 hover:text-zinc-600 font-bold text-[10px]">&gt;</button>
                </div>
                <input`;
code = code.replace(headerMapBlock, newHeaderMapBlock);

// 4. Also update the grid cells to use widths!
let cellMapBlockSearch = `{headers.map((_, i) => \`col\${i+1}\`).map((colKey, cIndex) => (
                    <div 
                      key={cIndex}
                      onClick={() => !readOnly && setActiveCell({ rIndex: index, colKey })}
                      className={\`flex-1 border-r p-1 text-sm \${isDark ? "border-zinc-800" : "border-zinc-200"} relative min-h-[32px] group/cell\`}`;
let cellMapBlockReplace = `{headers.map((_, i) => \`col\${i+1}\`).map((colKey, cIndex) => (
                    <div 
                      key={cIndex}
                      onClick={() => !readOnly && setActiveCell({ rIndex: index, colKey })}
                      style={{ width: columnWidths[cIndex] || 150, minWidth: columnWidths[cIndex] || 150 }}
                      className={\`shrink-0 border-r p-1 text-sm \${isDark ? "border-zinc-800" : "border-zinc-200"} relative min-h-[32px] group/cell\`}`;
code = code.replace(cellMapBlockSearch, cellMapBlockReplace);

fs.writeFileSync('src/components/Notepad.tsx', code, 'utf8');
console.log('done moving grids and resize logic');
