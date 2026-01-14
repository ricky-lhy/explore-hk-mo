import argparse
import json
import os
import glob
import sys
import re
from dotenv import load_dotenv

from mappers.tripadvisor import TripadvisorMapper
from utils.tripadvisor import TripadvisorClient
from utils.model import LLMClient

# Load environment variables
load_dotenv()

TRIPADVISOR_API_KEY = os.getenv("TRIPADVISOR_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

tripadvisor_client = TripadvisorClient(api_key=TRIPADVISOR_API_KEY)
model_client = LLMClient(api_key=OPENAI_API_KEY)


def load_categories() -> list[str]:
    """
    Loads allowed categories from the config file.

    :return: List of allowed categories
    :rtype: list[str]
    """
    categories = []
    # Determine path relative to this script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    config_path = os.path.join(script_dir, "config", "categories.txt")
    if os.path.exists(config_path):
        with open(config_path, "r", encoding="utf-8") as f:
            for line in f:
                cat = line.strip()
                if cat:
                    categories.append(cat)
    else:
        print(f"Warning: Categories config not found at {config_path}")
    return categories


def get_next_id(dir: str) -> int:
    """
    Finds the next available internal place ID
    by scanning existing JSON files in the output directory.

    :param dir: Directory to scan for existing place JSON files
    :type dir: str
    :return: Next available internal place ID
    :rtype: int
    """
    used_ids = set()
    # Match any file starting with place_{number}
    files = glob.glob(os.path.join(dir, "place_*.json"))
    for f in files:
        basename = os.path.basename(f)
        # Regex to capture the ID part at the start
        match = re.match(r"place_(\d+)", basename)
        if match:
            used_ids.add(int(match.group(1)))
    next_id = 1
    while next_id in used_ids:
        next_id += 1
    return next_id


def get_existing_taids(dir: str) -> set[int]:
    """
    Scans the output directory for existing Tripadvisor location IDs
    already processed and returns a set of those IDs as strings.

    :param dir: Directory to scan for existing place JSON files
    :type dir: str
    :return: Set of existing Tripadvisor location IDs
    :rtype: set[int]
    """
    existing_taids = set()
    files = glob.glob(os.path.join(dir, "*.json"))
    for f in files:
        try:
            with open(f, "r", encoding="utf-8") as file:
                data = json.load(file)
                conn = data.get("_connection", {})
                if conn.get("type") == "tripadvisor":
                    lid = conn.get("locationId")
                    if lid:
                        existing_taids.add(int(lid))
        except Exception as e:
            # Ignore files that aren't valid JSON or don't match schema
            pass
    return existing_taids


def main():
    # Argument parsing
    parser = argparse.ArgumentParser(
        description="Generate place JSONs from Tripadvisor IDs",
    )
    parser.add_argument(
        "-o",
        "--output",
        required=True,
        help="Destination directory",
    )
    parser.add_argument(
        "-p",
        "--places",
        nargs="+",
        required=True,
        help="List of Tripadvisor IDs",
    )
    args = parser.parse_args()

    # Check output directory
    if not os.path.exists(args.output):
        try:
            os.makedirs(args.output)
            print(f"Created output directory: {args.output}")
        except Exception as e:
            print(f"Error creating output directory {args.output}: {e}")
            sys.exit(1)

    existing_taids = get_existing_taids(args.output)
    allowed_categories = load_categories()

    print(f"Found {len(existing_taids)} existing Tripadvisor places.")
    print(f"Loaded {len(allowed_categories)} allowed categories.")

    # Create mapper
    mapper = TripadvisorMapper(model_client, allowed_categories)

    for taid in args.places:
        if int(taid) in existing_taids:
            print(f"Skipping {taid}: Already exists.")
            continue

        print(f"Processing {taid}...")

        # Fetch data
        details = tripadvisor_client.fetch_details(taid)
        if not details:
            print(f"Skipping {taid}: Failed to fetch details.")
            continue
        photos = tripadvisor_client.fetch_photos(taid)

        # Get next ID right before mapping
        id = get_next_id(args.output)
        place, flags = mapper.map_place(details, photos, id)

        # Check description for filename suffix
        suffix = "*"
        if flags["missing_description"]:
            suffix += "#"
        if flags["missing_region"]:
            suffix += "%"
        if flags["missing_category"]:
            suffix += "$"

        # Write to file
        filename = f"place_{id}{suffix}.json"
        filepath = os.path.join(args.output, filename)
        try:
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(place.to_json())

            print(f"Generated {filename}")

            # Update cache
            existing_taids.add(int(taid))
        except Exception as e:
            print(f"Error writing file {filename}: {e}")


if __name__ == "__main__":
    main()
