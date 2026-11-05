# Hybrid Claim Verification & Unsupported Claim Detection Model

> **Module A: AI & Detection Engine**  
> **Team:** Ek Kachori Do Samosa  
> **Members:** Sakshi Dharpure (Lead), Khushi Rathi, Purva Deshmukh  
> **Problem Statement:** Intelligent Brand Governance Platform (Inkloom AI)  
> **Target Dataset:** [FEVER (Fact Extraction and VERification)](https://huggingface.co/datasets/fever/fever)  

---

## 1. Overview & Problem Context

In growing organisations, marketing copy, social posts, and product documentation are created by multiple internal teams, external agencies, and AI tools. A critical risk identified by **Inkloom AI** is **unsupported promotional claims** (e.g., *"Our product is #1 in the world"*, *"100% guaranteed results"* without citations or evidence) and **factual inconsistencies** before publication.

This module implements a **Hybrid Neural Architecture** trained on the official **FEVER** benchmark dataset to classify statements into three governance states:
1. `SUPPORTS` (Class 0): Claim is grounded and corroborated by factual evidence.
2. `REFUTES` (Class 1): Claim directly contradicts established knowledge or approved guidelines.
3. `NOT ENOUGH INFO` (Class 2): Unsupported claim lacking empirical backing or promotional hype requiring evidence attachment.

---

## 2. Hybrid Model Architecture

Rather than relying purely on a black-box transformer (which can hallucinate or overfit to spurious lexical artifacts), our model employs a **Hybrid Multi-Branch Architecture**:

```
                         [ Input Claim Text ]
                                 │
         ┌───────────────────────┴───────────────────────┐
         ▼                                               ▼
[ Transformer Encoder ]                         [ Deterministic Linguistic ]
(all-MiniLM-L6-v2, 384-d)                       [ Feature Extractor (16-D) ]
         │                                      (Superlatives, Hype, Hedging,
         ▼                                       Certainty, Modals, Stats, Caps)
  [ Bi-LSTM Layer ]                                      │
  (2 Layers, 256-d)                                      ▼
         │                                      [ Dense Projection MLP ]
         ▼                                      (16-d -> 64-d, LayerNorm)
[ Attention Pooling ]                                    │
  (Contextual 256-d)                                     │
         │                                               │
         └───────────────────────┬───────────────────────┘
                                 ▼
                 [ Gated Multimodal Fusion Unit ]
                 (Dynamic Gating: Semantic vs Rules)
                                 │ (320-d)
                                 ▼
                     [ Classification Head ]
                     (Linear -> GELU -> Dropout -> 3 Classes)
                                 │
                                 ▼
                 [ SUPPORTS | REFUTES | NOT ENOUGH INFO ]
```

### Key Components:
- **Semantic Transformer Branch**: Pretrained `sentence-transformers/all-MiniLM-L6-v2` generating dense token representations.
- **Contextual Bi-LSTM**: Captures directional sequence dynamics across the tokens.
- **Self-Attention Pooling**: Learns token importance weights instead of basic mean/max pooling.
- **Deterministic Linguistic Feature Subnet**: Extracts 16 hand-crafted domain features (superlative density, hype markers, hedging/epistemic terms, negations, numerical assertions, and uppercase ratios) and projects them through a non-linear MLP.
- **Gated Multimodal Fusion Unit (GMFU)**: A learnable gate \( g \in [0, 1] \) dynamically balances how much to rely on contextual language semantics versus deterministic linguistic rule signals.
- **Decision Classifier**: 3-way softmax output with inverse-frequency class weighting for imbalance mitigation.

---

## 3. Layer-by-Layer Progressive Training

Deep networks suffer from catastrophic forgetting when high-learning-rate updates are passed through all layers at the start. To ensure stability and optimal feature alignment, we train **layer by layer** across three sequential phases:

```
┌───────────────────────────────────────────────────────────────────────────┐
│ PHASE 1: Head & Fusion Training (Backbone Frozen)                         │
│ - Frozen: Transformer embeddings + all 6 encoder layers + Bi-LSTM         │
│ - Trainable: Attention Pooler, Linguistic Subnet, Gated Fusion, Head      │
│ - Goal: Initialize and align hybrid fusion space without harming backbone │
└───────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ PHASE 2: Contextual Sequence & Top Encoder Training                       │
│ - Frozen: Transformer embeddings + Lower 4 encoder layers (0, 1, 2, 3)    │
│ - Trainable: Upper Transformer layers (4, 5) + Bi-LSTM + Fusion + Head    │
│ - Goal: Adapt high-level task representations with moderate LR (3e-5)     │
└───────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ PHASE 3: Full End-to-End Fine-Tuning with LLRD                            │
│ - Unfrozen: All parameters (100% trainable)                               │
│ - Optimization: Layer-wise Learning Rate Decay (decay factor = 0.85)      │
│   Lower layers get exponentially smaller LR; head gets higher LR          │
│ - Goal: Synergistic convergence across all neural and feature branches    │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Directory Structure

```
code nexus/model/
├── data/                       # Downloaded FEVER jsonl files (train.jsonl, dev.jsonl)
├── checkpoints/                # Saved weights per phase, best model, and training history
├── config.py                   # Hyperparameters, architecture settings, label mappings
├── download_data.py            # Stream downloader and validator for FEVER dataset
├── features.py                 # 16-D deterministic & linguistic feature extractor
├── hybrid_model.py             # Full PyTorch HybridClaimClassifier architecture
├── data_loader.py              # PyTorch Dataset, stratified sampling, and DataLoader
├── train_layer_by_layer.py     # Staged progressive training engine (Phase 1, 2, 3)
├── evaluate.py                 # Evaluation suite (Confusion Matrix, Precision/Recall, F1)
├── predict.py                  # Standalone inference & brand governance diagnostics CLI
└── run_pipeline.py             # All-in-one execution pipeline
```

---

## 5. Usage Instructions

### Step 1: Download & Validate the FEVER Dataset
```bash
python download_data.py
```
Downloads `train.jsonl` (145,449 claims) and `dev.jsonl` (19,998 claims) and verifies schema and label distributions.

### Step 2: Run Layer-by-Layer Training
```bash
python train_layer_by_layer.py --train_samples 6000 --val_samples 1500 --phase1_epochs 2 --phase2_epochs 2 --phase3_epochs 2
```
*Note: To train on the entire dataset of 145,449 claims, set `--train_samples 145449`.*

### Step 3: Evaluate on Validation Split & Calibrate High-Precision Thresholds (>= 90%)
```bash
python evaluate.py --samples 1500
```
Generates full classification report, confusion matrix, and automatically computes class-specific operating thresholds achieving **$\ge 90\%$ Precision**, saving parameters to `checkpoints/precision_thresholds.json`.

### Step 4: Verify Any Arbitrary Claim (Inference)
```bash
# Test a promotional claim:
python predict.py --claim "Our enterprise platform is the #1 revolutionary AI tool with 100% guaranteed results."

# Or run the built-in benchmark demo:
python predict.py --demo

# Or launch interactive testing:
python predict.py
```

### Step 5: All-in-One Pipeline
```bash
python run_pipeline.py
```
Runs data validation, layer-by-layer training, evaluation, and demo predictions sequentially.
