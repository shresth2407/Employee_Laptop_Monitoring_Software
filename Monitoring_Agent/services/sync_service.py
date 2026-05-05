import time
import threading


class SyncService:

    def __init__(self, activity_api, screenshot_api, cache):
        self.activity_api = activity_api
        self.screenshot_api = screenshot_api
        self.cache = cache

        self.running = False
        self.interval = 20

    def start(self, session_id):
        if self.running:
            return

        self.running = True

        threading.Thread(target=self.run, daemon=True).start()
        print("🔁 Sync started")

    def stop(self):
        self.running = False
        print("🛑 Sync stopped")

    def run(self):
        while self.running:
            try:
                events = self.cache._read()

                if not events:
                    time.sleep(self.interval)
                    continue

                remaining = []

                for event in events:
                    event_type = event.get("type")
                    data = event.get("data")

                    success = False

                    if event_type == "heartbeat":
                        success = self.activity_api.send_heartbeat(data)

                    elif event_type == "screenshot":
                        # ❌ DO NOT resend metadata directly
                        print("⚠️ Skipping cached screenshot metadata")
                        success = True

                    if not success:
                        remaining.append(event)

                self.cache._write(remaining)

            except Exception as e:
                print("❌ Sync error:", e)

            time.sleep(self.interval)