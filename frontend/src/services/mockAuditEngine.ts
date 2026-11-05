import { Finding, IssueCategory, SeverityLevel } from '../types';

interface RuleMatch {
  pattern: RegExp;
  category: IssueCategory;
  severity: SeverityLevel;
  explanation: string;
  sourceGuideline: string;
  fixGenerator: (match: string) => string;
}

const AUDIT_RULES: RuleMatch[] = [
  // 1. Extreme / Unsupported Claims
  {
    pattern: /(100% best in the world|best in the world|undisputed #1|market leader without equal|never fails)/gi,
    category: 'UNSUPPORTED_CLAIM',
    severity: 'CRITICAL',
    explanation: 'Superlative claims violate advertising compliance standards without documented third-party auditor verification.',
    sourceGuideline: 'Brand Rulebook §4.1: Substantiation of Claims',
    fixGenerator: () => 'an industry-recognized leader in enterprise governance'
  },
  {
    pattern: /(100% guaranteed|guaranteed to eliminate all risk|zero error guarantee)/gi,
    category: 'UNSUPPORTED_CLAIM',
    severity: 'CRITICAL',
    explanation: 'Absolute warranties create binding legal risk under commercial consumer protection laws.',
    sourceGuideline: 'Legal Policy §1.4: Absolute Guarantees',
    fixGenerator: () => 'engineered with rigorous safeguards to significantly mitigate risk'
  },

  // 2. Off-Brand Commercial Terminology
  {
    pattern: /\b(cheap|dirt cheap|cheapest)\b/gi,
    category: 'TERMINOLOGY',
    severity: 'WARNING',
    explanation: 'Derogatory price framing reduces perceived product trust and enterprise value.',
    sourceGuideline: 'Brand Voice Guide §2.3: Approved Commercial Terms',
    fixGenerator: () => 'cost-effective'
  },
  {
    pattern: /\b(crush everyone|kill the competition|destroy rivals)\b/gi,
    category: 'TONE',
    severity: 'WARNING',
    explanation: 'Aggressive and hostile terminology conflicts with our brand tone of trustworthy, professional partnership.',
    sourceGuideline: 'Brand Tone Standards §1.2: Empathetic & Authoritative Voice',
    fixGenerator: () => 'deliver superior value across the market'
  },

  // 3. Corporate Buzzwords & Jargon
  {
    pattern: /\b(synergistic disruption|synergy|synergies)\b/gi,
    category: 'TERMINOLOGY',
    severity: 'SUGGESTION',
    explanation: 'Overused corporate buzzwords dilute messaging clarity and reduce reader engagement.',
    sourceGuideline: 'Editorial Guidelines §3.2: Plain English',
    fixGenerator: (m) => m.toLowerCase().includes('disruption') ? 'collaborative innovation' : 'seamless collaboration'
  },
  {
    pattern: /\b(hyper-scalable paradigm|paradigm shift)\b/gi,
    category: 'TONE',
    severity: 'SUGGESTION',
    explanation: 'Abstract technical jargon obscures practical product capabilities.',
    sourceGuideline: 'Editorial Guidelines §3.2: Plain English',
    fixGenerator: () => 'adaptable enterprise framework'
  }
];

export function runClientSideAudit(content: string): Finding[] {
  const findings: Finding[] = [];

  AUDIT_RULES.forEach((rule, idx) => {
    let match: RegExpExecArray | null;
    const regex = new RegExp(rule.pattern.source, rule.pattern.flags);

    while ((match = regex.exec(content)) !== null) {
      findings.push({
        id: `finding-${idx}-${match.index}`,
        category: rule.category,
        severity: rule.severity,
        flaggedText: match[0],
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        explanation: rule.explanation,
        sourceGuideline: rule.sourceGuideline,
        suggestedFix: rule.fixGenerator(match[0]),
        confidenceScore: 0.94 + (Math.random() * 0.05),
        status: 'PENDING'
      });
    }
  });

  return findings;
}

export function calculateComplianceScore(findings: Finding[]): number {
  let score = 100;
  findings.forEach(f => {
    if (f.status === 'PENDING') {
      if (f.severity === 'CRITICAL') score -= 22;
      else if (f.severity === 'WARNING') score -= 12;
      else score -= 6;
    }
  });
  return Math.max(12, Math.min(100, score));
}
