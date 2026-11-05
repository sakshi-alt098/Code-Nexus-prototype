import React, { useState, useRef } from 'react';
import { ContentFormat, Finding, SubmissionItem } from '../../types';
import { ExplainableFindings } from './ExplainableFindings';
import { runClientSideAudit, calculateComplianceScore } from '../../services/mockAuditEngine';
import { BrandGovernanceService } from '../../services/apiClient';
import { 
  FileText, 
  Share2, 
  Mail, 
  Send, 
  Sparkles, 
  RefreshCw, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  Upload,
  Zap,
  ShieldCheck,
  FileCheck,
  FileCode,
  BookOpen,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface SubmissionStudioProps {
  onNewSubmissionCreated: (submission: SubmissionItem) => void;
  activeItem: SubmissionItem;
  setActiveItem: React.Dispatch<React.SetStateAction<SubmissionItem>>;
}

export const SubmissionStudio: React.FC<SubmissionStudioProps> = ({
  onNewSubmissionCreated,
  activeItem,
  setActiveItem
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanStage, setScanStage] = useState('');
  const [scanProgress, setScanProgress] = useState(0);
  const [isLiveApi, setIsLiveApi] = useState(false);
  const [importedDocName, setImportedDocName] = useState<string | null>(null);
  const [autoFixedAnimation, setAutoFixedAnimation] = useState(false);

  // Company Policy & Privacy Policy Upload State
  const [companyPolicyName, setCompanyPolicyName] = useState<string>('Inkloom_Brand_&_Privacy_Policy_v2.6.pdf');
  const [policyRulesCount, setPolicyRulesCount] = useState<number>(5);
  const [showPolicyPreview, setShowPolicyPreview] = useState(false);
  const [policyText, setPolicyText] = useState(
    `§1.4 Absolute Guarantees: Prohibits unbacked zero-risk or 100% elimination claims.\n§2.3 Commercial Terms: Price framing must be value-oriented; avoid "cheap".\n§4.1 Substantiation: Absolute superlatives ("best in the world") must be verified by accredited third-party data.\n§5.2 Privacy Disclosures: Disclose AI assistance and adhere to data protection norms.\n§3.2 Plain English: Prohibits overused corporate buzzwords ("synergistic disruption").`
  );

  const docInputRef = useRef<HTMLInputElement>(null);
  const policyInputRef = useRef<HTMLInputElement>(null);

  const formatOptions: { format: ContentFormat; label: string; icon: React.ReactNode }[] = [
    { format: 'PRESS_RELEASE', label: 'Press Release', icon: <FileText className="w-3.5 h-3.5" /> },
    { format: 'SOCIAL_POST', label: 'Social Post', icon: <Share2 className="w-3.5 h-3.5" /> },
    { format: 'MARKETING_EMAIL', label: 'Email Copy', icon: <Mail className="w-3.5 h-3.5" /> },
    { format: 'BLOG_POST', label: 'Blog Article', icon: <FileText className="w-3.5 h-3.5" /> },
    { format: 'CREATIVE_BANNER', label: 'Banner Copy', icon: <Layers className="w-3.5 h-3.5" /> }
  ];

  const handleFormatChange = (fmt: ContentFormat) => {
    setActiveItem(prev => ({ ...prev, contentType: fmt }));
  };

  const handleContentChange = (newText: string) => {
    setActiveItem(prev => ({
      ...prev,
      rawContent: newText,
      remediatedContent: newText
    }));
  };

  // Upload Company Policy File (Privacy Policy or Brand Guidelines)
  const handlePolicyUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCompanyPolicyName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = (event.target?.result as string) || '';
      if (text.trim().length > 0) {
        setPolicyText(text);
        const sectionMatches = text.match(/§|\b(rule|section|policy|article)\b/gi);
        setPolicyRulesCount(Math.max(4, sectionMatches ? sectionMatches.length : 5));
      }
    };
    reader.readAsText(file);
  };

  // Upload Document to Review
  const handleDocumentImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportedDocName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = (event.target?.result as string) || '';
      const docTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setActiveItem(prev => ({
        ...prev,
        title: docTitle.charAt(0).toUpperCase() + docTitle.slice(1),
        rawContent: text,
        remediatedContent: text,
        findings: [],
        complianceScore: 100,
        status: 'DRAFT'
      }));
    };
    reader.readAsText(file);
  };

  const loadViolatingSample = () => {
    const sampleText = 'Inkloom AI is officially announced today as the 100% best in the world brand governance platform. Our cheap enterprise pricing is guaranteed to eliminate all brand risk forever through synergistic disruption, allowing us to crush everyone else in the compliance space.';
    setActiveItem(prev => ({
      ...prev,
      title: 'Global Launch Press Release — Q4 Announcement',
      rawContent: sampleText,
      remediatedContent: sampleText,
      findings: runClientSideAudit(sampleText),
      complianceScore: 38,
      status: 'NEEDS_REVISION'
    }));
    setImportedDocName(null);
  };

  const handleRunAudit = async () => {
    setIsScanning(true);
    setScanProgress(15);
    setScanStage(`Grounded in policy: ${companyPolicyName}...`);

    setTimeout(() => {
      setScanProgress(45);
      setScanStage('Evaluating Claims (§4.1), Privacy Disclosures (§5.2) & Pricing (§2.3)...');
    }, 350);

    setTimeout(() => {
      setScanProgress(75);
      setScanStage('Checking tone alignment, aggressive phrasing & unverified superlatives...');
    }, 750);

    setTimeout(() => {
      setScanProgress(100);
      setScanStage('Synthesizing intent-preserving replacements...');
    }, 1200);

    setTimeout(async () => {
      const auditResult = await BrandGovernanceService.auditContent({
        content: activeItem.rawContent,
        contentType: activeItem.contentType,
        title: activeItem.title,
        brandContext: policyText
      });

      setIsScanning(false);

      setActiveItem(prev => ({
        ...prev,
        findings: auditResult.findings,
        complianceScore: auditResult.score,
        status: auditResult.findings.length === 0 ? 'APPROVED' : 'NEEDS_REVISION',
        historyTrail: [
          ...prev.historyTrail,
          {
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            action: `Policy Audit against "${companyPolicyName}": ${auditResult.findings.length} issues identified (Score: ${auditResult.score}/100)`,
            actor: isLiveApi ? 'FastAPI Microservice' : 'Policy Audit Engine'
          }
        ]
      }));
    }, 1500);
  };

  // 1-Click Batch Remediation: Automatically replaces all violations with compliant fixes
  const handleAutoRemediateAll = () => {
    let content = activeItem.remediatedContent || activeItem.rawContent;
    const pendingFindings = activeItem.findings.filter(f => f.status === 'PENDING');
    if (pendingFindings.length === 0) return;

    // Apply all fixes preserving intent
    pendingFindings.forEach(f => {
      if (f.flaggedText && f.suggestedFix) {
        content = content.replace(f.flaggedText, f.suggestedFix);
      }
    });

    const updatedFindings = activeItem.findings.map(f => ({
      ...f,
      status: 'ACCEPTED' as const
    }));

    const newScore = calculateComplianceScore(updatedFindings);
    setAutoFixedAnimation(true);
    setTimeout(() => setAutoFixedAnimation(false), 2000);

    setActiveItem(prev => ({
      ...prev,
      rawContent: content,
      remediatedContent: content,
      findings: updatedFindings,
      complianceScore: newScore,
      status: 'APPROVED',
      historyTrail: [
        ...prev.historyTrail,
        {
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: `⚡ 1-Click Auto-Remediate: Applied ${pendingFindings.length} intent-preserving fixes (Score: 100/100)`,
          actor: 'Automated Policy Engine'
        }
      ]
    }));
  };

  const handleAcceptFix = (findingId: string) => {
    const finding = activeItem.findings.find(f => f.id === findingId);
    if (!finding) return;

    const updatedContent = activeItem.remediatedContent.replace(finding.flaggedText, finding.suggestedFix);
    const updatedFindings = activeItem.findings.map(f => 
      f.id === findingId ? { ...f, status: 'ACCEPTED' as const } : f
    );
    const newScore = calculateComplianceScore(updatedFindings);

    setActiveItem(prev => ({
      ...prev,
      rawContent: updatedContent,
      remediatedContent: updatedContent,
      findings: updatedFindings,
      complianceScore: newScore,
      historyTrail: [
        ...prev.historyTrail,
        {
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: `Accepted fix: "${finding.flaggedText}" → "${finding.suggestedFix}"`,
          actor: 'Creator'
        }
      ]
    }));
  };

  const handleEditFix = (findingId: string, customFix: string) => {
    const finding = activeItem.findings.find(f => f.id === findingId);
    if (!finding) return;

    const updatedContent = activeItem.remediatedContent.replace(finding.flaggedText, customFix);
    const updatedFindings = activeItem.findings.map(f => 
      f.id === findingId ? { ...f, suggestedFix: customFix, status: 'EDITED' as const } : f
    );
    const newScore = calculateComplianceScore(updatedFindings);

    setActiveItem(prev => ({
      ...prev,
      rawContent: updatedContent,
      remediatedContent: updatedContent,
      findings: updatedFindings,
      complianceScore: newScore
    }));
  };

  const handleDismissFix = (findingId: string, reason: string) => {
    const updatedFindings = activeItem.findings.map(f => 
      f.id === findingId ? { ...f, status: 'DISMISSED' as const, dismissReason: reason } : f
    );
    const newScore = calculateComplianceScore(updatedFindings);

    setActiveItem(prev => ({
      ...prev,
      findings: updatedFindings,
      complianceScore: newScore,
      historyTrail: [
        ...prev.historyTrail,
        {
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: `Dismissed issue with reason: "${reason}"`,
          actor: 'Creator'
        }
      ]
    }));
  };

  const handleSubmitForReview = () => {
    const updated: SubmissionItem = {
      ...activeItem,
      status: 'PENDING_MANAGER_REVIEW',
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      historyTrail: [
        ...activeItem.historyTrail,
        {
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: 'Forwarded for Manager Endorsement & Legal Approval',
          actor: 'Creator'
        }
      ]
    };
    setActiveItem(updated);
    onNewSubmissionCreated(updated);
  };

  const wordCount = activeItem.rawContent.trim().split(/\s+/).filter(Boolean).length;
  const charCount = activeItem.rawContent.length;
  const readingTimeSec = Math.max(1, Math.round(wordCount / 3.5));

  const activeIssues = activeItem.findings.filter(f => f.status === 'PENDING');
  const criticalCount = activeIssues.filter(f => f.severity === 'CRITICAL').length;

  return (
    <div className="space-y-6">
      
      {/* ======================================================== */}
      {/* 1. COMPANY POLICY & PRIVACY GUIDELINES CONTROL CARD       */}
      {/* ======================================================== */}
      <div className="bg-[#151324] p-5 rounded-2xl border border-[#2E2A4A] shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#B69DF8]/15 border border-[#B69DF8]/30 flex items-center justify-center text-[#B69DF8]">
              <ShieldCheck className="w-5 h-5 text-[#B69DF8]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-white">Active Company Brand & Privacy Policy</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/30 font-semibold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
                  <span>Policy Active</span>
                </span>
              </div>
              <p className="text-xs text-[#EDE9FE]/70 mt-0.5 flex items-center space-x-2">
                <FileCheck className="w-3.5 h-3.5 text-[#B69DF8]" />
                <span className="font-mono text-white font-medium">{companyPolicyName}</span>
                <span>•</span>
                <span>{policyRulesCount} Rules Grounded</span>
              </p>
            </div>
          </div>

          {/* Policy Action Buttons */}
          <div className="flex items-center space-x-2">
            <input
              type="file"
              ref={policyInputRef}
              onChange={handlePolicyUpload}
              accept=".pdf,.txt,.docx,.md"
              className="hidden"
            />

            <button
              onClick={() => policyInputRef.current?.click()}
              className="px-3.5 py-1.5 rounded-xl bg-[#2E2A4A] hover:bg-[#3B3463] text-xs font-semibold text-[#EDE9FE] border border-[#B69DF8]/30 transition flex items-center space-x-1.5 cursor-pointer shadow-sm"
            >
              <Upload className="w-3.5 h-3.5 text-[#B69DF8]" />
              <span>Upload Company Policy File</span>
            </button>

            <button
              onClick={() => setShowPolicyPreview(!showPolicyPreview)}
              className="px-3 py-1.5 rounded-xl bg-[#090810] hover:bg-[#151324] text-xs text-[#EDE9FE]/70 hover:text-white border border-[#2E2A4A] transition flex items-center space-x-1 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#B69DF8]" />
              <span>{showPolicyPreview ? 'Hide Rules' : 'View Rules'}</span>
              {showPolicyPreview ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Expandable Policy Preview & Rules Editor */}
        {showPolicyPreview && (
          <div className="p-3.5 rounded-xl bg-[#090810] border border-[#2E2A4A] space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between text-[#EDE9FE]/70 text-[11px]">
              <span>Active Policy Context (Editable):</span>
              <span className="text-[#B69DF8] font-bold">Auditing will evaluate drafts against these rules</span>
            </div>
            <textarea
              rows={4}
              value={policyText}
              onChange={(e) => setPolicyText(e.target.value)}
              className="w-full bg-[#151324] border border-[#2E2A4A] rounded-lg p-2.5 text-[#EDE9FE] focus:outline-none focus:border-[#B69DF8] text-xs font-mono leading-relaxed resize-none"
            />
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 2. DOCUMENT TO REVIEW & PRE-FLIGHT AUDIT STUDIO          */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Authoring & Document Upload (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="p-5 rounded-2xl bg-[#151324] border border-[#2E2A4A] shadow-xl space-y-4">
            
            {/* Top Toolbar: Format Selector & Document Upload */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#2E2A4A]">
              <div>
                <label className="text-[11px] font-mono text-[#EDE9FE]/70 uppercase tracking-wider block">
                  Content Format
                </label>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {formatOptions.map(opt => (
                    <button
                      key={opt.format}
                      onClick={() => handleFormatChange(opt.format)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition cursor-pointer ${
                        activeItem.contentType === opt.format
                          ? 'bg-[#B69DF8] text-[#0A0912] font-bold shadow-[0_0_15px_rgba(182,157,248,0.4)]'
                          : 'bg-[#090810] text-[#EDE9FE]/70 hover:text-white border border-[#2E2A4A]'
                      }`}
                    >
                      {opt.icon}
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Document / Load Sample Actions */}
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  ref={docInputRef}
                  onChange={handleDocumentImport}
                  accept=".txt,.md,.json,.csv,.doc,.docx"
                  className="hidden"
                />

                <button
                  onClick={() => docInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-[#2E2A4A] hover:bg-[#3B3463] text-xs font-semibold text-[#EDE9FE] border border-[#B69DF8]/30 transition flex items-center space-x-1.5 cursor-pointer shadow-sm"
                  title="Upload a draft document to review"
                >
                  <Upload className="w-3.5 h-3.5 text-[#B69DF8]" />
                  <span>Upload Document</span>
                </button>

                <button
                  onClick={loadViolatingSample}
                  className="px-3 py-1.5 rounded-lg bg-[#090810] hover:bg-[#1A172E] text-xs font-medium text-[#E879F9] border border-[#E879F9]/30 transition flex items-center space-x-1.5 cursor-pointer"
                  title="Load sample copy with intentional policy violations"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#E879F9]" />
                  <span>Load Sample</span>
                </button>
              </div>
            </div>

            {/* Document Title */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-mono text-[#EDE9FE]/70 uppercase tracking-wider">
                  Document / Campaign Title
                </label>
                {importedDocName && (
                  <span className="text-[11px] font-mono text-[#B69DF8]">
                    Source file: {importedDocName}
                  </span>
                )}
              </div>
              <input
                type="text"
                value={activeItem.title}
                onChange={(e) => setActiveItem(prev => ({ ...prev, title: e.target.value }))}
                className="w-full text-sm font-semibold bg-[#090810] border border-[#2E2A4A] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#B69DF8]"
                placeholder="Enter title..."
              />
            </div>

            {/* Live Editable Text Area */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-mono text-[#EDE9FE]/70 uppercase tracking-wider">
                  Content to Review Against Policy
                </label>
                <div className="text-[11px] font-mono text-[#EDE9FE]/60 space-x-3">
                  <span>{wordCount} words</span>
                  <span>{charCount} chars</span>
                  <span>~{readingTimeSec}s read</span>
                </div>
              </div>

              <textarea
                rows={9}
                value={activeItem.rawContent}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Paste or write your campaign copy, press release, or document text here..."
                className={`w-full text-sm font-sans bg-[#090810] border rounded-xl p-4 text-white focus:outline-none leading-relaxed resize-none font-normal transition-all duration-500 ${
                  autoFixedAnimation 
                    ? 'border-[#B69DF8] shadow-[0_0_20px_rgba(182,157,248,0.5)]' 
                    : 'border-[#2E2A4A] focus:border-[#B69DF8]'
                }`}
              />
            </div>

            {/* Scan Progress Bar (When Active) */}
            {isScanning && (
              <div className="p-3.5 rounded-xl bg-[#090810] border border-[#B69DF8]/40 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#B69DF8] font-bold flex items-center space-x-2">
                    <Sparkles className="w-3.5 h-3.5 animate-spin text-[#E879F9]" />
                    <span>{scanStage}</span>
                  </span>
                  <span className="text-[#EDE9FE]">{scanProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#151324] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#B69DF8] to-[#E879F9] transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center space-x-2">
                <button
                  disabled={isScanning || !activeItem.rawContent.trim()}
                  onClick={handleRunAudit}
                  className="px-4 py-2.5 rounded-xl bg-[#B69DF8] hover:bg-[#a688f7] disabled:opacity-50 text-[#0A0912] font-bold text-xs tracking-wide transition shadow-[0_0_20px_rgba(182,157,248,0.4)] flex items-center space-x-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#0A0912]" />
                  <span>{isScanning ? 'Auditing Against Policy...' : 'Run Policy Audit'}</span>
                </button>

                {/* ⚡ 1-Click Auto-Remediate All */}
                {activeIssues.length > 0 && (
                  <button
                    onClick={handleAutoRemediateAll}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E879F9] to-[#B69DF8] hover:opacity-90 text-[#0A0912] font-black text-xs tracking-wide transition shadow-[0_0_25px_rgba(232,121,249,0.5)] flex items-center space-x-1.5 cursor-pointer transform hover:scale-105 active:scale-95"
                  >
                    <Zap className="w-4 h-4 text-[#0A0912] fill-current" />
                    <span>⚡ 1-Click Auto-Fix All ({activeIssues.length})</span>
                  </button>
                )}
              </div>

              <button
                disabled={isScanning || criticalCount > 0 || activeItem.status === 'PENDING_MANAGER_REVIEW'}
                onClick={handleSubmitForReview}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
                  criticalCount === 0 && activeItem.status !== 'PENDING_MANAGER_REVIEW'
                    ? 'bg-[#2E2A4A] hover:bg-[#3B3463] text-white border border-[#B69DF8]/40 shadow-sm cursor-pointer'
                    : 'bg-[#090810] text-[#EDE9FE]/40 border border-[#2E2A4A] cursor-not-allowed'
                }`}
              >
                <Send className="w-3.5 h-3.5 text-[#B69DF8]" />
                <span>
                  {activeItem.status === 'PENDING_MANAGER_REVIEW'
                    ? 'Submitted for Review'
                    : 'Submit for Manager Review'}
                </span>
              </button>
            </div>

            {criticalCount > 0 && (
              <p className="text-[11px] text-[#E879F9] font-medium flex items-center space-x-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Resolve the {criticalCount} critical claim violation(s) or click "⚡ 1-Click Auto-Fix All".</span>
              </p>
            )}

          </div>

          {/* Submission History Log */}
          {activeItem.historyTrail.length > 0 && (
            <div className="p-4 rounded-xl bg-[#090810] border border-[#2E2A4A] space-y-2">
              <span className="text-xs font-mono uppercase text-[#EDE9FE]/70 block">
                Session Audit History
              </span>
              <div className="space-y-1 text-xs font-mono">
                {activeItem.historyTrail.map((h, i) => (
                  <div key={i} className="flex items-center space-x-2 text-[#EDE9FE]/70">
                    <span className="text-[10px] text-[#EDE9FE]/40">{h.timestamp}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B69DF8]" />
                    <span className="text-white">{h.action}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Findings & Suggested Fixes (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Top Compliance Score Gauge */}
          <div className="p-4 rounded-2xl bg-[#151324] border border-[#2E2A4A] shadow-xl flex items-center justify-between">
            <div>
              <span className="text-xs font-mono uppercase text-[#EDE9FE]/70">Brand & Policy Score</span>
              <h3 className="text-2xl font-black font-mono text-white mt-0.5">
                <span className={activeItem.complianceScore >= 80 ? 'text-[#B69DF8]' : activeItem.complianceScore >= 60 ? 'text-[#EDE9FE]' : 'text-[#E879F9]'}>
                  {activeItem.complianceScore}
                </span>
                <span className="text-xs text-[#EDE9FE]/60 font-normal"> / 100</span>
              </h3>
            </div>

            <div className="flex items-center space-x-2">
              {activeItem.complianceScore >= 85 ? (
                <span className="px-2.5 py-1 rounded-lg bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/40 text-xs font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Compliant</span>
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-lg bg-[#E879F9]/20 text-[#E879F9] border border-[#E879F9]/40 text-xs font-semibold flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Violations Present</span>
                </span>
              )}
            </div>
          </div>

          {/* Explainable Findings List with 1-Click Action Buttons */}
          <ExplainableFindings
            findings={activeItem.findings}
            onAcceptFix={handleAcceptFix}
            onEditFix={handleEditFix}
            onDismissFix={handleDismissFix}
          />

        </div>

      </div>

    </div>
  );
};
