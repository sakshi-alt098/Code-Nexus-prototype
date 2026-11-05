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
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#C38EB4] text-[#0B1B3D] shadow-sm">
            <ShieldAlert className="w-3 h-3 text-[#0B1B3D]" />
            <span>Critical Violation</span>
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#C38EB4]/25 text-[#E1CBD7] border border-[#C38EB4]/60">
            <AlertTriangle className="w-3 h-3 text-[#C38EB4]" />
            <span>Tone / Term Warning</span>
          </span>
        );
      case 'SUGGESTION':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#86A8CF]/20 text-[#86A8CF] border border-[#86A8CF]/40">
            <Sparkles className="w-3 h-3" />
            <span>Style Suggestion</span>
          </span>
        );
    }
  };

  if (activeFindings.length === 0) {
    return (
      <div className="bg-[#26425A]/60 border border-[#86A8CF]/30 rounded-2xl p-6 text-center shadow-lg">
        <div className="w-12 h-12 rounded-full bg-[#86A8CF]/20 text-[#86A8CF] mx-auto flex items-center justify-center mb-3">
          <Check className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-white">All Brand Guidelines Satisfied</h4>
        <p className="text-xs text-[#E1CBD7]/70 mt-1 max-w-sm mx-auto">
          No policy violations, unsupported claims, or off-brand buzzwords were found in this draft.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-[#26425A]">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <span>Diagnostic Findings & Suggested Remediations</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-[#C38EB4] text-[#0B1B3D] font-bold">
              {activeFindings.length}
            </span>
          </h3>
          <p className="text-[11px] text-[#E1CBD7]/60 mt-0.5">
            Every issue is explainable, backed by approved guidelines, with fixes preserving your original intent.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {activeFindings.map((finding) => (
          <div
            key={finding.id}
            className="p-4 rounded-xl bg-[#26425A]/75 border border-[#86A8CF]/25 hover:border-[#86A8CF]/60 transition-all shadow-md"
          >
            {/* Finding Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center space-x-2">
                {getSeverityBadge(finding.severity)}
                <span className="text-xs font-mono text-[#E1CBD7]/70 flex items-center space-x-1">
                  <BookOpen className="w-3 h-3 text-[#86A8CF]" />
                  <span>{finding.sourceGuideline}</span>
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#E1CBD7]/50">
                Confidence: {(finding.confidenceScore * 100).toFixed(0)}%
              </span>
            </div>

            {/* Flagged Phrase */}
            <div className="mb-2">
              <span className="text-xs text-[#E1CBD7]/70">Flagged Phrase:</span>
              <p className="text-xs font-mono font-medium text-[#C38EB4] bg-[#07111C] px-2.5 py-1.5 rounded-md mt-1 border border-[#C38EB4]/30 line-through">
                "{finding.flaggedText}"
              </p>
            </div>

            {/* Explanation */}
            <p className="text-xs text-[#E1CBD7]/90 mb-3 leading-relaxed">
              <strong className="text-white">Why this is an issue:</strong> {finding.explanation}
            </p>

            {/* Suggested Remediation Box */}
            <div className="p-3 rounded-lg bg-[#0B1B3D] border-l-4 border-[#86A8CF] mb-3">
              <span className="text-[11px] font-mono text-[#86A8CF] uppercase font-bold block mb-1">
                Suggested Brand-Compliant Replacement:
              </span>
              
              {editingId === finding.id ? (
                <div className="space-y-2 mt-1">
                  <input
                    type="text"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    className="w-full text-xs font-mono bg-[#07111C] border border-[#86A8CF]/50 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-[#86A8CF]"
                  />
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        onEditFix(finding.id, customText);
                        setEditingId(null);
                      }}
                      className="px-2.5 py-1 rounded bg-[#86A8CF] text-[#0B1B3D] text-xs font-bold cursor-pointer"
                    >
                      Save Custom Fix
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-2.5 py-1 rounded bg-[#26425A] text-[#E1CBD7] text-xs cursor-pointer"
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
            {dismissingId === finding.id ? (
              <div className="p-2.5 rounded-lg bg-[#07111C] border border-[#C38EB4]/50 mb-3">
                <span className="text-[11px] text-[#E1CBD7] font-semibold block mb-1">
                  Reason for Override (Recorded for Guideline Ambiguity Analytics):
                </span>
                <input
                  type="text"
                  placeholder="e.g. Authorized under Legal §1.4 exception"
                  value={dismissReason}
                  onChange={(e) => setDismissReason(e.target.value)}
                  className="w-full text-xs bg-[#0B1B3D] border border-[#86A8CF]/30 rounded px-2 py-1 text-white mb-2"
                />
                <div className="flex items-center space-x-2">
                  <button
                    disabled={!dismissReason.trim()}
                    onClick={() => {
                      onDismissFix(finding.id, dismissReason);
                      setDismissingId(null);
                      setDismissReason('');
                    }}
                    className="px-2.5 py-1 rounded bg-[#C38EB4] disabled:opacity-50 text-[#0B1B3D] text-xs font-bold cursor-pointer"
                  >
                    Confirm Override
                  </button>
                  <button
                    onClick={() => setDismissingId(null)}
                    className="px-2.5 py-1 rounded bg-[#26425A] text-[#E1CBD7] text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : null}

            {/* Action Buttons */}
            {editingId !== finding.id && dismissingId !== finding.id && (
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#26425A]">
                <button
                  onClick={() => onAcceptFix(finding.id)}
                  className="px-3 py-1.5 rounded-lg bg-[#86A8CF] hover:bg-[#7297c0] text-[#0B1B3D] font-bold text-xs transition flex items-center space-x-1.5 shadow-[0_0_12px_rgba(134,168,207,0.3)] cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5 text-[#0B1B3D]" />
                  <span>Accept Suggestion</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setEditingId(finding.id);
                      setCustomText(finding.suggestedFix);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-[#0B1B3D] hover:bg-[#07111C] border border-[#86A8CF]/30 text-xs text-[#E1CBD7] transition flex items-center space-x-1 cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3 text-[#86A8CF]" />
                    <span>Customize</span>
                  </button>

                  <button
                    onClick={() => setDismissingId(finding.id)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#0B1B3D] hover:bg-[#07111C] border border-[#C38EB4]/40 text-xs text-[#E1CBD7]/70 hover:text-white transition flex items-center space-x-1 cursor-pointer"
                  >
                    <X className="w-3 h-3 text-[#C38EB4]" />
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
