const fs = require('fs');
let text = fs.readFileSync('src/components/Notepad.tsx', 'utf8');

text = text.replace(/headers: string\[\];/, 'headers: string[];\n  columnWidths?: number[];');
text = text.replace(/const \[headers, setHeaders\] = useState/, 'const [columnWidths, setColumnWidths] = useState<number[]>([]);\n  const [headers, setHeaders] = useState');

text = text.replace(/const updateActiveDocumentState = \(newTitle: string, newRows: GridRow\[\], newHeaders: string\[\]\) => \{/, 
`const updateActiveDocumentState = (newTitle: string, newRows: GridRow[], newHeaders: string[], newWidths: number[] = columnWidths) => {`);

text = text.replace(/headers: newHeaders,\n\s*rows: newRows/g, 'headers: newHeaders,\n        columnWidths: newWidths,\n        rows: newRows');

text = text.replace(/setHeaders\(doc\.headers\);/, 'setHeaders(doc.headers);\n    setColumnWidths(doc.columnWidths || []);');

fs.writeFileSync('src/components/Notepad.tsx', text, 'utf8');
console.log('done refactoring state');
