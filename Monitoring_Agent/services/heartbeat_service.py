import time
import threading
from datetime import datetime


class HeartbeatService:

    def __init__(self, activity_tracker, idle_detector, window_tracker, activity_api, cache):
        self.activity_tracker = activity_tracker
        self.idle_detector = idle_detector
        self.window_tracker = window_tracker
        self.activity_api = activity_api
        self.cache = cache

        self.running = False
        self.thread = None
        self.interval = 30
        self.session_id = None

    # ======================
    # START
    # ======================
    def start(self, session_id, interval):
        if self.running:
            return

        self.running = True
        self.session_id = session_id
        self.interval = interval

        self.thread = threading.Thread(target=self.run, daemon=True)
        self.thread.start()

        print("🚀 Heartbeat service started")

    # ======================
    # STOP
    # ======================
    def stop(self):
        self.running = False
        print("🛑 Heartbeat service stopped")

    # ======================
    # MAIN LOOP
    # ======================
    def run(self):
        while self.running:
            try:
                # 🔥 GET ACTIVITY (AUTO RESET INSIDE)
                activity = self.activity_tracker.get_activity()

                idle_data = self.idle_detector.check_idle(
                    activity["lastInputTime"]
                )

                window = self.window_tracker.get_active_window()

                payload = {
                    "sessionId": self.session_id,
                    "applicationName": window.get("applicationName"),
                    "windowTitle": window.get("windowTitle"),
                    "keyboardActive": activity.get("keyboardActive", False),
                    "keystrokes": activity.get("keyCount", 0),
                    "mouseActive": activity.get("mouseActive", False),
                    "idleStatus": idle_data.get("idle", False),
                    "idleSeconds": idle_data.get("idleSeconds", 0),
                    "timestamp": datetime.utcnow().isoformat()
                }

                print("📡 Sending heartbeat:", payload)  # 🔥 DEBUG

                success = self.activity_api.send_heartbeat(payload)

                if not success:
                    self.cache.save_event({
                        "type": "heartbeat",
                        "data": payload
                    })

                # ❌ REMOVE THIS (ALREADY HANDLED)
                # self.activity_tracker.reset_activity()

            except Exception as e:
                print("❌ Heartbeat error:", e)

            time.sleep(self.interval)