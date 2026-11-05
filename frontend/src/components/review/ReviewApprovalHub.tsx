import React, { useState } from 'react';
import { SubmissionItem, UserRole } from '../../types';
import { computeWordDiff } from '../../services/diffHelper';
import { 
  CheckCircle, 
  RotateCcw, 
  History, 
  ShieldCheck, 
  Split,
  Highlighter
} from 'lucide-react';

interface ReviewApprovalHubProps {
  submissions: SubmissionItem[];
  activeRole: UserRole;
  onUpdateSubmission: (updated: SubmissionItem) => void;
}

export const ReviewApprovalHub: React.FC<ReviewApprovalHubProps> = ({
  submissions,
  activeRole,
  onUpdateSubmission
}) => {
  const [selectedSubId, setSelectedSubId] = useState<string>(submissions[0]?.id || '');
  const [commentInput, setCommentInput] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED'>('ALL');
  const [diffViewMode, setDiffViewMode] = useState<'SIDE_BY_SIDE' | 'UNIFIED_HIGHLIGHT'>('UNIFIED_HIGHLIGHT');

  const selectedItem = submissions.find(s => s.id === selectedSubId) || submissions[0];

  const filteredList = submissions.filter(s => {
    if (filter === 'PENDING') return s.status.includes('PENDING') || s.status === 'NEEDS_REVISION';
    if (filter === 'APPROVED') return s.status === 'APPROVED';
    return true;
  });

  const handleAddComment = () => {
    if (!commentInput.trim() || !selectedItem) return;

    const newComment = {
      id: `c-${Date.now()}`,
      authorName: activeRole === 'MANAGER' ? 'Purva Deshmukh (Manager)' : activeRole === 'REVIEWER' ? 'Sakshi Dharpure (Reviewer)' : 'Admin',
      authorRole: activeRole,
      text: commentInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated: SubmissionItem = {
      ...selectedItem,
      comments: [...selectedItem.comments, newComment],
      historyTrail: [
        ...selectedItem.historyTrail,
        {
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: `Added Review Comment: "${commentInput.substring(0, 30)}..."`,
          actor: activeRole
        }
      ]
    };

    onUpdateSubmission(updated);
    setCommentInput('');
  };

  const handleManagerEndorse = () => {
    if (!selectedItem) return;
    const updated: SubmissionItem = {
      ...selectedItem,
      status: 'PENDING_LEGAL_REVIEW',
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      historyTrail: [
        ...selectedItem.historyTrail,
        {
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: 'Manager Review Passed -> Forwarded to Authorised Reviewer',
          actor: 'Purva Deshmukh (Manager)'
        }
      ]
    };
    onUpdateSubmission(updated);
  };

  const handleRequestChanges = () => {
    if (!selectedItem) return;
    const updated: SubmissionItem = {
      ...selectedItem,
      status: 'CHANGES_REQUESTED',
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      historyTrail: [
        ...selectedItem.historyTrail,
        {
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: 'Changes Requested back to Creator',
          actor: activeRole
        }
      ]
    };
    onUpdateSubmission(updated);
  };

  const handleFinalApproval = () => {
    if (!selectedItem) return;
    const updated: SubmissionItem = {
      ...selectedItem,
      status: 'APPROVED',
      complianceScore: 100,
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      historyTrail: [
        ...selectedItem.historyTrail,
        {
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: 'Official Brand & Legal Compliance Sign-Off Granted',
          actor: 'Sakshi Dharpure (Authorised Reviewer)'
        }
      ]
    };
    onUpdateSubmission(updated);
  };

  // Compute word diff tokens
  const diffTokens = selectedItem 
    ? computeWordDiff(selectedItem.rawContent, selectedItem.remediatedContent)
    : [];

  const additionsCount = diffTokens.filter(t => t.type === 'INSERT').length;
  const deletionsCount = diffTokens.filter(t => t.type === 'DELETE').length;

  return (
    <div className="space-y-6">
      
      {/* Top Review Hub Header */}
      <div className="bg-[#0B1B3D] p-4 rounded-xl border border-[#26425A] flex flex-wrap items-center justify-between gap-4 shadow-md">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <span>Collaborative Review & Approval Hub</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#26425A] text-[#86A8CF] border border-[#86A8CF]/30">
              Active Role: {activeRole}
            </span>
          </h2>
          <p className="text-xs text-[#E1CBD7]/70 mt-0.5">
            Compare original text with remediated copy, trace audit trails, and execute digital sign-offs.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex bg-[#07111C] p-1 rounded-xl border border-[#86A8CF]/20 text-xs">
          {(['ALL', 'PENDING', 'APPROVED'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                filter === f
                  ? 'bg-[#86A8CF] text-[#0B1B3D] font-bold shadow-sm'
                  : 'text-[#E1CBD7]/70 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Submissions Queue (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-mono uppercase text-[#E1CBD7]/70 block">
            Submissions Queue ({filteredList.length})
          </span>

          <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
            {filteredList.map(item => (
              <div
                key={item.id}
                onClick={() => setSelectedSubId(item.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition ${
                  selectedSubId === item.id
                    ? 'bg-[#26425A] border-[#86A8CF] shadow-[0_0_15px_rgba(134,168,207,0.25)]'
                    : 'bg-[#0B1B3D] border-[#26425A] hover:border-[#86A8CF]/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-white leading-snug line-clamp-1">{item.title}</h4>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold whitespace-nowrap ${
                    item.status === 'APPROVED'
                      ? 'bg-[#86A8CF]/20 text-[#86A8CF]'
                      : item.status.includes('PENDING')
                      ? 'bg-[#E1CBD7]/20 text-[#E1CBD7]'
                      : 'bg-[#C38EB4]/20 text-[#C38EB4]'
                  }`}>
                    {item.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#E1CBD7]/60 mt-2">
                  <span>{item.authorName} ({item.department.split(' ')[0]})</span>
                  <span className="font-mono text-[#86A8CF] font-bold">{item.complianceScore}/100</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Detail, Diff Viewer & Sign-off Actions (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {selectedItem ? (
            <div className="p-6 rounded-2xl bg-[#26425A]/60 border border-[#86A8CF]/25 shadow-xl space-y-5">
              
              {/* Submission Metadata Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#26425A]">
                <div>
                  <h3 className="text-base font-bold text-white">{selectedItem.title}</h3>
                  <div className="flex items-center space-x-3 text-xs text-[#E1CBD7]/70 mt-1">
                    <span>Submitted by: <strong className="text-white">{selectedItem.authorName}</strong></span>
                    <span>•</span>
                    <span>Department: {selectedItem.department}</span>
                    <span>•</span>
                    <span className="font-mono text-[#86A8CF] font-bold">Score: {selectedItem.complianceScore}/100</span>
                  </div>
                </div>

                {/* Role-Specific Sign-Off Action Controls */}
                <div className="flex items-center space-x-2">
                  {(activeRole === 'MANAGER' || activeRole === 'ADMIN') && (
                    <button
                      onClick={handleManagerEndorse}
                      className="px-3 py-1.5 rounded-lg bg-[#86A8CF] hover:bg-[#7297c0] text-[#0B1B3D] font-bold text-xs transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-[#0B1B3D]" />
                      <span>Endorse & Send to Legal</span>
                    </button>
                  )}

                  {(activeRole === 'REVIEWER' || activeRole === 'ADMIN') && (
                    <button
                      onClick={handleFinalApproval}
                      className="px-3.5 py-1.5 rounded-lg bg-[#86A8CF] hover:bg-[#7297c0] text-[#0B1B3D] font-bold text-xs transition flex items-center space-x-1.5 shadow-[0_0_15px_rgba(134,168,207,0.4)] cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#0B1B3D]" />
                      <span>Grant Final Approval</span>
                    </button>
                  )}

                  <button
                    onClick={handleRequestChanges}
                    className="px-3 py-1.5 rounded-lg bg-[#0B1B3D] hover:bg-[#07111C] border border-[#C38EB4]/50 text-xs text-[#E1CBD7] transition flex items-center space-x-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#C38EB4]" />
                    <span>Request Changes</span>
                  </button>
                </div>
              </div>

              {/* Visual Diff Control Bar */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-mono uppercase text-[#E1CBD7]/70 block">
                      Differential Remediation Viewer
                    </span>
                    <div className="flex items-center space-x-2 text-[11px] font-mono">
                      <span className="text-[#C38EB4]">-{deletionsCount} violations</span>
                      <span className="text-[#86A8CF]">+{additionsCount} fixes</span>
                    </div>
                  </div>

                  {/* Diff Switcher Toggle */}
                  <div className="flex bg-[#07111C] p-0.5 rounded-lg border border-[#86A8CF]/20 text-xs">
                    <button
                      onClick={() => setDiffViewMode('UNIFIED_HIGHLIGHT')}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center space-x-1 transition cursor-pointer ${
                        diffViewMode === 'UNIFIED_HIGHLIGHT'
                          ? 'bg-[#86A8CF] text-[#0B1B3D] font-bold'
                          : 'text-[#E1CBD7]/70 hover:text-white'
                      }`}
                    >
                      <Highlighter className="w-3 h-3" />
                      <span>Inline Highlighting</span>
                    </button>
                    <button
                      onClick={() => setDiffViewMode('SIDE_BY_SIDE')}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center space-x-1 transition cursor-pointer ${
                        diffViewMode === 'SIDE_BY_SIDE'
                          ? 'bg-[#86A8CF] text-[#0B1B3D] font-bold'
                          : 'text-[#E1CBD7]/70 hover:text-white'
                      }`}
                    >
                      <Split className="w-3 h-3" />
                      <span>Side-by-Side</span>
                    </button>
                  </div>
                </div>

                {/* Unified Highlight Mode */}
                {diffViewMode === 'UNIFIED_HIGHLIGHT' && (
                  <div className="p-4 rounded-xl bg-[#07111C] border border-[#86A8CF]/30 space-y-2">
                    <span className="text-[11px] font-mono text-[#86A8CF] block">
                      Intent-Preserving Diff (Dusty Rose: Original Violations, Cornflower: Compliant Suggestions):
                    </span>
                    <div className="text-xs font-mono leading-relaxed p-3 select-text bg-[#0B1B3D]/80 rounded-lg border border-white/5">
                      {diffTokens.map((token, i) => {
                        if (token.type === 'DELETE') {
                          return (
                            <span
                              key={i}
                              className="bg-[#C38EB4]/30 text-[#E1CBD7] line-through px-1.5 py-0.5 rounded border border-[#C38EB4]/50 mr-1"
                              title="Original flagged text"
                            >
                              {token.text}
                            </span>
                          );
                        }
                        if (token.type === 'INSERT') {
                          return (
                            <span
                              key={i}
                              className="bg-[#86A8CF]/20 text-[#86A8CF] font-bold px-1.5 py-0.5 rounded border border-[#86A8CF]/40 mr-1"
                              title="Remediated compliant alternative"
                            >
                              {token.text}
                            </span>
                          );
                        }
                        return <span key={i} className="text-[#E1CBD7]/80">{token.text}</span>;
                      })}
                    </div>
                  </div>
                )}

                {/* Side-by-Side Mode */}
                {diffViewMode === 'SIDE_BY_SIDE' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left: Original Raw Draft */}
                    <div className="p-4 rounded-xl bg-[#07111C] border border-[#C38EB4]/40 space-y-1.5">
                      <span className="text-[11px] font-mono font-bold text-[#C38EB4] uppercase flex items-center space-x-1">
                        <span>• Original Creator Draft</span>
                      </span>
                      <p className="text-xs text-[#E1CBD7]/80 font-mono leading-relaxed select-text">
                        {selectedItem.rawContent}
                      </p>
                    </div>

                    {/* Right: Remediated Compliant Text */}
                    <div className="p-4 rounded-xl bg-[#07111C] border border-[#86A8CF]/40 space-y-1.5">
                      <span className="text-[11px] font-mono font-bold text-[#86A8CF] uppercase flex items-center space-x-1">
                        <span>✓ Remediated & Preserved Intent</span>
                      </span>
                      <p className="text-xs text-white font-mono leading-relaxed select-text">
                        {selectedItem.remediatedContent}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Threaded Review Comments */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-mono uppercase text-[#E1CBD7]/70 block">
                  Reviewer Collaboration Thread ({selectedItem.comments.length})
                </span>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedItem.comments.map(c => (
                    <div key={c.id} className="p-3 rounded-lg bg-[#0B1B3D] border border-[#26425A] text-xs space-y-1">
                      <div className="flex items-center justify-between text-[#E1CBD7]/60 text-[11px]">
                        <span className="font-semibold text-white">{c.authorName} ({c.authorRole})</span>
                        <span className="font-mono">{c.timestamp}</span>
                      </div>
                      <p className="text-white">{c.text}</p>
                    </div>
                  ))}
                </div>

                {/* Add Comment Box */}
                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="text"
                    placeholder={`Add review notes as ${activeRole}...`}
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                    className="flex-1 text-xs bg-[#07111C] border border-[#86A8CF]/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#86A8CF]"
                  />
                  <button
                    onClick={handleAddComment}
                    className="px-4 py-2 rounded-xl bg-[#26425A] hover:bg-[#32526e] text-xs font-bold text-[#86A8CF] border border-[#86A8CF]/40 cursor-pointer"
                  >
                    Post Note
                  </button>
                </div>
              </div>

              {/* Complete Audit Trail */}
              <div className="pt-2 border-t border-[#26425A]">
                <span className="text-xs font-mono uppercase text-[#E1CBD7]/70 block mb-2 flex items-center space-x-1">
                  <History className="w-3.5 h-3.5 text-[#86A8CF]" />
                  <span>Tamper-Proof Audit History</span>
                </span>
                
                <div className="space-y-1.5 text-xs font-mono">
                  {selectedItem.historyTrail.map((h, i) => (
                    <div key={i} className="flex items-center space-x-3 text-[#E1CBD7]/70">
                      <span className="text-[10px] text-[#E1CBD7]/40">{h.timestamp}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#86A8CF]" />
                      <span className="text-white">{h.action}</span>
                      <span className="text-[10px] text-[#E1CBD7]/50">({h.actor})</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="p-8 text-center text-[#E1CBD7]/60 bg-[#26425A]/30 rounded-2xl border border-[#26425A]">
              Select a submission from the left queue to inspect diffs and approve.
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
