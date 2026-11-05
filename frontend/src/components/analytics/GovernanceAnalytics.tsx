import React from 'react';
import { BarChart3, AlertOctagon, TrendingUp, Users, ShieldAlert } from 'lucide-react';

export const GovernanceAnalytics: React.FC = () => {
  const frequentViolations = [
    { name: 'Unsupported Superlative Claims (§4.1)', count: 48, percentage: 38, color: '#C38EB4' },
    { name: 'Corporate Buzzwords & Jargon (§3.2)', count: 32, percentage: 26, color: '#86A8CF' },
    { name: 'Derogatory Commercial Pricing (§2.3)', count: 22, percentage: 18, color: '#E1CBD7' },
    { name: 'WCAG 2.1 Contrast Failures (§6.1)', count: 15, percentage: 12, color: '#26425A' },
    { name: 'Absolute Immunity Guarantees (§1.4)', count: 8, percentage: 6, color: '#C38EB4' }
  ];

  const departmentScores = [
    { dept: 'Corporate PR & Comms', score: 96, status: 'High Consistency', authorCount: 8 },
    { dept: 'Executive Operations', score: 94, status: 'High Consistency', authorCount: 4 },
    { dept: 'Performance Marketing', score: 84, status: 'Moderate Risk', authorCount: 12 },
    { dept: 'Sales Enablement', score: 78, status: 'Moderate Risk', authorCount: 16 },
    { dept: 'External Creative Agencies', score: 62, status: 'High Risk (Frequent Claims)', authorCount: 22 }
  ];

  const ambiguousGuidelines = [
    {
      rule: '§3.2: Plain English vs Corporate Jargon',
      overrideRate: '68%',
      dismissals: 24,
      aiRecommendation: 'Rule is too restrictive regarding industry terms like "disruption". Recommend specifying allowed technical context.'
    },
    {
      rule: '§1.4: Absolute Risk Elimination Guarantees',
      overrideRate: '54%',
      dismissals: 19,
      aiRecommendation: 'Marketing teams struggle with phrasing. Recommend adding pre-approved disclaimer templates.'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-[#0B1B3D] p-4 rounded-xl border border-[#26425A] flex flex-wrap items-center justify-between gap-4 shadow-md">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-[#86A8CF]" />
            <span>Brand Governance Insights & Guideline Health</span>
          </h2>
          <p className="text-xs text-[#E1CBD7]/70 mt-0.5">
            Real-time analytics revealing repeated mistakes, agency compliance gaps, and guidelines that need rewording.
          </p>
        </div>
      </div>

      {/* Top 3 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#26425A]/60 border border-[#86A8CF]/25 shadow-xl">
          <span className="text-xs font-mono text-[#E1CBD7]/70 uppercase">Average Organization Score</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-3xl font-black font-mono text-[#86A8CF]">87.4%</span>
            <span className="text-xs text-[#86A8CF] font-bold flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +5.2% this month
            </span>
          </div>
          <p className="text-[11px] text-[#E1CBD7]/70 mt-2">125 content assets audited across 5 departments.</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#26425A]/60 border border-[#86A8CF]/25 shadow-xl">
          <span className="text-xs font-mono text-[#E1CBD7]/70 uppercase">Unsupported Claims Prevented</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-3xl font-black font-mono text-[#C38EB4]">48 Claims</span>
            <span className="text-xs text-[#C38EB4] font-semibold">Caught Pre-Publication</span>
          </div>
          <p className="text-[11px] text-[#E1CBD7]/70 mt-2">Zero regulatory or compliance escalation incidents.</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#26425A]/60 border border-[#86A8CF]/25 shadow-xl">
          <span className="text-xs font-mono text-[#E1CBD7]/70 uppercase">Ambiguous Guidelines Flagged</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-3xl font-black font-mono text-[#E1CBD7]">2 Rules</span>
            <span className="text-xs text-[#E1CBD7]/70 font-semibold">Action Required</span>
          </div>
          <p className="text-[11px] text-[#E1CBD7]/70 mt-2">High manager override rates signal unclear policy wording.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Repeated Violations Breakdown (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-[#26425A]/60 border border-[#86A8CF]/25 shadow-xl space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-[#C38EB4]" />
                <span>Most Frequent Policy Violations</span>
              </h3>
              <p className="text-xs text-[#E1CBD7]/60 mt-0.5">
                Breakdown of issues caught by deterministic filters and model inference.
              </p>
            </div>

            <div className="space-y-3 pt-1">
              {frequentViolations.map((v, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white font-medium">{v.name}</span>
                    <span className="font-mono text-[#E1CBD7]">{v.count} occurrences ({v.percentage}%)</span>
                  </div>
                  <div className="w-full h-2 bg-[#07111C] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${v.percentage}%`, backgroundColor: v.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Unclear Guideline Ambiguity Detector (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-[#26425A]/60 border border-[#86A8CF]/25 shadow-xl space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <AlertOctagon className="w-4 h-4 text-[#86A8CF]" />
                <span>Guideline Ambiguity Discovery</span>
              </h3>
              <p className="text-xs text-[#E1CBD7]/60 mt-0.5">
                Rules with unusually high creator/manager overrides—showing where brand rules need updating.
              </p>
            </div>

            <div className="space-y-3">
              {ambiguousGuidelines.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#07111C] border border-[#26425A] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{item.rule}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#C38EB4]/30 text-[#C38EB4] border border-[#C38EB4]/50">
                      {item.overrideRate} Override Rate
                    </span>
                  </div>
                  <p className="text-xs text-[#E1CBD7]/80 bg-[#0B1B3D] p-2.5 rounded-lg border-l-2 border-[#86A8CF]">
                    <strong className="text-[#86A8CF]">Automated Recommendation:</strong> {item.aiRecommendation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Department Compliance Leaderboard */}
      <div className="p-5 rounded-2xl bg-[#26425A]/60 border border-[#86A8CF]/25 shadow-xl space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Users className="w-4 h-4 text-[#86A8CF]" />
            <span>Department & Agency Compliance Performance</span>
          </h3>
          <p className="text-xs text-[#E1CBD7]/60 mt-0.5">
            Identify teams that need additional training or updated guideline toolkits.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-[#26425A] text-[#E1CBD7]/60 font-mono uppercase text-[10px]">
                <th className="pb-2">Department / Source</th>
                <th className="pb-2">Contributors</th>
                <th className="pb-2">Avg. Compliance Score</th>
                <th className="pb-2">Governance Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#26425A]/50">
              {departmentScores.map((d, i) => (
                <tr key={i} className="hover:bg-[#0B1B3D]/60 transition">
                  <td className="py-3 font-semibold text-white">{d.dept}</td>
                  <td className="py-3 text-[#E1CBD7]/70">{d.authorCount} creators</td>
                  <td className="py-3 font-mono font-bold text-[#86A8CF]">{d.score}/100</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      d.score >= 90
                        ? 'bg-[#86A8CF]/20 text-[#86A8CF]'
                        : d.score >= 75
                        ? 'bg-[#E1CBD7]/20 text-[#E1CBD7]'
                        : 'bg-[#C38EB4]/20 text-[#C38EB4]'
                    }`}>
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
