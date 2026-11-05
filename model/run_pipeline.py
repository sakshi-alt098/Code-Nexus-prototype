"""
End-to-End Execution Pipeline:
1. Verifies dataset presence
2. Executes progressive 3-stage layer-by-layer training
3. Evaluates the resulting best model on the FEVER dev split
4. Runs interactive inference demonstrations on factual and brand promotional claims
"""

import sys
import argparse
from pathlib import Path

from config import DATA_DIR, CHECKPOINT_DIR
from download_data import main as download_main
from train_layer_by_layer import run_staged_training
from evaluate import run_evaluation
from predict import run_demo


def main():
    parser = argparse.ArgumentParser(description="End-to-End Pipeline for Hybrid Claim Verifier")
    parser.add_argument("--train_samples", type=int, default=6000, help="Number of training samples (stratified)")
    parser.add_argument("--val_samples", type=int, default=1500, help="Number of validation samples")
    parser.add_argument("--phase1_epochs", type=int, default=2, help="Epochs for Phase 1 (Head & Fusion)")
    parser.add_argument("--phase2_epochs", type=int, default=2, help="Epochs for Phase 2 (BiLSTM & Top Layers)")
    parser.add_argument("--phase3_epochs", type=int, default=2, help="Epochs for Phase 3 (Full Fine-tuning)")
    parser.add_argument("--batch_size", type=int, default=32, help="Training batch size")
    args = parser.parse_args()

    print("\n" + "#" * 75)
    print("STEP 1: CHECKING DATASET READINESS")
    print("#" * 75)
    train_file = DATA_DIR / "train.jsonl"
    dev_file = DATA_DIR / "dev.jsonl"
    if not train_file.exists() or not dev_file.exists():
        print("Dataset missing. Initiating download...")
        download_main()
    else:
        print(f"[READY] Found {train_file.name} and {dev_file.name} in {DATA_DIR}")

    print("\n" + "#" * 75)
    print("STEP 2: PROGRESSIVE LAYER-BY-LAYER TRAINING")
    print("#" * 75)
    history = run_staged_training(
        train_samples=args.train_samples,
        val_samples=args.val_samples,
        phase1_epochs=args.phase1_epochs,
        phase2_epochs=args.phase2_epochs,
        phase3_epochs=args.phase3_epochs,
        batch_size=args.batch_size
    )

    print("\n" + "#" * 75)
    print("STEP 3: COMPREHENSIVE EVALUATION ON DEV SPLIT")
    print("#" * 75)
    best_ckpt = CHECKPOINT_DIR / "best_hybrid_model.pt"
    run_evaluation(checkpoint_path=best_ckpt, eval_samples=args.val_samples)

    print("\n" + "#" * 75)
    print("STEP 4: SAMPLE INFERENCE & GOVERNANCE DEMONSTRATIONS")
    print("#" * 75)
    run_demo()

    print("\n[SUCCESS] Pipeline finished successfully!")


if __name__ == "__main__":
    main()
