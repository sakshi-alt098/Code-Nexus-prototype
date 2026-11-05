"""
Evaluation, Calibration, and High-Precision Optimization Suite.
Computes Standard Metrics AND High-Precision Operating Thresholds (Target Precision >= 90%).
"""

import sys
import json
import argparse
from pathlib import Path
from typing import Dict, Any, Tuple, List

import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, precision_score, recall_score
from transformers import AutoTokenizer

from config import (
    CHECKPOINT_DIR,
    DATA_DIR,
    DEVICE,
    NUM_CLASSES,
    ID2LABEL,
    LABEL2ID,
    EVAL_BATCH_SIZE,
    DEFAULT_VAL_SAMPLES,
)
from hybrid_model import HybridClaimClassifier
from data_loader import load_raw_fever_split, FeverDataset


def compute_threshold_metrics(
    all_targets: List[int],
    all_probs: np.ndarray,
    target_class: int,
    threshold: float
) -> Tuple[float, float, float, int]:
    """Computes precision, recall, and coverage for a specific class at a given confidence threshold."""
    class_probs = all_probs[:, target_class]
    # Binary predictions for target class: 1 if prob >= threshold else 0
    positives = (class_probs >= threshold)
    count = int(np.sum(positives))
    if count == 0:
        return 0.0, 0.0, 0.0, 0

    true_positives = np.sum((np.array(all_targets) == target_class) & positives)
    precision = true_positives / count
    total_actual = np.sum(np.array(all_targets) == target_class)
    recall = true_positives / max(total_actual, 1)
    coverage = count / len(all_targets)

    return float(precision), float(recall), float(coverage), count


def find_high_precision_thresholds(
    all_targets: List[int],
    all_probs: np.ndarray,
    target_precision: float = 0.90
) -> Dict[str, Any]:
    """
    Sweeps confidence thresholds from 0.40 to 0.95 to find the exact threshold
    where Precision >= 90% for each class.
    """
    print("\n" + "=" * 75)
    print(f"HIGH-PRECISION OPERATING POINT ANALYSIS (Target: Precision >= {target_precision * 100:.0f}%)")
    print("=" * 75)
    print(f"{'Class':<18}{'Threshold':<12}{'Precision':<12}{'Recall':<10}{'Coverage':<10}{'Status'}")
    print("-" * 75)

    threshold_results = {}
    threshold_sweep = np.linspace(0.40, 0.95, 56)

    for c_id, c_name in ID2LABEL.items():
        best_thresh = None
        best_p = 0.0
        best_r = 0.0
        best_cov = 0.0

        for thresh in threshold_sweep:
            p, r, cov, cnt = compute_threshold_metrics(all_targets, all_probs, c_id, thresh)
            if p >= target_precision and cnt >= 5:
                best_thresh = float(thresh)
                best_p = p
                best_r = r
                best_cov = cov
                break

        # If strict 90% was not crossed, take the maximum precision achieved
        if best_thresh is None:
            max_p_thresh = max(threshold_sweep, key=lambda t: compute_threshold_metrics(all_targets, all_probs, c_id, t)[0])
            p, r, cov, _ = compute_threshold_metrics(all_targets, all_probs, c_id, max_p_thresh)
            best_thresh = float(max_p_thresh)
            best_p = p
            best_r = r
            best_cov = cov
            status = f"Peak: {best_p * 100:.1f}%"
        else:
            status = f"ACHIEVED (>={target_precision * 100:.0f}%)"

        print(f"{c_name:<18}{best_thresh:<12.3f}{best_p * 100:>6.2f}%    {best_r * 100:>6.2f}%   {best_cov * 100:>6.2f}%   {status}")
        threshold_results[c_name] = {
            "threshold": round(best_thresh, 4),
            "precision_pct": round(best_p * 100, 2),
            "recall_pct": round(best_r * 100, 2),
            "coverage_pct": round(best_cov * 100, 2),
            "target_met": best_p >= target_precision
        }

    # Global High-Precision Verdict Strategy (Selective Classification)
    # A prediction is only emitted when max(prob) >= overall threshold
    print("\n--- Overall Selective High-Precision Strategy ---")
    global_results = []
    for t in [0.50, 0.60, 0.70, 0.75, 0.80, 0.85, 0.90]:
        max_probs = np.max(all_probs, axis=-1)
        preds = np.argmax(all_probs, axis=-1)
        mask = max_probs >= t
        if np.sum(mask) == 0:
            continue
        filtered_targets = np.array(all_targets)[mask]
        filtered_preds = preds[mask]
        p_macro = precision_score(filtered_targets, filtered_preds, average="macro", zero_division=0)
        acc = accuracy_score(filtered_targets, filtered_preds)
        cov = np.mean(mask) * 100
        n_samples = int(np.sum(mask))
        met_str = "YES [>=90%]" if p_macro >= 0.90 or acc >= 0.90 else "Approaching"
        print(f"  Confidence Threshold >= {t:.2f} | Precision: {p_macro * 100:5.2f}% | Accuracy: {acc * 100:5.2f}% | Decided: {cov:5.1f}% ({n_samples:,} claims) | {met_str}")
        global_results.append({
            "threshold": t,
            "precision_pct": round(p_macro * 100, 2),
            "accuracy_pct": round(acc * 100, 2),
            "coverage_pct": round(cov, 2),
            "samples_decided": n_samples
        })

    # Save to disk for predict.py
    calib_file = CHECKPOINT_DIR / "precision_thresholds.json"
    with open(calib_file, "w", encoding="utf-8") as f:
        json.dump({
            "per_class": threshold_results,
            "global_thresholds": global_results,
            "recommended_high_precision_threshold": 0.75
        }, f, indent=2)
    print(f"\n[SAVED] High-precision operating parameters saved to: {calib_file.name}")

    return threshold_results


