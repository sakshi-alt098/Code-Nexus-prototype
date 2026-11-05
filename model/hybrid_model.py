"""
Hybrid Deep Learning Model Architecture for Claim Verification.
Combines:
  1. Dense Pretrained Transformer (sentence-transformers/all-MiniLM-L6-v2)
  2. Bidirectional LSTM Sequence Context Layer
  3. Self-Attention Sequence Pooling
  4. Non-linear Linguistic Feature Projection Subnet (16 -> 64)
  5. Gated Multimodal Fusion Unit (GMFU)
  6. Multi-layer Classification Decision Head (3 classes)
Includes support for progressive layer-by-layer training.
"""

import math
from typing import Dict, List, Tuple, Optional
import torch
import torch.nn as nn
import torch.nn.functional as F
from transformers import AutoModel, AutoConfig

from config import (
    BACKBONE_NAME,
    TRANSFORMER_DIM,
    LSTM_HIDDEN_DIM,
    LSTM_NUM_LAYERS,
    LINGUISTIC_FEATURE_DIM,
    FEATURE_PROJECTED_DIM,
    FUSED_DIM,
    CLASSIFIER_HIDDEN_DIM,
    NUM_CLASSES,
    DROPOUT_RATE,
    PHASE1_LR,
    PHASE2_HEAD_LR,
    PHASE2_LSTM_LR,
    PHASE2_ENCODER_LR,
    PHASE3_BASE_LR,
    PHASE3_LLRD_DECAY,
    PHASE1_WEIGHT_DECAY,
    PHASE2_WEIGHT_DECAY,
    PHASE3_WEIGHT_DECAY,
)


