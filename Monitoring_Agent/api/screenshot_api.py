class ScreenshotAPI:

    def __init__(self, base_api):
        self.base_api = base_api

    def get_upload_url(self):
        res = self.base_api.post("/agent/screenshots/upload-url", {})

        if res and res.get("success"):
            return res["data"]

        print("❌ Upload URL failed:", res)
        return None

    def send_metadata(self, data):
        res = self.base_api.post("/agent/screenshots/metadata", data)

        if res and res.get("success"):
            print("📸 Metadata saved")
            return True

        print("❌ Metadata failed:", res)
        return False