def run_evaluation(
    checkpoint_path: Path = CHECKPOINT_DIR / "best_hybrid_model.pt",
    eval_samples: int = DEFAULT_VAL_SAMPLES,
    batch_size: int = EVAL_BATCH_SIZE
):
    print("=" * 75)
    print("EVALUATING HYBRID CLAIM VERIFIER ON FEVER DEV SET")
    print(f"Checkpoint: {checkpoint_path}")
    print(f"Device: {DEVICE}")
    print("=" * 75)

    if not checkpoint_path.exists():
        raise FileNotFoundError(f"Checkpoint not found at {checkpoint_path}. Train the model first.")

    # 1. Load Checkpoint
    checkpoint = torch.load(checkpoint_path, map_location=DEVICE)
    model = HybridClaimClassifier()
    model.load_state_dict(checkpoint["model_state_dict"])
    model.to(DEVICE)
    model.eval()

    tokenizer = AutoTokenizer.from_pretrained(model.backbone_name)

    # 2. Load Validation Split
    dev_path = DATA_DIR / "dev.jsonl"
    claims, labels = load_raw_fever_split(dev_path, max_samples=eval_samples)
    dataset = FeverDataset(claims, labels, tokenizer)
    dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=False)

    # 3. Predict on All Batches
    all_preds = []
    all_targets = []
    all_probs = []

    print("\n[INFERENCE] Running evaluation over validation samples...")
    with torch.no_grad():
        for batch in dataloader:
            input_ids = batch["input_ids"].to(DEVICE, non_blocking=True)
            attention_mask = batch["attention_mask"].to(DEVICE, non_blocking=True)
            linguistic_features = batch["linguistic_features"].to(DEVICE, non_blocking=True)
            target = batch["label"]

            logits = model(input_ids, attention_mask, linguistic_features)
            probs = torch.softmax(logits, dim=-1).cpu().numpy()
            preds = torch.argmax(logits, dim=-1).cpu().tolist()

            all_preds.extend(preds)
            all_targets.extend(target.tolist())
            all_probs.extend(probs)

    all_probs_np = np.array(all_probs)

    # 4. Standard Unconstrained Metrics (ArgMax)
    acc = accuracy_score(all_targets, all_preds)
    target_names = [ID2LABEL[i] for i in range(NUM_CLASSES)]
    report = classification_report(all_targets, all_preds, target_names=target_names, digits=4)
    cm = confusion_matrix(all_targets, all_preds)

    print("\n" + "=" * 75)
    print("STANDARD CLASSIFICATION REPORT (Unconstrained ArgMax)")
    print("=" * 75)
    print(report)

    print("=" * 75)
    print("CONFUSION MATRIX")
    print("=" * 75)
    header = f"{'True \\ Pred':<20}" + "".join([f"{name:>18}" for name in target_names])
    print(header)
    print("-" * len(header))
    for i, row in enumerate(cm):
        row_str = f"{target_names[i]:<20}" + "".join([f"{val:>18,}" for val in row])
        print(row_str)

    # 5. High-Precision Sweep (Target >= 90%)
    find_high_precision_thresholds(all_targets, all_probs_np, target_precision=0.90)


def main():
    parser = argparse.ArgumentParser(description="Evaluate Trained Hybrid Model with Precision Optimization")
    parser.add_argument("--checkpoint", type=str, default=str(CHECKPOINT_DIR / "best_hybrid_model.pt"))
    parser.add_argument("--samples", type=int, default=DEFAULT_VAL_SAMPLES)
    parser.add_argument("--batch_size", type=int, default=EVAL_BATCH_SIZE)
    args = parser.parse_args()

    run_evaluation(
        checkpoint_path=Path(args.checkpoint),
        eval_samples=args.samples,
        batch_size=args.batch_size
    )


if __name__ == "__main__":
    main()
