# 📓 Bllok Shënimesh — Android APK

Projekti Android i **Bllok Shënimesh NoteBook2** — konvertim autentik i aplikacionit web në APK native.

---

## 🏗️ Struktura e Projektit

```
NoteBook/
├── app/
│   ├── src/main/
│   │   ├── java/al/gen/notebook/
│   │   │   └── MainActivity.kt        ← Kodi Kotlin kryesor
│   │   ├── assets/www/                ← ⚠️  Vendosni skedarët e build-it këtu
│   │   ├── res/                       ← Resources (ikona, teme, strings)
│   │   └── AndroidManifest.xml
│   └── build.gradle
├── build_assets.sh                    ← Skripti i build-it automatik
├── build.gradle
├── settings.gradle
└── README.md
```

---

## 🚀 Hapat e Build-it (Hera e Parë)

### Kërkesat
- **Node.js** v18+ dhe **npm** (për të ndërtuar web app-in)
- **Android Studio** Hedgehog 2023.1+ (për të ndërtuar APK)
- **Java** 17+
- **Android SDK** API 34 (të instaluar përmes Android Studio)

---

### Hapi 1 — Ndërtoni Web App-in

Ekstraktoni zip-in origjinal të projektit web, pastaj:

```bash
# Metoda A — Skripti automatik (Linux/Mac)
chmod +x build_assets.sh
./build_assets.sh /rruga/te/bllok-shenimesh-web/

# Metoda B — Manualisht (të gjitha platformat)
cd /rruga/te/bllok-shenimesh-web/
npm install
npm run build
# Pastaj kopjoni manulisht dist/* → app/src/main/assets/www/
```

> **Rezultati:** Dosja `app/src/main/assets/www/index.html` duhet të ekzistojë.

---

### Hapi 2 — Hapni në Android Studio

1. Hapni **Android Studio**
2. **File → Open** → zgjidhni dosjen `NoteBook/`
3. Prisni **Gradle sync** të përfundojë (~1-3 min hera e parë)
4. Klikoni **Build → Rebuild Project**

---

### Hapi 3 — Ndërtoni APK

**APK për testim (Debug):**
```
Build → Build Bundle(s) / APK(s) → Build APK(s)
```
APK ndodhet te: `app/build/outputs/apk/debug/app-debug.apk`

**APK për publikim (Release i nënshkruar):**
```
Build → Generate Signed Bundle/APK → APK
```
Krijoni keystore nëse nuk keni, pastaj ndiqni udhëzuesin.

---

## 🤖 Konfigurimi i AI Chat (Gemini)

Funksioni **AI Chat** kërkon një çelës Gemini API:

1. Shkoni tek **[ai.google.dev](https://ai.google.dev/gemini-api/docs/api-key)**
2. Krijoni API Key falas (Google account kërkohet)
3. Kur aplikacioni hapet për herë të parë, do t'ju kërkojë çelësin
4. Ose mund ta vendosni manualisht te: `Settings` brenda aplikacionit

> **Model:** `gemini-2.5-flash` — i njëjtë me web app-in origjinal.

---

## 🔥 Firebase (Sync Cloud)

Aplikacioni përdor të njëjtën konfiguracion Firebase si web app-i:

```json
Project ID: gen-lang-client-0285886461
App ID: 1:763941768009:web:a9f760da30e951bae1e898
```

### Autentifikimi Firebase

| Metoda | Statusi | Shënim |
|--------|---------|--------|
| Email/Fjalëkalim | ✅ Funksionon plotësisht | |
| Google Sign-In | ⚠️ Kufizimet e WebView | Hapet si popup i jashtëm |
| Firestore sync | ✅ Funksionon plotësisht | |
| Auto-save cloud | ✅ Funksionon plotësisht | |

---

## 📱 Funksionet dhe Mbështetja

| Funksion | Statusi |
|----------|---------|
| 90 rrjeshta + kolona dinamike | ✅ |
| Shumë dokumente | ✅ |
| Shënim i errët/ndritshëm | ✅ |
| Statuset (✓, ✗, 🔒, etiketa) | ✅ |
| Eksporti TXT, CSV, PDF | ✅ Shkruan te Downloads/ |
| Ngarkim imazhesh | ✅ |
| Voice-to-Text (sq-AL) | ✅ Me leje mikrofoni |
| AI Chat (Gemini) | ✅ Çelës API nevojitet |
| Shënime Sekrete (PIN) | ✅ |
| Firebase Auth (email) | ✅ |
| Firebase Sync | ✅ |
| Ngjyrat e temës | ✅ |
| Madhësia e tekstit | ✅ |

---

## ⚙️ Detaje Teknike

- **Package:** `al.gen.notebook`
- **Min SDK:** API 26 (Android 8.0 Oreo)
- **Target SDK:** API 34 (Android 14)
- **Gjuha:** Kotlin 1.9.22
- **WebView:** Chromium (AndroidX WebViewAssetLoader)
- **Gemini API:** REST HTTP direkt (pa SDK të jashtëm)
- **Ruajtja:** MediaStore Downloads API (API 29+)

---

## 🛠️ Zgjidhja e Problemeve

**"assets/www/index.html nuk ekziston"**
→ Ekzekutoni `build_assets.sh` ose kopjojini manualisht skedarët nga `dist/`

**"Gradle sync dështoi"**
→ Sigurohuni që Android Studio ka SDK API 34 dhe Kotlin 1.9+

**"AI Chat nuk funksionon"**
→ Vendosni çelësin Gemini API duke klikuar ikonën e cilësimeve

**"Zëri nuk regjistrohet"**
→ Lejojini lejet e mikrofonit nga Settings > Apps > NoteBook

---

## 📦 Versioni

- Web App Bazë: `NoteBook2 v1.0`  
- Android Wrapper: `v1.0.0`
- Ndërtuar nga: Claude AI (Anthropic)
