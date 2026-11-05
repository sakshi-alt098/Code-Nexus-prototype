"""
Configuration and Hyperparameters for FEVER Hybrid Claim Verification Model.
Designed for Inkloom AI Brand Governance: Unsupported Claim Detection.
"""

from pathlib import Path
import torch

# Base directories
BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
CHECKPOINT_DIR = BASE_DIR / "checkpoints"

CHECKPOINT_DIR.mkdir(parents=True, exist_ok=True)
DATA_DIR.mkdir(parents=True, exist_ok=True)

# Device Configuration
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Model Architecture
BACKBONE_NAME = "sentence-transformers/all-MiniLM-L6-v2"
TRANSFORMER_DIM = 384      # MiniLM-L6-v2 output dimension
LSTM_HIDDEN_DIM = 128      # Bidirectional -> 256
LSTM_NUM_LAYERS = 2
LINGUISTIC_FEATURE_DIM = 16
FEATURE_PROJECTED_DIM = 64
FUSED_DIM = (LSTM_HIDDEN_DIM * 2) + FEATURE_PROJECTED_DIM  # 256 + 64 = 320
CLASSIFIER_HIDDEN_DIM = 128
NUM_CLASSES = 3
DROPOUT_RATE = 0.25

# Class Labels
LABEL2ID = {
    "SUPPORTS": 0,
    "REFUTES": 1,
    "NOT ENOUGH INFO": 2
}

ID2LABEL = {v: k for k, v in LABEL2ID.items()}

# Training Hyperparameters
MAX_SEQ_LENGTH = 128
BATCH_SIZE = 32
EVAL_BATCH_SIZE = 64
SEED = 42

# Layer-by-Layer Staged Training Plan:
# Phase 1: Classification Head & Multimodal Fusion Layer (Backbone & LSTM frozen)
PHASE1_EPOCHS = 2
PHASE1_LR = 1e-3
PHASE1_WEIGHT_DECAY = 0.01

# Phase 2: Top Transformer Layers (layers 4, 5) + BiLSTM Contextual Layer
PHASE2_EPOCHS = 2
PHASE2_HEAD_LR = 1e-4
PHASE2_LSTM_LR = 1e-4
PHASE2_ENCODER_LR = 3e-5
PHASE2_WEIGHT_DECAY = 0.01

# Phase 3: Full End-to-End Hybrid Network with Layer-wise Learning Rate Decay (LLRD)
PHASE3_EPOCHS = 2
PHASE3_BASE_LR = 2e-5
PHASE3_LLRD_DECAY = 0.85
PHASE3_WEIGHT_DECAY = 0.01

# Subsampling for fast experimentation / full training
# Set to None to train on all 145,449 training instances
DEFAULT_TRAIN_SAMPLES = 15000  # High-quality stratified subset for fast multi-phase convergence
DEFAULT_VAL_SAMPLES = 3000     # Stratified validation subset
