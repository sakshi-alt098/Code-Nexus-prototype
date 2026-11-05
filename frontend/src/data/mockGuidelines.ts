import { BrandGuidelineRule } from '../types';

export const OFFICIAL_BRAND_PALETTE = [
  { name: 'Obsidian Black (Canvas Base)', hex: '#0A0912', role: 'Base Background & Frame' },
  { name: 'Lavender Slate (Card Surface)', hex: '#151324', role: 'Container & Navigation Background' },
  { name: 'Soft Lavender (Primary Accent)', hex: '#B69DF8', role: 'CTA Buttons, Scans & Primary Focus' },
  { name: 'Rose Violet (Alert & Warning)', hex: '#E879F9', role: 'Critical Risk Highlights & Violations' },
  { name: 'Pale Mist (High-Contrast Text)', hex: '#EDE9FE', role: 'Primary Typography & Muted Badges' }
];

export const MOCK_GUIDELINE_RULES: BrandGuidelineRule[] = [
  {
    id: 'rule-01',
    category: 'Commercial Claims',
    sectionCode: '§4.1',
    ruleName: 'Substantiation of Absolute Superlatives',
    description: 'Prohibits unqualified superlative phrases such as "best in the world", "undisputed leader", or "100% guaranteed" without accredited third-party benchmark citations.',
    bannedExample: 'We offer the 100% best AI governance platform in the world.',
    approvedAlternative: 'We provide an industry-recognized enterprise brand governance solution.',
    overrideCount: 3
  },
  {
    id: 'rule-02',
    category: 'Brand Tone & Positioning',
    sectionCode: '§2.3',
    ruleName: 'Value-First Commercial Pricing',
    description: 'Avoid derogatory price framing such as "cheap" or "dirt cheap". Always frame commercial positioning around ROI, efficiency, or cost-effectiveness.',
    bannedExample: 'Our cheap pricing model will undercut all traditional tools.',
    approvedAlternative: 'Our cost-effective pricing structure maximizes enterprise ROI.',
    overrideCount: 8
  },
  {
    id: 'rule-03',
    category: 'Legal & Privacy Safeguards',
    sectionCode: '§1.4',
    ruleName: 'Absolute Risk Elimination Guarantees',
    description: 'Marketing content must not guarantee zero risk or indefinite legal immunity. Statements must reflect dependable risk mitigation and governance controls.',
    bannedExample: 'Guaranteed to eliminate 100% of brand compliance risk forever.',
    approvedAlternative: 'Engineered to significantly mitigate non-compliant messaging before publication.',
    overrideCount: 19,
    isAmbiguousWarning: true
  },
  {
    id: 'rule-04',
    category: 'Editorial Tone',
    sectionCode: '§3.2',
    ruleName: 'Plain English vs Corporate Jargon',
    description: 'Avoid overused buzzwords like "synergistic disruption", "hyper-scalable paradigm", or "ninja execution". Use clear, punchy, customer-centric terms.',
    bannedExample: 'Unlocking synergistic disruption across all enterprise silos.',
    approvedAlternative: 'Enabling seamless collaboration across distributed enterprise teams.',
    overrideCount: 24,
    isAmbiguousWarning: true
  },
  {
    id: 'rule-05',
    category: 'Accessibility & Privacy Policy',
    sectionCode: '§6.1',
    ruleName: 'WCAG 2.1 Contrast & Clear Disclosures',
    description: 'All promotional assets must maintain at least 4.5:1 text-to-background contrast ratio and clearly disclose the use of AI assistance and data usage terms.',
    overrideCount: 2
  }
];
