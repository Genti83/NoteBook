package al.gen.notebook

import android.Manifest
import android.annotation.SuppressLint
import android.app.Activity
import android.content.ContentValues
import android.content.Intent
import android.content.SharedPreferences
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.provider.MediaStore
import android.util.Base64
import android.util.Log
import android.view.KeyEvent
import android.view.WindowManager
import android.webkit.*
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.browser.customtabs.CustomTabsIntent
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.core.content.FileProvider
import androidx.documentfile.provider.DocumentFile
import kotlinx.coroutines.*
import org.json.JSONArray
import org.json.JSONObject
import java.io.BufferedReader
import java.io.File
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var prefs: SharedPreferences
    private lateinit var localServer: LocalAssetServer
    private val mainScope = CoroutineScope(Dispatchers.Main + SupervisorJob())
    private val mainHandler = Handler(Looper.getMainLooper())
    private val SERVER_PORT = 8765
    private val SERVER_URL  = "http://localhost:$SERVER_PORT"

    // ── File chooser ──────────────────────────────────────────────────────────
    private var fileChooserCallback: ValueCallback<Array<Uri>>? = null
    private val fileChooserLauncher =
        registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
            val uris: Array<Uri> = if (result.resultCode == Activity.RESULT_OK)
                result.data?.data?.let { arrayOf(it) } ?: emptyArray()
            else emptyArray()
            fileChooserCallback?.onReceiveValue(uris)
            fileChooserCallback = null
        }

    // ── Directory picker ──────────────────────────────────────────────────────
    private var dirPickerCbId: String? = null
    private val dirPickerLauncher =
        registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
            val cbId = dirPickerCbId ?: return@registerForActivityResult
            dirPickerCbId = null
            if (result.resultCode == Activity.RESULT_OK) {
                val uri = result.data?.data
                if (uri != null) {
                    runCatching {
                        contentResolver.takePersistableUriPermission(uri,
                            Intent.FLAG_GRANT_READ_URI_PERMISSION or Intent.FLAG_GRANT_WRITE_URI_PERMISSION)
                    }
                    prefs.edit().putString("dir_uri", uri.toString()).apply()
                    val safe = uri.toString().replace("'", "\\'")
                    val cbSafe = cbId.replace("'", "\\'")
                    webView.evaluateJavascript("window.__onDirPicked&&window.__onDirPicked('$cbSafe','$safe');", null)
                } else {
                    webView.evaluateJavascript("window.__onDirPickedError&&window.__onDirPickedError('$cbId');", null)
                }
            } else {
                webView.evaluateJavascript("window.__onDirPickedError&&window.__onDirPickedError('$cbId');", null)
            }
        }

    private val REQ_MIC = 100

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.statusBarColor = 0xFF09090B.toInt()
        window.navigationBarColor = 0xFF09090B.toInt()

        prefs = getSharedPreferences("notebook_prefs", MODE_PRIVATE)

        // ── Nis server lokal ─────────────────────────────────────────────────
        localServer = LocalAssetServer(this, SERVER_PORT)
        localServer.start()

        webView = WebView(this)
        webView.layoutParams = android.view.ViewGroup.LayoutParams(-1, -1)
        setContentView(webView)

        setupWebView()

        val hasAssets = runCatching { assets.list("www")?.contains("index.html") == true }.getOrDefault(false)
        mainHandler.postDelayed({
            if (hasAssets) webView.loadUrl("$SERVER_URL/")
            else loadSetupPage()
        }, 300)

        // Leje mikrofon
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED)
            ActivityCompat.requestPermissions(this, arrayOf(Manifest.permission.RECORD_AUDIO), REQ_MIC)

        // Dialog Gemini nëse mungon
        if (prefs.getString("gemini_api_key", "").isNullOrEmpty())
            mainHandler.postDelayed({ showApiKeyDialog() }, 2500)
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            allowFileAccess = true
            allowContentAccess = true
            mediaPlaybackRequiresUserGesture = false
            setSupportZoom(false)
            displayZoomControls = false
            javaScriptCanOpenWindowsAutomatically = true
            setSupportMultipleWindows(true)
            mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
            // FIX 3: Cache për offline
            cacheMode = WebSettings.LOAD_DEFAULT
            useWideViewPort = true
            loadWithOverviewMode = true
            // Hiq "wv" nga UserAgent — Firebase e pranon si browser normal
            userAgentString = userAgentString.replace("; wv", "")
        }

        CookieManager.getInstance().apply {
            setAcceptCookie(true)
            setAcceptThirdPartyCookies(webView, true)
        }

        webView.webViewClient = object : WebViewClient() {
            override fun onPageStarted(view: WebView?, url: String?, favicon: android.graphics.Bitmap?) {
                super.onPageStarted(view, url, favicon)
                // INJECT PARA JS-it te pages - patch Firebase domain check
                injectFirebaseEarlyPatch()
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                injectBridge()
                injectFirebaseOffline()
            }

            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url?.toString() ?: return false
                // Firebase auth handler — lejo brenda WebView
                if (url.contains("firebaseapp.com/__/auth/")) return false
                // Google OAuth — Chrome Custom Tab
                if (url.contains("accounts.google.com") || url.contains("oauth2/auth")) {
                    openChromeCustomTab(url)
                    return true
                }
                // Lejo localhost dhe googleapis
                if (url.startsWith("http://localhost") || url.contains("googleapis.com") ||
                    url.contains("firebase")) return false
                // URL të jashtme
                if (url.startsWith("https://") || url.startsWith("http://")) {
                    startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                    return true
                }
                return false
            }

            override fun onReceivedError(view: WebView?, request: WebResourceRequest?, error: WebResourceError?) {
                // Mos shfaq gabime rrjeti — punon offline
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onPermissionRequest(request: PermissionRequest?) {
                mainHandler.post { request?.grant(request.resources) }
            }

            override fun onShowFileChooser(webView: WebView?,
                filePathCallback: ValueCallback<Array<Uri>>?,
                fileChooserParams: FileChooserParams?): Boolean {
                fileChooserCallback?.onReceiveValue(null)
                fileChooserCallback = filePathCallback
                try {
                    fileChooserLauncher.launch(fileChooserParams?.createIntent()
                        ?: Intent(Intent.ACTION_GET_CONTENT).apply { type = "*/*" })
                } catch (e: Exception) {
                    fileChooserCallback?.onReceiveValue(null); fileChooserCallback = null
                }
                return true
            }

            // FIX 1: Popup Google Sign-In - WebView brenda Dialog
            override fun onCreateWindow(view: WebView?, isDialog: Boolean,
                isUserGesture: Boolean, resultMsg: android.os.Message?): Boolean {
                val popupWV = WebView(this@MainActivity)
                popupWV.settings.apply {
                    javaScriptEnabled = true
                    domStorageEnabled = true
                    // UserAgent pa "wv" - Google e lejon
                    userAgentString = "Mozilla/5.0 (Linux; Android 14; Pixel 8) " +
                        "AppleWebKit/537.36 (KHTML, like Gecko) " +
                        "Chrome/120.0.6099.210 Mobile Safari/537.36"
                }
                var popupDialog: AlertDialog? = null
                popupWV.webViewClient = object : WebViewClient() {
                    override fun shouldOverrideUrlLoading(v: WebView?, req: WebResourceRequest?): Boolean {
                        val url = req?.url?.toString() ?: return false
                        // Kur auth perfundon, mbyll dialogun
                        if (url.contains("firebaseapp.com/__/auth/") ||
                            url.contains("localhost") || url.contains("127.0.0.1")) {
                            popupDialog?.dismiss()
                        }
                        return false
                    }
                }
                popupDialog = AlertDialog.Builder(this@MainActivity)
                    .setTitle("Hyr me Google")
                    .setView(popupWV)
                    .setNegativeButton("Anulo") { d, _ -> d.dismiss(); popupWV.destroy() }
                    .create()
                popupDialog.show()
                popupDialog.window?.setLayout(
                    (resources.displayMetrics.widthPixels * 0.92).toInt(),
                    (resources.displayMetrics.heightPixels * 0.85).toInt()
                )
                (resultMsg?.obj as? WebView.WebViewTransport)?.webView = popupWV
                resultMsg?.sendToTarget()
                return true
            }
        }

        webView.addJavascriptInterface(Bridge(), "AndroidBridge")
    }

    // ── FIX 1: Chrome Custom Tab për Google Sign-In ───────────────────────────
    private fun openChromeCustomTab(url: String) {
        try {
            CustomTabsIntent.Builder().build().launchUrl(this, Uri.parse(url))
        } catch (e: Exception) {
            startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
        }
    }

    // ── FIX 3: Firebase Offline Persistence ───────────────────────────────────
    private fun injectFirebaseOffline() {
        val js = """
(function() {
    if (window.__offlineInjected) return;
    window.__offlineInjected = true;
    // Suppress network errors kur offline
    window.addEventListener('unhandledrejection', function(e) {
        if (e.reason && e.reason.code &&
            (e.reason.code === 'unavailable' || e.reason.message?.includes('network') ||
             e.reason.message?.includes('Failed to fetch') || e.reason.code === 'failed-precondition')) {
            e.preventDefault();
            console.log('[NoteBook] Offline - Firebase error suppressed');
        }
    });
})();
        """.trimIndent()
        webView.evaluateJavascript(js, null)
    }

    // ── JavaScript Bridge ─────────────────────────────────────────────────────
    private fun injectBridge() {
        val js = """
(function() {
    if (window.__bridgeInjected) return;
    window.__bridgeInjected = true;
    window.__geminiCbs = {};

    // FIX 4: Gemini AI fetch override
    var _fetch = window.fetch.bind(window);
    window.fetch = async function(input, init) {
        var url = typeof input === 'string' ? input : (input?.url || '');
        if (url === '/api/ai/chat' || url.endsWith('/api/ai/chat')) {
            return new Promise(function(resolve, reject) {
                var id = 'g_' + Date.now() + '_' + Math.random().toString(36).substr(2,8);
                window.__geminiCbs[id] = {resolve, reject};
                try {
                    var body = init?.body || '{}';
                    AndroidBridge.callGeminiAsync(id, typeof body === 'string' ? body : JSON.stringify(body));
                } catch(e) { delete window.__geminiCbs[id]; reject(e); }
            });
        }
        return _fetch(input, init);
    };
    window.__geminiOK = function(id, json) {
        var cb = window.__geminiCbs[id]; if(!cb) return;
        delete window.__geminiCbs[id];
        cb.resolve(new Response(new Blob([json],{type:'application/json'}),{status:200}));
    };
    window.__geminiERR = function(id, msg) {
        var cb = window.__geminiCbs[id]; if(!cb) return;
        delete window.__geminiCbs[id];
        cb.resolve(new Response(new Blob([JSON.stringify({error:msg})],{type:'application/json'}),{status:500}));
    };

    // FIX 1: Google Sign-In intercept
    var _open = window.open.bind(window);
    window.open = function(url, target, feat) {
        if (url && (url.includes('accounts.google.com') || url.includes('oauth2'))) {
            AndroidBridge.openGoogleAuth(url); return null;
        }
        return _open(url, target, feat);
    };

    // FIX 2: showDirectoryPicker → Android folder picker
    window.__dirCbs = {};
    window.__onDirPicked = function(id, uri) {
        var cb = window.__dirCbs[id]; if(!cb) return;
        delete window.__dirCbs[id];
        cb.resolve(makeDirHandle('BllokuShenimesh', uri));
    };
    window.__onDirPickedError = function(id) {
        var cb = window.__dirCbs[id]; if(!cb) return;
        delete window.__dirCbs[id];
        // Fallback: Downloads
        cb.resolve(makeDirHandle('BllokuShenimesh', 'downloads'));
    };
    function makeDirHandle(name, uri) {
        return {
            name: name, kind: 'directory', androidUri: uri,
            getFileHandle: async function(fname, opts) {
                return {
                    name: fname, kind: 'file',
                    createWritable: async function() {
                        var chunks = [];
                        return {
                            write: async function(d) { chunks.push(d); },
                            close: async function() {
                                var blob = new Blob(chunks);
                                return new Promise(function(res) {
                                    var r = new FileReader();
                                    r.onload = function(ev) {
                                        var b64 = ev.target.result.split(',')[1];
                                        var mime = ev.target.result.split(';')[0].split(':')[1];
                                        AndroidBridge.saveFileToDir(uri, fname, b64, mime);
                                        res();
                                    };
                                    r.readAsDataURL(blob);
                                });
                            }
                        };
                    }
                };
            },
            values: async function*() {}
        };
    }
    window.showDirectoryPicker = async function() {
        return new Promise(function(resolve, reject) {
            var id = 'dir_' + Date.now();
            window.__dirCbs[id] = {resolve, reject};
            AndroidBridge.openDirPicker(id);
        });
    };

    // Blob downloads
    var _cou = URL.createObjectURL.bind(URL);
    var _blobs = new Map();
    URL.createObjectURL = function(obj) {
        var url = _cou(obj); _blobs.set(url, obj); return url;
    };
    document.addEventListener('click', function(e) {
        var a = e.target?.closest('a[download]'); if(!a) return;
        var href = a.getAttribute('href') || '';
        var fname = a.getAttribute('download') || 'file';
        if (href.startsWith('blob:') || href.startsWith('data:')) {
            e.preventDefault(); e.stopPropagation();
            function go(du) {
                var b64 = du.split(',')[1];
                var mime = du.split(';')[0].split(':')[1] || 'application/octet-stream';
                AndroidBridge.saveFile(fname, b64, mime);
            }
            if (href.startsWith('data:')) { go(href); return; }
            var blob = _blobs.get(href);
            if (blob) { var r = new FileReader(); r.onload = ev => go(ev.target.result); r.readAsDataURL(blob); }
        }
    }, true);

    // showSaveFilePicker
    window.showSaveFilePicker = async function(opts) {
        var name = opts?.suggestedName || 'file';
        var chunks = [];
        return { createWritable: async function() { return {
            write: async function(d) { chunks.push(d); },
            close: async function() {
                var b = new Blob(chunks);
                return new Promise(res => {
                    var r = new FileReader();
                    r.onload = ev => {
                        AndroidBridge.saveFile(name, ev.target.result.split(',')[1],
                            ev.target.result.split(';')[0].split(':')[1]);
                        res();
                    };
                    r.readAsDataURL(b);
                });
            }
        }; }};
    };

    // navigator.share
    if (!navigator.share) {
        navigator.share = async function(d) {
            if (d.files?.length) {
                return new Promise(res => {
                    var r = new FileReader();
                    r.onload = ev => {
                        AndroidBridge.shareFile(d.files[0].name,
                            ev.target.result.split(',')[1],
                            ev.target.result.split(';')[0].split(':')[1]);
                        res();
                    };
                    r.readAsDataURL(d.files[0]);
                });
            }
            AndroidBridge.shareText(d.title||'', d.text||d.url||'');
        };
        navigator.canShare = () => true;
    }

    // SpeechRecognition
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
        var _start = SR.prototype.start;
        SR.prototype.start = function() {
            AndroidBridge.requestMic();
            try { _start.call(this); } catch(e) {}
        };
    }

    console.log('[NoteBook] Bridge v3 OK — localhost mode');
})();
        """.trimIndent()
        webView.evaluateJavascript(js, null)
    }

    // ─── Android Bridge ───────────────────────────────────────────────────────
    inner class Bridge {

        @JavascriptInterface
        fun callGeminiAsync(cbId: String, body: String) {
            mainScope.launch(Dispatchers.IO) {
                try {
                    val key = prefs.getString("gemini_api_key", "") ?: ""
                    if (key.isEmpty()) {
                        ok(cbId, "{\"error\":\"Vendos Gemini API Key\"}")
                        withContext(Dispatchers.Main) { showApiKeyDialog() }
                        return@launch
                    }
                    ok(cbId, callGemini(key, body))
                } catch (e: Exception) {
                    err(cbId, e.message ?: "Gabim")
                }
            }
        }

        private suspend fun ok(id: String, json: String) = withContext(Dispatchers.Main) {
            webView.evaluateJavascript("window.__geminiOK('${id.esc}',${JSONObject.quote(json)});", null)
        }
        private suspend fun err(id: String, msg: String) = withContext(Dispatchers.Main) {
            webView.evaluateJavascript("window.__geminiERR('${id.esc}',${JSONObject.quote(msg)});", null)
        }
        private val String.esc get() = replace("'", "\\'")

        // FIX 1: Google Auth
        @JavascriptInterface
        fun openGoogleAuth(url: String) = mainScope.launch {
            AlertDialog.Builder(this@MainActivity, R.style.AlertDialog_Dark)
                .setTitle("🔐 Hyr me Google")
                .setMessage("Zgjedh mënyrën e hyrjes:")
                .setPositiveButton("Hap Chrome") { _, _ -> openChromeCustomTab(url) }
                .setNegativeButton("Hyr me Email") { _, _ ->
                    Toast.makeText(this@MainActivity, "Përdor Email/Fjalëkalim", Toast.LENGTH_LONG).show()
                }
                .setNeutralButton("Anulo", null).show()
        }

        // FIX 2: Directory picker
        @JavascriptInterface
        fun openDirPicker(cbId: String) = mainScope.launch {
            dirPickerCbId = cbId
            try {
                dirPickerLauncher.launch(
                    Intent(Intent.ACTION_OPEN_DOCUMENT_TREE).apply {
                        addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION or
                                 Intent.FLAG_GRANT_WRITE_URI_PERMISSION or
                                 Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION)
                    }
                )
            } catch (e: Exception) {
                dirPickerCbId = null
                webView.evaluateJavascript("window.__onDirPickedError('$cbId');", null)
            }
        }

        // Ruaj skedar në dosjen e zgjedhur
        @JavascriptInterface
        fun saveFileToDir(dirUriStr: String, filename: String, base64: String, mimeType: String) {
            mainScope.launch {
                try {
                    val bytes = Base64.decode(base64, Base64.DEFAULT)
                    if (dirUriStr == "downloads") { saveToDownloads(filename, bytes, mimeType); return@launch }
                    val dirUri = Uri.parse(dirUriStr)
                    val dir = DocumentFile.fromTreeUri(this@MainActivity, dirUri)
                    val existing = dir?.findFile(filename)
                    val file = existing ?: dir?.createFile(mimeType, filename)
                    file?.uri?.let { uri ->
                        contentResolver.openOutputStream(uri, "wt")?.use { it.write(bytes) }
                        Toast.makeText(this@MainActivity, "✓ Ruajtur: $filename", Toast.LENGTH_SHORT).show()
                    } ?: saveToDownloads(filename, bytes, mimeType)
                } catch (e: Exception) {
                    saveToDownloads(filename, Base64.decode(base64, Base64.DEFAULT), mimeType)
                }
            }
        }

        @JavascriptInterface
        fun saveFile(filename: String, base64: String, mimeType: String) {
            mainScope.launch {
                val bytes = Base64.decode(base64, Base64.DEFAULT)
                // Nëse ka dosje të zgjedhur, ruaj atje
                val dirUriStr = prefs.getString("dir_uri", "") ?: ""
                if (dirUriStr.isNotEmpty()) {
                    saveFileToDir(dirUriStr, filename, base64, mimeType)
                } else {
                    saveToDownloads(filename, bytes, mimeType)
                }
            }
        }

        private fun saveToDownloads(filename: String, bytes: ByteArray, mimeType: String) {
            try {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    val cv = ContentValues().apply {
                        put(MediaStore.Downloads.DISPLAY_NAME, filename)
                        put(MediaStore.Downloads.MIME_TYPE, mimeType)
                        put(MediaStore.Downloads.IS_PENDING, 1)
                    }
                    contentResolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, cv)?.let { u ->
                        contentResolver.openOutputStream(u)?.use { it.write(bytes) }
                        cv.clear(); cv.put(MediaStore.Downloads.IS_PENDING, 0)
                        contentResolver.update(u, cv, null, null)
                    }
                } else {
                    val dir = android.os.Environment.getExternalStoragePublicDirectory(
                        android.os.Environment.DIRECTORY_DOWNLOADS)
                    dir.mkdirs(); File(dir, filename).writeBytes(bytes)
                }
                mainHandler.post { Toast.makeText(this@MainActivity, "✓ Downloads/$filename", Toast.LENGTH_SHORT).show() }
            } catch (e: Exception) {
                mainHandler.post { Toast.makeText(this@MainActivity, "✗ ${e.message}", Toast.LENGTH_LONG).show() }
            }
        }

        @JavascriptInterface
        fun shareFile(filename: String, base64: String, mimeType: String) = mainScope.launch {
            try {
                val bytes = Base64.decode(base64, Base64.DEFAULT)
                val f = File(cacheDir, filename).also { it.writeBytes(bytes) }
                val uri = FileProvider.getUriForFile(this@MainActivity, "$packageName.fileprovider", f)
                startActivity(Intent.createChooser(Intent(Intent.ACTION_SEND).apply {
                    type = mimeType; putExtra(Intent.EXTRA_STREAM, uri)
                    addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                }, "Ndaj: $filename"))
            } catch (e: Exception) { saveFile(filename, base64, mimeType) }
        }

        @JavascriptInterface
        fun shareText(title: String, text: String) = mainScope.launch {
            startActivity(Intent.createChooser(Intent(Intent.ACTION_SEND).apply {
                type = "text/plain"
                putExtra(Intent.EXTRA_SUBJECT, title)
                putExtra(Intent.EXTRA_TEXT, text)
            }, title.ifEmpty { "Ndaj" }))
        }

        @JavascriptInterface
        fun requestMic() {
            if (ContextCompat.checkSelfPermission(this@MainActivity, Manifest.permission.RECORD_AUDIO)
                != PackageManager.PERMISSION_GRANTED)
                ActivityCompat.requestPermissions(this@MainActivity,
                    arrayOf(Manifest.permission.RECORD_AUDIO), REQ_MIC)
        }

        @JavascriptInterface
        fun openApiKeySettings() = mainScope.launch { showApiKeyDialog() }
    }

    // ─── Gemini API ────────────────────────────────────────────────────────────
    private fun callGemini(key: String, reqJson: String): String {
        val req = JSONObject(reqJson)
        val parts = JSONArray().put(JSONObject().put("text", req.optString("prompt", "")))
        req.optString("image","").takeIf { it.contains(",") }?.let { img ->
            parts.put(JSONObject().put("inline_data",
                JSONObject().put("mime_type", img.substringBefore(";").substringAfter(":"))
                            .put("data", img.substringAfter(","))))
        }
        val body = JSONObject().apply {
            put("system_instruction", JSONObject().put("parts",
                JSONArray().put(JSONObject().put("text",
                    "Ti je asistent AI për Bllok Shënimesh.\nDokumentet: ${req.optJSONArray("documents")?.toString() ?: "[]"}\nAktiv: \"${req.optString("activeDocId")}\"\nKthe VETËM JSON: {\"text\":\"...\",\"actions\":[]}"
                ))))
            put("contents", JSONArray().put(JSONObject().put("role","user").put("parts", parts)))
            put("generationConfig", JSONObject().put("temperature", 0.1).put("responseMimeType","application/json"))
        }
        val conn = URL("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=$key")
            .openConnection() as HttpURLConnection
        conn.apply { requestMethod="POST"; setRequestProperty("Content-Type","application/json; charset=UTF-8")
            doOutput=true; connectTimeout=30_000; readTimeout=90_000 }
        conn.outputStream.use { it.write(body.toString().toByteArray(Charsets.UTF_8)) }
        val code = conn.responseCode
        val raw = (if (code==200) conn.inputStream else conn.errorStream).bufferedReader().readText()
        if (code != 200) throw Exception("Gemini $code")
        val text = JSONObject(raw).getJSONArray("candidates")
            .getJSONObject(0).getJSONObject("content")
            .getJSONArray("parts").getJSONObject(0).getString("text")
        return try { JSONObject(text); text }
        catch (_: Exception) { "{\"text\":\"${text.replace("\"","\\\"")}\",\"actions\":[]}" }
    }

    // ─── API Key Dialog ────────────────────────────────────────────────────────
    private fun showApiKeyDialog() {
        val layout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL; setPadding(48,24,48,0)
        }
        val et = EditText(this).apply {
            hint = "AIza..."
            setText(prefs.getString("gemini_api_key", ""))
            layout.addView(this)
        }
        AlertDialog.Builder(this, R.style.AlertDialog_Dark)
            .setTitle("🤖 Gemini AI Key")
            .setMessage("Merr falas:\nhttps://ai.google.dev\n\n(Nevojitet vetëm për AI Chat)")
            .setView(layout)
            .setPositiveButton("✓ Ruaj") { _,_ ->
                val k = et.text.toString().trim()
                prefs.edit().putString("gemini_api_key", k).apply()
                if (k.isNotEmpty()) Toast.makeText(this,"✓ Key u ruajt!",Toast.LENGTH_SHORT).show()
            }
            .setNegativeButton("Kapërcej", null).show()
    }

    // ─── Setup Page ────────────────────────────────────────────────────────────
    private fun loadSetupPage() {
        webView.loadDataWithBaseURL("http://localhost:$SERVER_PORT/",
            "<html><body style='background:#09090b;color:#f4f4f5;font-family:system-ui;padding:20px'>" +
            "<h2 style='color:#3b82f6'>📓 NoteBook</h2>" +
            "<p>Web assets mungojnë. Ekzekutoni GitHub Actions workflow.</p></body></html>",
            "text/html", "UTF-8", null)
    }

    // ─── Navigimi & Lifecycle ──────────────────────────────────────────────────
    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        if (keyCode == KeyEvent.KEYCODE_BACK && webView.canGoBack()) { webView.goBack(); return true }
        return super.onKeyDown(keyCode, event)
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == REQ_MIC && grantResults.firstOrNull() == PackageManager.PERMISSION_GRANTED)
            webView.evaluateJavascript("window.__onMicGranted&&window.__onMicGranted()", null)
    }

    override fun onResume() { super.onResume(); webView.onResume(); CookieManager.getInstance().flush() }
    override fun onPause() { super.onPause(); webView.onPause() }
    override fun onDestroy() {
        mainScope.cancel(); localServer.stop()
        webView.stopLoading(); webView.destroy()
        super.onDestroy()
    }
}
