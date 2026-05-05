from pynput import keyboard, mouse
import time
from datetime import datetime


class ActivityTracker:
    def __init__(self):
        self.current_date = self.get_today()

        self.daily_data = {
            self.current_date: {
                "keyCount": 0,
                "mouseCount": 0
            }
        }

        self.last_input_time = time.time()

        # ✅ NEW FLAGS
        self.keyboard_active = False
        self.mouse_active = False

        self.keyboard_listener = None
        self.mouse_listener = None

    # ======================
    # DATE HELPERS
    # ======================
    def get_today(self):
        return datetime.now().strftime("%Y-%m-%d")

    def check_date_rollover(self):
        today = self.get_today()

        if today != self.current_date:
            print(f"📅 New day detected: {today}")

            self.current_date = today

            if today not in self.daily_data:
                self.daily_data[today] = {
                    "keyCount": 0,
                    "mouseCount": 0
                }

    # ======================
    # EVENT HANDLERS
    # ======================
    def on_key_press(self, key):
        self.check_date_rollover()

        self.daily_data[self.current_date]["keyCount"] += 1
        self.last_input_time = time.time()

        # ✅ mark active
        self.keyboard_active = True

        print(f"⌨️ [{self.current_date}] Keys: {self.daily_data[self.current_date]['keyCount']}")
        
    def on_mouse_move(self, x, y):
        self.last_input_time = time.time()

    def on_mouse_click(self, x, y, button, pressed):
        if pressed:
            self.check_date_rollover()

            self.daily_data[self.current_date]["mouseCount"] += 1
            self.last_input_time = time.time()

            # ✅ mark active
            self.mouse_active = True

            print(f"🖱 [{self.current_date}] Clicks: {self.daily_data[self.current_date]['mouseCount']}")
            
    # ======================
    # START LISTENERS
    # ======================
    def start(self):
        self.keyboard_listener = keyboard.Listener(
            on_press=self.on_key_press
        )

        self.mouse_listener = mouse.Listener(
            on_move=self.on_mouse_move,
            on_click=self.on_mouse_click
        )

        self.keyboard_listener.start()
        self.mouse_listener.start()

        print("🎧 Activity tracking started")

    # ======================
    # GET CURRENT DAY ACTIVITY
    # ======================
    def get_activity(self):
        self.check_date_rollover()

        data = self.daily_data[self.current_date]

        activity = {
            "keyCount": data["keyCount"],
            "mouseCount": data["mouseCount"],
            "lastInputTime": self.last_input_time,

            # ✅ send flags
            "keyboardActive": self.keyboard_active,
            "mouseActive": self.mouse_active
        }

        # 🔥 IMPORTANT: reset after sending
        self.keyboard_active = False
        self.mouse_active = False

        return activity