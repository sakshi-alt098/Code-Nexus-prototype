"""
Inkloom AI — Brand Governance Synthetic Dataset Generator
Author: Module A (AI & Detection Engine / Sakshi)

This utility generates high-quality paired training data for:
1. Multi-label Brand Violation Classification (Category + Severity)
2. Intent-Preserving Remediation (Supervised Fine-Tuning / LoRA)
"""

import json
import random
from typing import List, Dict

RULEBOOK_SECTIONS = [
    {
        "category": "UNSUPPORTED_CLAIM",
        "severity": "CRITICAL",
        "citation": "Brand Rulebook §4.1: Substantiation of Claims",
        "templates": [
            ("We are the undisputed #1 brand solution in the galaxy.", "an industry-recognized leader in brand governance", "undisputed #1 brand solution in the galaxy"),
            ("Our platform is 100% best in the world for marketing teams.", "top-tier enterprise solution for marketing teams", "100% best in the world"),
            ("We are the market leader without equal in AI safety.", "a pioneering enterprise provider in AI safety", "market leader without equal"),
            ("Our software never fails under any circumstance.", "is architected for 99.99% high-availability reliability", "never fails under any circumstance")
        ],
        "explanation": "Superlative claims violate advertising compliance standards without documented third-party auditor verification."
    },
    {
        "category": "UNSUPPORTED_CLAIM",
        "severity": "CRITICAL",
        "citation": "Legal Policy §1.4: Absolute Guarantees",
        "templates": [
            ("Our tool is 100% guaranteed to eliminate all risk.", "engineered with rigorous safeguards to significantly mitigate risk", "100% guaranteed to eliminate all risk"),
            ("We offer a zero error guarantee on all generated campaigns.", "comprehensive quality assurance checks across all generated campaigns", "zero error guarantee"),
            ("Zero legal exposure is guaranteed when using our suite.", "proactive compliance monitoring designed to reduce legal exposure", "Zero legal exposure is guaranteed")
        ],
        "explanation": "Absolute warranties create binding legal risk under commercial consumer protection laws."
    },
    {
        "category": "TERMINOLOGY",
        "severity": "WARNING",
        "citation": "Brand Voice Guide §2.3: Approved Commercial Terms",
        "templates": [
            ("Get our cheap enterprise package today.", "cost-effective enterprise package", "cheap"),
            ("We offer dirt cheap pricing compared to legacy vendors.", "competitive and transparent pricing", "dirt cheap"),
            ("The cheapest governance tool on the market.", "the most value-driven governance tool on the market", "cheapest")
        ],
        "explanation": "Derogatory price framing reduces perceived product trust and enterprise value."
    },
    {
        "category": "TONE",
        "severity": "WARNING",
        "citation": "Brand Tone Standards §1.2: Empathetic & Authoritative Voice",
        "templates": [
            ("We will crush everyone in the industry with this release.", "deliver superior value across the industry", "crush everyone"),
            ("Use our software to kill the competition before Q4.", "outperform market benchmarks", "kill the competition"),
            ("Our strategy is to destroy rivals effortlessly.", "consistently lead the market through excellence", "destroy rivals")
        ],
        "explanation": "Aggressive and hostile terminology conflicts with our brand tone of trustworthy, professional partnership."
    },
    {
        "category": "TERMINOLOGY",
        "severity": "SUGGESTION",
        "citation": "Editorial Guidelines §3.2: Plain English",
        "templates": [
            ("Our synergistic disruption enables rapid scaling.", "collaborative innovation enables rapid scaling", "synergistic disruption"),
            ("Experience our hyper-scalable paradigm today.", "experience our adaptable enterprise framework today", "hyper-scalable paradigm"),
            ("Unlock game-changing synergies across all departments.", "unlock seamless cross-departmental collaboration", "game-changing synergies")
        ],
        "explanation": "Overused corporate buzzwords dilute messaging clarity and reduce reader engagement."
    }
]

CLEAN_TEMPLATES = [
    "Inkloom AI helps organizations safeguard their brand identity across every channel.",
    "Our platform integrates with existing review workflows to surface actionable compliance insights.",
    "Designed for enterprise scale, our architecture combines deterministic rules with grounded AI.",
    "Review draft documents, social campaigns, and press releases with role-based governance.",
    "Maintain consistent messaging, accessible visuals, and substantiated claims effortlessly."
]

FORMATS = ["PRESS_RELEASE", "SOCIAL_POST", "MARKETING_EMAIL", "BLOG_POST", "CREATIVE_BANNER"]

def generate_governance_dataset(num_samples: int = 500) -> List[Dict]:
    dataset = []
    
    # 1. Generate Violating Samples (70%)
    violating_target = int(num_samples * 0.7)
    for i in range(violating_target):
        rule = random.choice(RULEBOOK_SECTIONS)
        template_tuple = random.choice(rule["templates"])
        raw_text, fix, flagged = template_tuple
        fmt = random.choice(FORMATS)

        # Build remediated text
        remediated_text = raw_text.replace(flagged, fix)

        dataset.append({
            "id": f"inkloom-syn-{i+1:04d}",
            "content_format": fmt,
            "input_text": raw_text,
            "category": rule["category"],
            "severity": rule["severity"],
            "flagged_text": flagged,
            "rule_citation": rule["citation"],
            "explanation": rule["explanation"],
            "intent_preserving_fix": fix,
            "intent_preservation_score": round(random.uniform(0.92, 0.99), 2),
            "remediated_text": remediated_text
        })

    # 2. Generate Clean Compliant Samples (30%)
    clean_target = num_samples - violating_target
    for i in range(clean_target):
        clean_text = random.choice(CLEAN_TEMPLATES)
        fmt = random.choice(FORMATS)
        dataset.append({
            "id": f"inkloom-syn-{violating_target + i + 1:04d}",
            "content_format": fmt,
            "input_text": clean_text,
            "category": "CLEAN",
            "severity": "NONE",
            "flagged_text": "",
            "rule_citation": "",
            "explanation": "Content strictly satisfies all active brand tone, claim substantiation, and terminology rules.",
            "intent_preserving_fix": "",
            "intent_preservation_score": 1.0,
            "remediated_text": clean_text
        })

    random.shuffle(dataset)
    return dataset

if __name__ == "__main__":
    generated = generate_governance_dataset(1000)
    output_path = "inkloom_governance_train_1000.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(generated, f, indent=2)
    print(f"Generated {len(generated)} brand governance samples -> {output_path}")
