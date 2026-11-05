import React, { useState } from 'react';
import { BrandGuidelineRule } from '../../types';
import { MOCK_GUIDELINE_RULES } from '../../data/mockGuidelines';
import { Sparkles, Plus, Download, AlertCircle } from 'lucide-react';

export const KnowledgeBaseManager: React.FC = () => {
  const [rules, setRules] = useState<BrandGuidelineRule[]>(MOCK_GUIDELINE_RULES);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRule, setNewRule] = useState({
    category: 'Commercial Claims',
    sectionCode: '§4.5',
    ruleName: '',
    description: '',
    bannedExample: '',
    approvedAlternative: ''
  });

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRule.ruleName.trim()) return;

    const created: BrandGuidelineRule = {
      id: `rule-${Date.now()}`,
      category: newRule.category,
      sectionCode: newRule.sectionCode,
      ruleName: newRule.ruleName,
      description: newRule.description,
      bannedExample: newRule.bannedExample,
      approvedAlternative: newRule.approvedAlternative,
      overrideCount: 0
    };

    setRules([created, ...rules]);
    setShowAddModal(false);
    setNewRule({
      category: 'Commercial Claims',
      sectionCode: '§4.5',
      ruleName: '',
      description: '',
      bannedExample: '',
      approvedAlternative: ''
    });
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(rules, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "inkloom-brand-rules-v2.4.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-[#0B1B3D] p-4 rounded-xl border border-[#26425A] flex flex-wrap items-center justify-between gap-4 shadow-md">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#86A8CF]" />
            <span>Brand Knowledge Base & Governance Rules Vault</span>
          </h2>
          <p className="text-xs text-[#E1CBD7]/70 mt-0.5">
            Single source of truth. The deterministic engine and model pipeline are grounded against these rules.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportJSON}
            className="px-3.5 py-2 rounded-xl bg-[#26425A] hover:bg-[#32526e] text-xs font-semibold text-[#E1CBD7] border border-[#86A8CF]/30 transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#86A8CF]" />
            <span>Export Brand Book (JSON)</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-[#86A8CF] hover:bg-[#7297c0] text-[#0B1B3D] text-xs font-bold transition flex items-center space-x-1.5 shadow-[0_0_15px_rgba(134,168,207,0.3)] cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#0B1B3D]" />
            <span>Add Brand Rule</span>
          </button>
        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rules.map(rule => (
          <div
            key={rule.id}
            className="p-5 rounded-2xl bg-[#26425A]/60 border border-[#86A8CF]/25 hover:border-[#86A8CF]/50 transition shadow-lg space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-[#86A8CF]/20 text-[#86A8CF] font-mono font-bold text-xs">
                  {rule.sectionCode}
                </span>
                <span className="text-[11px] font-mono text-[#E1CBD7]/60 uppercase">{rule.category}</span>
              </div>

              {rule.isAmbiguousWarning && (
                <span className="px-2 py-0.5 rounded-full bg-[#C38EB4]/30 text-[#E1CBD7] border border-[#C38EB4]/60 text-[10px] font-semibold flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5 text-[#C38EB4]" />
                  <span>Ambiguity Flag ({rule.overrideCount} overrides)</span>
                </span>
              )}
            </div>

            <div>
              <h3 className="text-sm font-bold text-white">{rule.ruleName}</h3>
              <p className="text-xs text-[#E1CBD7]/80 mt-1 leading-relaxed">{rule.description}</p>
            </div>

            {(rule.bannedExample || rule.approvedAlternative) && (
              <div className="pt-2 border-t border-[#26425A] space-y-1.5 font-mono text-[11px]">
                {rule.bannedExample && (
                  <div className="text-[#C38EB4] flex items-start space-x-1.5 bg-[#07111C] p-2 rounded">
                    <span className="font-bold">✗ Banned:</span>
                    <span>"{rule.bannedExample}"</span>
                  </div>
                )}
                {rule.approvedAlternative && (
                  <div className="text-[#86A8CF] flex items-start space-x-1.5 bg-[#07111C] p-2 rounded">
                    <span className="font-bold">✓ Approved:</span>
                    <span>"{rule.approvedAlternative}"</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Rule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-[#0B1B3D] border border-[#86A8CF]/40 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Add New Brand Guideline Rule</h3>
            <form onSubmit={handleAddRule} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-[#E1CBD7]/70 block mb-1">Section Code</label>
                  <input
                    type="text"
                    required
                    value={newRule.sectionCode}
                    onChange={(e) => setNewRule({ ...newRule, sectionCode: e.target.value })}
                    className="w-full text-xs bg-[#07111C] border border-[#86A8CF]/30 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-[#E1CBD7]/70 block mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={newRule.category}
                    onChange={(e) => setNewRule({ ...newRule, category: e.target.value })}
                    className="w-full text-xs bg-[#07111C] border border-[#86A8CF]/30 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-[#E1CBD7]/70 block mb-1">Rule Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unverified SLA Metrics"
                  value={newRule.ruleName}
                  onChange={(e) => setNewRule({ ...newRule, ruleName: e.target.value })}
                  className="w-full text-xs bg-[#07111C] border border-[#86A8CF]/30 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[#E1CBD7]/70 block mb-1">Guideline Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Explain why this rule exists and how to comply..."
                  value={newRule.description}
                  onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                  className="w-full text-xs bg-[#07111C] border border-[#86A8CF]/30 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[#E1CBD7]/70 block mb-1">Banned Phrasing Example</label>
                <input
                  type="text"
                  placeholder="e.g. 100% uptime guaranteed"
                  value={newRule.bannedExample}
                  onChange={(e) => setNewRule({ ...newRule, bannedExample: e.target.value })}
                  className="w-full text-xs bg-[#07111C] border border-[#86A8CF]/30 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[#E1CBD7]/70 block mb-1">Approved Alternative Example</label>
                <input
                  type="text"
                  placeholder="e.g. 99.9% target SLA availability"
                  value={newRule.approvedAlternative}
                  onChange={(e) => setNewRule({ ...newRule, approvedAlternative: e.target.value })}
                  className="w-full text-xs bg-[#07111C] border border-[#86A8CF]/30 rounded-lg p-2 text-white"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#26425A]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#26425A] text-xs text-[#E1CBD7] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#86A8CF] text-[#0B1B3D] font-bold text-xs cursor-pointer"
                >
                  Save Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
