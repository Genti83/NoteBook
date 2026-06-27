const fs = require('fs');
let s = fs.readFileSync('src/components/Notepad.tsx', 'utf8');

// Replace translucent blue/accent buttons
s = s.replace(/bg-accent-600\/20 text-accent-400 (?:border-accent-500\/20 )?hover:bg-accent-600\/30/g, "bg-accent-600 hover:bg-accent-500 text-white shadow-md border-transparent");
s = s.replace(/bg-accent-50 text-accent-600 (?:border-accent-200 )?hover:bg-accent-100/g, "bg-accent-500 hover:bg-accent-600 text-white shadow-md font-bold border-transparent");

// Replace translucent green buttons
s = s.replace(/bg-green-600\/20 text-green-400 border-green-500\/30 hover:bg-green-600\/30/g, "bg-green-600 hover:bg-green-500 text-white shadow-md border-transparent");
s = s.replace(/bg-green-50 text-green-600 border-green-200 hover:bg-green-100/g, "bg-green-500 hover:bg-green-600 text-white shadow-md font-bold border-transparent");

// Replace translucent purple buttons
s = s.replace(/bg-purple-600\/20 text-purple-400 border-purple-500\/20 hover:bg-purple-600\/30/g, "bg-purple-600 hover:bg-purple-500 text-white shadow-md border-transparent");
s = s.replace(/bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100/g, "bg-purple-500 hover:bg-purple-600 text-white shadow-md font-bold border-transparent");

// Replace translucent blue buttons
s = s.replace(/bg-blue-500\/10 border-blue-500\/20 text-blue-500 hover:bg-blue-500\/20/g, "bg-blue-600 hover:bg-blue-500 text-white shadow-md border-transparent");
s = s.replace(/bg-blue-50 border-orange-200 text-blue-600 hover:bg-blue-100/g, "bg-blue-500 hover:bg-blue-600 text-white shadow-md font-bold border-transparent");

// Replace translucent red buttons
s = s.replace(/bg-red-500\/10 border-red-500\/20 text-red-500 hover:bg-red-500\/20/g, "bg-red-600 hover:bg-red-500 text-white shadow-md border-transparent");
s = s.replace(/bg-red-50 border-red-200 text-red-600 hover:bg-red-100/g, "bg-red-500 hover:bg-red-600 text-white shadow-md font-bold border-transparent");
s = s.replace(/bg-red-950 hover:bg-red-900 text-red-500 border-red-900\/30/g, "bg-red-600 hover:bg-red-500 text-white shadow-md border-transparent");

// Replace red outline buttons (trash)
s = s.replace(/bg-red-950\/30 hover:bg-red-900 border-red-900\/50 text-red-500/g, "bg-red-600 hover:bg-red-500 text-white shadow-md border-transparent");

// TXT CSV PDF buttons
s = s.replace(/hover:bg-zinc-800 text-zinc-400 hover:text-zinc-300/g, "bg-zinc-800 hover:bg-zinc-700 text-white shadow-sm border-transparent");
s = s.replace(/hover:bg-zinc-100 text-zinc-500 hover:text-zinc-700/g, "bg-zinc-200 hover:bg-zinc-300 text-zinc-900 font-bold shadow-sm border-transparent");

// Replace small buttons in the toolbar (Ok, Sekrete, X, Hiq Statusin)
s = s.replace(/hover:bg-green-900\/40 text-green-500/g, "bg-green-600/90 text-white hover:bg-green-500 shadow-sm");
s = s.replace(/hover:bg-green-100 text-green-600/g, "bg-green-500/90 text-white hover:bg-green-600 shadow-sm");

s = s.replace(/hover:bg-blue-900\/40 text-blue-500/g, "bg-blue-600/90 text-white hover:bg-blue-500 shadow-sm");
s = s.replace(/hover:bg-blue-100 text-blue-600/g, "bg-blue-500/90 text-white hover:bg-blue-600 shadow-sm");

s = s.replace(/hover:bg-red-900\/40 text-red-500/g, "bg-red-600/90 text-white hover:bg-red-500 shadow-sm");
s = s.replace(/hover:bg-red-100 text-red-600/g, "bg-red-500/90 text-white hover:bg-red-600 shadow-sm");

s = s.replace(/hover:bg-zinc-800 text-zinc-400/g, "bg-zinc-700 text-white hover:bg-zinc-600 shadow-sm font-bold");
s = s.replace(/hover:bg-zinc-200 text-zinc-600/g, "bg-zinc-300 text-zinc-900 hover:bg-zinc-400 shadow-sm font-bold");

// Theme switch & theme menu
s = s.replace(/bg-zinc-800 text-accent-500 hover:bg-zinc-700/g, "bg-accent-600 hover:bg-accent-500 text-white shadow-md border-transparent");
s = s.replace(/bg-white border border-zinc-300 text-accent-600 hover:bg-zinc-100/g, "bg-accent-500 hover:bg-accent-600 text-white shadow-md font-bold border-transparent");

s = s.replace(/bg-zinc-800 text-yellow-400 hover:bg-zinc-700/g, "bg-yellow-600 hover:bg-yellow-500 text-white shadow-md border-transparent");
s = s.replace(/bg-white border border-zinc-300 text-zinc-600 hover:bg-zinc-100/g, "bg-zinc-800 hover:bg-zinc-700 text-white shadow-md font-bold border-transparent");

// Back button "Kthehu" in the toolbar
s = s.replace(/bg-zinc-800 hover:bg-zinc-700 text-zinc-300/g, "bg-zinc-700 hover:bg-zinc-600 text-white shadow-md font-bold");

fs.writeFileSync('src/components/Notepad.tsx', s);
