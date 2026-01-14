from typing import Tuple
from models.place import Place, Description, Location, Connection, Hours, RegularHour
from utils.model import LLMClient


class TripadvisorMapper:
    def __init__(self, llm_client: LLMClient, categories: list[str]):
        self.llm_client = llm_client
        self.categories = categories

    def _determine_region(self, ancestors: list[dict]) -> str | None:
        """
        Determines the region (`hong-kong` or `macau`) from the location details.

        :param ancestors: List of ancestor location dictionaries
        :type ancestors: list[dict]
        :return: Region string or None if not found
        :rtype: str | None
        """
        for ancestor in ancestors:
            aid = str(ancestor.get("location_id", ""))
            if aid == "664891":
                return "macau"
            elif aid == "294217":
                return "hong-kong"
        return None

    def _generate_description(self, name: str, region: str) -> str | None:
        """
        Generates a description for the place using the LLM client.

        :param name: Name of the place
        :type name: str
        :param region: Region of the place
        :type region: str
        :return: Generated description or None if failed
        :rtype: str | None
        """
        print(f"Generating description for {name}...")
        if self.llm_client.is_available:
            description = self.llm_client.generate_description(name, region)
            if description:
                print(f"Generated description for {name}")
                return description
            else:
                print(f"Failed to generate description for {name}")
                return None
        else:
            print("Cannot generate description: LLM client not available.")
            return None

    def _determine_category(self, name: str) -> str | None:
        """
        Determines the category for the place using the LLM client.

        :param name: Name of the place
        :type name: str
        :return: Determined category or None if failed
        :rtype: str | None
        """
        print(f"Determining category for {name}...")
        if self.llm_client.is_available:
            category = self.llm_client.determine_category(name, self.categories)
            if category:
                print(f"Determined category for {name}: {category}")
                return category
            else:
                print(f"Failed to determine category for {name}")
                return None
        else:
            print("Cannot determine category: LLM client not available.")
            return None

    def _parse_periods(self, periods: list[dict]) -> list[RegularHour]:
        """
        Parses the opening hours periods from Tripadvisor format to RegularHour list.

        :param periods: List of period dictionaries
        :type periods: list[dict]
        :return: List of RegularHour objects
        :rtype: list[RegularHour]
        """
        hours = []
        for p in periods:
            day = p["open"]["day"]  # 0 (Sunday) to 6 (Saturday)
            open_t = p["open"]["time"]  # Open time string "HHMM"
            close_t = p["close"]["time"]  # Close time string "HHMM"
            hours.append(
                RegularHour(
                    day=7 if day == 0 else day,  # Convert to 1-7
                    open=f"{open_t[:2]}:{open_t[2:]}",
                    close=f"{close_t[:2]}:{close_t[2:]}",
                )
            )
        return sorted(hours, key=lambda x: x.day)

    @staticmethod
    def extract_rating(details: dict) -> float | None:
        try:
            return float(details["rating"]) if details.get("rating") else None
        except (ValueError, TypeError):
            return None

    @staticmethod
    def extract_ranking(details: dict) -> int | None:
        try:
            return (
                int(details["ranking_data"].get("ranking"))
                if details.get("ranking_data")
                else None
            )
        except (ValueError, TypeError):
            return None

    def map_place(
        self, details: dict, photos: list[str], id: int
    ) -> Tuple[Place, dict]:
        flags = {
            "missing_description": False,
            "missing_region": False,
            "missing_category": False,
        }

        # 1. Name
        name = details.get("name", "")

        # 2. Region
        region = self._determine_region(details.get("ancestors", []))
        if not region:
            region = "unknown"
            flags["missing_region"] = True

        # 3. Description
        description = details.get("description", "")
        description_source = "tripadvisor"
        if not description.strip():  # Empty description, try to generate one
            description = self._generate_description(name, region)
            description_source = "ai"
        if not description:  # Still no description
            description = ""
            description_source = "none"
            flags["missing_description"] = True

        # 4. Category
        category = self._determine_category(name)
        if not category:
            category = (details.get("category") or {}).get("name", "attraction").lower()
            flags["missing_category"] = True

        # 5. Hours
        timezone = details.get("timezone", "Asia/Hong_Kong")
        periods = self._parse_periods(details.get("hours", {}).get("periods", []))

        # 6. Location
        address = details.get("address_obj", {}).get("address_string", "")
        lat = float(details.get("latitude")) if details.get("latitude") else None
        lng = float(details.get("longitude")) if details.get("longitude") else None

        # 7. Other fields
        externalId = int(details.get("location_id", 0))
        rating = self.extract_rating(details)
        ranking = self.extract_ranking(details)

        place = Place(
            id=id,
            name=name,
            region=region,
            category=category,
            description=Description(content=description, source=description_source),
            location=Location(address=address, latitude=lat, longitude=lng),
            hours=Hours(timezone=timezone, regular=periods),
            images=photos,
            rating=rating,
            ranking=ranking,
            phone=details.get("phone"),
            website=details.get("website"),
            _connection=Connection(type="tripadvisor", locationId=externalId),
        )

        return place, flags
