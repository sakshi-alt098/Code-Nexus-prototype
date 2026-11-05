import React, { useState } from 'react';
import { BrandGuidelineRule } from '../../types';
import { MOCK_GUIDELINE_RULES } from '../../data/mockGuidelines';
import { Sparkles, Plus, Download, AlertCircle, BookOpen, Check } from 'lucide-react';

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
      <div className="bg-[#00272B] p-4 rounded-xl border border-[#024950] flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#0FA4AF]" />
            <span>Brand Knowledge Base & Governance Rules Vault</span>
          </h2>
          <p className="text-xs text-[#AFDDE5]/60 mt-0.5">
            Single source of truth. The deterministic engine and GPT API are grounded against these rules.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportJSON}
            className="px-3.5 py-2 rounded-xl bg-[#002225] hover:bg-[#003135] text-xs font-semibold text-[#AFDDE5] border border-[#0FA4AF]/30 transition flex items-center space-x-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-[#0FA4AF]" />
            <span>Export Brand Book (JSON)</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-[#0FA4AF] hover:bg-[#0c8e98] text-[#003135] text-xs font-bold transition flex items-center space-x-1.5 shadow-[0_0_15px_rgba(15,164,175,0.3)]"
          >
            <Plus className="w-4 h-4 text-[#003135]" />
            <span>Add Brand Rule</span>
          </button>
        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rules.map(rule => (
          <div
            key={rule.id}
            className="p-5 rounded-2xl bg-[#024950]/50 border border-[#0FA4AF]/20 hover:border-[#0FA4AF]/50 transition shadow-lg space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-[#0FA4AF]/20 text-[#0FA4AF] font-mono font-bold text-xs">
                  {rule.sectionCode}
                </span>
                <span className="text-[11px] font-mono text-[#AFDDE5]/60 uppercase">{rule.category}</span>
              </div>

              {rule.isAmbiguousWarning && (
                <span className="px-2 py-0.5 rounded-full bg-[#964734]/30 text-[#AFDDE5] border border-[#964734]/60 text-[10px] font-semibold flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3 text-[#964734]" />
                  <span>Ambiguity Flag ({rule.overrideCount} overrides)</span>
                </span>
              )}
            </div>

            <div>
              <h3 className="text-sm font-bold text-white">{rule.ruleName}</h3>
              <p className="text-xs text-[#AFDDE5]/80 mt-1 leading-relaxed">{rule.description}</p>
            </div>

            {(rule.bannedExample || rule.approvedAlternative) && (
              <div className="pt-2 border-t border-[#024950] space-y-1.5 font-mono text-[11px]">
                {rule.bannedExample && (
                  <div className="text-[#964734] flex items-start space-x-1.5 bg-[#002225] p-2 rounded">
                    <span className="font-bold">✗ Banned:</span>
                    <span>"{rule.bannedExample}"</span>
                  </div>
                )}
                {rule.approvedAlternative && (
                  <div className="text-[#0FA4AF] flex items-start space-x-1.5 bg-[#002225] p-2 rounded">
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
          <div className="w-full max-w-lg rounded-2xl bg-[#003135] border border-[#0FA4AF]/40 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Add New Brand Guideline Rule</h3>
            <form onSubmit={handleAddRule} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-[#AFDDE5]/70 block mb-1">Section Code</label>
                  <input
                    type="text"
                    required
                    value={newRule.sectionCode}
                    onChange={(e) => setNewRule({ ...newRule, sectionCode: e.target.value })}
                    className="w-full text-xs bg-[#002225] border border-[#0FA4AF]/30 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-[#AFDDE5]/70 block mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={newRule.category}
                    onChange={(e) => setNewRule({ ...newRule, category: e.target.value })}
                    className="w-full text-xs bg-[#002225] border border-[#0FA4AF]/30 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-[#AFDDE5]/70 block mb-1">Rule Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unverified SLA Metrics"
                  value={newRule.ruleName}
                  onChange={(e) => setNewRule({ ...newRule, ruleName: e.target.value })}
                  className="w-full text-xs bg-[#002225] border border-[#0FA4AF]/30 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[#AFDDE5]/70 block mb-1">Guideline Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Explain why this rule exists and how to comply..."
                  value={newRule.description}
                  onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                  className="w-full text-xs bg-[#002225] border border-[#0FA4AF]/30 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[#AFDDE5]/70 block mb-1">Banned Phrasing Example</label>
                <input
                  type="text"
                  placeholder="e.g. 100% uptime guaranteed"
                  value={newRule.bannedExample}
                  onChange={(e) => setNewRule({ ...newRule, bannedExample: e.target.value })}
                  className="w-full text-xs bg-[#002225] border border-[#0FA4AF]/30 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[#AFDDE5]/70 block mb-1">Approved Alternative Example</label>
                <input
                  type="text"
                  placeholder="e.g. 99.9% target SLA availability"
                  value={newRule.approvedAlternative}
                  onChange={(e) => setNewRule({ ...newRule, approvedAlternative: e.target.value })}
                  className="w-full text-xs bg-[#002225] border border-[#0FA4AF]/30 rounded-lg p-2 text-white"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#024950]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#024950] text-xs text-[#AFDDE5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#0FA4AF] text-[#003135] font-bold text-xs"
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
