from flask import Flask, Response
import threading, time, os

app = Flask(__name__)

@app.route("/sse")
def sse():
    def stream():
        while True:
            yield f"data: heartbeat {time.time()}\n\n"
            time.sleep(1)
    return Response(stream(), mimetype="text/event-stream")

def watcher_thread():
    while True:
        time.sleep(3)
        print("👁️ watcher active...")

if __name__ == "__main__":
    threading.Thread(target=watcher_thread, daemon=True).start()
    port = 31173
    print(f"✅ MCP server running on http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, threaded=True)
