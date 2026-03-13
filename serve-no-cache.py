#!/usr/bin/env python3
"""HTTP server on port 8080 with no caching (Cache-Control: no-store)."""
import http.server
import socketserver

PORT = 8080


class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


with socketserver.TCPServer(("", PORT), NoCacheHTTPRequestHandler) as httpd:
    print("Serving at http://127.0.0.1:{}/ (no cache)".format(PORT))
    httpd.serve_forever()
