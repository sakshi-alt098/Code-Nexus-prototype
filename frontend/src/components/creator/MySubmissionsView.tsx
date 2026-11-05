import React from 'react';
import { SubmissionItem } from '../../types';
import { Edit3, Clock, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

interface MySubmissionsViewProps {
  submissions: SubmissionItem[];
  currentUserEmail: string;
  onEditSubmission: (sub: SubmissionItem) => void;
}

export const MySubmissionsView: React.FC<MySubmissionsViewProps> = ({
  submissions,
  currentUserEmail,
  onEditSubmission
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-[#00272B] p-4 rounded-xl border border-[#024950] flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <FileText className="w-4 h-4 text-[#0FA4AF]" />
            <span>My Authored Submissions & Drafts</span>
          </h2>
          <p className="text-xs text-[#AFDDE5]/60 mt-0.5">
            Track the status of your content through manager reviews and authorized legal approvals.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {submissions.map(sub => (
          <div
            key={sub.id}
            className="p-5 rounded-2xl bg-[#024950]/50 border border-[#0FA4AF]/20 hover:border-[#0FA4AF]/50 transition shadow-lg space-y-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono text-[#0FA4AF] uppercase tracking-wider block mb-1">
                  {sub.contentType.replace(/_/g, ' ')}
                </span>
                <h3 className="text-sm font-bold text-white leading-snug">{sub.title}</h3>
              </div>

              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold whitespace-nowrap ${
                sub.status === 'APPROVED'
                  ? 'bg-[#0FA4AF]/20 text-[#0FA4AF] border border-[#0FA4AF]/40'
                  : sub.status.includes('PENDING')
                  ? 'bg-[#AFDDE5]/20 text-[#AFDDE5] border border-[#AFDDE5]/40'
                  : 'bg-[#964734]/20 text-[#964734] border border-[#964734]/40'
              }`}>
                {sub.status.replace(/_/g, ' ')}
              </span>
            </div>

            <p className="text-xs text-[#AFDDE5]/80 font-mono line-clamp-2 bg-[#002225] p-2.5 rounded-lg border border-[#024950]">
              "{sub.remediatedContent}"
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-[#024950] text-xs">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-[#0FA4AF] font-bold">Score: {sub.complianceScore}/100</span>
                <span className="text-[#AFDDE5]/50">•</span>
                <span className="text-[#AFDDE5]/60">{sub.findings.filter(f => f.status === 'PENDING').length} active flags</span>
              </div>

              <button
                onClick={() => onEditSubmission(sub)}
                className="px-3 py-1.5 rounded-lg bg-[#003135] hover:bg-[#002225] text-xs font-semibold text-[#0FA4AF] border border-[#0FA4AF]/30 transition flex items-center space-x-1.5"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#0FA4AF]" />
                <span>Open in Studio</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
