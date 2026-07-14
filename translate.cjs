const fs = require('fs');

let content = fs.readFileSync('src/components/Notepad.tsx', 'utf8');

const translations = {
  "Dëgjimi u ndal": "Listening stopped",
  "Shfletuesi juaj nuk e suporton Voice-to-Text.": "Your browser does not support Voice-to-Text.",
  "Teksti u shtua!": "Text added!",
  "Ju lutem lejoni përdorimin e mikrofonit.": "Please allow microphone usage.",
  "Gabim në dëgjim.": "Listening error.",
  "Po dëgjojmë... Flisni tani.": "Listening... Speak now.",
  "Dokumenti u përditësua nga AI!": "Document updated by AI!",
  "Nuk mund të hapet mikrofoni.": "Could not open microphone.",
  "Gabim gjatë marrjes nga Cloud.": "Error fetching from Cloud.",
  "Dokumenti u fshi nga Cloud.": "Document deleted from Cloud.",
  "Gabim gjatë fshirjes nga Cloud.": "Error deleting from Cloud.",
  "Llogaria u krijua!": "Account created!",
  "Hyrje e suksesshme!": "Login successful!",
  "Gabim gjatë hyrjes me Google: ": "Error logging in with Google: ",
  "Pin u krijua me sukses!": "PIN created successfully!",
  "Dokumenti u fshi!": "Document deleted!",
  "U ruajt me sukses!": "Saved successfully!",
  "Zgjidhni rrjeshta (klikoni numrat majtas) për të ndryshuar statusin!": "Select rows (click numbers on the left) to change status!",
  "Duke gjeneruar imazhin...": "Generating image...",
  "Imazhi u gjenerua!": "Image generated!",
  "Gabim gjatë gjenerimit të imazhit!": "Error generating image!",
  "Të gjitha 90 rrjeshtat u boshatisën!": "All 90 rows cleared!",
  "Rrjeshtat u boshatisën (struktura u ruajt)!": "Rows cleared (structure preserved)!",
  "Dokumenti TXT u shkarkua!": "TXT document downloaded!",
  "Blloku është bosh!": "Notepad is empty!",
  "Dokumenti u ruajt në dosjen e zgjedhur!": "Document saved in selected folder!",
  "Dokumenti CSV u shkarkua!": "CSV document downloaded!",
  "Dokumenti PDF u shkarkua!": "PDF document downloaded!",
  "Nuk ka asnjë dokument për të ruajtur.": "No documents to save.",
  "Arkiva PDF u ruajt në dosjen e zgjedhur!": "PDF Archive saved in selected folder!",
  "Arkiva PDF u shkarkua!": "PDF Archive downloaded!",
  "Kopja e rezervës u ruajt në pajisjen tuaj!": "Backup saved to your device!",
  "Gabim gjatë ruajtjes së kopjes rezervë.": "Error saving backup.",
  "Të dhënat u rikthyen me sukses nga pajisja!": "Data successfully restored from device!",
  "Skedari nuk është i vlefshëm për këtë aplikacion.": "File is not valid for this application.",
  "Skedari i dëmtuar ose i pavlefshëm.": "Corrupted or invalid file.",
  "Të gjitha dokumentet u ruajtën në Cloud!": "All documents saved to Cloud!",
  "Pati një problem gjatë ngarkimit në Cloud.": "There was a problem uploading to Cloud.",
  "Nuk keni asnjë PIN të vendosur.": "You have no PIN set.",
  "PIN u fshi me sukses nga pajisja.": "PIN successfully deleted from device.",
  "Të gjitha të dhënat u fshinë nga pajisja.": "All data was deleted from device.",
  "Të dhënat u eksportuan si JSON.": "Data exported as JSON.",
  "Të dhënat u importuan me sukses!": "Data imported successfully!",
  "Gabim gjatë importimit të skedarit JSON.": "Error importing JSON file.",
  "Dokumentet u renditën A-Z.": "Documents sorted A-Z.",
  "Dokumentet u renditën Z-A.": "Documents sorted Z-A.",
  "Dokumentet u renditën më të rejat të parat.": "Documents sorted newest first.",
  "Dokumentet u renditën më të vjetrat të parat.": "Documents sorted oldest first.",
  "Titujt u kapitalizuan me sukses.": "Titles capitalized successfully.",
  "Nuk kishte asnjë status rrjeshti për të fshirë.": "No row status to delete.",
  "Nuk u gjetën dokumente bosh.": "No empty documents found.",
  "Nuk kishte asnjë rrjesht bosh për t'u pastruar.": "No empty row to clear.",
  "Asnjë imazh nuk u gjet.": "No image found.",
  "Parametrat vizualë u kthyen në vlerat fillestare!": "Visual parameters reset to defaults!",
  "Po pastrohet cache...": "Clearing cache...",
  "PIN i gabuar!": "Wrong PIN!",
  "Shënimet sekrete u ruajtën!": "Secret notes saved!",
  "Dokumenti u ruajt në memorien e telefonit!": "Document saved in phone memory!",
  "Imazhi (Rrjeshti) u zgjodh!": "Image (Row) selected!",
  "Hap me Google": "Open with Google",
  "Kyçja dështoi.": "Login failed."
};

