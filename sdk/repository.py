import os
import requests
import pandas as pd
from io import StringIO
from dotenv import load_dotenv

# Load .env variables
load_dotenv()

IPFS_GATEWAY = os.getenv("IPFS_GATEWAY", "https://ipfs.io/ipfs")
CONTRACT_API = os.getenv("CONTRACT_API", "https://api.dehug.io")
TRACK_API = os.getenv("TRACK_API", "https://localhost:8000")  # Can be separate if needed

class DeHugRepository:
    @staticmethod
    def _track_download(item_name: str):
        try:
            response = requests.post(
                f"{TRACK_API}/track/download",
                json={
                    "item_name": item_name,
                    "source": "sdk"
                },
                timeout=5
            )
            response.raise_for_status()
        except requests.RequestException as e:
            print(f"[DeHug SDK] Tracking failed: {e}")

    @staticmethod
    def load_dataset(name: str):
        res = requests.get(f"{CONTRACT_API}/datasets/{name}")
        res.raise_for_status()
        data = res.json()
        cid = data["cid"]
        file_format = data.get("format", "json")
        file_url = f"{IPFS_GATEWAY}/{cid}"
        file_res = requests.get(file_url)
        file_res.raise_for_status()

        # Track the download
        DeHugRepository._track_download(name)

        if file_format == "json":
            return file_res.json()
        elif file_format == "csv":
            return pd.read_csv(StringIO(file_res.text))
        else:
            raise Exception("Unsupported format")

    @staticmethod
    def load_model(name: str):
        res = requests.get(f"{CONTRACT_API}/models/{name}")
        res.raise_for_status()
        model = res.json()

        # Track the download
        DeHugRepository._track_download(name)

        return model
