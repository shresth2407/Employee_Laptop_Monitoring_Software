# monitor/window_tracker.py

import win32gui
import win32process
import psutil


class WindowTracker:

    def get_active_window(self):
        try:
            hwnd = win32gui.GetForegroundWindow()
            window_title = win32gui.GetWindowText(hwnd)

            _, pid = win32process.GetWindowThreadProcessId(hwnd)
            process = psutil.Process(pid)
            app_name = process.name()

            return {
                "applicationName": app_name,
                "windowTitle": window_title
            }

        except Exception as e:
            print("❌ Window tracking error:", e)

            return {
                "applicationName": None,
                "windowTitle": None
            }