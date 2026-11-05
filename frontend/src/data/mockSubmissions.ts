import { SubmissionItem } from '../types';

export const INITIAL_SUBMISSIONS: SubmissionItem[] = [
  {
    id: 'sub-001',
    title: 'Inkloom AI Global Launch Press Release',
    authorName: 'Alex Croft',
    department: 'Corporate PR & Comms',
    contentType: 'PRESS_RELEASE',
    rawContent: 'Inkloom AI is officially announced today as the 100% best in the world brand governance platform. Our cheap enterprise pricing is guaranteed to eliminate all brand risk forever through synergistic disruption, allowing us to crush everyone else in the compliance space.',
    remediatedContent: 'Inkloom AI is officially announced today as an industry-recognized leader in enterprise governance. Our cost-effective pricing structure is engineered with rigorous safeguards to significantly mitigate risk through collaborative innovation, allowing us to deliver superior value across the market.',
    status: 'NEEDS_REVISION',
    complianceScore: 38,
    createdAt: '2026-11-04 14:20',
    updatedAt: '2026-11-04 15:10',
    historyTrail: [
      { timestamp: '14:20', action: 'Draft Created', actor: 'Alex Croft (Creator)' },
      { timestamp: '14:22', action: 'Diagnostic Scan Executed (4 issues flagged)', actor: 'Inkloom AI Engine' }
    ],
    comments: [
      {
        id: 'c-1',
        authorName: 'Khushi Rathi',
        authorRole: 'MANAGER',
        text: 'Alex, make sure you accept the suggested claim fixes before sending this to legal.',
        timestamp: '14:45'
      }
    ],
    findings: [
      {
        id: 'f-1',
        category: 'UNSUPPORTED_CLAIM',
        severity: 'CRITICAL',
        flaggedText: '100% best in the world',
        startIndex: 48,
        endIndex: 70,
        explanation: 'Superlative claims violate advertising compliance standards without documented third-party auditor verification.',
        sourceGuideline: 'Brand Rulebook §4.1: Substantiation of Claims',
        suggestedFix: 'an industry-recognized leader in enterprise governance',
        confidenceScore: 0.98,
        status: 'PENDING'
      },
      {
        id: 'f-2',
        category: 'UNSUPPORTED_CLAIM',
        severity: 'CRITICAL',
        flaggedText: 'guaranteed to eliminate all brand risk forever',
        startIndex: 130,
        endIndex: 176,
        explanation: 'Absolute warranties create binding legal risk under commercial consumer protection laws.',
        sourceGuideline: 'Legal Policy §1.4: Absolute Guarantees',
        suggestedFix: 'engineered with rigorous safeguards to significantly mitigate risk',
        confidenceScore: 0.99,
        status: 'PENDING'
      },
      {
        id: 'f-3',
        category: 'TERMINOLOGY',
        severity: 'WARNING',
        flaggedText: 'cheap',
        startIndex: 99,
        endIndex: 104,
        explanation: 'Derogatory price framing reduces perceived product trust and enterprise value.',
        sourceGuideline: 'Brand Voice Guide §2.3: Approved Commercial Terms',
        suggestedFix: 'cost-effective',
        confidenceScore: 0.95,
        status: 'PENDING'
      },
      {
        id: 'f-4',
        category: 'TERMINOLOGY',
        severity: 'SUGGESTION',
        flaggedText: 'synergistic disruption',
        startIndex: 185,
        endIndex: 207,
        explanation: 'Overused corporate buzzwords dilute messaging clarity and reduce reader engagement.',
        sourceGuideline: 'Editorial Guidelines §3.2: Plain English',
        suggestedFix: 'collaborative innovation',
        confidenceScore: 0.92,
        status: 'PENDING'
      }
    ]
  },
  {
    id: 'sub-002',
    title: 'Q4 Enterprise Cloud Webinar LinkedIn Teaser',
    authorName: 'Sarah Lin',
    department: 'Performance Marketing',
    contentType: 'SOCIAL_POST',
    rawContent: 'Join our exclusive webinar on building resilient multi-cloud architectures. Featuring case studies from Fortune 500 engineering leaders.',
    remediatedContent: 'Join our exclusive webinar on building resilient multi-cloud architectures. Featuring case studies from Fortune 500 engineering leaders.',
    status: 'PENDING_MANAGER_REVIEW',
    complianceScore: 96,
    createdAt: '2026-11-04 11:00',
    updatedAt: '2026-11-04 11:30',
    historyTrail: [
      { timestamp: '11:00', action: 'Draft Created', actor: 'Sarah Lin (Creator)' },
      { timestamp: '11:05', action: 'Diagnostic Scan: 100% Policy Match', actor: 'Inkloom AI Engine' },
      { timestamp: '11:10', action: 'Submitted for Manager Review', actor: 'Sarah Lin (Creator)' }
    ],
    comments: [
      {
        id: 'c-2',
        authorName: 'Sarah Lin',
        authorRole: 'CREATOR',
        text: 'Clean post, speaker permissions already verified by event ops.',
        timestamp: '11:11'
      }
    ],
    findings: []
  },
  {
    id: 'sub-003',
    title: 'Investor Quarterly Briefing Q3 Summary',
    authorName: 'David Vance',
    department: 'Executive Operations',
    contentType: 'BLOG_POST',
    rawContent: 'We delivered 42% revenue acceleration while maintaining cost discipline. All product roadmap targets for AI governance automation met on schedule.',
    remediatedContent: 'We delivered 42% revenue acceleration while maintaining cost discipline. All product roadmap targets for AI governance automation met on schedule.',
    status: 'PENDING_LEGAL_REVIEW',
    complianceScore: 100,
    createdAt: '2026-11-04 09:15',
    updatedAt: '2026-11-04 13:40',
    historyTrail: [
      { timestamp: '09:15', action: 'Draft Created', actor: 'David Vance' },
      { timestamp: '12:00', action: 'Manager Review Approved & Forwarded to Legal', actor: 'Purva Deshmukh (Manager)' }
    ],
    comments: [
      {
        id: 'c-3',
        authorName: 'Purva Deshmukh',
        authorRole: 'MANAGER',
        text: 'Revenue metrics match auditor report. Forwarded for legal compliance final sign-off.',
        timestamp: '12:01'
      }
    ],
    findings: []
  },
  {
    id: 'sub-004',
    title: 'Brand Refresh 2026 Promotional Banner',
    authorName: 'Priya Sharma',
    department: 'Design Studio',
    contentType: 'CREATIVE_BANNER',
    rawContent: 'Banner graphic with typography, new color accents, and brand badges.',
    remediatedContent: 'Banner graphic with typography, new color accents, and brand badges.',
    status: 'APPROVED',
    complianceScore: 100,
    createdAt: '2026-11-03 16:00',
    updatedAt: '2026-11-04 10:15',
    historyTrail: [
      { timestamp: 'Nov 03 16:00', action: 'Uploaded Creative Asset', actor: 'Priya Sharma' },
      { timestamp: 'Nov 03 16:30', action: 'WCAG 2.1 AA Contrast Verified (9.67:1 ratio)', actor: 'Visual Inspector' },
      { timestamp: 'Nov 04 10:15', action: 'Final Legal Sign-Off Completed', actor: 'Sakshi Dharpure (Reviewer)' }
    ],
    comments: [],
    findings: []
  }
];
