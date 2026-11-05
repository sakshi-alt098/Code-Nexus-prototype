import React, { useState } from 'react';
import { Finding, SeverityLevel } from '../../types';
import { Check, Edit2, X, AlertTriangle, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';

interface ExplainableFindingsProps {
  findings: Finding[];
  onAcceptFix: (findingId: string) => void;
  onEditFix: (findingId: string, customFix: string) => void;
  onDismissFix: (findingId: string, reason: string) => void;
}

export const ExplainableFindings: React.FC<ExplainableFindingsProps> = ({
  findings,
  onAcceptFix,
  onEditFix,
  onDismissFix
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [customText, setCustomText] = useState('');
  const [dismissingId, setDismissingId] = useState<string | null>(null);
  const [dismissReason, setDismissReason] = useState('');

  const activeFindings = findings.filter(f => f.status === 'PENDING');

  const getSeverityBadge = (severity: SeverityLevel) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#E879F9]/20 text-[#E879F9] border border-[#E879F9]/40">
            <ShieldAlert className="w-3 h-3 text-[#E879F9]" />
            <span>Critical Violation</span>
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#C38EB4]/20 text-[#C38EB4] border border-[#C38EB4]/50">
            <AlertTriangle className="w-3 h-3 text-[#C38EB4]" />
            <span>Tone / Term Warning</span>
          </span>
        );
      case 'SUGGESTION':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#B69DF8]/20 text-[#B69DF8] border border-[#B69DF8]/40">
            <Sparkles className="w-3 h-3 text-[#B69DF8]" />
            <span>Style Suggestion</span>
          </span>
        );
    }
  };

  if (activeFindings.length === 0) {
    return (
      <div className="bg-[#151324] border border-[#B69DF8]/30 rounded-2xl p-6 text-center shadow-xl">
        <div className="w-12 h-12 rounded-full bg-[#B69DF8]/20 text-[#B69DF8] mx-auto flex items-center justify-center mb-3">
          <Check className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-white">All Brand Guidelines Satisfied</h4>
        <p className="text-xs text-[#EDE9FE]/70 mt-1 max-w-sm mx-auto">
          No policy violations, unsupported claims, or unapproved terms were detected in this draft.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-[#2E2A4A]">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <span>Diagnostic Findings & Suggested Remediations</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-[#E879F9] text-[#0A0912] font-bold">
              {activeFindings.length}
            </span>
          </h3>
          <p className="text-[11px] text-[#EDE9FE]/60 mt-0.5">
            Every issue is explainable, backed by approved guidelines, with fixes preserving creator intent.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {activeFindings.map((finding) => (
          <div
            key={finding.id}
            className="p-4 rounded-xl bg-[#151324] border border-[#2E2A4A] hover:border-[#B69DF8]/60 transition-all shadow-md space-y-3"
          >
            {/* Finding Header */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                {getSeverityBadge(finding.severity)}
                <span className="text-xs font-mono text-[#EDE9FE]/70 flex items-center space-x-1">
                  <BookOpen className="w-3 h-3 text-[#B69DF8]" />
                  <span>{finding.sourceGuideline}</span>
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#EDE9FE]/50">
                Confidence: {(finding.confidenceScore * 100).toFixed(0)}%
              </span>
            </div>

            {/* Flagged Phrase */}
            <div>
              <span className="text-xs text-[#EDE9FE]/70">Flagged Phrase:</span>
              <p className="text-xs font-mono font-medium text-[#E879F9] bg-[#0A0912] px-2.5 py-1.5 rounded-lg mt-1 border border-[#E879F9]/30 line-through">
                "{finding.flaggedText}"
              </p>
            </div>

            {/* Explanation */}
            <p className="text-xs text-[#EDE9FE]/90 leading-relaxed">
              <strong className="text-white">Why this was flagged:</strong> {finding.explanation}
            </p>

            {/* Suggested Remediation Box */}
            <div className="p-3 rounded-xl bg-[#0A0912] border-l-4 border-[#B69DF8]">
              <span className="text-[11px] font-mono text-[#B69DF8] uppercase font-bold block mb-1">
                Suggested Brand-Compliant Replacement:
              </span>
              
              {editingId === finding.id ? (
                <div className="space-y-2 mt-1">
                  <input
                    type="text"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    className="w-full text-xs font-mono bg-[#151324] border border-[#B69DF8]/50 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-[#B69DF8]"
                  />
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        onEditFix(finding.id, customText);
                        setEditingId(null);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#B69DF8] text-[#0A0912] text-xs font-bold cursor-pointer"
                    >
                      Save Custom Fix
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-2.5 py-1 rounded-lg bg-[#2E2A4A] text-[#EDE9FE] text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-white font-mono leading-relaxed">
                  "{finding.suggestedFix}"
                </p>
              )}
            </div>

            {/* Dismiss Justification Input */}
            {dismissingId === finding.id && (
              <div className="p-3 rounded-xl bg-[#0A0912] border border-[#E879F9]/40 space-y-2">
                <span className="text-[11px] text-[#EDE9FE] font-semibold block">
                  Reason for Override (Recorded for Guideline Health Analytics):
                </span>
                <input
                  type="text"
                  placeholder="e.g. Authorized exception by Legal Counsel"
                  value={dismissReason}
                  onChange={(e) => setDismissReason(e.target.value)}
                  className="w-full text-xs bg-[#151324] border border-[#2E2A4A] rounded-lg px-2.5 py-1.5 text-white"
                />
                <div className="flex items-center space-x-2">
                  <button
                    disabled={!dismissReason.trim()}
                    onClick={() => {
                      onDismissFix(finding.id, dismissReason);
                      setDismissingId(null);
                      setDismissReason('');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#E879F9] disabled:opacity-50 text-[#0A0912] text-xs font-bold cursor-pointer"
                  >
                    Confirm Override
                  </button>
                  <button
                    onClick={() => setDismissingId(null)}
                    className="px-2.5 py-1 rounded-lg bg-[#2E2A4A] text-[#EDE9FE] text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {editingId !== finding.id && dismissingId !== finding.id && (
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#2E2A4A]">
                <button
                  onClick={() => onAcceptFix(finding.id)}
                  className="px-3 py-1.5 rounded-xl bg-[#B69DF8] hover:bg-[#a688f7] text-[#0A0912] font-bold text-xs transition flex items-center space-x-1.5 shadow-[0_0_12px_rgba(182,157,248,0.3)] cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5 text-[#0A0912]" />
                  <span>Accept Suggestion</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setEditingId(finding.id);
                      setCustomText(finding.suggestedFix);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-[#0A0912] hover:bg-[#2E2A4A]/50 border border-[#2E2A4A] text-xs text-[#EDE9FE] transition flex items-center space-x-1 cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3 text-[#B69DF8]" />
                    <span>Customize</span>
                  </button>

                  <button
                    onClick={() => setDismissingId(finding.id)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#0A0912] hover:bg-[#2E2A4A]/50 border border-[#E879F9]/40 text-xs text-[#EDE9FE]/70 hover:text-[#E879F9] transition flex items-center space-x-1 cursor-pointer"
                  >
                    <X className="w-3 h-3 text-[#E879F9]" />
                    <span>Override / Dismiss</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
