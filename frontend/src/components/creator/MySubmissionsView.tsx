import React from 'react';
import { SubmissionItem } from '../../types';
import { Edit3, FileText } from 'lucide-react';

interface MySubmissionsViewProps {
  submissions: SubmissionItem[];
  currentUserEmail: string;
  onEditSubmission: (sub: SubmissionItem) => void;
}

export const MySubmissionsView: React.FC<MySubmissionsViewProps> = ({
  submissions,
  onEditSubmission
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-[#0B1B3D] p-4 rounded-xl border border-[#26425A] flex flex-wrap items-center justify-between gap-4 shadow-md">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <FileText className="w-4 h-4 text-[#86A8CF]" />
            <span>My Authored Submissions & Drafts</span>
          </h2>
          <p className="text-xs text-[#E1CBD7]/70 mt-0.5">
            Track the status of your content through manager reviews and authorized legal approvals.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {submissions.map(sub => (
          <div
            key={sub.id}
            className="p-5 rounded-2xl bg-[#26425A]/60 border border-[#86A8CF]/25 hover:border-[#86A8CF]/50 transition shadow-lg space-y-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono text-[#86A8CF] uppercase tracking-wider block mb-1">
                  {sub.contentType.replace(/_/g, ' ')}
                </span>
                <h3 className="text-sm font-bold text-white leading-snug">{sub.title}</h3>
              </div>

              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold whitespace-nowrap ${
                sub.status === 'APPROVED'
                  ? 'bg-[#86A8CF]/20 text-[#86A8CF] border border-[#86A8CF]/40'
                  : sub.status.includes('PENDING')
                  ? 'bg-[#E1CBD7]/20 text-[#E1CBD7] border border-[#E1CBD7]/40'
                  : 'bg-[#C38EB4]/20 text-[#C38EB4] border border-[#C38EB4]/40'
              }`}>
                {sub.status.replace(/_/g, ' ')}
              </span>
            </div>

            <p className="text-xs text-[#E1CBD7]/80 font-mono line-clamp-2 bg-[#07111C] p-2.5 rounded-lg border border-[#26425A]">
              "{sub.remediatedContent}"
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-[#26425A] text-xs">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-[#86A8CF] font-bold">Score: {sub.complianceScore}/100</span>
                <span className="text-[#E1CBD7]/50">•</span>
                <span className="text-[#E1CBD7]/60">{sub.findings.filter(f => f.status === 'PENDING').length} active flags</span>
              </div>

              <button
                onClick={() => onEditSubmission(sub)}
                className="px-3 py-1.5 rounded-lg bg-[#0B1B3D] hover:bg-[#07111C] text-xs font-semibold text-[#86A8CF] border border-[#86A8CF]/30 transition flex items-center space-x-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#86A8CF]" />
                <span>Open in Studio</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