class SelfAttentionPooling(nn.Module):
    """Computes an attention-weighted sum over sequence time steps."""

    def __init__(self, hidden_dim: int):
        super().__init__()
        self.projection = nn.Sequential(
            nn.Linear(hidden_dim, hidden_dim // 2),
            nn.Tanh(),
            nn.Linear(hidden_dim // 2, 1, bias=False)
        )

    def forward(self, x: torch.Tensor, mask: Optional[torch.Tensor] = None) -> torch.Tensor:
        # x: (batch_size, seq_len, hidden_dim)
        # mask: (batch_size, seq_len) with 1 for valid tokens and 0 for pad
        scores = self.projection(x).squeeze(-1)  # (batch_size, seq_len)
        if mask is not None:
            scores = scores.masked_fill(~mask.bool(), -1e9)
        weights = F.softmax(scores, dim=-1).unsqueeze(-1)  # (batch_size, seq_len, 1)
        pooled = torch.sum(x * weights, dim=1)  # (batch_size, hidden_dim)
        return pooled


class LinguisticFeatureSubnet(nn.Module):
    """Projects 16-D handcrafted linguistic/governance features into dense representation."""

    def __init__(self, in_features: int = LINGUISTIC_FEATURE_DIM, out_features: int = FEATURE_PROJECTED_DIM):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(in_features, out_features),
            nn.BatchNorm1d(out_features),
            nn.GELU(),
            nn.Dropout(DROPOUT_RATE),
            nn.Linear(out_features, out_features),
            nn.LayerNorm(out_features),
            nn.GELU()
        )

    def forward(self, features: torch.Tensor) -> torch.Tensor:
        return self.net(features)


class GatedMultimodalFusion(nn.Module):
    """
    Dynamically balances semantic sequence embeddings and deterministic linguistic features
    using a learnable gating mechanism.
    """

    def __init__(self, input_dim: int = FUSED_DIM):
        super().__init__()
        self.gate = nn.Sequential(
            nn.Linear(input_dim, input_dim),
            nn.Sigmoid()
        )
        self.projection = nn.Sequential(
            nn.Linear(input_dim, input_dim),
            nn.GELU(),
            nn.Dropout(DROPOUT_RATE)
        )
        self.layer_norm = nn.LayerNorm(input_dim)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        g = self.gate(x)
        proj = self.projection(x)
        fused = (g * x) + ((1.0 - g) * proj)
        return self.layer_norm(fused)


class HybridClaimClassifier(nn.Module):
    """
    Full Hybrid Architecture:
      - Semantic Transformer Encoder
      - Contextual Bi-LSTM with Dropout
      - Attention Pooling
      - Linguistic Feature Subnet
      - Gated Multimodal Fusion
      - 3-Class Classifier (SUPPORTS, REFUTES, NOT ENOUGH INFO)
    """

    def __init__(self, backbone_name: str = BACKBONE_NAME):
        super().__init__()
        self.backbone_name = backbone_name
        self.transformer = AutoModel.from_pretrained(backbone_name)

        # Contextual BiLSTM
        lstm_input_dim = self.transformer.config.hidden_size
        self.bilstm = nn.LSTM(
            input_size=lstm_input_dim,
            hidden_size=LSTM_HIDDEN_DIM,
            num_layers=LSTM_NUM_LAYERS,
            batch_first=True,
            bidirectional=True,
            dropout=DROPOUT_RATE if LSTM_NUM_LAYERS > 1 else 0.0
        )
        bilstm_output_dim = LSTM_HIDDEN_DIM * 2  # 256

        # Attention pooling over BiLSTM representations
        self.attention_pool = SelfAttentionPooling(bilstm_output_dim)

        # Linguistic & brand-governance feature branch
        self.feature_subnet = LinguisticFeatureSubnet(
            in_features=LINGUISTIC_FEATURE_DIM,
            out_features=FEATURE_PROJECTED_DIM
        )

        # Gated fusion layer
        self.fusion = GatedMultimodalFusion(input_dim=bilstm_output_dim + FEATURE_PROJECTED_DIM)

        # Classification decision head
        self.classifier = nn.Sequential(
            nn.Linear(FUSED_DIM, CLASSIFIER_HIDDEN_DIM),
            nn.GELU(),
            nn.Dropout(DROPOUT_RATE),
            nn.Linear(CLASSIFIER_HIDDEN_DIM, NUM_CLASSES)
        )

        self.current_phase = 1

    def forward(
        self,
        input_ids: torch.Tensor,
        attention_mask: torch.Tensor,
        linguistic_features: torch.Tensor
    ) -> torch.Tensor:
        # 1. Semantic Transformer Branch
        transformer_outputs = self.transformer(
            input_ids=input_ids,
            attention_mask=attention_mask
        )
        token_embeddings = transformer_outputs.last_hidden_state  # (B, T, D)

        # 2. Contextual BiLSTM Sequence Modeling
        lstm_out, _ = self.bilstm(token_embeddings)  # (B, T, 256)

        # 3. Sequence Attention Pooling
        semantic_vec = self.attention_pool(lstm_out, mask=attention_mask)  # (B, 256)

        # 4. Deterministic Linguistic Feature Projection
        ling_vec = self.feature_subnet(linguistic_features)  # (B, 64)

        # 5. Hybrid Gated Multimodal Fusion
        combined = torch.cat([semantic_vec, ling_vec], dim=-1)  # (B, 320)
        fused = self.fusion(combined)  # (B, 320)

        # 6. Classification Decision Head
        logits = self.classifier(fused)  # (B, 3)
        return logits

    # =========================================================================
    # LAYER-BY-LAYER PROGRESSIVE TRAINING CONTROLS
    # =========================================================================
    def set_phase(self, phase: int) -> None:
        """
        Configures layer trainability for progressive layer-by-layer training.
        
        Phase 1:
          - FREEZE: Transformer Backbone + BiLSTM
          - TRAIN: Attention Pooler, Linguistic Subnet, Fusion Unit, Classification Head
        
        Phase 2:
          - FREEZE: Transformer Embeddings + Lower Transformer Layers (0..3)
          - TRAIN: Upper Transformer Layers (4..5) + BiLSTM + Fusion + Head
          
        Phase 3:
          - UNFREEZE: Entire Network (All layers trainable) with Layer-wise Learning Rate Decay
        """
        self.current_phase = phase

        if phase == 1:
            print("\n" + "=" * 60)
            print(">>> CONFIGURING PHASE 1: Training Head & Fusion Layers (Backbone Frozen)")
            print("=" * 60)
            # Freeze entire transformer
            for p in self.transformer.parameters():
                p.requires_grad = False
            # Freeze bilstm
            for p in self.bilstm.parameters():
                p.requires_grad = False
            # Unfreeze heads & fusion
            for m in [self.attention_pool, self.feature_subnet, self.fusion, self.classifier]:
                for p in m.parameters():
                    p.requires_grad = True

        elif phase == 2:
            print("\n" + "=" * 60)
            print(">>> CONFIGURING PHASE 2: Unfreezing BiLSTM & Top Transformer Layers")
            print("=" * 60)
            # Freeze embeddings
            if hasattr(self.transformer, "embeddings"):
                for p in self.transformer.embeddings.parameters():
                    p.requires_grad = False

            # Inspect transformer encoder layers
            encoder_layers = []
            if hasattr(self.transformer, "encoder") and hasattr(self.transformer.encoder, "layer"):
                encoder_layers = self.transformer.encoder.layer

            num_layers = len(encoder_layers)
            top_layers_start = max(0, num_layers - 2)

            for i, layer in enumerate(encoder_layers):
                if i < top_layers_start:
                    for p in layer.parameters():
                        p.requires_grad = False
                else:
                    for p in layer.parameters():
                        p.requires_grad = True

            # Unfreeze BiLSTM
            for p in self.bilstm.parameters():
                p.requires_grad = True

            # Ensure heads & fusion remain trainable
            for m in [self.attention_pool, self.feature_subnet, self.fusion, self.classifier]:
                for p in m.parameters():
                    p.requires_grad = True

        elif phase == 3:
            print("\n" + "=" * 60)
            print(">>> CONFIGURING PHASE 3: Unfreezing Full Network with Layer-wise Decay (LLRD)")
            print("=" * 60)
            # Unfreeze all parameters
            for p in self.parameters():
                p.requires_grad = True

        self._print_trainable_summary()

    def _print_trainable_summary(self):
        total_params = sum(p.numel() for p in self.parameters())
        trainable_params = sum(p.numel() for p in self.parameters() if p.requires_grad)
        frozen_params = total_params - trainable_params
        pct = (trainable_params / total_params) * 100 if total_params > 0 else 0.0
        print(f"  Total Parameters:     {total_params:,}")
        print(f"  Trainable Parameters: {trainable_params:,} ({pct:.1f}%)")
        print(f"  Frozen Parameters:    {frozen_params:,}")

    def get_phase_optimizer(self, phase: int) -> torch.optim.Optimizer:
        """Returns tuned optimizer parameters for the specified training phase."""
        if phase == 1:
            params = [
                {"params": self.feature_subnet.parameters(), "lr": PHASE1_LR, "weight_decay": PHASE1_WEIGHT_DECAY},
                {"params": self.attention_pool.parameters(), "lr": PHASE1_LR, "weight_decay": PHASE1_WEIGHT_DECAY},
                {"params": self.fusion.parameters(), "lr": PHASE1_LR, "weight_decay": PHASE1_WEIGHT_DECAY},
                {"params": self.classifier.parameters(), "lr": PHASE1_LR, "weight_decay": PHASE1_WEIGHT_DECAY},
            ]
            return torch.optim.AdamW(params)

        elif phase == 2:
            encoder_layers = []
            if hasattr(self.transformer, "encoder") and hasattr(self.transformer.encoder, "layer"):
                encoder_layers = self.transformer.encoder.layer
            top_layers_start = max(0, len(encoder_layers) - 2)
            top_encoder_params = []
            for i in range(top_layers_start, len(encoder_layers)):
                top_encoder_params.extend([p for p in encoder_layers[i].parameters() if p.requires_grad])

            params = [
                {"params": top_encoder_params, "lr": PHASE2_ENCODER_LR, "weight_decay": PHASE2_WEIGHT_DECAY},
                {"params": self.bilstm.parameters(), "lr": PHASE2_LSTM_LR, "weight_decay": PHASE2_WEIGHT_DECAY},
                {"params": self.attention_pool.parameters(), "lr": PHASE2_HEAD_LR, "weight_decay": PHASE2_WEIGHT_DECAY},
                {"params": self.feature_subnet.parameters(), "lr": PHASE2_HEAD_LR, "weight_decay": PHASE2_WEIGHT_DECAY},
                {"params": self.fusion.parameters(), "lr": PHASE2_HEAD_LR, "weight_decay": PHASE2_WEIGHT_DECAY},
                {"params": self.classifier.parameters(), "lr": PHASE2_HEAD_LR, "weight_decay": PHASE2_WEIGHT_DECAY},
            ]
            return torch.optim.AdamW(params)

        elif phase == 3:
            # Layer-wise Learning Rate Decay (LLRD)
            encoder_layers = []
            if hasattr(self.transformer, "encoder") and hasattr(self.transformer.encoder, "layer"):
                encoder_layers = self.transformer.encoder.layer
            num_layers = len(encoder_layers)

            param_groups = []
            # Embeddings get lowest learning rate
            if hasattr(self.transformer, "embeddings"):
                emb_lr = PHASE3_BASE_LR * (PHASE3_LLRD_DECAY ** (num_layers + 1))
                param_groups.append({
                    "params": self.transformer.embeddings.parameters(),
                    "lr": emb_lr,
                    "weight_decay": PHASE3_WEIGHT_DECAY
                })

            # Intermediate transformer layers
            for i, layer in enumerate(encoder_layers):
                layer_lr = PHASE3_BASE_LR * (PHASE3_LLRD_DECAY ** (num_layers - i))
                param_groups.append({
                    "params": layer.parameters(),
                    "lr": layer_lr,
                    "weight_decay": PHASE3_WEIGHT_DECAY
                })

            # BiLSTM, Fusion, and Head get base learning rate
            param_groups.append({
                "params": self.bilstm.parameters(),
                "lr": PHASE3_BASE_LR * 2,
                "weight_decay": PHASE3_WEIGHT_DECAY
            })
            param_groups.append({
                "params": self.attention_pool.parameters(),
                "lr": PHASE3_BASE_LR * 2,
                "weight_decay": PHASE3_WEIGHT_DECAY
            })
            param_groups.append({
                "params": self.feature_subnet.parameters(),
                "lr": PHASE3_BASE_LR * 2,
                "weight_decay": PHASE3_WEIGHT_DECAY
            })
            param_groups.append({
                "params": self.fusion.parameters(),
                "lr": PHASE3_BASE_LR * 2,
                "weight_decay": PHASE3_WEIGHT_DECAY
            })
            param_groups.append({
                "params": self.classifier.parameters(),
                "lr": PHASE3_BASE_LR * 3,
                "weight_decay": PHASE3_WEIGHT_DECAY
            })

            return torch.optim.AdamW(param_groups)

        raise ValueError(f"Unknown phase: {phase}")


if __name__ == "__main__":
    print("Testing HybridClaimClassifier initialization...")
    model = HybridClaimClassifier()
    model.set_phase(1)
    model.set_phase(2)
    model.set_phase(3)

    # Dummy forward pass
    dummy_input_ids = torch.randint(0, 1000, (2, 16))
    dummy_mask = torch.ones((2, 16), dtype=torch.long)
    dummy_features = torch.randn((2, 16), dtype=torch.float32)

    out = model(dummy_input_ids, dummy_mask, dummy_features)
    print("Forward pass output shape:", out.shape)
    assert out.shape == (2, 3), f"Expected (2, 3) got {out.shape}"
    print("Hybrid model successfully verified!")
