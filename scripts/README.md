# Automation Scripts

This directory contains various automation scripts for **Explore Hong Kong & Macau**, including data generation and management tools.

## 🛠 Setup

### Prerequisite

This project uses [uv](https://docs.astral.sh/uv/) for Python package management.

1.  Navigate to this directory: `cd scripts`

2.  Install dependencies: `uv sync`

### Environment Settings

Create a `.env` file in the `scripts` directory and specify the following variables:

- `TRIPADVISOR_API_KEY`: API key for Tripadvisor content.
- `OPENAI_API_KEY`: (Optional) API key for generating missing descriptions using OpenAI.

### Running Scripts

You can run scripts directly using:

```bash
uv run <script_name.py> [arguments]
```

For example:

```bash
uv run spawn-places.py -o ../backend/Data/places -p 123456 123457
```

## 🤖 Scripts

### Place Spawner

- **Script:** `spawn-places.py`

- **Usage:**

  - Fetches place details and photos from Tripadvisor API and generates standardized JSON files for the backend.
  - Uses OpenAI to fill in missing descriptions and determine category if available.

- **Arguments:**

  | Option           | Description                                                                          |
  | :--------------- | :----------------------------------------------------------------------------------- |
  | `-o`, `--output` | Destination directory for the generated JSON files (e.g., `../backend/Data/places`). |
  | `-p`, `--places` | List of Tripadvisor Location IDs to process (separated by space).                    |

- **Output:** Files are generated in the format `place_[id]{*#%$}.json`. The suffixes indicate:
  - **`*`:** Not yet manually verified; data may be incorrect.
  - **`#`:** Missing description (not found in Tripadvisor + AI generation failed).
  - **`%`:** Missing region information (mapping failed).
  - **`$`:** Unable to determine category using AI.

> ⚠️ **Warning:** Data fetched from Tripadvisor, especially **addresses**, is often incorrect or formatted poorly. **Coordinates** can also be inaccurate. Always verify this information manually using Google Maps or another reliable source.

### Rating & Ranking Updater

- **Script:** `update-ratings.py`

- **Usage:**

  - Scans an existing directory of place JSON files.
  - Fetches the latest ratings and rankings from Tripadvisor for connected places.
  - Updates (only) the `rating` and `ranking` fields in the JSON file if they have changed.

- **Arguments:**

  | Option        | Description                                      |
  | :------------ | :----------------------------------------------- |
  | `-d`, `--dir` | Directory containing Place JSON files to update. |
