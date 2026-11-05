import React, { useState } from 'react';
import { SubmissionItem, UserRole } from '../../types';
import { 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  MessageSquare, 
  History, 
  ShieldCheck, 
  FileText, 
  Clock, 
  ArrowRight 
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

  return (
    <div className="space-y-6">
      
      {/* Top Review Hub Header */}
      <div className="bg-[#00272B] p-4 rounded-xl border border-[#024950] flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <span>Collaborative Review & Approval Hub</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#024950] text-[#0FA4AF] border border-[#0FA4AF]/30">
              Active Role: {activeRole}
            </span>
          </h2>
          <p className="text-xs text-[#AFDDE5]/60 mt-0.5">
            Compare original text with remediated copy, trace audit trails, and execute digital sign-offs.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex bg-[#002024] p-1 rounded-xl border border-[#0FA4AF]/20 text-xs">
          {(['ALL', 'PENDING', 'APPROVED'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                filter === f
                  ? 'bg-[#0FA4AF] text-[#003135] font-bold'
                  : 'text-[#AFDDE5]/70 hover:text-white'
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
          <span className="text-xs font-mono uppercase text-[#AFDDE5]/70 block">
            Submissions Queue ({filteredList.length})
          </span>

          <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
            {filteredList.map(item => (
              <div
                key={item.id}
                onClick={() => setSelectedSubId(item.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition ${
                  selectedSubId === item.id
                    ? 'bg-[#024950] border-[#0FA4AF] shadow-[0_0_15px_rgba(15,164,175,0.2)]'
                    : 'bg-[#00272B] border-[#024950] hover:border-[#0FA4AF]/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-white leading-snug line-clamp-1">{item.title}</h4>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold whitespace-nowrap ${
                    item.status === 'APPROVED'
                      ? 'bg-[#0FA4AF]/20 text-[#0FA4AF]'
                      : item.status.includes('PENDING')
                      ? 'bg-[#AFDDE5]/20 text-[#AFDDE5]'
                      : 'bg-[#964734]/20 text-[#964734]'
                  }`}>
                    {item.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#AFDDE5]/60 mt-2">
                  <span>{item.authorName} ({item.department.split(' ')[0]})</span>
                  <span className="font-mono text-[#0FA4AF] font-bold">{item.complianceScore}/100</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Detail, Diff Viewer & Sign-off Actions (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {selectedItem ? (
            <div className="p-6 rounded-2xl bg-[#024950]/50 border border-[#0FA4AF]/20 shadow-xl space-y-5">
              
              {/* Submission Metadata Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#024950]">
                <div>
                  <h3 className="text-base font-bold text-white">{selectedItem.title}</h3>
                  <div className="flex items-center space-x-3 text-xs text-[#AFDDE5]/60 mt-1">
                    <span>Submitted by: <strong className="text-white">{selectedItem.authorName}</strong></span>
                    <span>•</span>
                    <span>Department: {selectedItem.department}</span>
                    <span>•</span>
                    <span className="font-mono text-[#0FA4AF]">Score: {selectedItem.complianceScore}/100</span>
                  </div>
                </div>

                {/* Role-Specific Sign-Off Action Controls */}
                <div className="flex items-center space-x-2">
                  {(activeRole === 'MANAGER' || activeRole === 'ADMIN') && (
                    <button
                      onClick={handleManagerEndorse}
                      className="px-3 py-1.5 rounded-lg bg-[#0FA4AF] hover:bg-[#0c8e98] text-[#003135] font-bold text-xs transition flex items-center space-x-1.5 shadow-sm"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-[#003135]" />
                      <span>Endorse & Send to Legal</span>
                    </button>
                  )}

                  {(activeRole === 'REVIEWER' || activeRole === 'ADMIN') && (
                    <button
                      onClick={handleFinalApproval}
                      className="px-3.5 py-1.5 rounded-lg bg-[#0FA4AF] hover:bg-[#0c8e98] text-[#003135] font-bold text-xs transition flex items-center space-x-1.5 shadow-[0_0_15px_rgba(15,164,175,0.4)]"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#003135]" />
                      <span>Grant Final Approval</span>
                    </button>
                  )}

                  <button
                    onClick={handleRequestChanges}
                    className="px-3 py-1.5 rounded-lg bg-[#003135] hover:bg-[#002225] border border-[#964734]/50 text-xs text-[#AFDDE5] transition flex items-center space-x-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#964734]" />
                    <span>Request Changes</span>
                  </button>
                </div>
              </div>

              {/* Side-by-Side Visual Diff Viewer */}
              <div>
                <span className="text-xs font-mono uppercase text-[#AFDDE5]/70 block mb-2">
                  Visual Diff Comparison (Original vs Remediated Intent)
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Left: Original Raw Draft */}
                  <div className="p-4 rounded-xl bg-[#002225] border border-[#964734]/40 space-y-1.5">
                    <span className="text-[11px] font-mono font-bold text-[#964734] uppercase flex items-center space-x-1">
                      <span>• Original Creator Draft</span>
                    </span>
                    <p className="text-xs text-[#AFDDE5]/80 font-mono leading-relaxed select-text">
                      {selectedItem.rawContent}
                    </p>
                  </div>

                  {/* Right: Remediated Compliant Text */}
                  <div className="p-4 rounded-xl bg-[#002225] border border-[#0FA4AF]/40 space-y-1.5">
                    <span className="text-[11px] font-mono font-bold text-[#0FA4AF] uppercase flex items-center space-x-1">
                      <span>✓ Remediated & Preserved Intent</span>
                    </span>
                    <p className="text-xs text-white font-mono leading-relaxed select-text">
                      {selectedItem.remediatedContent}
                    </p>
                  </div>

                </div>
              </div>

              {/* Threaded Review Comments */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-mono uppercase text-[#AFDDE5]/70 block">
                  Reviewer Collaboration Thread ({selectedItem.comments.length})
                </span>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedItem.comments.map(c => (
                    <div key={c.id} className="p-3 rounded-lg bg-[#00272B] border border-[#024950] text-xs space-y-1">
                      <div className="flex items-center justify-between text-[#AFDDE5]/60 text-[11px]">
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
                    className="flex-1 text-xs bg-[#002225] border border-[#0FA4AF]/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#0FA4AF]"
                  />
                  <button
                    onClick={handleAddComment}
                    className="px-4 py-2 rounded-xl bg-[#024950] hover:bg-[#035b64] text-xs font-bold text-[#0FA4AF] border border-[#0FA4AF]/40"
                  >
                    Post Note
                  </button>
                </div>
              </div>

              {/* Complete Audit Trail */}
              <div className="pt-2 border-t border-[#024950]">
                <span className="text-xs font-mono uppercase text-[#AFDDE5]/70 block mb-2 flex items-center space-x-1">
                  <History className="w-3.5 h-3.5 text-[#0FA4AF]" />
                  <span>Tamper-Proof Audit History</span>
                </span>
                
                <div className="space-y-1.5 text-xs font-mono">
                  {selectedItem.historyTrail.map((h, i) => (
                    <div key={i} className="flex items-center space-x-3 text-[#AFDDE5]/70">
                      <span className="text-[10px] text-[#AFDDE5]/40">{h.timestamp}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0FA4AF]" />
                      <span className="text-white">{h.action}</span>
                      <span className="text-[10px] text-[#AFDDE5]/50">({h.actor})</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="p-8 text-center text-[#AFDDE5]/60 bg-[#024950]/30 rounded-2xl border border-[#024950]">
              Select a submission from the left queue to inspect diffs and approve.
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
