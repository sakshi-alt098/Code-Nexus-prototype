import React from 'react';
import { SubmissionItem } from '../../types';
import { Edit3, FileText, ArrowRight } from 'lucide-react';

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
      
      {/* Header */}
      <div className="bg-[#151324] p-4 rounded-2xl border border-[#2E2A4A] flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <FileText className="w-4 h-4 text-[#B69DF8]" />
            <span>My Authored Submissions & Draft Status</span>
          </h2>
          <p className="text-xs text-[#EDE9FE]/70 mt-0.5">
            Track content lifecycle from creator draft to manager endorsement and legal approval.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {submissions.map(sub => (
          <div
            key={sub.id}
            className="p-5 rounded-2xl bg-[#151324] border border-[#2E2A4A] hover:border-[#B69DF8]/50 transition shadow-xl space-y-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono text-[#B69DF8] uppercase tracking-wider block mb-1">
                  {sub.contentType.replace(/_/g, ' ')}
                </span>
                <h3 className="text-sm font-bold text-white leading-snug">{sub.title}</h3>
              </div>

              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold whitespace-nowrap ${
                sub.status === 'APPROVED'
                  ? 'bg-[#B69DF8]/20 text-[#B69DF8] border border-[#B69DF8]/40'
                  : sub.status.includes('PENDING')
                  ? 'bg-[#C38EB4]/20 text-[#C38EB4] border border-[#C38EB4]/40'
                  : 'bg-[#E879F9]/20 text-[#E879F9] border border-[#E879F9]/40'
              }`}>
                {sub.status.replace(/_/g, ' ')}
              </span>
            </div>

            <p className="text-xs text-[#EDE9FE]/80 font-mono line-clamp-2 bg-[#0A0912] p-2.5 rounded-xl border border-[#2E2A4A]">
              "{sub.remediatedContent}"
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-[#2E2A4A] text-xs">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-[#B69DF8] font-bold">Compliance: {sub.complianceScore}/100</span>
                <span className="text-[#EDE9FE]/40">•</span>
                <span className="text-[#EDE9FE]/60">{sub.findings.length} findings resolved</span>
              </div>

              <button
                onClick={() => onEditSubmission(sub)}
                className="px-3 py-1.5 rounded-lg bg-[#0A0912] hover:bg-[#2E2A4A]/50 text-xs font-semibold text-[#EDE9FE] hover:text-[#B69DF8] border border-[#2E2A4A] transition flex items-center space-x-1 cursor-pointer"
              >
                <Edit3 className="w-3 h-3 text-[#B69DF8]" />
                <span>Open in Studio</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
