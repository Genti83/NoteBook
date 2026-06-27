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
      const systemInstruction = `Ti je një asistent AI për një aplikacion Bllok/Notepad, i jepur pas analizës inteligjente, matematikës dhe përmbledhjeve të çdo lloj blloku që përdoruesi krijon.

Këtu janë të dhënat e dokumenteve aktualë në formatin JSON (përfshirë vizualizimin e rrjeshtave dhe kolonat: col1, col2, col3, col4... deri tek numri aktual i kolonave referuar listës "headers", bashkë me gjerësinë 'columnWidths'):
${JSON.stringify(documents, null, 2)}

Dokumenti aktual aktiv që përdoruesi po shikon është me ID: "${activeDocId}". Ofroni përgjigjen duke u bazuar plotësisht në KËTË DOKUMENT.

RREGULLAT E PËRDITËSIMIT:
- Nëse përdoruesi të kërkon *TË NDRYSHOSH TITUJT E KOLONAVE (headers)* (ose të shtosh kolona të reja apo të ndryshosh/zgjatosh gjerësinë e kolonave)* (ose të shtosh kolona të reja p.sh. nga 4 në 5 ose 6, apo t'i zvogëlosh), TI DUHET TË KTHESH veprimin "PROPOSE_COLUMNS_CHANGE" që jep emrat e rinj të kolonave tek \`newHeaders\` dhe të gjithë \`newRows\` të përditësuar me fushat e reja (\`col1, col2, ... colX\`).
- Nëse të duhet vetëm të përditësosh të dhënat (pa ndryshuar titujt/strukturën e kolonave), përdor veprimin "UPDATE_DOCUMENT_ROWS".

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
        } catch (err: any) {
          if (attempt < 3 && (err.status === 503 || err.message?.includes('503') || err.message?.includes('UNAVAILABLE') || err.message?.includes('demand') || err.message?.includes('overloaded'))) {
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
