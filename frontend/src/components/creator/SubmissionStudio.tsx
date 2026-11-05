import React, { useState } from 'react';
import { ContentFormat, Finding, SubmissionItem } from '../../types';
import { ExplainableFindings } from './ExplainableFindings';
import { runClientSideAudit, calculateComplianceScore } from '../../services/mockAuditEngine';
import { 
  FileText, 
  Share2, 
  Mail, 
  Send, 
  Sparkles, 
  RefreshCw, 
  Layers, 
  CheckCircle2, 
  AlertCircle 
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
  };

  const handleRunAudit = () => {
    setIsScanning(true);
    setScanProgress(15);
    setScanStage('Extracting tokens & analyzing syntax...');

    setTimeout(() => {
      setScanProgress(45);
      setScanStage('Comparing against active Brand Guidelines (§4.1, §2.3)...');
    }, 400);

    setTimeout(() => {
      setScanProgress(75);
      setScanStage('Detecting extreme claims, tone dissonance & buzzwords...');
    }, 900);

    setTimeout(() => {
      setScanProgress(100);
      setScanStage('Generating intent-preserving suggested remediations...');
    }, 1400);

    setTimeout(() => {
      const generatedFindings = runClientSideAudit(activeItem.rawContent);
      const score = calculateComplianceScore(generatedFindings);
      setIsScanning(false);

      setActiveItem(prev => ({
        ...prev,
        findings: generatedFindings,
        complianceScore: score,
        status: generatedFindings.length === 0 ? 'APPROVED' : 'NEEDS_REVISION',
        historyTrail: [
          ...prev.historyTrail,
          {
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            action: `Diagnostic Scan Run: ${generatedFindings.length} issues flagged (Score: ${score}/100)`,
            actor: 'Client AI Audit Engine'
          }
        ]
      }));
    }, 1800);
  };

  const handleAcceptFix = (findingId: string) => {
    const finding = activeItem.findings.find(f => f.id === findingId);
    if (!finding) return;

    // Replace the flagged text with the suggested fix
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
          action: `Accepted fix for: "${finding.flaggedText}"`,
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
          action: `Dismissed issue with justification: "${reason}"`,
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
          action: 'Submitted for Manager Review & Sign-Off',
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
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#00272B] p-4 rounded-xl border border-[#024950]">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <span>Pre-Flight Submission Studio</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#024950] text-[#0FA4AF] border border-[#0FA4AF]/30">
              Deterministic + AI Scanner
            </span>
          </h2>
          <p className="text-xs text-[#AFDDE5]/60 mt-0.5">
            Write or paste marketing copy to check tone, terminology, claims, and WCAG standards.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadViolatingSample}
            className="px-3 py-1.5 rounded-lg bg-[#024950] hover:bg-[#035b64] text-xs font-medium text-[#AFDDE5] border border-[#0FA4AF]/30 transition flex items-center space-x-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#0FA4AF]" />
            <span>Load Sample With Violations</span>
          </button>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Authoring & Editor Panel (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="p-5 rounded-2xl bg-[#024950]/50 border border-[#0FA4AF]/20 shadow-xl space-y-4">
            
            {/* Format Selector Pills */}
            <div>
              <label className="text-xs font-mono text-[#AFDDE5]/70 block mb-2 uppercase tracking-wider">
                Select Content Format
              </label>
              <div className="flex flex-wrap gap-2">
                {formatOptions.map(opt => (
                  <button
                    key={opt.format}
                    onClick={() => handleFormatChange(opt.format)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition ${
                      activeItem.contentType === opt.format
                        ? 'bg-[#0FA4AF] text-[#003135] font-bold shadow-[0_0_10px_rgba(15,164,175,0.3)]'
                        : 'bg-[#00272B] text-[#AFDDE5]/70 hover:text-white border border-[#024950]'
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
              <label className="text-xs font-mono text-[#AFDDE5]/70 block mb-1 uppercase tracking-wider">
                Campaign / Document Title
              </label>
              <input
                type="text"
                value={activeItem.title}
                onChange={(e) => setActiveItem(prev => ({ ...prev, title: e.target.value }))}
                className="w-full text-sm font-semibold bg-[#002225] border border-[#0FA4AF]/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#0FA4AF]"
                placeholder="Enter title..."
              />
            </div>

            {/* Live Editable Text Area */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-mono text-[#AFDDE5]/70 uppercase tracking-wider">
                  Content Draft
                </label>
                <div className="text-[11px] font-mono text-[#AFDDE5]/60 space-x-3">
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
                className="w-full text-sm font-sans bg-[#002024] border border-[#0FA4AF]/30 rounded-xl p-4 text-white focus:outline-none focus:border-[#0FA4AF] leading-relaxed resize-none font-normal"
              />
            </div>

            {/* Scan Progress Bar (When Active) */}
            {isScanning && (
              <div className="p-3.5 rounded-xl bg-[#002225] border border-[#0FA4AF]/40 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#0FA4AF] font-bold flex items-center space-x-2">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>{scanStage}</span>
                  </span>
                  <span className="text-[#AFDDE5]">{scanProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#003135] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#0FA4AF] to-[#AFDDE5] transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                disabled={isScanning || !activeItem.rawContent.trim()}
                onClick={handleRunAudit}
                className="px-5 py-2.5 rounded-xl bg-[#0FA4AF] hover:bg-[#0c8e98] disabled:opacity-50 text-[#003135] font-bold text-xs tracking-wide transition shadow-[0_0_15px_rgba(15,164,175,0.4)] flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-[#003135]" />
                <span>{isScanning ? 'Auditing Content...' : 'Run Brand Governance Check'}</span>
              </button>

              <button
                disabled={isScanning || criticalCount > 0 || activeItem.status === 'PENDING_MANAGER_REVIEW'}
                onClick={handleSubmitForReview}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
                  criticalCount === 0 && activeItem.status !== 'PENDING_MANAGER_REVIEW'
                    ? 'bg-[#024950] hover:bg-[#035b64] text-white border border-[#0FA4AF]/40 shadow-sm'
                    : 'bg-[#00272B] text-[#AFDDE5]/40 border border-[#024950] cursor-not-allowed'
                }`}
              >
                <Send className="w-3.5 h-3.5 text-[#0FA4AF]" />
                <span>
                  {activeItem.status === 'PENDING_MANAGER_REVIEW'
                    ? 'Submitted to Manager'
                    : 'Submit for Manager Review'}
                </span>
              </button>
            </div>

            {criticalCount > 0 && (
              <p className="text-[11px] text-[#964734] font-medium flex items-center space-x-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Please resolve or accept suggestions for the {criticalCount} critical claim violations before forwarding to managers.</span>
              </p>
            )}

          </div>

        </div>

        {/* Right Column: Compliance Score & Explainable Findings (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Compliance Score Gauge Card */}
          <div className="p-5 rounded-2xl bg-[#024950]/50 border border-[#0FA4AF]/20 shadow-xl flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono text-[#AFDDE5]/70 uppercase tracking-wider block">
                Brand Compliance Health
              </span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className={`text-3xl font-black font-mono ${
                  activeItem.complianceScore >= 85
                    ? 'text-[#0FA4AF]'
                    : activeItem.complianceScore >= 60
                    ? 'text-[#AFDDE5]'
                    : 'text-[#964734]'
                }`}>
                  {activeItem.complianceScore}/100
                </span>
                <span className="text-xs font-semibold text-[#AFDDE5]/70">
                  {activeItem.complianceScore >= 85 ? 'Safe to Publish' : activeItem.complianceScore >= 60 ? 'Moderate Risk' : 'High Brand Risk'}
                </span>
              </div>
            </div>

            {/* Status Pill */}
            <div className="text-right">
              <span className="text-[10px] text-[#AFDDE5]/50 font-mono uppercase block">Status</span>
              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold font-mono mt-1 ${
                activeItem.status === 'APPROVED'
                  ? 'bg-[#0FA4AF]/20 text-[#0FA4AF] border border-[#0FA4AF]/50'
                  : activeItem.status === 'PENDING_MANAGER_REVIEW'
                  ? 'bg-[#AFDDE5]/20 text-[#AFDDE5] border border-[#AFDDE5]/50'
                  : 'bg-[#964734]/20 text-[#964734] border border-[#964734]/50'
              }`}>
                {activeItem.status.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          {/* Explainable Findings Drawer */}
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
