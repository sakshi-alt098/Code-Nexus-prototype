"""
Data downloader and validator for the FEVER (Fact Extraction and VERification) dataset.
Source: https://fever.ai/download/fever/
Dataset reference: https://huggingface.co/datasets/fever/fever
"""

import os
import sys
import json
import time
import requests
from pathlib import Path
from tqdm import tqdm

DATA_DIR = Path(__file__).resolve().parent / "data"

URLS = {
    "train": "https://fever.ai/download/fever/train.jsonl",
    "dev": "https://fever.ai/download/fever/shared_task_dev.jsonl",
}

EXPECTED_SIZES = {
    "train.jsonl": 33024303,
    "dev.jsonl": 4349935,
}


def download_file(url: str, dest_path: Path) -> None:
    if dest_path.exists() and dest_path.stat().st_size > 0:
        expected = EXPECTED_SIZES.get(dest_path.name)
        if expected and abs(dest_path.stat().st_size - expected) < 100:
            print(f"[CACHE] {dest_path.name} already exists ({dest_path.stat().st_size:,} bytes). Skipping download.")
            return

    print(f"[DOWNLOAD] Downloading {url} -> {dest_path.name}...")
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) InkloomAI/1.0"}
    response = requests.get(url, stream=True, headers=headers, timeout=30)
    response.raise_for_status()

    total_size = int(response.headers.get("content-length", 0))
    block_size = 1024 * 64

    temp_path = dest_path.with_suffix(".tmp")
    with open(temp_path, "wb") as f, tqdm(
        total=total_size, unit="B", unit_scale=True, desc=dest_path.name
    ) as pbar:
        for chunk in response.iter_content(chunk_size=block_size):
            if chunk:
                f.write(chunk)
                pbar.update(len(chunk))

    if temp_path.exists():
        temp_path.replace(dest_path)
    print(f"[SUCCESS] Saved to {dest_path} ({dest_path.stat().st_size:,} bytes)")


def verify_dataset(split_name: str, file_path: Path) -> dict:
    print(f"\n[VERIFY] Validating {split_name} ({file_path.name})...")
    label_counts = {}
    total_records = 0

    with open(file_path, "r", encoding="utf-8") as f:
        for line_num, line in enumerate(f, start=1):
            line = line.strip()
            if not line:
                continue
            item = json.loads(line)
            label = item.get("label", "UNKNOWN")
            claim = item.get("claim", "")
            if not claim:
                continue
            label_counts[label] = label_counts.get(label, 0) + 1
            total_records += 1

    print(f"  Total Valid Records: {total_records:,}")
    print(f"  Label Distribution: {label_counts}")
    return {"total": total_records, "distribution": label_counts}


def main():
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    print("=" * 60)
    print("FEVER Dataset Ingestion & Validation Pipeline")
    print(f"Target Directory: {DATA_DIR}")
    print("=" * 60)

    train_path = DATA_DIR / "train.jsonl"
    dev_path = DATA_DIR / "dev.jsonl"

    # Download both files
    download_file(URLS["dev"], dev_path)
    download_file(URLS["train"], train_path)

    # Verify both files
    dev_stats = verify_dataset("Validation (Dev)", dev_path)
    train_stats = verify_dataset("Training (Train)", train_path)

    print("\n[COMPLETE] Dataset successfully prepared for Hybrid Model training.")


if __name__ == "__main__":
    main()
