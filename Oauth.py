import requests

CLIENT_ID = '6caab81a61e4a30d34d021c1a41e8322'
REDIRECT_URI = 'http://localhost:5173?login=kakao'


class KakaoOauth:
    def __init__(self):
        self.auth_server = "https://kauth.kakao.com%s"
        self.api_server = "https://kapi.kakao.com%s"
        self.default_header = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cache-Control": "no-cache",
        }

    def auth(self, code) -> any:
        return requests.post(
            url=self.auth_server % "/oauth/token",
            headers=self.default_header,
            data={
                "grant_type": "authorization_code",
                "client_id": CLIENT_ID,
                "redirect_uri": REDIRECT_URI,
                "code": code,
            },
        ).json()

    def userinfo(self, bearer_token):
        return requests.post(
            url=self.api_server % "/v2/user/me",
            headers={
                **self.default_header,
                **{"Authorization": 'Bearer ' + bearer_token}
            },
            # "property_keys":'["kakao_account.profile_image_url"]'
            data={}
        ).json()


class KakaoOauthResult:
    access_token: str
    token_type: str
    refresh_token: str
    id_token: str
    expires_in: int
    scope: list[str]
    refresh_token_expires_in: int




