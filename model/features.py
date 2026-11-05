"""
Linguistic and Deterministic Feature Extraction Module.
Extracts 16 statistical, structural, and brand-governance domain indicators
to support hybrid claim verification (SUPPORTS, REFUTES, NOT ENOUGH INFO).
"""

import re
import math
from typing import List, Dict, Any
import torch

# Hype & Superlative terms (Commonly associated with unverified promotional claims)
SUPERLATIVES = {
    "best", "fastest", "leading", "greatest", "highest", "top", "premier",
    "ultimate", "finest", "maximum", "cheapest", "largest", "strongest",
    "safest", "brightest", "cleanest", "latest", "most", "foremost"
}

# Unsupported promotional hype markers
PROMOTIONAL_HYPE = {
    "guaranteed", "proven", "revolutionary", "game-changing", "groundbreaking",
    "unmatched", "unrivaled", "superior", "unbeatable", "flawless", "miracle",
    "perfect", "100%", "#1", "world-first", "world's first", "state-of-the-art",
    "breakthrough", "limitless", "indisputable", "unquestionable", "unprecedented"
}

# Epistemic / Hedging markers (signals speculative / non-definitive claims)
HEDGING_MARKERS = {
    "allegedly", "reportedly", "purportedly", "claimed", "believed", "supposedly",
    "may", "might", "could", "possibly", "suggests", "rumored", "assumed",
    "presumably", "perhaps", "plausibly", "apparently", "suspected"
}

# Strong assertion & certainty markers
CERTAINTY_MARKERS = {
    "always", "never", "definitely", "undoubtedly", "strictly", "certainly",
    "absolutely", "inevitably", "positively", "clearly", "unquestionably", "entirely"
}

# Negation words (crucial for contradiction / REFUTES detection)
NEGATIONS = {
    "not", "never", "no", "neither", "nor", "none", "nobody", "nowhere",
    "nothing", "hardly", "scarcely", "barely", "without", "cannot", "isnt",
    "arent", "wasnt", "werent", "hasnt", "havent", "hadnt", "wont", "wouldnt",
    "shouldnt", "cant"
}

# Modal verbs
MODAL_VERBS = {
    "will", "shall", "should", "would", "can", "could", "must", "ought", "may", "might"
}

# Regex patterns
NUMBER_PATTERN = re.compile(r"\b\d+(?:[\.,]\d+)?\b")
YEAR_PATTERN = re.compile(r"\b(?:1[789]\d\d|20[0-2]\d)\b")
PERCENT_PATTERN = re.compile(r"(?:\d+\s*%|\bpercent\b|\bpercentage\b)", re.IGNORECASE)
CURRENCY_PATTERN = re.compile(r"[\$€£¥₹]|\b(?:usd|dollars|euro|inr|cents)\b", re.IGNORECASE)
QUOTE_PATTERN = re.compile(r"[\"'\u201c\u201d]")
UPPER_WORD_PATTERN = re.compile(r"\b[A-Z]{2,}\b")


