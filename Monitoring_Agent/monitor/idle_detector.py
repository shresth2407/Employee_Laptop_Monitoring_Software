# monitor/idle_detector.py

import time


class IdleDetector:
    def __init__(self, threshold_seconds=300):
        self.threshold = threshold_seconds

    def check_idle(self, last_input_time):
        now = time.time()
        idle_seconds = int(now - last_input_time)

        is_idle = idle_seconds >= self.threshold

        return {
            "idle": is_idle,
            "idleSeconds": idle_seconds
        }