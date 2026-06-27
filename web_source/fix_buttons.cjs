const fs = require('fs');

let code = fs.readFileSync('src/components/Notepad.tsx', 'utf8');

const searchRegex = /<button onClick=\{\(\) => updateSelectedRowsStatus\('none'\)\} className=\{`p-1\.5 round[\s\S]*?<Plus className="w-3\.5 h-3\.5 border border-current rounded-full" \/>\s*<\/button>\s*<\/div>/;

const replacement = `<button onClick={() => updateSelectedRowsStatus('none')} className={\`p-1.5 rounded transition-colors \${isDark ? "bg-zinc-700 text-white hover:bg-zinc-600 shadow-sm font-bold" : "bg-zinc-300 text-zinc-900 hover:bg-zinc-400 shadow-sm font-bold"}\`} title="Hiq Statusin">
               <Unlock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
            <div className="h-4 w-px bg-zinc-500/30 mx-1"></div>

             <div className="flex flex-wrap items-center gap-2 border-r pr-2 border-zinc-500/30">
                  <div className="flex items-center gap-1">
                     <span className="text-[10px] text-zinc-500 font-bold tracking-wider uppercase mr-1 hidden sm:inline" title="Kolonat">K:</span>
                     <button onClick={() => {
                        executeProtectedAction(() => {
                            if(headers.length > 2) {
                                const newH = [...headers];
                                newH.pop();
                                setHeaders(newH);
                                const newW = [...columnWidths];
                                newW.pop();
                                setColumnWidths(newW);
                                updateActiveDocumentState(title, rows, newH, newW);
                            }
                        });
                     }} title={t("Hiq Kolonë", "Remove Column")} className={\`p-1.5 rounded transition-colors shadow-sm font-bold \${isDark ? "bg-zinc-700 text-white hover:bg-zinc-600" : "bg-zinc-200 text-zinc-900 hover:bg-zinc-300"}\`}>
                        <Minus className="w-3.5 h-3.5" />
                     </button>
                     <span className={\`text-[11px] font-bold min-w-[12px] text-center px-1 \${isDark ? "text-zinc-300" : "text-zinc-700"}\`}>{headers.length}</span>
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
                     }} title={t("Shto Kolonë", "Add Column")} className={\`p-1.5 rounded transition-colors shadow-sm font-bold \${isDark ? "bg-zinc-700 text-white hover:bg-zinc-600" : "bg-zinc-200 text-zinc-900 hover:bg-zinc-300"}\`}>
                        <Plus className="w-3.5 h-3.5" />
                     </button>
                  </div>
             </div>
             
             <div className="flex flex-wrap items-center gap-2 lg:pr-0 border-zinc-500/30">
                  <div className="flex items-center gap-1">
                     <span className="text-[10px] text-zinc-500 font-bold tracking-wider uppercase mr-1 hidden sm:inline" title="Rrjeshtat">R:</span>
                     <button onClick={() => {
                        executeProtectedAction(() => {
                            if(rows.length > 10) {
                                const newR = [...rows];
                                newR.splice(-10); // Remove last 10
                                setRows(newR);
                                updateActiveDocumentState(title, newR, headers);
                                showToast(t("U hoqën 10 rrjeshta", "Removed 10 rows"));
                            }
                        });
                     }} title={t("Hiq 10 Rrjeshta", "Remove 10 Rows")} className={\`p-1.5 rounded transition-colors shadow-sm font-bold \${isDark ? "bg-zinc-700 text-white hover:bg-zinc-600" : "bg-zinc-200 text-zinc-900 hover:bg-zinc-300"}\`}>
                        <Minus className="w-3.5 h-3.5" />
                     </button>
                     <span className={\`text-[11px] font-bold min-w-[20px] text-center px-1 \${isDark ? "text-zinc-300" : "text-zinc-700"}\`}>{rows.length}</span>
                     <button onClick={() => {
                        executeProtectedAction(() => {
                            if(rows.length < 500) {
                                const newR = [...rows];
                                const startId = rows.length;
                                for(let i = 0; i < 10; i++) {
                                   newR.push({ id: \`row-\${startId + i}\`, status: 'none' as const, image: '' });
                                }
                                setRows(newR);
                                updateActiveDocumentState(title, newR, headers);
                                showToast(t("U shtuan 10 rrjeshta", "Added 10 rows"));
                            }
                        });
                     }} title={t("Shto 10 Rrjeshta", "Add 10 Rows")} className={\`p-1.5 rounded transition-colors shadow-sm font-bold \${isDark ? "bg-zinc-700 text-white hover:bg-zinc-600" : "bg-zinc-200 text-zinc-900 hover:bg-zinc-300"}\`}>
                        <Plus className="w-3.5 h-3.5" />
                     </button>
                  </div>
             </div>`;

code = code.replace(searchRegex, replacement);

fs.writeFileSync('src/components/Notepad.tsx', code, 'utf8');
