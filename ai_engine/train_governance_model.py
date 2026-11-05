"""
Inkloom AI — Brand Violation Classifier Training Pipeline
Author: Module A (AI & Detection Engine / Sakshi)

This script trains a brand governance classification model to detect:
1. Category: [UNSUPPORTED_CLAIM, TERMINOLOGY, TONE, ACCESSIBILITY, CLEAN]
2. Severity: [CRITICAL, WARNING, SUGGESTION, NONE]
"""

import json
import os
import argparse
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

def load_data(json_file: str):
    with open(json_file, "r", encoding="utf-8") as f:
        data = json.load(f)
    texts = [item["input_text"] for item in data]
    categories = [item["category"] for item in data]
    severities = [item["severity"] for item in data]
    return texts, categories, severities, data

def train_baseline_classifier(dataset_file: str):
    print(f"[*] Loading training corpus from: {dataset_file}")
    texts, categories, severities, _ = load_data(dataset_file)

    # Split train/eval
    X_train, X_test, y_train, y_test = train_test_split(
        texts, categories, test_size=0.2, random_state=42, stratify=categories
    )

    print(f"[*] Dataset split: {len(X_train)} train, {len(X_test)} evaluation examples")

    # Build TF-IDF + Logistic Regression pipeline
    model = Pipeline([
        ("tfidf", TfidfVectorizer(ngram_range=(1, 3), max_features=5000)),
        ("clf", LogisticRegression(class_weight="balanced", max_iter=1000))
    ])

    print("[*] Training classification engine...")
    model.fit(X_train, y_train)

    # Evaluate
    predictions = model.predict(X_test)
    accuracy = accuracy_score(y_test, predictions)
    print("\n" + "="*50)
    print(f"Inkloom Brand Classifier Evaluation Accuracy: {accuracy*100:.2f}%")
    print("="*50)
    print(classification_report(y_test, predictions))

    return model

def fine_tune_transformer_instructions():
    print("""
======================================================================
HUGGINGFACE TRANSFORMERS / LoRA FINE-TUNING PIPELINE (ROUND 2 / ROUND 3)
======================================================================
To fine-tune a deep neural model (e.g., 'roberta-base' or 'llama-3-8b-instruct'):

1. Prepare HuggingFace Dataset:
   from datasets import Dataset
   ds = Dataset.from_list(data)

2. Multi-Label Classification Head:
   from transformers import AutoModelForSequenceClassification, AutoTokenizer, Trainer
   tokenizer = AutoTokenizer.from_pretrained("roberta-base")
   model = AutoModelForSequenceClassification.from_pretrained("roberta-base", num_labels=5)

3. For Generative Intent-Preserving Remediation:
   Format prompt:
   "### System: You are Inkloom Brand Governance AI.
    ### Guideline: {rule_citation}
    ### Draft: {input_text}
    ### Task: Remediate the draft to satisfy brand policy while preserving the author's original intent.
    ### Remediation: {remediated_text}"

4. Train with TRL (Transformer Reinforcement Learning) / SFTTrainer with LoRA:
   from peft import LoraConfig, get_peft_model
   lora_config = LoraConfig(r=8, lora_alpha=16, target_modules=["q_proj", "v_proj"])
======================================================================
    """)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train Inkloom Brand Governance Model")
    parser.add_argument("--data", default="sample_dataset.json", help="Path to JSON dataset")
    args = parser.parse_args()

    if os.path.exists(args.data):
        train_baseline_classifier(args.data)
    else:
        print(f"[!] Dataset file '{args.data}' not found. Run dataset_generator.py first!")

    fine_tune_transformer_instructions()
