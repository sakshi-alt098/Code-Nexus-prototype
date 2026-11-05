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
  CheckCheck
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
  const [importedFileName, setImportedFileName] = useState<string | null>(null);
  const [autoFixedAnimation, setAutoFixedAnimation] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleDocumentImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportedFileName(file.name);
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
    setImportedFileName(null);
  };

  const handleRunAudit = async () => {
    setIsScanning(true);
    setScanProgress(15);
    setScanStage('Tokenizing & analyzing syntax against Brand Rulebook...');

    setTimeout(() => {
      setScanProgress(45);
      setScanStage('Evaluating Claims (§4.1), Guarantees (§1.4) & Commercial Terms (§2.3)...');
    }, 350);

    setTimeout(() => {
      setScanProgress(75);
      setScanStage('Detecting tone dissonance, aggressive verbs & buzzwords...');
    }, 750);

    setTimeout(() => {
      setScanProgress(100);
      setScanStage('Synthesizing intent-preserving replacements...');
    }, 1200);

    setTimeout(async () => {
      const auditResult = await BrandGovernanceService.auditContent({
        content: activeItem.rawContent,
        contentType: activeItem.contentType,
        title: activeItem.title
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
            action: `Automated Scan: ${auditResult.findings.length} issues identified (Score: ${auditResult.score}/100)`,
            actor: isLiveApi ? 'FastAPI Microservice' : 'Hybrid AI Audit Engine'
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
          action: `⚡ 1-Click Auto-Remediate All: Applied ${pendingFindings.length} intent-preserving fixes (Score: 100/100)`,
          actor: 'Automated Intent Engine'
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
          action: 'Forwarded for Manager Endorsement & Legal Review',
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
      
      {/* Top Studio Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0B1B3D] p-4 rounded-xl border border-[#26425A] shadow-md">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <span>Pre-Flight Submission Studio</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#26425A] text-[#86A8CF] border border-[#86A8CF]/30">
              Automated AI Governance
            </span>
          </h2>
          <p className="text-xs text-[#E1CBD7]/70 mt-0.5">
            Check marketing drafts against approved claims, terminology, and tone before publication.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleDocumentImport}
            accept=".txt,.md,.json,.csv,.doc,.docx"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-lg bg-[#26425A] hover:bg-[#32526e] text-xs font-medium text-[#E1CBD7] border border-[#86A8CF]/30 transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-[#86A8CF]" />
            <span>Import Document</span>
          </button>

          <button
            onClick={loadViolatingSample}
            className="px-3 py-1.5 rounded-lg bg-[#26425A]/70 hover:bg-[#26425A] text-xs font-medium text-[#E1CBD7] border border-[#C38EB4]/40 transition flex items-center space-x-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#C38EB4]" />
            <span>Load Sample Violations</span>
          </button>
        </div>
      </div>

      {importedFileName && (
        <div className="px-4 py-2 rounded-xl bg-[#86A8CF]/10 border border-[#86A8CF]/30 flex items-center justify-between text-xs text-[#E1CBD7]">
          <span>Imported document source: <strong className="text-white">{importedFileName}</strong></span>
          <span className="text-[#86A8CF] font-mono font-semibold">Ready to scan</span>
        </div>
      )}

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Authoring & Editor Panel (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="p-5 rounded-2xl bg-[#26425A]/60 border border-[#86A8CF]/25 shadow-xl space-y-4">
            
            {/* Format Selector Pills */}
            <div>
              <label className="text-xs font-mono text-[#E1CBD7]/70 block mb-2 uppercase tracking-wider">
                Select Content Format
              </label>
              <div className="flex flex-wrap gap-2">
                {formatOptions.map(opt => (
                  <button
                    key={opt.format}
                    onClick={() => handleFormatChange(opt.format)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition cursor-pointer ${
                      activeItem.contentType === opt.format
                        ? 'bg-[#86A8CF] text-[#0B1B3D] font-bold shadow-[0_0_15px_rgba(134,168,207,0.4)]'
                        : 'bg-[#0B1B3D] text-[#E1CBD7]/70 hover:text-white border border-[#26425A]'
                    }`}
                  >
                    {opt.icon}
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Document Title */}
            <div>
              <label className="text-xs font-mono text-[#E1CBD7]/70 block mb-1 uppercase tracking-wider">
                Campaign / Document Title
              </label>
              <input
                type="text"
                value={activeItem.title}
                onChange={(e) => setActiveItem(prev => ({ ...prev, title: e.target.value }))}
                className="w-full text-sm font-semibold bg-[#07111C] border border-[#86A8CF]/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#86A8CF]"
                placeholder="Enter title..."
              />
            </div>

            {/* Live Editable Text Area */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-mono text-[#E1CBD7]/70 uppercase tracking-wider">
                  Content Draft
                </label>
                <div className="text-[11px] font-mono text-[#E1CBD7]/60 space-x-3">
                  <span>{wordCount} words</span>
                  <span>{charCount} chars</span>
                  <span>~{readingTimeSec}s read</span>
                </div>
              </div>

              <textarea
                rows={9}
                value={activeItem.rawContent}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Paste or write your campaign copy, press release, or social media post here..."
                className={`w-full text-sm font-sans bg-[#07111C] border rounded-xl p-4 text-white focus:outline-none leading-relaxed resize-none font-normal transition-all duration-500 ${
                  autoFixedAnimation 
                    ? 'border-[#86A8CF] shadow-[0_0_20px_rgba(134,168,207,0.5)]' 
                    : 'border-[#86A8CF]/30 focus:border-[#86A8CF]'
                }`}
              />
            </div>

            {/* Scan Progress Bar (When Active) */}
            {isScanning && (
              <div className="p-3.5 rounded-xl bg-[#07111C] border border-[#86A8CF]/40 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#86A8CF] font-bold flex items-center space-x-2">
                    <Sparkles className="w-3.5 h-3.5 animate-spin text-[#C38EB4]" />
                    <span>{scanStage}</span>
                  </span>
                  <span className="text-[#E1CBD7]">{scanProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#0B1B3D] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#86A8CF] to-[#C38EB4] transition-all duration-300"
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
                  className="px-4 py-2.5 rounded-xl bg-[#86A8CF] hover:bg-[#7297c0] disabled:opacity-50 text-[#0B1B3D] font-bold text-xs tracking-wide transition shadow-[0_0_15px_rgba(134,168,207,0.4)] flex items-center space-x-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#0B1B3D]" />
                  <span>{isScanning ? 'Auditing Content...' : 'Run Automated Audit'}</span>
                </button>

                {/* ⚡ 1-Click Auto-Remediate All */}
                {activeIssues.length > 0 && (
                  <button
                    onClick={handleAutoRemediateAll}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C38EB4] to-[#86A8CF] hover:opacity-90 text-[#0B1B3D] font-black text-xs tracking-wide transition shadow-[0_0_20px_rgba(195,142,180,0.5)] flex items-center space-x-1.5 cursor-pointer transform hover:scale-105 active:scale-95"
                  >
                    <Zap className="w-4 h-4 text-[#0B1B3D] fill-current" />
                    <span>⚡ 1-Click Auto-Fix All ({activeIssues.length})</span>
                  </button>
                )}
              </div>

              <button
                disabled={isScanning || criticalCount > 0 || activeItem.status === 'PENDING_MANAGER_REVIEW'}
                onClick={handleSubmitForReview}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
                  criticalCount === 0 && activeItem.status !== 'PENDING_MANAGER_REVIEW'
                    ? 'bg-[#26425A] hover:bg-[#32526e] text-white border border-[#86A8CF]/40 shadow-sm cursor-pointer'
                    : 'bg-[#0B1B3D] text-[#E1CBD7]/40 border border-[#26425A] cursor-not-allowed'
                }`}
              >
                <Send className="w-3.5 h-3.5 text-[#86A8CF]" />
                <span>
                  {activeItem.status === 'PENDING_MANAGER_REVIEW'
                    ? 'Submitted for Review'
                    : 'Submit for Manager Review'}
                </span>
              </button>
            </div>

            {criticalCount > 0 && (
              <p className="text-[11px] text-[#C38EB4] font-medium flex items-center space-x-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Please accept suggestions for the {criticalCount} critical claim violation(s) or click "1-Click Auto-Fix All".</span>
              </p>
            )}

          </div>

          {/* Submission History Log */}
          {activeItem.historyTrail.length > 0 && (
            <div className="p-4 rounded-xl bg-[#0B1B3D] border border-[#26425A] space-y-2">
              <span className="text-xs font-mono uppercase text-[#E1CBD7]/70 block">
                Session Audit History
              </span>
              <div className="space-y-1 text-xs font-mono">
                {activeItem.historyTrail.map((h, i) => (
                  <div key={i} className="flex items-center space-x-2 text-[#E1CBD7]/70">
                    <span className="text-[10px] text-[#E1CBD7]/40">{h.timestamp}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#86A8CF]" />
                    <span className="text-white">{h.action}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Findings & Suggestions (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Top Compliance Score Gauge */}
          <div className="p-4 rounded-2xl bg-[#26425A]/60 border border-[#86A8CF]/25 shadow-xl flex items-center justify-between">
            <div>
              <span className="text-xs font-mono uppercase text-[#E1CBD7]/70">Pre-Flight Brand Health Score</span>
              <h3 className="text-2xl font-black font-mono text-white mt-0.5">
                <span className={activeItem.complianceScore >= 80 ? 'text-[#86A8CF]' : activeItem.complianceScore >= 60 ? 'text-[#E1CBD7]' : 'text-[#C38EB4]'}>
                  {activeItem.complianceScore}
                </span>
                <span className="text-xs text-[#E1CBD7]/60 font-normal"> / 100</span>
              </h3>
            </div>

            <div className="flex items-center space-x-2">
              {activeItem.complianceScore >= 85 ? (
                <span className="px-2.5 py-1 rounded-lg bg-[#86A8CF]/20 text-[#86A8CF] border border-[#86A8CF]/40 text-xs font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Compliant</span>
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-lg bg-[#C38EB4]/20 text-[#C38EB4] border border-[#C38EB4]/40 text-xs font-semibold flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Action Needed</span>
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
