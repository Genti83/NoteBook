const fs = require('fs');
let code = fs.readFileSync('src/components/Notepad.tsx', 'utf8');

// 1. Add state variable
code = code.replace(
  /const \[docSearch, setDocSearch\] = useState\(''\);/,
  "const [docSearch, setDocSearch] = useState('');\n  const [docToDelete, setDocToDelete] = useState<string | null>(null);"
);

// 2. Add Modal JSX
const modalJSX = `      {/* CONFIRMATION MODAL - DELETE DOC */}
      {docToDelete && (
         <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
            <div className={\`max-w-md w-full p-6 rounded-2xl shadow-2xl border \${isDark ? "bg-zinc-900 border-zinc-700" : "bg-white border-zinc-300"}\`}>
               <h3 className={\`text-xl font-bold mb-3 text-red-500\`}>{t('Kujdes!', 'Warning!')}</h3>
               <p className={\`mb-6 \${isDark ? "text-zinc-400" : "text-zinc-600"}\`}>{t('Jeni i sigurt që doni ta fshini këtë dokument? Ky veprim nuk mund të kthehet mbrapsht.', 'Are you sure you want to delete this document? This action cannot be undone.')}</p>
               <div className="flex justify-end gap-3">
                  <button onClick={() => setDocToDelete(null)} className={\`px-4 py-2 font-medium rounded-lg transition-colors \${isDark ? "text-zinc-300 hover:bg-zinc-800" : "text-zinc-600 hover:bg-zinc-100"}\`}>
                     {t('Anulo', 'Cancel')}
                  </button>
                  <button onClick={() => {
                     const id = docToDelete;
                     setDocToDelete(null);
                     executeProtectedAction(async () => {
                        const updatedDocs = documents.filter(d => d.id !== id);
                        setDocuments(updatedDocs);
                        localStorage.setItem('grid_notepad_documents_v2', JSON.stringify(updatedDocs));
                        if (user) {
                           import('firebase/firestore').then(({ deleteDoc, doc }) => {
                               deleteDoc(doc(db, 'documents', id)).catch(() => {});
                           });
                        }
                        showToast(t('Dokumenti u fshi!', 'Document deleted!'));
                     });
                  }} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg transition-colors">
                     {t('Po, Fshijë', 'Yes, Delete')}
                  </button>
               </div>
            </div>
         </div>
      )}

      {/* CONFIRMATION MODAL - CLOSE */}`;

code = code.replace(/\{\/\* CONFIRMATION MODAL - CLOSE \*\/\}/, modalJSX);

// 3. Update the button
code = code.replace(/deleteDocument\(e, doc\.id\)/, "(e) => { e.stopPropagation(); setDocToDelete(doc.id); }");

fs.writeFileSync('src/components/Notepad.tsx', code, 'utf8');
console.log('done');
