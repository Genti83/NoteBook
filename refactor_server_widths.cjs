const fs = require('fs');

let serverContent = fs.readFileSync('server.ts', 'utf8');

serverContent = serverContent.replace(/"newHeaders": \["Data", "Emri", "Sasia \(kg\)", "Cmimi", "Vlera"\],/, 
`"newHeaders": ["Data", "Emri", "Sasia (kg)", "Cmimi", "Vlera"],
       "newColumnWidths": [120, 200, 100, 100, 150],`);

serverContent = serverContent.replace(/Nëse përdoruesi të kërkon \*TË NDRYSHOSH TITUJT E KOLONAVE.*?\)/,
`Nëse përdoruesi të kërkon *TË NDRYSHOSH TITUJT E KOLONAVE (headers)* (ose të shtosh kolona të reja apo të ndryshosh/zgjatosh gjerësinë e kolonave)`);

// "col2, col3, col4... deri tek numri aktual i kolonave referuar listës "headers")" Add widths too.
serverContent = serverContent.replace(/numri aktual i kolonave referuar listës "headers"\):/, 
`numri aktual i kolonave referuar listës "headers", bashkë me gjerësinë 'columnWidths'):`);

fs.writeFileSync('server.ts', serverContent, 'utf8');
console.log('updated server prompt');
