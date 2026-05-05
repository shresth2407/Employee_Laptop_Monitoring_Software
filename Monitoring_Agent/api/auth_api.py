class AuthAPI:

    def __init__(self, base_api):
        self.base_api = base_api

    def login(self, email, password):
        print("🔑 LOGGED IN USER:", email)   # 🔥 ADD THIS LINE
        payload = {
            "email": email,
            "password": password
        }

        res = self.base_api.post("/auth/login", payload)

        if res and res.get("success"):
            data = res["data"]

            token = data["accessToken"]
            session_id = data.get("sessionId")

            if not session_id:
                print("❌ No sessionId received")
                return None

            # 🔥 SET globally
            self.base_api.set_token(token)
            self.base_api.set_session_id(session_id)

            print("✅ Login success | Session:", session_id)

            return {
                "token": token,
                "sessionId": session_id
            }

        print("❌ Login failed:", res)
        return None

    def logout(self):
        res = self.base_api.post("/auth/logout", {})

        if res and res.get("success"):
            print("✅ Logout success")
        else:
            print("❌ Logout failed:", res)