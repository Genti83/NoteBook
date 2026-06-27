const fs = require('fs');

let code = fs.readFileSync('src/components/Notepad.tsx', 'utf8');

let blockToMoveSearch = `             <div className="flex items-center gap-1 border-l pl-2 border-zinc-500/30">
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

let targetDestSearch = `            <button onClick={() => updateSelectedRowsStatus('none')} className={\`p-1.5 rounded transition-colors \${isDark ? "bg-zinc-700 text-white hover:bg-zinc-600 shadow-sm font-bold" : "bg-zinc-300 text-zinc-900 hover:bg-zinc-400 shadow-sm font-bold"}\`} title="Hiq Statusin">
               <Unlock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>`;

let blockToMoveReplace = `            <button onClick={() => updateSelectedRowsStatus('none')} className={\`p-1.5 rounded transition-colors \${isDark ? "bg-zinc-700 text-white hover:bg-zinc-600 shadow-sm font-bold" : "bg-zinc-300 text-zinc-900 hover:bg-zinc-400 shadow-sm font-bold"}\`} title="Hiq Statusin">
               <Unlock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
            <div className="h-4 w-px bg-zinc-500/30 mx-1"></div>
            <div className="flex items-center gap-1">
                  <span className="text-[10px] text-zinc-500 font-medium tracking-wide uppercase mr-1 hidden sm:inline">{t('Kolonat', 'Cols')}:</span>
                  <button onClick={() => {
                     executeProtectedAction(() => {
                         if(headers.length > 1) {
                             const newH = [...headers];
                             newH.pop();
                             setHeaders(newH);
                             const newW = [...columnWidths];
                             newW.pop();
                             setColumnWidths(newW);
                             updateActiveDocumentState(title, rows, newH, newW);
                         }
                     });
                  }} title={t("Hiq Kolonë", "Remove Column")} className={\`p-1.5 rounded transition-colors \${isDark ? "text-zinc-400 hover:text-red-500 hover:bg-red-500/10" : "text-zinc-500 hover:text-red-600 hover:bg-red-50"}\`}>
                     <Minus className="w-3.5 h-3.5 border border-current rounded-full" />
                  </button>
                  <span className={\`text-[11px] font-bold min-w-[12px] text-center \${isDark ? "text-zinc-300" : "text-zinc-700"}\`}>{headers.length}</span>
                  <button onClick={() => {
                     executeProtectedAction(() => {
                         if(headers.length < 8) {
                             const newH = [...headers, \`\${t('Kolona', 'Col')} \${headers.length + 1}\`];
                             setHeaders(newH);
                             const newW = [...columnWidths, 150];
                             setColumnWidths(newW);
                             updateActiveDocumentState(title, rows, newH, newW);
                         }
                     });
                  }} title={t("Shto Kolonë", "Add Column")} className={\`p-1.5 rounded transition-colors \${isDark ? "text-zinc-400 hover:text-green-500 hover:bg-green-500/10" : "text-zinc-500 hover:text-green-600 hover:bg-green-50"}\`}>
                     <Plus className="w-3.5 h-3.5 border border-current rounded-full" />
                  </button>
             </div>`;

if (!code.includes(blockToMoveSearch)) console.log("Did not find source block");
if (!code.includes(targetDestSearch)) console.log("Did not find target block");

code = code.replace(blockToMoveSearch, '');
code = code.replace(targetDestSearch, blockToMoveReplace);

fs.writeFileSync('src/components/Notepad.tsx', code, 'utf8');
