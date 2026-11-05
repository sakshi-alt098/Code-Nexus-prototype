"""
Dataset Loading, Stratified Preprocessing, and PyTorch DataLoaders for FEVER.
Handles tokenization and linguistic feature vector generation.
"""

import json
import random
from pathlib import Path
from typing import Dict, List, Tuple, Optional
import torch
from torch.utils.data import Dataset, DataLoader
from transformers import AutoTokenizer

from config import (
    DATA_DIR,
    BACKBONE_NAME,
    MAX_SEQ_LENGTH,
    BATCH_SIZE,
    EVAL_BATCH_SIZE,
    LABEL2ID,
    ID2LABEL,
    NUM_CLASSES,
    SEED,
    DEFAULT_TRAIN_SAMPLES,
    DEFAULT_VAL_SAMPLES,
)
from features import extract_claim_features


class FeverDataset(Dataset):
    """
    PyTorch Dataset for FEVER Claims.
    Yields:
      - input_ids: Tensor[MAX_SEQ_LENGTH]
      - attention_mask: Tensor[MAX_SEQ_LENGTH]
      - linguistic_features: Tensor[16]
      - label: Tensor (scalar Long)
      - claim_text: str (original text for explainability)
    """

    def __init__(
        self,
        claims: List[str],
        labels: List[int],
        tokenizer: AutoTokenizer,
        max_length: int = MAX_SEQ_LENGTH,
        precompute_features: bool = True
    ):
        self.claims = claims
        self.labels = labels
        self.tokenizer = tokenizer
        self.max_length = max_length
        self.precompute_features = precompute_features

        if precompute_features:
            print(f"Precomputing 16-D linguistic features for {len(claims):,} claims...")
            self.features = [extract_claim_features(c) for c in claims]
        else:
            self.features = None

    def __len__(self) -> int:
        return len(self.claims)

    def __getitem__(self, idx: int) -> Dict[str, torch.Tensor]:
        claim = self.claims[idx]
        label = self.labels[idx]

        # Tokenization
        encoded = self.tokenizer(
            claim,
            padding="max_length",
            truncation=True,
            max_length=self.max_length,
            return_tensors="pt"
        )

        input_ids = encoded["input_ids"].squeeze(0)
        attention_mask = encoded["attention_mask"].squeeze(0)

        # Features
        if self.features is not None:
            feat_list = self.features[idx]
        else:
            feat_list = extract_claim_features(claim)

        features_tensor = torch.tensor(feat_list, dtype=torch.float32)

        return {
            "input_ids": input_ids,
            "attention_mask": attention_mask,
            "linguistic_features": features_tensor,
            "label": torch.tensor(label, dtype=torch.long),
            "claim": claim
        }


def load_raw_fever_split(
    file_path: Path,
    max_samples: Optional[int] = None,
    stratified: bool = True,
    random_state: int = SEED
) -> Tuple[List[str], List[int]]:
    """
    Reads a FEVER jsonl file, parses claims and labels, and optionally
    samples a stratified subset for fast experimentation.
    """
    if not file_path.exists():
        raise FileNotFoundError(f"FEVER dataset file not found at {file_path}. Run download_data.py first.")

    claims_by_class: Dict[int, List[str]] = {0: [], 1: [], 2: []}
    total_parsed = 0

    with open(file_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            item = json.loads(line)
            label_str = item.get("label")
            claim = item.get("claim", "").strip()

            if label_str not in LABEL2ID or not claim:
                continue

            label_id = LABEL2ID[label_str]
            claims_by_class[label_id].append(claim)
            total_parsed += 1

    print(f"Loaded {total_parsed:,} valid records from {file_path.name}:")
    for label_id, c_list in claims_by_class.items():
        print(f"  {ID2LABEL[label_id]}: {len(c_list):,} instances")

    # If no sampling requested, return full dataset
    if max_samples is None or max_samples >= total_parsed:
        all_claims = []
        all_labels = []
        for label_id, c_list in claims_by_class.items():
            all_claims.extend(c_list)
            all_labels.extend([label_id] * len(c_list))

        # Shuffle
        rng = random.Random(random_state)
        combined = list(zip(all_claims, all_labels))
        rng.shuffle(combined)
        claims, labels = zip(*combined)
        return list(claims), list(labels)

    # Stratified Sampling
    per_class_quota = max_samples // NUM_CLASSES
    selected_claims = []
    selected_labels = []
    rng = random.Random(random_state)

    for label_id in sorted(claims_by_class.keys()):
        c_list = claims_by_class[label_id]
        rng.shuffle(c_list)
        sampled = c_list[:per_class_quota]
        selected_claims.extend(sampled)
        selected_labels.extend([label_id] * len(sampled))

    combined = list(zip(selected_claims, selected_labels))
    rng.shuffle(combined)
    claims, labels = zip(*combined)

    print(f"Stratified sample created: {len(claims):,} total instances ({per_class_quota:,} per class).")
    return list(claims), list(labels)


def compute_class_weights(labels: List[int]) -> torch.Tensor:
    """Computes balanced inverse-frequency weights for CrossEntropyLoss."""
    counts = [labels.count(i) for i in range(NUM_CLASSES)]
    total = len(labels)
    weights = [total / (NUM_CLASSES * max(c, 1)) for c in counts]
    weights_tensor = torch.tensor(weights, dtype=torch.float32)
    print(f"Computed Class Weights: {[round(w, 3) for w in weights]}")
    return weights_tensor


def get_dataloaders(
    train_samples: Optional[int] = DEFAULT_TRAIN_SAMPLES,
    val_samples: Optional[int] = DEFAULT_VAL_SAMPLES,
    batch_size: int = BATCH_SIZE,
    eval_batch_size: int = EVAL_BATCH_SIZE
) -> Tuple[DataLoader, DataLoader, torch.Tensor, AutoTokenizer]:
    """Creates train and validation DataLoaders with tokenizer and class weights."""
    tokenizer = AutoTokenizer.from_pretrained(BACKBONE_NAME)

    train_path = DATA_DIR / "train.jsonl"
    dev_path = DATA_DIR / "dev.jsonl"

    print("\n--- Loading FEVER Training Split ---")
    train_claims, train_labels = load_raw_fever_split(train_path, max_samples=train_samples)
    class_weights = compute_class_weights(train_labels)

    print("\n--- Loading FEVER Validation Split ---")
    dev_claims, dev_labels = load_raw_fever_split(dev_path, max_samples=val_samples)

    train_dataset = FeverDataset(train_claims, train_labels, tokenizer)
    dev_dataset = FeverDataset(dev_claims, dev_labels, tokenizer)

    train_loader = DataLoader(
        train_dataset,
        batch_size=batch_size,
        shuffle=True,
        num_workers=0,  # 0 for Windows multiprocessing safety
        pin_memory=torch.cuda.is_available()
    )

    dev_loader = DataLoader(
        dev_dataset,
        batch_size=eval_batch_size,
        shuffle=False,
        num_workers=0,
        pin_memory=torch.cuda.is_available()
    )

    return train_loader, dev_loader, class_weights, tokenizer


if __name__ == "__main__":
    train_l, dev_l, weights, tok = get_dataloaders(train_samples=300, val_samples=100)
    batch = next(iter(train_l))
    print("Batch input_ids shape:", batch["input_ids"].shape)
    print("Batch linguistic_features shape:", batch["linguistic_features"].shape)
    print("Batch labels shape:", batch["label"].shape)
    print("DataLoader test passed successfully!")
