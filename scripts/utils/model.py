from openai import OpenAI

REGIONAL_ADJECTIVES = {
    "hong-kong": "香港的",
    "macau": "澳門的",
}


class LLMClient:
    def __init__(self, api_key: str | None):
        self.client = OpenAI(api_key=api_key) if api_key else None

    @property
    def is_available(self) -> bool:
        return self.client is not None

    def determine_category(self, name: str, categories: list[str]) -> str | None:
        """
        Determines the category of a place using OpenAI.

        :param name: Name of the place
        :type name: str
        :param categories: List of allowed categories
        :type categories: list[str]
        :return: Determined category or None
        :rtype: str | None
        """
        if not self.client or not categories:
            return None

        categories_str = ", ".join(categories)
        prompt = f"Categorize the place '{name}' into exactly one of the following categories: {categories_str}. Return ONLY the category name. If it doesn't fit well, pick the closest one."

        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful categorization assistant.",
                    },
                    {"role": "user", "content": prompt},
                ],
                max_tokens=20,
                temperature=0,
            )
            result = response.choices[0].message.content.strip().lower()
            if result in categories:
                return result
            else:
                print(f"LLM returned invalid category: {result}")
                return None
        except Exception as e:
            print(f"Error determining category for {name}: {e}")
            return None

    def generate_description(
        self, name: str, region: str | None, length: int = 50
    ) -> str | None:
        """
        Generates a description for a place using OpenAI.

        :param name: Name of the place
        :type name: str
        :param region: Region of the place (hong-kong or macau)
        :type region: str | None
        :param length: Desired length of the description in characters
        :type length: int
        :return: Generated description
        :rtype: str | None
        """
        if not self.client:
            return None

        regional_str = REGIONAL_ADJECTIVES.get(region, "")
        prompt = f"請用繁體中文為{regional_str}「{name}」寫一段旅遊介紹。內容要精簡，大約{length}字，重點介紹其吸引遊客之處。"

        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful travel assistant. You reply in Traditional Chinese.",
                    },
                    {"role": "user", "content": prompt},
                ],
                max_tokens=500,
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"Error generating description for {name}: {e}")
            return None
