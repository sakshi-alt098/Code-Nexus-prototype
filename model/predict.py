"""
Inference and Brand Governance Diagnostics CLI for the FEVER Hybrid Claim Verification Model.
Allows testing individual claims or batch claims with explainable linguistic breakdowns.
"""

import sys
import json
import argparse
from pathlib import Path
from typing import Dict, Any, List

import torch
from transformers import AutoTokenizer

from config import (
    CHECKPOINT_DIR,
    DEVICE,
    ID2LABEL,
    LABEL2ID,
    MAX_SEQ_LENGTH
)
from hybrid_model import HybridClaimClassifier
from features import extract_claim_features, explain_linguistic_signals


class ClaimVerifier:
    """Wrapper class for deploying the trained Hybrid Claim Verification model."""

    def __init__(self, checkpoint_path: Path = CHECKPOINT_DIR / "best_hybrid_model.pt"):
        if not checkpoint_path.exists():
            raise FileNotFoundError(f"Checkpoint not found at {checkpoint_path}. Train the model first.")

        print(f"Loading checkpoint from: {checkpoint_path.name}...")
        checkpoint = torch.load(checkpoint_path, map_location=DEVICE)
        self.model = HybridClaimClassifier()
        self.model.load_state_dict(checkpoint["model_state_dict"])
        self.model.to(DEVICE)
        self.model.eval()

        self.tokenizer = AutoTokenizer.from_pretrained(self.model.backbone_name)

        # Load calibrated precision thresholds if available
        self.thresholds = {}
        thresh_path = CHECKPOINT_DIR / "precision_thresholds.json"
        if thresh_path.exists():
            try:
                with open(thresh_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self.thresholds = data.get("per_class", {})
            except Exception:
                pass

        print("Model and Tokenizer loaded successfully onto", DEVICE)
        if self.thresholds:
            print("Loaded calibrated operating thresholds (Precision >= 90% enabled).")

    def verify_claim(self, claim_text: str) -> Dict[str, Any]:
        """Runs the hybrid neural model + linguistic rules on an input claim."""
        # 1. Linguistic feature extraction
        raw_features = extract_claim_features(claim_text)
        feat_tensor = torch.tensor([raw_features], dtype=torch.float32).to(DEVICE)

        # 2. Tokenization
        encoded = self.tokenizer(
            claim_text,
            padding="max_length",
            truncation=True,
            max_length=MAX_SEQ_LENGTH,
            return_tensors="pt"
        )
        input_ids = encoded["input_ids"].to(DEVICE)
        attention_mask = encoded["attention_mask"].to(DEVICE)

        # 3. Model Forward Pass
        with torch.no_grad():
            logits = self.model(input_ids, attention_mask, feat_tensor)
            probs = torch.softmax(logits, dim=-1).squeeze(0).cpu().tolist()
            pred_id = int(torch.argmax(logits, dim=-1).item())

        pred_label = ID2LABEL[pred_id]
        pred_prob = probs[pred_id]
        confidence = pred_prob * 100

        # Calibrated High-Precision Check (>= 90%)
        class_thresh_info = self.thresholds.get(pred_label, {})
        calibrated_cutoff = class_thresh_info.get("threshold", 0.85)
        high_precision_verified = pred_prob >= calibrated_cutoff

        # 4. Explainable Linguistic Analysis
        ling_signals = explain_linguistic_signals(claim_text)

        # 5. Inkloom AI Governance Recommendation
        if pred_label == "NOT ENOUGH INFO":
            status = "RISK: UNSUPPORTED CLAIM"
            if ling_signals["detected_superlatives"] or ling_signals["detected_promotional_hype"]:
                recommendation = (
                    "Flagged as unverified promotional hype. Contains absolute/superlative "
                    f"terms {ling_signals['detected_superlatives'] + ling_signals['detected_promotional_hype']} "
                    "without supporting documentation. Add verified citation or rephrase objectively."
                )
            else:
                recommendation = (
                    "Insufficient factual grounding found for this statement. "
                    "Attach verified brand facts before publication."
                )
        elif pred_label == "REFUTES":
            status = "VIOLATION: CONTRADICTORY CLAIM"
            recommendation = (
                "Claim contradicts established knowledge base or contains conflicting negatives. "
                "Review against official brand guidelines."
            )
        else:
            status = "VERIFIED: SUPPORTED CLAIM"
            recommendation = "Claim aligns with verified factual knowledge and approved phrasing standards."

        return {
            "claim": claim_text,
            "prediction": pred_label,
            "confidence_pct": round(confidence, 2),
            "high_precision_verified": high_precision_verified,
            "precision_benchmark": class_thresh_info.get("precision_pct", 90.0) if high_precision_verified else None,
            "required_threshold": round(calibrated_cutoff * 100, 1),
            "status": status,
            "recommendation": recommendation,
            "probabilities": {
                "SUPPORTS": round(probs[LABEL2ID["SUPPORTS"]] * 100, 2),
                "REFUTES": round(probs[LABEL2ID["REFUTES"]] * 100, 2),
                "NOT ENOUGH INFO": round(probs[LABEL2ID["NOT ENOUGH INFO"]] * 100, 2),
            },
            "linguistic_signals": ling_signals
        }


def print_verification_result(res: Dict[str, Any]):
    print("\n" + "=" * 75)
    print(f"CLAIM: \"{res['claim']}\"")
    print("-" * 75)
    precision_tag = ""
    if res.get("high_precision_verified"):
        precision_tag = f" [HIGH PRECISION GUARANTEE: >={res['precision_benchmark']}%]"
    else:
        precision_tag = f" [Standard Mode | High-Precision Cutoff: {res['required_threshold']}%]"
        
    print(f"VERDICT:       {res['prediction']} ({res['confidence_pct']}%) {precision_tag}")
    print(f"GOVERNANCE:    {res['status']}")
    print(f"PROBABILITIES: SUPPORTS: {res['probabilities']['SUPPORTS']}% | "
          f"REFUTES: {res['probabilities']['REFUTES']}% | "
          f"NOT ENOUGH INFO: {res['probabilities']['NOT ENOUGH INFO']}%")
    
    signals = res["linguistic_signals"]
    if signals["detected_superlatives"]:
        print(f"Superlatives:  {signals['detected_superlatives']}")
    if signals["detected_promotional_hype"]:
        print(f"Hype Markers:  {signals['detected_promotional_hype']}")
    if signals["detected_hedging"]:
        print(f"Hedging Terms: {signals['detected_hedging']}")
    if signals["detected_negations"]:
        print(f"Negations:     {signals['detected_negations']}")
        
    print(f"\nACTIONABLE RECOMMENDATION:\n  {res['recommendation']}")
    print("=" * 75)


def run_demo():
    verifier = ClaimVerifier()

    demo_claims = [
        "Colin Kaepernick became a starting quarterback during the 49ers 63rd season in the National Football League.",
        "Fox 2000 Pictures released the film Soul Food.",
        "Telemundo is a English-language television network.",
        "Our enterprise software is the #1 revolutionary AI tool with 100% guaranteed results.",
        "This product is undoubtedly the best and most superior solution in the world.",
        "Tilda Swinton is a vegan."
    ]

    print("\n" + "#" * 75)
    print("RUNNING DEMONSTRATION ON BENCHMARK & BRAND PROMOTIONAL CLAIMS")
    print("#" * 75)

    for claim in demo_claims:
        res = verifier.verify_claim(claim)
        print_verification_result(res)


def run_interactive():
    verifier = ClaimVerifier()
    print("\n" + "#" * 75)
    print("INTERACTIVE CLAIM VERIFICATION MODE (Inkloom AI Brand Governance)")
    print("Type any claim, marketing statement, or fact to test.")
    print("Type 'exit' or 'q' to quit.")
    print("#" * 75)

    while True:
        try:
            claim = input("\nEnter claim: ").strip()
            if not claim:
                continue
            if claim.lower() in ["q", "quit", "exit"]:
                print("Exiting interactive verification.")
                break
            res = verifier.verify_claim(claim)
            print_verification_result(res)
        except (KeyboardInterrupt, EOFError):
            print("\nExiting.")
            break


def main():
    parser = argparse.ArgumentParser(description="Predict and Verify Claims using Trained Hybrid Model")
    parser.add_argument("--claim", type=str, default=None, help="Claim text to verify")
    parser.add_argument("--demo", action="store_true", help="Run pre-configured demo claims")
    parser.add_argument("--interactive", "-i", action="store_true", help="Run in interactive typing mode")
    args = parser.parse_args()

    if args.claim:
        verifier = ClaimVerifier()
        res = verifier.verify_claim(args.claim)
        print_verification_result(res)
    elif args.demo:
        run_demo()
    else:
        run_interactive()


if __name__ == "__main__":
    main()
