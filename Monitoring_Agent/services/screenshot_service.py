import os
import time
import threading
import requests
from datetime import datetime


class ScreenshotService:

    def __init__(self, capturer, screenshot_api, window_tracker, cache):
        self.capturer = capturer
        self.screenshot_api = screenshot_api
        self.window_tracker = window_tracker
        self.cache = cache

        self.running = False
        self.interval = 300

    # 🧹 Delete local file safely
    def delete_local_file(self, path):
        try:
            if path and os.path.exists(path):
                os.remove(path)
                print(f"🗑️ Deleted local file: {path}")
        except Exception as e:
            print("❌ File delete error:", e)

    # ▶️ Start service
    def start(self, session_id, interval):
        if self.running:
            return

        self.running = True
        self.interval = interval

        threading.Thread(target=self.run, daemon=True).start()
        print("📸 Screenshot service started")

    # ⛔ Stop service
    def stop(self):
        self.running = False
        print("🛑 Screenshot service stopped")

    # 🔁 Main loop
    def run(self):
        while self.running:
            try:
                # 1️⃣ Capture screenshot
                shot = self.capturer.capture()

                if not shot:
                    time.sleep(self.interval)
                    continue

                local_path = shot.get("filePath")

                # 2️⃣ Get upload URL
                upload_data = self.screenshot_api.get_upload_url()

                if not upload_data:
                    print("❌ Upload URL not received")
                    time.sleep(self.interval)
                    continue

                upload_url = upload_data.get("uploadUrl")
                params = upload_data.get("params")

                # 3️⃣ Upload to Cloudinary
                try:
                    with open(local_path, "rb") as f:
                        files = {"file": f}
                        response = requests.post(upload_url, data=params, files=files)
                except Exception as e:
                    print("❌ File upload error:", e)
                    time.sleep(self.interval)
                    continue

                if response.status_code != 200:
                    print("❌ Cloudinary upload failed:", response.text)

                    # cache for retry
                    self.cache.save_event({
                        "type": "screenshot",
                        "data": shot
                    })

                    time.sleep(self.interval)
                    continue

                upload_result = response.json()
                file_url = upload_result.get("secure_url")

                if not file_url:
                    print("❌ No file URL received from upload")
                    time.sleep(self.interval)
                    continue

                # 4️⃣ Session check
                session_id = self.screenshot_api.base_api.session_id
                if not session_id:
                    print("❌ No sessionId, skipping screenshot")
                    time.sleep(self.interval)
                    continue

                # 5️⃣ Window info
                window = self.window_tracker.get_active_window() or {}

                # 6️⃣ Metadata payload
                metadata_payload = {
                    "sessionId": session_id,
                    "fileName": shot.get("fileName") or f"screenshot_{int(time.time())}.jpg",
                    "filePath": file_url,
                    "capturedAt": datetime.utcnow().isoformat(),
                    "applicationName": window.get("applicationName", "Unknown"),
                    "windowTitle": window.get("windowTitle", "Unknown")
                }

                print("📸 Upload success, sending metadata...")

                # 7️⃣ Retry metadata (3 attempts)
                success = False
                for attempt in range(3):
                    success = self.screenshot_api.send_metadata(metadata_payload)

                    if success:
                        print("✅ Metadata saved")

                        # 🗑️ DELETE LOCAL FILE AFTER FULL SUCCESS
                        self.delete_local_file(local_path)
                        break

                    print(f"⚠️ Retry metadata ({attempt + 1}/3)")
                    time.sleep(2)

                # 8️⃣ If metadata failed
                if not success:
                    print("❌ Metadata failed after retries, caching...")

                    self.cache.save_event({
                        "type": "screenshot",
                        "data": metadata_payload
                    })

                    # ❌ DO NOT DELETE FILE (important for retry)

            except Exception as e:
                print("❌ Screenshot service error:", e)

            time.sleep(self.interval)