def extract_claim_features(text: str) -> List[float]:
    """
    Extracts a 16-dimensional normalized feature vector from a claim text.
    
    Features:
     0: Superlative term count (normalized)
     1: Promotional hype / unverified claim markers (normalized)
     2: Hedging / epistemic uncertainty markers (normalized)
     3: Certainty / absolute assertion markers (normalized)
     4: Negation density (normalized)
     5: Modal verb density (normalized)
     6: Number / quantity mentions (normalized)
     7: Specific calendar year mentions (0 or 1)
     8: Percentage / statistical claim mentions (0 or 1)
     9: Currency / financial claim mentions (0 or 1)
    10: Quotation marks presence (0 or 1)
    11: Normalized word count
    12: Average token length (lexical complexity)
    13: Uppercase / shouting token ratio
    14: Punctuation density (!, ?, ...)
    15: Vocabulary diversity (Type-Token Ratio)
    """
    if not text or not isinstance(text, str):
        return [0.0] * 16

    words = re.findall(r"\b[\w'-]+\b", text.lower())
    raw_words = text.split()
    total_words = max(len(words), 1)

    # 0. Superlatives
    superlative_count = sum(1 for w in words if w in SUPERLATIVES)
    f0 = min(superlative_count / 3.0, 1.0)

    # 1. Promotional Hype
    text_lower = text.lower()
    hype_count = sum(1 for w in words if w in PROMOTIONAL_HYPE)
    for multi in ["world-first", "world's first", "state-of-the-art", "#1", "100%"]:
        if multi in text_lower:
            hype_count += 1
    f1 = min(hype_count / 3.0, 1.0)

    # 2. Hedging
    hedging_count = sum(1 for w in words if w in HEDGING_MARKERS)
    f2 = min(hedging_count / 3.0, 1.0)

    # 3. Certainty
    certainty_count = sum(1 for w in words if w in CERTAINTY_MARKERS)
    f3 = min(certainty_count / 3.0, 1.0)

    # 4. Negation (Crucial for REFUTES)
    neg_count = sum(1 for w in words if w in NEGATIONS)
    f4 = min(neg_count / 2.0, 1.0)

    # 5. Modals
    modal_count = sum(1 for w in words if w in MODAL_VERBS)
    f5 = min(modal_count / 3.0, 1.0)

    # 6. Specific Numbers
    num_matches = len(NUMBER_PATTERN.findall(text))
    f6 = min(num_matches / 4.0, 1.0)

    # 7. Calendar Year
    f7 = 1.0 if YEAR_PATTERN.search(text) else 0.0

    # 8. Percentage
    f8 = 1.0 if PERCENT_PATTERN.search(text) else 0.0

    # 9. Currency
    f9 = 1.0 if CURRENCY_PATTERN.search(text) else 0.0

    # 10. Direct Quotes
    f10 = 1.0 if QUOTE_PATTERN.search(text) else 0.0

    # 11. Word count (clamped to [0, 50] range)
    f11 = min(len(words) / 40.0, 1.0)

    # 12. Average word length (clamped to [3, 10])
    avg_len = sum(len(w) for w in words) / total_words
    f12 = max(0.0, min((avg_len - 3.0) / 7.0, 1.0))

    # 13. Uppercase ratio (ALL-CAPS words like "BEST", "EXCLUSIVE")
    caps_count = len(UPPER_WORD_PATTERN.findall(text))
    f13 = min(caps_count / max(len(raw_words), 1), 1.0)

    # 14. Punctuation intensity (! or ?)
    punct_count = sum(1 for c in text if c in "!?;:")
    f14 = min(punct_count / 4.0, 1.0)

    # 15. Type-Token Ratio (Vocabulary diversity)
    f15 = len(set(words)) / total_words

    return [f0, f1, f2, f3, f4, f5, f6, f7, f8, f9, f10, f11, f12, f13, f14, f15]


def extract_batch_features(texts: List[str]) -> torch.Tensor:
    """Extracts features for a batch of strings and returns a torch.FloatTensor of shape (B, 16)."""
    batch = [extract_claim_features(t) for t in texts]
    return torch.tensor(batch, dtype=torch.float32)


def explain_linguistic_signals(text: str) -> Dict[str, Any]:
    """Generates an explainability breakdown for Inkloom AI Brand Governance."""
    words = set(re.findall(r"\b[\w'-]+\b", text.lower()))
    detected_superlatives = list(words.intersection(SUPERLATIVES))
    detected_hype = list(words.intersection(PROMOTIONAL_HYPE))
    detected_hedging = list(words.intersection(HEDGING_MARKERS))
    detected_negations = list(words.intersection(NEGATIONS))

    return {
        "detected_superlatives": detected_superlatives,
        "detected_promotional_hype": detected_hype,
        "detected_hedging": detected_hedging,
        "detected_negations": detected_negations,
        "has_numerical_evidence": bool(NUMBER_PATTERN.search(text)),
        "is_unsupported_candidate": len(detected_superlatives) > 0 or len(detected_hype) > 0,
    }


if __name__ == "__main__":
    test_claim = "Our brand is the #1 revolutionary product with 100% guaranteed results in 2026."
    features = extract_claim_features(test_claim)
    print("Test Claim:", test_claim)
    print("Extracted 16-D Features:", [round(x, 3) for x in features])
    print("Linguistic Signals:", explain_linguistic_signals(test_claim))
