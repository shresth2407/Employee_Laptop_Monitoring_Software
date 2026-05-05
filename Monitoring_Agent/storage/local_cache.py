# storage/local_cache.py

import json
import os
import threading


class LocalCache:

    def __init__(self, file_path="cache/events.json"):
        self.file_path = file_path
        self.lock = threading.Lock()

        # ensure folder exists
        os.makedirs(os.path.dirname(self.file_path), exist_ok=True)

        # create file if not exists
        if not os.path.exists(self.file_path):
            with open(self.file_path, "w") as f:
                json.dump([], f)

    # ======================
    # SAVE EVENT
    # ======================
    def save_event(self, data):
        """
        Save single event to cache
        """
        with self.lock:
            try:
                events = self._read()

                events.append({
                    "type": data.get("type", "heartbeat"),
                    "data": data
                })

                self._write(events)

                print("💾 Cached event")

            except Exception as e:
                print("❌ Cache save error:", e)

    # ======================
    # GET EVENTS
    # ======================
    def get_events(self):
        """
        Return all cached events
        """
        with self.lock:
            try:
                events = self._read()

                # return only data list (API expects raw events)
                return [e["data"] for e in events]

            except Exception as e:
                print("❌ Cache read error:", e)
                return []

    # ======================
    # CLEAR EVENTS
    # ======================
    def clear_events(self):
        """
        Clear cache after successful sync
        """
        with self.lock:
            try:
                self._write([])
                print("🧹 Cache cleared")

            except Exception as e:
                print("❌ Cache clear error:", e)

    # ======================
    # INTERNAL READ
    # ======================
    def _read(self):
        try:
            with open(self.file_path, "r") as f:
                return json.load(f)
        except:
            return []

    # ======================
    # INTERNAL WRITE
    # ======================
    def _write(self, data):
        with open(self.file_path, "w") as f:
            json.dump(data, f, indent=2)