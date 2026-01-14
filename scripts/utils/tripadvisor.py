import requests


class TripadvisorClient:
    def __init__(self, api_key: str, language: str = "zh_TW", currency: str = "HKD"):
        if not api_key:
            raise ValueError("Tripadvisor API key is required.")
        self.api_key = api_key
        self.language = language
        self.currency = currency
        self.base_url = "https://api.content.tripadvisor.com/api/v1/location"
        self.headers = {"accept": "application/json"}

    def fetch_details(self, taid: int) -> dict | None:
        """
        Fetches location details from the Tripadvisor API for a given location ID.

        :param taid: Tripadvisor location ID
        :type taid: int
        :return: Location details as a dictionary or None if not found/error
        :rtype: dict | None
        """
        url = f"{self.base_url}/{taid}/details"
        params = {
            "language": self.language,
            "currency": self.currency,
            "key": self.api_key,
        }
        try:
            response = requests.get(url, headers=self.headers, params=params)
            if response.status_code == 404:
                print(f"Place {taid} not found on Tripadvisor.")
                return None
            if response.status_code != 200:
                print(
                    f"Error fetching details for {taid}: {response.status_code} {response.text}"
                )
                return None
            return response.json()
        except Exception as e:
            print(f"Exception details for {taid}: {e}")
            return None

    def fetch_photos(self, taid: int) -> list[str]:
        """
        Fetches photo URLs from the Tripadvisor API for a given location ID.

        :param taid: Tripadvisor location ID
        :type taid: int
        :return: List of photo URLs
        :rtype: list[str]
        """
        url = f"{self.base_url}/{taid}/photos"
        params = {
            "language": self.language,
            "key": self.api_key,
        }
        try:
            response = requests.get(url, headers=self.headers, params=params)
            if response.status_code != 200:
                print(
                    f"Error fetching photos for {taid}: {response.status_code} {response.text}"
                )
                return []

            data = response.json()
            images = []
            if "data" in data:
                for item in data["data"]:
                    # Try to get the original or largest image
                    if "images" in item:
                        imgs = item["images"]
                        if "original" in imgs:
                            images.append(imgs["original"]["url"])
                        elif "large" in imgs:
                            images.append(imgs["large"]["url"])
                        elif "medium" in imgs:
                            images.append(imgs["medium"]["url"])
            return images
        except Exception as e:
            print(f"Exception photos for {taid}: {e}")
            return []
