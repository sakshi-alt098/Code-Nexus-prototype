import React from 'react';
import { BarChart3, AlertOctagon, TrendingUp, Users, ShieldAlert, Sparkles } from 'lucide-react';

export const GovernanceAnalytics: React.FC = () => {
  const frequentViolations = [
    { name: 'Unsupported Superlative Claims (§4.1)', count: 48, percentage: 38, color: '#B69DF8' },
    { name: 'Corporate Buzzwords & Jargon (§3.2)', count: 32, percentage: 26, color: '#C38EB4' },
    { name: 'Derogatory Commercial Pricing (§2.3)', count: 22, percentage: 18, color: '#EDE9FE' },
    { name: 'WCAG 2.1 Contrast Failures (§6.1)', count: 15, percentage: 12, color: '#E879F9' },
    { name: 'Absolute Immunity Guarantees (§1.4)', count: 8, percentage: 6, color: '#B69DF8' }
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
      aiRecommendation: 'Rule is too restrictive regarding industry terms like "disruption". Specify allowed technical contexts.'
    },
    {
      rule: '§1.4: Absolute Risk Elimination Guarantees',
      overrideRate: '54%',
      dismissals: 19,
      aiRecommendation: 'Marketing teams struggle with phrasing. Provide pre-approved disclaimer templates.'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-[#151324] p-4 rounded-2xl border border-[#2E2A4A] flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-[#B69DF8]" />
            <span>Brand Governance Insights & Guideline Health</span>
          </h2>
          <p className="text-xs text-[#EDE9FE]/70 mt-0.5">
            Real-time analytics revealing repeated mistakes, agency compliance gaps, and guidelines that need rewording.
          </p>
        </div>
      </div>

      {/* Top 3 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#151324] border border-[#2E2A4A] shadow-xl">
          <span className="text-xs font-mono text-[#EDE9FE]/70 uppercase">Average Organization Score</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-3xl font-black font-mono text-[#B69DF8]">87.4%</span>
            <span className="text-xs text-[#B69DF8] font-bold flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +5.2% this month
            </span>
          </div>
          <p className="text-[11px] text-[#EDE9FE]/70 mt-2">125 content assets audited across 5 departments.</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#151324] border border-[#2E2A4A] shadow-xl">
          <span className="text-xs font-mono text-[#EDE9FE]/70 uppercase">Unsupported Claims Prevented</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-3xl font-black font-mono text-[#E879F9]">48 Claims</span>
            <span className="text-xs text-[#E879F9] font-semibold">Pre-Publication</span>
          </div>
          <p className="text-[11px] text-[#EDE9FE]/70 mt-2">Zero regulatory or compliance escalation incidents.</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#151324] border border-[#2E2A4A] shadow-xl">
          <span className="text-xs font-mono text-[#EDE9FE]/70 uppercase">Ambiguous Guidelines Flagged</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-3xl font-black font-mono text-[#EDE9FE]">2 Rules</span>
            <span className="text-xs text-[#EDE9FE]/70 font-semibold">Action Recommended</span>
          </div>
          <p className="text-[11px] text-[#EDE9FE]/70 mt-2">High creator override rates indicate guidelines need clearer phrasing.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Repeated Mistake Analysis */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-[#151324] border border-[#2E2A4A] shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#2E2A4A]">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <AlertOctagon className="w-4 h-4 text-[#E879F9]" />
              <span>Top Recurring Violations</span>
            </h3>
            <span className="text-xs font-mono text-[#EDE9FE]/60">Past 30 Days</span>
          </div>

          <div className="space-y-3">
            {frequentViolations.map((v, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">{v.name}</span>
                  <span className="font-mono text-[#EDE9FE]/70">{v.count} violations ({v.percentage}%)</span>
                </div>
                <div className="w-full bg-[#0A0912] rounded-full h-2 overflow-hidden border border-[#2E2A4A]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${v.percentage}%`, backgroundColor: v.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Departmental Consistency Breakdown */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-[#151324] border border-[#2E2A4A] shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#2E2A4A]">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Users className="w-4 h-4 text-[#B69DF8]" />
              <span>Departmental Brand Consistency</span>
            </h3>
            <span className="text-xs font-mono text-[#EDE9FE]/60">5 Units Audited</span>
          </div>

          <div className="space-y-3">
            {departmentScores.map((d, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-[#0A0912] border border-[#2E2A4A] flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-bold text-white">{d.dept}</h4>
                  <span className="text-[10px] text-[#EDE9FE]/60">{d.authorCount} Active Contributors</span>
                </div>
                
                <div className="text-right">
                  <span className="font-mono font-bold text-sm text-[#B69DF8]">{d.score}%</span>
                  <span className={`block text-[10px] font-mono ${
                    d.score >= 90 ? 'text-[#B69DF8]' : d.score >= 80 ? 'text-[#EDE9FE]' : 'text-[#E879F9]'
                  }`}>
                    {d.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom: Policy Health & Ambiguity Alerts */}
      <div className="p-6 rounded-2xl bg-[#151324] border border-[#2E2A4A] shadow-xl space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-[#E879F9]" />
            <span>Policy Health Engine • Ambiguous Guidelines Requiring Revision</span>
          </h3>
          <p className="text-xs text-[#EDE9FE]/70 mt-0.5">
            When creators repeatedly dismiss or override an AI recommendation, the governance engine flags the guideline for brand managers to clarify.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ambiguousGuidelines.map((g, i) => (
            <div key={i} className="p-4 rounded-xl bg-[#0A0912] border border-[#E879F9]/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">{g.rule}</span>
                <span className="px-2 py-0.5 rounded bg-[#E879F9]/20 text-[#E879F9] font-mono text-[10px] font-bold">
                  {g.overrideRate} Creator Override Rate
                </span>
              </div>
              <p className="text-xs text-[#EDE9FE]/80 leading-relaxed font-sans">
                {g.aiRecommendation}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
