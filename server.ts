import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // AI API Route handlers
  app.post('/api/ai/chat', async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: 'GEMINI_API_KEY environment variable is missing.' });
      }

      const { prompt, documents, activeDocId, image, audio } = req.body;
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      // We give the AI the context of all documents in JSON format,
      // and ask it to answer the user's question.
      const systemInstruction = `Ti je një asistent AI për një aplikacion Bllok/Notepad, i jepur pas analizës inteligjente, matematikës dhe përmbledhjeve të çdo lloj blloku që përdoruesi krijon. Përdoruesi po të jep akses të plotë tek TË GJITHA DOKUMENTAT në PLATFORMË (përfshirë të dhënat ngarkuara nga JSON, TXT, PDF, CSV që figurojnë kudo si shënime). Ti duhet të zbulosh, analizosh dhe testosh rezultatet e llogaritjeve apo sa numër personash përmenden, si dhe të gjurmosh e analizosh nëse ka shënime dhe rreshta që mund të kenë qenë fshirë gabimisht nga blloku aktiv por që ruhen ende në ndonjë dokument apo bllok tjetër për korrigjim/riviktim. Kujdes me të dhënat dhe mos ndrysho strukturën pa dashjen e përdoruesit!
Gjithashtu ke për detyrë të ndihmosh si inxhinier dhe të analizosh problemin kur dokumentet (CSV, PDF, TXT, JSON) nuk shkarkohen ose nuk shkojnë në "Dosjen e Bllokut (Kërkon Android/PC)". Ti mund të theksosh se teknologjia \`showDirectoryPicker\` funksionon zakonisht në PC, ndërsa në Android për shkak të kufizimeve të shfletuesit apo iFrame zakonisht bie në mekanizmin fallback "download". Kur përdoruesi të kërkojë ndihmë pse nuk shkojnë në dosje, gjej detaje teknike teorike mbi ruajtjen në shfletues dhe thuaji "Këtu është mesazhi i gabimit që mund t'i dërgosh zhvilluesit: ..." duke theksuar mekanizmat e Download API-t ose lejet në ueb, në mënyrë që përdoruesi ta kopjojë dhe t'ia dërgojë inxhinierit.
Këtu janë të dhënat e dokumenteve aktualë në formatin JSON (përfshirë vizualizimin e rrjeshtave dhe kolonat: col1, col2, col3, col4... deri tek numri aktual i kolonave referuar listës "headers", bashkë me gjerësinë 'columnWidths'):
${JSON.stringify(documents, null, 2)}

Dokumenti aktual aktiv që përdoruesi po shikon është me ID: "${activeDocId}". Ofroni përgjigjen duke u bazuar plotësisht në KËTË DOKUMENT.

RREGULLAT E PËRDITËSIMIT:
- Përdoruesi sugjeron TË MOS NDRYSHOSH STRUKTURËN (kolonat) asnjëherë apo të zhbësh shënimet, vetëm t'i përditësosh të dhënat brenda, pra gjej problemet dhe theksoji ato.
- Nëse përdoruesi të kërkon SHPREHIMISHT *TË NDRYSHOSH TITUJT E KOLONAVE (headers)* (ose të shtosh kolona të reja apo të ndryshosh/zgjatosh gjerësinë e kolonave)* (ose të shtosh kolona të reja p.sh. nga 4 në 5 ose 6, apo t'i zvogëlosh), TI DUHET TË KTHESH veprimin "PROPOSE_COLUMNS_CHANGE" që jep emrat e rinj të kolonave tek \`newHeaders\` dhe të gjithë \`newRows\` të përditësuar me fushat e reja (\`col1, col2, ... colX\`).
- Nëse të duhet vetëm të përditësosh të dhënat dhe rreshtat per rregullime apo llogaritje (pa ndryshuar titujt/strukturën e kolonave siç këshillohet), përdor veprimin "UPDATE_DOCUMENT_ROWS" (dhe kthe \`documentId\` e dokumentit konkret që rregullon).

TI GJITHMONË DUHET TË KTHESH PËRGJIGJEN TËNDE NË FORMATIN JSON SI MË POSHTË:
{
  "text": "Teksti i përgjigjes tënde për përdoruesin dhe/ose raporti i llogaritjeve",
  "actions": [
    {
       "type": "PROPOSE_COLUMNS_CHANGE",
       "documentId": "id_e_dokumentit_qe_po_ndryshon",
       "newHeaders": ["Data", "Emri", "Sasia (kg)", "Cmimi", "Vlera"],
       "newColumnWidths": [120, 200, 100, 100, 150],
       "newRows": [
          // Array i plotë i rrjeshtave sipas numrit të ri të kolonave (id, col1, col2, col3, col4, col5..., status)
       ]
    },
    // OSE Nëse nuk ndryshon kolonat, veprimi duhet të jetë:
    {
       "type": "UPDATE_DOCUMENT_ROWS",
       "documentId": "id_e_dokumentit_qe_po_ndryshon",
       "newRows": [
          // Array i plotë i rrjeshtave (id, col1, col2, col3, col4, status) duke ruajtur kolonat aktuale
       ]
    }
  ]
}

Nëse ka nevojë të përditësosh rrjeshtat, kthe të gjithë rrjeshtat sipas renditjes (deri në 90), mundësisht duke ruajtur formatin e atyre që mbeten të paprekura.
Kthe VETËM JSON të vlefshëm!`;

      for (let attempt = 0; attempt < 4; attempt++) {
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: (() => { const parts: any[] = [{ text: prompt }]; if (image) { const b = image.split(',')[1]; const m = image.split(';')[0].split(':')[1]; parts.push({ inlineData: { data: b, mimeType: m } }); } if (audio) { const b = audio.split(',')[1]; const m = audio.split(';')[0].split(':')[1]; parts.push({ inlineData: { data: b, mimeType: m } }); } return parts; })(),
            config: {
              systemInstruction,
              temperature: 0.1,
              responseMimeType: 'application/json'
            }
          });

          const parsedResponse = JSON.parse(response.text || '{}');
          return res.json(parsedResponse);
        } catch (err: any) {
          const isRateLimit = err.status === 429 || err.message?.includes('429') || err.message?.includes('quota');
          if (attempt === 0 && isRateLimit) {
            try {
              // Fallback to gemini-1.5-flash or pro
              const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: (() => { const parts: any[] = [{ text: prompt }]; if (image) { const b = image.split(',')[1]; const m = image.split(';')[0].split(':')[1]; parts.push({ inlineData: { data: b, mimeType: m } }); } if (audio) { const b = audio.split(',')[1]; const m = audio.split(';')[0].split(':')[1]; parts.push({ inlineData: { data: b, mimeType: m } }); } return parts; })(),
                config: {
                  systemInstruction,
                  temperature: 0.1,
                  responseMimeType: 'application/json'
                }
              });
              const parsedResponse = JSON.parse(response.text || '{}');
              return res.json(parsedResponse);
            } catch (fallbackErr: any) {
               throw fallbackErr; // If fallback fails too, let it pass down
            }
          }

          if (attempt < 3 && (err.status === 503 || err.message?.includes('503') || err.message?.includes('UNAVAILABLE') || err.message?.includes('demand') || err.message?.includes('overloaded') || isRateLimit)) {
            // Exponential backoff
            await new Promise(r => setTimeout(r, (attempt + 1) * 3000));
            continue;
          }
          throw err;
        }
      }
    } catch (err: any) {
      console.error('AI Chat Error:', err);
      let errMsg = err.message || 'Ndodhi një gabim gjatë komunikimit me AI.';
      if (typeof errMsg === 'string' && (errMsg.includes('503') || errMsg.includes('demand') || errMsg.includes('UNAVAILABLE'))) {
         errMsg = 'Serveri i AI është i mbingarkuar për momentin (Spike në kërkesa). Ju lutem provoni përsëri pas pak.';
      } else if (typeof errMsg === 'string' && (errMsg.includes('quota') || errMsg.includes('exceeded') || errMsg.includes('429'))) {
         errMsg = 'Keni tejkaluar limitin ditor falas të API-së së AI. Ju lutem provoni përsëri më vonë ose ndërshkoni planin tuaj.';
      }
      res.status(500).json({ error: errMsg });
    }
  });



  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
