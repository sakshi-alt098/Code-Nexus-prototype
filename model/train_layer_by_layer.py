"""
Progressive Layer-by-Layer Training Pipeline for the FEVER Hybrid Claim Verification Model.
Executes three distinct training stages:
  - Phase 1: Train Classification Head & Gated Multimodal Fusion Unit (Backbone frozen)
  - Phase 2: Unfreeze Contextual BiLSTM & Top Transformer Layers
  - Phase 3: Full End-to-End Fine-Tuning with Layer-wise Learning Rate Decay (LLRD)
"""

import os
import sys
import time
import json
import argparse
from pathlib import Path
from typing import Dict, List, Tuple, Any

import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from tqdm import tqdm
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, classification_report

from config import (
    CHECKPOINT_DIR,
    DEVICE,
    NUM_CLASSES,
    ID2LABEL,
    LABEL2ID,
    BATCH_SIZE,
    EVAL_BATCH_SIZE,
    DEFAULT_TRAIN_SAMPLES,
    DEFAULT_VAL_SAMPLES,
    PHASE1_EPOCHS,
    PHASE2_EPOCHS,
    PHASE3_EPOCHS,
)
from hybrid_model import HybridClaimClassifier
from data_loader import get_dataloaders


def evaluate(
    model: nn.Module,
    dataloader: DataLoader,
    criterion: nn.Module,
    device: torch.device
) -> Tuple[float, float, float, Dict[str, Any]]:
    """Evaluates the model on the validation dataset."""
    model.eval()
    total_loss = 0.0
    all_preds = []
    all_targets = []

    with torch.no_grad():
        for batch in dataloader:
            input_ids = batch["input_ids"].to(device, non_blocking=True)
            attention_mask = batch["attention_mask"].to(device, non_blocking=True)
            linguistic_features = batch["linguistic_features"].to(device, non_blocking=True)
            labels = batch["label"].to(device, non_blocking=True)

            logits = model(input_ids, attention_mask, linguistic_features)
            loss = criterion(logits, labels)

            total_loss += loss.item() * len(labels)
            preds = torch.argmax(logits, dim=-1).cpu().tolist()
            all_preds.extend(preds)
            all_targets.extend(labels.cpu().tolist())

    avg_loss = total_loss / max(len(all_targets), 1)
    acc = accuracy_score(all_targets, all_preds)
    p, r, f1, _ = precision_recall_fscore_support(all_targets, all_preds, average="macro", zero_division=0)
    
    report_dict = classification_report(
        all_targets,
        all_preds,
        target_names=[ID2LABEL[i] for i in range(NUM_CLASSES)],
        output_dict=True,
        zero_division=0
    )

    return avg_loss, acc, f1, report_dict


def train_epoch(
    model: nn.Module,
    dataloader: DataLoader,
    optimizer: torch.optim.Optimizer,
    criterion: nn.Module,
    device: torch.device,
    epoch_desc: str
) -> float:
    """Trains the model for a single epoch."""
    model.train()
    total_loss = 0.0
    total_samples = 0

    pbar = tqdm(dataloader, desc=epoch_desc, leave=False)
    for batch in pbar:
        input_ids = batch["input_ids"].to(device, non_blocking=True)
        attention_mask = batch["attention_mask"].to(device, non_blocking=True)
        linguistic_features = batch["linguistic_features"].to(device, non_blocking=True)
        labels = batch["label"].to(device, non_blocking=True)

        optimizer.zero_grad()
        logits = model(input_ids, attention_mask, linguistic_features)
        loss = criterion(logits, labels)
        loss.backward()

        # Gradient clipping for LSTM & Transformer stability
        torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
        optimizer.step()

        batch_size = len(labels)
        total_loss += loss.item() * batch_size
        total_samples += batch_size
        pbar.set_postfix({"batch_loss": f"{loss.item():.4f}"})

    return total_loss / max(total_samples, 1)


