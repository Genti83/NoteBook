const fs = require('fs');
let code = fs.readFileSync('src/components/Notepad.tsx', 'utf8');

const modalCode = `      {/* PENDING AI CHANGES MODAL */}
      {pendingAiChanges && (
         <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
            <div className={\`max-w-xl w-full p-6 rounded-2xl shadow-2xl border \${isDark ? "bg-zinc-900 border-zinc-700" : "bg-white border-zinc-300"}\`}>
               <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-accent-500/10 text-accent-500">
                     <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className={\`text-xl font-bold \${textColor}\`}>{t('Mirato Ndryshimet', 'Approve AI Changes')}</h3>
               </div>
               
               <p className={\`mb-4 text-sm \${isDark ? "text-zinc-400" : "text-zinc-600"}\`}>
                  {t('AI sugjeron ndryshime. Struktura e re e kolonave:', 'AI suggests changes. New column structure:')}
               </p>
               
               <div className="flex flex-wrap gap-2 mb-6">
                   {pendingAiChanges.newHeaders.map((h, i) => (
                      <span key={i} className={\`px-3 py-1.5 rounded-lg text-xs font-bold \${isDark ? "bg-zinc-800 text-zinc-300" : "bg-zinc-100 text-zinc-700"}\`}>
                          {h}
                      </span>
                   ))}
               </div>

               <div className="flex justify-end gap-3">
                  <button onClick={() => setPendingAiChanges(null)} className={\`px-4 py-2 font-medium rounded-lg transition-colors \${isDark ? "text-zinc-300 hover:bg-zinc-800" : "text-zinc-600 hover:bg-zinc-100"}\`}>
                     {t('Anulo', 'Cancel')}
                  </button>
                  <button onClick={() => {
                        const pd = pendingAiChanges;
                        setPendingAiChanges(null);
                        executeProtectedAction(async () => {
                           const updatedDocs = documents.map(d => {
                               if (d.id === pd.documentId) {
                                   const newRowsWithImages = pd.newRows.map((nr: any, idx: number) => {
                                       return { ...nr, image: d.rows[idx]?.image || null };
                                   });

                                   if (activeDocId === d.id) {
                                      setRows(newRowsWithImages);
                                      setHeaders(pd.newHeaders);
                                      if (pd.newColumnWidths) setColumnWidths(pd.newColumnWidths);
                                      updateActiveDocumentState(title, newRowsWithImages, pd.newHeaders, pd.newColumnWidths);
                                   }
                                   return { ...d, rows: newRowsWithImages, headers: pd.newHeaders, columnWidths: pd.newColumnWidths || d.columnWidths, updatedAt: new Date().toISOString() };
                               }
                               return d;
                           });
                           setDocuments(updatedDocs);
                           localStorage.setItem('grid_notepad_documents_v2', JSON.stringify(updatedDocs));
                           showToast(t("Struktura u përditësua nga AI!", "Structure updated by AI!"));
                           
                           // Try saving to cloud
                           import('firebase/firestore').then(({ setDoc, doc }) => {
                               const theDoc = updatedDocs.find((x) => x.id === pd.documentId);
                               if (user && theDoc) setDoc(doc(db, 'documents', theDoc.id), theDoc).catch(()=>console.error('ai header error sync'));
                           }).catch(()=>console.log('firebase error module'));
                        });
                  }} className="px-4 py-2 bg-accent-600 hover:bg-accent-500 text-white font-medium rounded-lg transition-colors">
                     {t('Apliko Ndryshimet', 'Apply Changes')}
                  </button>
               </div>
            </div>
         </div>
      )}
`;

code = code.replace(/\{\/\* CONFIRMATION MODAL - CLOSE \*\/\}/, modalCode + "\n      {/* CONFIRMATION MODAL - CLOSE */}");
fs.writeFileSync('src/components/Notepad.tsx', code, 'utf8');
