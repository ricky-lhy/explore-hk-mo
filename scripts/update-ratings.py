import argparse
import os
import glob
import sys
from dotenv import load_dotenv

from utils.tripadvisor import TripadvisorClient
from models.place import Place
from mappers.tripadvisor import TripadvisorMapper

# Load environment variables
load_dotenv()

TRIPADVISOR_API_KEY = os.getenv("TRIPADVISOR_API_KEY")
tripadvisor_client = TripadvisorClient(api_key=TRIPADVISOR_API_KEY)


def main():
    # Argument parsing
    parser = argparse.ArgumentParser(
        description="Update Place ratings and rankings from Tripadvisor",
    )
    parser.add_argument(
        "-d",
        "--dir",
        required=True,
        help="Directory containing Place JSON files",
    )
    args = parser.parse_args()

    # Check directory
    if not os.path.exists(args.dir):
        print(f"Error: Directory {args.dir} does not exist.")
        sys.exit(1)

    files = glob.glob(os.path.join(args.dir, "*.json"))
    print(f"Found {len(files)} files in {args.dir}")

    for file in files:
        try:
            with open(file, "r", encoding="utf-8") as f:
                place = Place.from_json(f.read())

            # Skip if not Tripadvisor connection
            if not place._connection or place._connection.type != "tripadvisor":
                continue

            location_id = place._connection.locationId
            if not location_id:
                continue

            print(f"Updating {os.path.basename(file)} (ID: {location_id})...")

            details = tripadvisor_client.fetch_details(location_id)
            if not details:
                print(f"  Skipping: Failed to fetch details for {location_id}")
                continue

            # Update Rating
            updated = False
            new_rating = TripadvisorMapper.extract_rating(details)
            if new_rating is not None and place.rating != new_rating:
                place.rating = new_rating
                updated = True
                print(f"  Rating updated: {new_rating}")

            # Update Ranking
            new_ranking = TripadvisorMapper.extract_ranking(details)
            if new_ranking is not None and place.ranking != new_ranking:
                place.ranking = new_ranking
                updated = True
                print(f"  Ranking updated: {new_ranking}")

            if updated:
                with open(file, "w", encoding="utf-8") as f:
                    f.write(place.to_json())
                print(f"  Saved changes to {os.path.basename(file)}")
            else:
                print("  No changes needed.")

        except Exception as e:
            print(f"Error processing {file}: {e}")


if __name__ == "__main__":
    main()
