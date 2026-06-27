package al.gen.notebook

import android.content.Context
import kotlinx.coroutines.*
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.ServerSocket
import java.net.Socket

class LocalAssetServer(private val context: Context, val port: Int = 8765) {

    private var serverSocket: ServerSocket? = null
    private val scope = CoroutineScope(Dispatchers.IO + SupervisorJob())

    fun start() {
        scope.launch {
            try {
                serverSocket = ServerSocket(port)
                while (true) {
                    val socket = serverSocket?.accept() ?: break
                    launch { handleRequest(socket) }
                }
            } catch (_: Exception) { }
        }
    }

    private fun handleRequest(socket: Socket) {
        try {
            val reader = BufferedReader(InputStreamReader(socket.getInputStream()))
            val requestLine = reader.readLine() ?: return
            var path = requestLine.split(" ").getOrNull(1) ?: "/"

            // Hiq query string
            if (path.contains("?")) path = path.substringBefore("?")
            // Hiq fragment
            if (path.contains("#")) path = path.substringBefore("#")

            val assetPath = "www" + if (path == "/" || path.isEmpty()) "/index.html" else path
            val mimeType  = mimeType(assetPath)

            try {
                val bytes = context.assets.open(assetPath).readBytes()
                val header = buildString {
                    append("HTTP/1.1 200 OK\r\n")
                    append("Content-Type: $mimeType\r\n")
                    append("Content-Length: ${bytes.size}\r\n")
                    append("Cache-Control: no-cache\r\n")
                    append("Access-Control-Allow-Origin: *\r\n")
                    append("\r\n")
                }
                socket.outputStream.apply { write(header.toByteArray()); write(bytes); flush() }
            } catch (_: Exception) {
                val r = "HTTP/1.1 404 Not Found\r\nContent-Length: 0\r\n\r\n"
                socket.outputStream.write(r.toByteArray())
            }
        } catch (_: Exception) { }
        finally { try { socket.close() } catch (_: Exception) { } }
    }

    private fun mimeType(path: String) = when {
        path.endsWith(".html") -> "text/html; charset=utf-8"
        path.endsWith(".js") || path.endsWith(".mjs") -> "application/javascript"
        path.endsWith(".css")  -> "text/css"
        path.endsWith(".json") -> "application/json"
        path.endsWith(".png")  -> "image/png"
        path.endsWith(".jpg") || path.endsWith(".jpeg") -> "image/jpeg"
        path.endsWith(".svg")  -> "image/svg+xml"
        path.endsWith(".ico")  -> "image/x-icon"
        path.endsWith(".woff") -> "font/woff"
        path.endsWith(".woff2")-> "font/woff2"
        path.endsWith(".ttf")  -> "font/ttf"
        path.endsWith(".webp") -> "image/webp"
        else -> "application/octet-stream"
    }

    fun stop() {
        try { serverSocket?.close() } catch (_: Exception) { }
        scope.cancel()
    }
}
