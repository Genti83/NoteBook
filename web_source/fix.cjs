const fs = require('fs');
let code = fs.readFileSync('src/components/Notepad.tsx', 'utf8');

const startText = "{/* PIN MODAL */}";
const endText = "{/* TOAST CUSTOM FOR INNER VIEW */}";

const startIndex = code.indexOf(startText);
const endIndex = code.indexOf(endText);

if (startIndex === -1 || endIndex === -1) {
    console.error("Tags not found");
    process.exit(1);
}

const modalsCode = code.substring(startIndex, endIndex);

// Remove from old place
code = code.substring(0, startIndex) + code.substring(endIndex);

const replacePoint = "  if (appLocked) {";
const splitCode = `  const renderSharedModals = () => (
    <>
${modalsCode}
    </>
  );

  if (appLocked) {`;

code = code.replace(replacePoint, splitCode);

// Inject `{renderSharedModals()}` in appLocked return
code = code.replace("          </div>\n      );\n  }", "          </div>\n         {renderSharedModals()}\n      );\n  }");

// Inject in catalog return
code = code.replace("         {/* TOAST CUSTOM */}\n         {toastMessage && (\n            <div className=\"absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-accent-600 text-white px-4 py-2 rounded-lg shadow-lg font-medium text-sm animate-in fade-in slide-in-from-bottom-4 z-50\">\n               {toastMessage}\n            </div>\n         )}\n      </div>\n    );\n  }", "         {/* TOAST CUSTOM */}\n         {toastMessage && (\n            <div className=\"absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-accent-600 text-white px-4 py-2 rounded-lg shadow-lg font-medium text-sm animate-in fade-in slide-in-from-bottom-4 z-50\">\n               {toastMessage}\n            </div>\n         )}\n         {renderSharedModals()}\n      </div>\n    );\n  }");

// Inject in active doc return
code = code.replace("{/* TOAST CUSTOM FOR INNER VIEW */}", "{renderSharedModals()}\n\n      {/* TOAST CUSTOM FOR INNER VIEW */}");

fs.writeFileSync('src/components/Notepad.tsx', code);
console.log("Modals moved to function!");
