export type UserRole = 'CREATOR' | 'MANAGER' | 'REVIEWER' | 'ADMIN';

export type ContentFormat = 'SOCIAL_POST' | 'PRESS_RELEASE' | 'BLOG_POST' | 'MARKETING_EMAIL' | 'CREATIVE_BANNER';

export type SeverityLevel = 'CRITICAL' | 'WARNING' | 'SUGGESTION';

export type IssueCategory = 
  | 'UNSUPPORTED_CLAIM' 
  | 'TERMINOLOGY' 
  | 'TONE' 
  | 'VISUAL_INCONSISTENCY' 
  | 'ACCESSIBILITY';

export type SubmissionStatus = 
  | 'DRAFT' 
  | 'SCANNING' 
  | 'NEEDS_REVISION' 
  | 'PENDING_MANAGER_REVIEW' 
  | 'PENDING_LEGAL_REVIEW' 
  | 'CHANGES_REQUESTED' 
  | 'APPROVED' 
  | 'REJECTED';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  badgeLabel: string;
}

export interface Finding {
  id: string;
  category: IssueCategory;
  severity: SeverityLevel;
  flaggedText: string;
  startIndex: number;
  endIndex: number;
  explanation: string;
  sourceGuideline: string;
  suggestedFix: string;
  confidenceScore: number;
  status: 'PENDING' | 'ACCEPTED' | 'EDITED' | 'DISMISSED';
  dismissReason?: string;
}

export interface ReviewComment {
  id: string;
  authorName: string;
  authorRole: UserRole;
  text: string;
  timestamp: string;
}

export interface SubmissionItem {
  id: string;
  title: string;
  authorName: string;
  department: string;
  contentType: ContentFormat;
  rawContent: string;
  remediatedContent: string;
  status: SubmissionStatus;
  complianceScore: number; // 0 to 100
  findings: Finding[];
  comments: ReviewComment[];
  createdAt: string;
  updatedAt: string;
  historyTrail: {
    timestamp: string;
    action: string;
    actor: string;
  }[];
}

export interface BrandGuidelineRule {
  id: string;
  category: string;
  sectionCode: string;
  ruleName: string;
  description: string;
  bannedExample?: string;
  approvedAlternative?: string;
  overrideCount: number;
  isAmbiguousWarning?: boolean;
}
