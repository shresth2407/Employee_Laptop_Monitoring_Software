class ActivityAPI:

    def __init__(self, base_api):
        self.base_api = base_api

    def send_heartbeat(self, data):
        res = self.base_api.post("/activity/heartbeat", data)

        if res and res.get("success"):
            print("📡 Heartbeat sent")
            return True

        print("❌ Heartbeat failed:", res)
        return False

    def send_batch(self, events):
        payload = {
            "events": events
        }

        res = self.base_api.post("/activity/batch", payload)

        if res and res.get("success"):
            print("📦 Batch uploaded")
            return True

        print("❌ Batch failed:", res)
        return False