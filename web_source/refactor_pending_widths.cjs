const fs = require('fs');
let code = fs.readFileSync('src/components/Notepad.tsx', 'utf8');

code = code.replace(/const \[pendingAiChanges, setPendingAiChanges\] = useState<\{[^\}]*\} \| null>\(null\);/, 
  'const [pendingAiChanges, setPendingAiChanges] = useState<{ documentId: string, newHeaders: string[], newColumnWidths?: number[], newRows: GridRow[] } | null>(null);');

let matchStr = `                if (act.type === 'PROPOSE_COLUMNS_CHANGE' && act.documentId && act.newHeaders && act.newRows) {
                   setPendingAiChanges({
                      documentId: act.documentId,
                      newHeaders: act.newHeaders,
                      newRows: act.newRows
                   });`;
let replStr = `                if (act.type === 'PROPOSE_COLUMNS_CHANGE' && act.documentId && act.newHeaders && act.newRows) {
                   setPendingAiChanges({
                      documentId: act.documentId,
                      newHeaders: act.newHeaders,
                      newColumnWidths: act.newColumnWidths,
                      newRows: act.newRows
                   });`;
code = code.replace(matchStr, replStr);

let confirmStr = `                           if (activeDocId === d.id) {
                              setRows(newRowsWithImages);
                              setHeaders(pd.newHeaders);
                           }
                           showToast(t("Struktura u përditësua nga AI!", "Structure updated by AI!"));
                           return { ...d, rows: newRowsWithImages, headers: pd.newHeaders, updatedAt: new Date().toISOString() };`;
let replConfirmStr = `                           if (activeDocId === d.id) {
                              setRows(newRowsWithImages);
                              setHeaders(pd.newHeaders);
                              if (pd.newColumnWidths) setColumnWidths(pd.newColumnWidths);
                           }
                           showToast(t("Struktura u përditësua nga AI!", "Structure updated by AI!"));
                           return { ...d, rows: newRowsWithImages, headers: pd.newHeaders, columnWidths: pd.newColumnWidths || d.columnWidths, updatedAt: new Date().toISOString() };`;

code = code.replace(confirmStr, replConfirmStr);

fs.writeFileSync('src/components/Notepad.tsx', code, 'utf8');
console.log('done updating notepad pending');
