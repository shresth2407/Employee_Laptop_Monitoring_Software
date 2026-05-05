# monitor/screenshot_capturer.py

import pyautogui
import os
import time
from datetime import datetime


class ScreenshotCapturer:

    def __init__(self, save_dir="screenshots"):
        self.save_dir = save_dir
        os.makedirs(self.save_dir, exist_ok=True)

    def capture(self):
        try:
            # ✅ Safe timestamp (no dependency on datetime formatting issues)
            ts = int(time.time())
            filename = f"screenshot_{ts}.jpg"
            filepath = os.path.join(self.save_dir, filename)

            # 📸 Capture screenshot
            image = pyautogui.screenshot()

            if image is None:
                print("❌ Screenshot capture returned None")
                return None

            # 💾 Save image
            image.save(filepath, "JPEG")

            # ✅ Ensure file exists
            if not os.path.exists(filepath):
                print("❌ Screenshot file not saved")
                return None

            # ✅ FINAL SAFE RETURN
            return {
                "filePath": filepath,
                "fileName": filename,
                "capturedAt": datetime.utcnow().isoformat() + "Z"  # ISO + UTC mark
            }

        except Exception as e:
            print("❌ Screenshot error:", e)
            return None