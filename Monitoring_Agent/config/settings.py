from api.settings_api import SettingsAPI
from api.base_api import BaseAPI


class Settings:
    """
    Central configuration store (singleton style)
    """

    # fallback defaults
    SCREENSHOT_INTERVAL = 300
    HEARTBEAT_INTERVAL = 30
    IDLE_THRESHOLD = 300

    _is_loaded = False  # prevent multiple API calls

    _last_settings = {}

    @classmethod
    def has_changed(cls):
        current = cls.get()
        changed = current != cls._last_settings
        cls._last_settings = current
        return changed

    @classmethod
    def load_from_api(cls, base_api):
        if cls._is_loaded:
            return

        print("📥 Loading settings from backend...")

        try:
            from api.settings_api import SettingsAPI

            settings_api = SettingsAPI(base_api)

            data = settings_api.get_settings()

            if data:
                cls.update(data)
                cls._is_loaded = True
            else:
                print("⚠️ Using default settings")

        except Exception as e:
            print("❌ Settings load failed:", e)

    @classmethod
    def update(cls, settings: dict):
        if not settings:
            return

        try:
            screenshot_min = settings.get("screenshotIntervalMinutes")
            heartbeat_sec = settings.get("heartbeatIntervalSeconds")
            idle_min = settings.get("idleThresholdMinutes")

            # ✅ FIX: convert to int
            if screenshot_min:
                cls.SCREENSHOT_INTERVAL = int(screenshot_min) * 60

            if heartbeat_sec:
                cls.HEARTBEAT_INTERVAL = int(heartbeat_sec)

            if idle_min:
                cls.IDLE_THRESHOLD = int(idle_min) * 60
                
            print("⚙️ Settings updated:", cls.get())

        except Exception as e:
            print("❌ Settings update error:", e)

    @classmethod
    def get(cls):
        return {
            "SCREENSHOT_INTERVAL": cls.SCREENSHOT_INTERVAL,
            "HEARTBEAT_INTERVAL": cls.HEARTBEAT_INTERVAL,
            "IDLE_THRESHOLD": cls.IDLE_THRESHOLD
        }