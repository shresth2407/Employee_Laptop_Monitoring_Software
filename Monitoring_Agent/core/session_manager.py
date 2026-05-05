# from api.base_api import BaseAPI


# class SessionManager:

#     def __init__(self, base_api: BaseAPI):
#         self.api = base_api

#     def get_session_status(self):
#         res = self.api.get("/agent/session-status")

#         if res and res.get("success"):
#             data = res.get("data", {})

#             return {
#                 "active": data.get("hasActiveSession", False),
#                 "session_id": data.get("sessionId"),
#                 "settings": data.get("settings", {})
#             }

#         return {"active": False}