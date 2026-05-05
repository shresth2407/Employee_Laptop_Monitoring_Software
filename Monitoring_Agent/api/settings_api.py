from api.base_api import BaseAPI


class SettingsAPI:
    def __init__(self, base_api: BaseAPI):
        self.base_api = base_api

    def get_settings(self):
        try:
            # ✅ correct endpoint for agent
            res = self.base_api.get("/settings/agent")

            print("📡 Settings API Response:", res)

            if res and res.get("success"):
                return res.get("data", {})

            print("❌ Settings error:", res)
            return {}

        except Exception as e:
            print("❌ Settings API Exception:", e)
            return {}