def run_staged_training(
    train_samples: int = DEFAULT_TRAIN_SAMPLES,
    val_samples: int = DEFAULT_VAL_SAMPLES,
    phase1_epochs: int = PHASE1_EPOCHS,
    phase2_epochs: int = PHASE2_EPOCHS,
    phase3_epochs: int = PHASE3_EPOCHS,
    batch_size: int = BATCH_SIZE,
    eval_batch_size: int = EVAL_BATCH_SIZE
) -> Dict[str, Any]:
    print("=" * 70)
    print("INKLOOM AI BRAND GOVERNANCE - HYBRID CLAIM VERIFIER")
    print(f"Device: {DEVICE} ({torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'CPU'})")
    print("Execution Plan: 3 Progressive Layer-by-Layer Training Phases")
    print("=" * 70)

    # 1. Load Data
    train_loader, dev_loader, class_weights, tokenizer = get_dataloaders(
        train_samples=train_samples,
        val_samples=val_samples,
        batch_size=batch_size,
        eval_batch_size=eval_batch_size
    )

    # 2. Initialize Hybrid Model
    model = HybridClaimClassifier()
    model.to(DEVICE)

    # Loss function with class weights
    criterion = nn.CrossEntropyLoss(weight=class_weights.to(DEVICE))

    # Tracking History
    history = {
        "phases": {},
        "best_macro_f1": 0.0,
        "best_accuracy": 0.0,
        "best_epoch": None,
        "training_time_seconds": 0.0
    }
    best_f1 = -1.0
    best_checkpoint_path = CHECKPOINT_DIR / "best_hybrid_model.pt"
    start_time = time.time()

    total_epoch_counter = 0

    # -------------------------------------------------------------------------
    # LAYER-BY-LAYER TRAINING PHASES
    # -------------------------------------------------------------------------
    phases_plan = [
        (1, phase1_epochs, "Phase 1: Head & Fusion Subnets (Backbone Frozen)"),
        (2, phase2_epochs, "Phase 2: Contextual BiLSTM & Top Transformer Blocks"),
        (3, phase3_epochs, "Phase 3: End-to-End Hybrid Network Fine-Tuning (LLRD)")
    ]

    for phase_num, num_epochs, phase_name in phases_plan:
        if num_epochs <= 0:
            print(f"\n[SKIP] {phase_name} (0 epochs configured)")
            continue

        print("\n" + "#" * 70)
        print(f"STARTING {phase_name}")
        print(f"Target Epochs: {num_epochs}")
        print("#" * 70)

        # Configure layer trainability
        model.set_phase(phase_num)
        optimizer = model.get_phase_optimizer(phase_num)

        phase_history = []

        for epoch in range(1, num_epochs + 1):
            total_epoch_counter += 1
            epoch_desc = f"Phase {phase_num} [Epoch {epoch}/{num_epochs}]"
            t0 = time.time()

            train_loss = train_epoch(model, train_loader, optimizer, criterion, DEVICE, epoch_desc)
            val_loss, val_acc, val_f1, val_report = evaluate(model, dev_loader, criterion, DEVICE)
            elapsed = time.time() - t0

            print(
                f"[{epoch_desc}] (Total Epoch {total_epoch_counter}) "
                f"Train Loss: {train_loss:.4f} | Val Loss: {val_loss:.4f} | "
                f"Val Acc: {val_acc * 100:.2f}% | Val Macro F1: {val_f1:.4f} | ({elapsed:.1f}s)"
            )

            # Per-class summary
            for cls_name in ["SUPPORTS", "REFUTES", "NOT ENOUGH INFO"]:
                c_stats = val_report.get(cls_name, {})
                f1_score = c_stats.get("f1-score", 0.0)
                prec = c_stats.get("precision", 0.0)
                rec = c_stats.get("recall", 0.0)
                print(f"    - {cls_name:<16}: Precision={prec:.3f}, Recall={rec:.3f}, F1={f1_score:.3f}")

            epoch_record = {
                "total_epoch": total_epoch_counter,
                "phase": phase_num,
                "phase_epoch": epoch,
                "train_loss": train_loss,
                "val_loss": val_loss,
                "val_accuracy": val_acc,
                "val_macro_f1": val_f1,
                "epoch_time_seconds": elapsed,
                "per_class_report": val_report
            }
            phase_history.append(epoch_record)

            # Checkpoint Best Model
            if val_f1 > best_f1:
                best_f1 = val_f1
                history["best_macro_f1"] = val_f1
                history["best_accuracy"] = val_acc
                history["best_epoch"] = total_epoch_counter
                torch.save({
                    "phase": phase_num,
                    "total_epoch": total_epoch_counter,
                    "model_state_dict": model.state_dict(),
                    "val_accuracy": val_acc,
                    "val_macro_f1": val_f1,
                    "label2id": LABEL2ID,
                    "id2label": ID2LABEL,
                    "config": {
                        "transformer_name": model.backbone_name,
                        "class_weights": class_weights.tolist()
                    }
                }, best_checkpoint_path)
                print(f"  --> Saved NEW BEST Model checkpoint to {best_checkpoint_path.name} (Macro F1: {val_f1:.4f})")

        # Save Phase-Specific Checkpoint
        phase_ckpt = CHECKPOINT_DIR / f"hybrid_model_phase_{phase_num}_final.pt"
        torch.save(model.state_dict(), phase_ckpt)
        print(f"  [CHECKPOINT] Phase {phase_num} final weights saved to {phase_ckpt.name}")

        history["phases"][f"phase_{phase_num}"] = phase_history

    total_training_time = time.time() - start_time
    history["training_time_seconds"] = total_training_time

    # Save training history JSON
    history_file = CHECKPOINT_DIR / "training_history.json"
    with open(history_file, "w", encoding="utf-8") as f:
        json.dump(history, f, indent=2)

    print("\n" + "=" * 70)
    print("TRAINING PIPELINE COMPLETE")
    print(f"Total Time: {total_training_time / 60:.2f} minutes")
    print(f"Best Validation Macro F1: {history['best_macro_f1']:.4f}")
    print(f"Best Validation Accuracy: {history['best_accuracy'] * 100:.2f}%")
    print(f"Best Model Path: {best_checkpoint_path}")
    print(f"History File: {history_file}")
    print("=" * 70)

    return history


