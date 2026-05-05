import time
import threading

from config.settings import Settings

from api.base_api import BaseAPI
from api.auth_api import AuthAPI
from api.activity_api import ActivityAPI
from api.screenshot_api import ScreenshotAPI

from monitor.activity_tracker import ActivityTracker
from monitor.idle_detector import IdleDetector
from monitor.window_tracker import WindowTracker
from monitor.screenshot_capturer import ScreenshotCapturer

from services.heartbeat_service import HeartbeatService
from services.screenshot_service import ScreenshotService
from services.sync_service import SyncService

from storage.local_cache import LocalCache


class AgentController:

    def __init__(self, email=None, password=None):
        self.base_url = "http://localhost:5000/api/v1"

        self.email = email
        self.password = password

        # APIs
        self.base_api = BaseAPI(self.base_url)
        self.auth_api = AuthAPI(self.base_api)
        self.activity_api = ActivityAPI(self.base_api)
        self.screenshot_api = ScreenshotAPI(self.base_api)

        # monitors
        self.activity_tracker = ActivityTracker()
        self.window_tracker = WindowTracker()
        self.screenshot_capturer = ScreenshotCapturer()
        self.idle_detector = None  # init after settings

        # storage
        self.cache = LocalCache()

        # services
        self.heartbeat_service = None
        self.screenshot_service = None
        self.sync_service = None

        # state
        self.session_id = None
        self.monitoring_active = False

    # 🔐 LOGIN
    def login(self, email=None, password=None):
        email = email or self.email
        password = password or self.password

        if not email or not password:
            print("❌ Missing credentials")
            return False

        res = self.auth_api.login(email, password)

        if not res:
            print("❌ Login failed")
            return False

        token = res.get("token")
        self.session_id = res.get("sessionId")

        if not self.session_id:
            print("❌ No sessionId received")
            return False

        # ✅ set token + session
        if token:
            self.base_api.set_token(token)

        self.base_api.set_session_id(self.session_id)

        print("✅ Logged in | Session:", self.session_id)
        return True

    # ▶️ START
    def start_monitoring(self):
        if self.monitoring_active:
            return

        # 🔥 load settings
        Settings.load_from_api(self.base_api)

        # 🔥 init idle detector AFTER settings
        self.idle_detector = IdleDetector(Settings.IDLE_THRESHOLD)

        print("🟢 Monitoring STARTED with settings:", Settings.get())
        self.monitoring_active = True

        self.activity_tracker.start()

        self.heartbeat_service = HeartbeatService(
            self.activity_tracker,
            self.idle_detector,
            self.window_tracker,
            self.activity_api,
            self.cache
        )

        self.screenshot_service = ScreenshotService(
            self.screenshot_capturer,
            self.screenshot_api,
            self.window_tracker,
            self.cache
        )

        self.sync_service = SyncService(
            self.activity_api,
            self.screenshot_api,
            self.cache
        )

        # ✅ start services
        self.heartbeat_service.start(self.session_id, Settings.HEARTBEAT_INTERVAL)
        self.screenshot_service.start(self.session_id, Settings.SCREENSHOT_INTERVAL)
        self.sync_service.start(self.session_id)

        # 🔥 AUTO REFRESH START
        self.start_settings_auto_refresh(60)

    # 🔄 AUTO SETTINGS REFRESH
    def start_settings_auto_refresh(self, interval=60):
        def loop():
            while self.monitoring_active:
                try:
                    time.sleep(interval)

                    print("🔄 Checking for settings update...")

                    old_settings = Settings.get().copy()

                    # reload settings
                    Settings._is_loaded = False  # force reload
                    Settings.load_from_api(self.base_api)

                    new_settings = Settings.get()

                    if old_settings != new_settings:
                        print("⚙️ Settings changed! Applying...")
                        self.apply_new_settings()

                except Exception as e:
                    print("❌ Settings refresh error:", e)

        thread = threading.Thread(target=loop, daemon=True)
        thread.start()

    # 🔁 APPLY NEW SETTINGS
    def apply_new_settings(self):
        print("🔁 Restarting services with new settings...")

        # stop services safely
        if self.heartbeat_service:
            self.heartbeat_service.stop()

        if self.screenshot_service:
            self.screenshot_service.stop()

        # re-init idle detector
        self.idle_detector = IdleDetector(Settings.IDLE_THRESHOLD)

        # restart with new intervals
        self.heartbeat_service.start(self.session_id, Settings.HEARTBEAT_INTERVAL)
        self.screenshot_service.start(self.session_id, Settings.SCREENSHOT_INTERVAL)

        print("✅ New settings applied:", Settings.get())

    # ⛔ STOP
    def stop_monitoring(self):
        if not self.monitoring_active:
            return

        print("🔴 Monitoring STOPPED")
        self.monitoring_active = False

        if self.heartbeat_service:
            self.heartbeat_service.stop()

        if self.screenshot_service:
            self.screenshot_service.stop()

        if self.sync_service:
            self.sync_service.stop()

    # 🔴 LOGOUT
    def shutdown(self):
        print("🔴 Shutting down...")

        self.stop_monitoring()

        try:
            self.auth_api.logout()
        except Exception as e:
            print("Logout error:", e)