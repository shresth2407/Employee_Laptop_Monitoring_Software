import requests


class BaseAPI:
    def __init__(self, base_url):
        self.base_url = base_url
        self.access_token = None
        self.session_id = None

    def set_token(self, token):
        self.access_token = token

    def set_session_id(self, session_id):
        self.session_id = session_id

    def _headers(self):
        headers = {"Content-Type": "application/json"}

        if self.access_token:
            headers["Authorization"] = f"Bearer {self.access_token}"

        return headers

    # ✅ NEW METHOD (IMPORTANT)
    def get(self, endpoint):
        try:
            print(f"📡 GET: {endpoint}")

            res = requests.get(
                f"{self.base_url}{endpoint}",
                headers=self._headers(),
                timeout=10
            )

            return res.json()

        except Exception as e:
            print("❌ GET error:", e)
            return None

    def post(self, endpoint, data=None):
        try:
            if data is None:
                data = {}

            # 🔥 ALWAYS attach sessionId
            if self.session_id:
                data["sessionId"] = self.session_id

            print(f"📡 POST: {endpoint} | sessionId: {data.get('sessionId')}")

            res = requests.post(
                f"{self.base_url}{endpoint}",
                json=data,
                headers=self._headers(),
                timeout=10
            )

            return res.json()

        except Exception as e:
            print("❌ POST error:", e)
            return None