def main():
    parser = argparse.ArgumentParser(description="Layer-by-Layer Training for FEVER Hybrid Model")
    parser.add_argument("--train_samples", type=int, default=DEFAULT_TRAIN_SAMPLES, help="Number of training instances (stratified)")
    parser.add_argument("--val_samples", type=int, default=DEFAULT_VAL_SAMPLES, help="Number of validation instances")
    parser.add_argument("--phase1_epochs", type=int, default=PHASE1_EPOCHS, help="Epochs for Phase 1 (Head & Fusion)")
    parser.add_argument("--phase2_epochs", type=int, default=PHASE2_EPOCHS, help="Epochs for Phase 2 (BiLSTM & Top Layers)")
    parser.add_argument("--phase3_epochs", type=int, default=PHASE3_EPOCHS, help="Epochs for Phase 3 (Full Fine-tuning)")
    parser.add_argument("--batch_size", type=int, default=BATCH_SIZE, help="Training batch size")
    parser.add_argument("--eval_batch_size", type=int, default=EVAL_BATCH_SIZE, help="Validation batch size")

    args = parser.parse_args()

    run_staged_training(
        train_samples=args.train_samples,
        val_samples=args.val_samples,
        phase1_epochs=args.phase1_epochs,
        phase2_epochs=args.phase2_epochs,
        phase3_epochs=args.phase3_epochs,
        batch_size=args.batch_size,
        eval_batch_size=args.eval_batch_size
    )


if __name__ == "__main__":
    main()