for (const [sq, en] of Object.entries(translations)) {
  const safeSq = sq.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`showToast\\(["']${safeSq}["']\\)`, 'g');
  content = content.replace(regex, `showToast(t('${sq.replace(/'/g, "\\'")}', '${en.replace(/'/g, "\\'")}'))`);
}

// Regex for template string showToasts
content = content.replace(/showToast\(`U fshinë \\$\\{statusesRemoved\\} statuse ngjyrash nga rrjeshtat\\.`\)/g, "showToast(t(`U fshinë ${statusesRemoved} statuse ngjyrash nga rrjeshtat.`, `${statusesRemoved} color statuses removed from rows.`))");
content = content.replace(/showToast\(`U fshinë me sukses \\$\\{emptyCount\\} dokumente bosh\\.`\)/g, "showToast(t(`U fshinë me sukses ${emptyCount} dokumente bosh.`, `Successfully deleted ${emptyCount} empty documents.`))");
content = content.replace(/showToast\(`U pastruan \\$\\{totalCleaned\\} rrjeshta bosh kudo\\.`\)/g, "showToast(t(`U pastruan ${totalCleaned} rrjeshta kudo.`, `Cleared ${totalCleaned} rows everywhere.`))");
content = content.replace(/showToast\(`U fshinë me sukses \\$\\{imagesRemoved\\} imazhe\\.`\)/g, "showToast(t(`U fshinë me sukses ${imagesRemoved} imazhe.`, `Successfully deleted ${imagesRemoved} images.`))");

// More regular replacements for things we missed:
const otherTranslations = {
  "Po, Boshatis": "Yes, Clear",
  "Ndërro Ngjyrën": "Change Color",
  "Kujdes!": "Warning!",
  "Jeni i sigurt që doni të boshatisni ": "Are you sure you want to clear ",
  "rrjeshtat e zgjedhur\\? Ky veprim nuk mund të kthehet mbrapsht\\.": "selected rows? This action cannot be undone.",
  "të 90 rrjeshtat\\? Ky veprim nuk mund të kthehet mbrapsht\\.": "all 90 rows? This action cannot be undone.",
  "Ruaj Ndryshimet": "Save Changes",
  "Anulo": "Cancel"
};

for (const [sq, en] of Object.entries(otherTranslations)) {
  const safeSq = sq.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  let regex = new RegExp(`>\\s*${safeSq}\\s*<`, 'g');
  content = content.replace(regex, `>{t('${sq}', '${en}')}<`);
  
  let regexTitle = new RegExp(`title=["']${safeSq}["']`, 'g');
  content = content.replace(regexTitle, `title={t("${sq}", "${en}")}`);
}

content = content.replace(/>\\s*Jeni i sigurt që doni të boshatisni \\{selectedRows\\.size\\} rrjeshtat e zgjedhur\\? Ky veprim nuk mund të kthehet mbrapsht\\.\\s*</g, 
  ">{t(`Jeni i sigurt që doni të boshatisni ${selectedRows.size} rrjeshtat e zgjedhur? Ky veprim nuk mund të kthehet mbrapsht.`, `Are you sure you want to clear ${selectedRows.size} selected rows? This action cannot be undone.`)}<");

content = content.replace(/>\\s*Jeni i sigurt që doni të boshatisni të 90 rrjeshtat\\? Ky veprim nuk mund të kthehet mbrapsht\\.\\s*</g, 
  ">{t(`Jeni i sigurt që doni të boshatisni të 90 rrjeshtat? Ky veprim nuk mund të kthehet mbrapsht.`, `Are you sure you want to clear all 90 rows? This action cannot be undone.`)}<");

fs.writeFileSync('src/components/Notepad.tsx', content, 'utf8');

console.log("Translation script completed.");
