import React, { useState } from 'react';
import { BrandGuidelineRule } from '../../types';
import { MOCK_GUIDELINE_RULES } from '../../data/mockGuidelines';
import { Sparkles, Plus, Download, AlertCircle, BookOpen } from 'lucide-react';

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
    downloadAnchor.setAttribute("download", "inkloom-brand-rules.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-[#151324] p-4 rounded-2xl border border-[#2E2A4A] flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#B69DF8]" />
            <span>Brand Knowledge Base & Governance Rules Vault</span>
          </h2>
          <p className="text-xs text-[#EDE9FE]/70 mt-0.5">
            Single source of truth. The audit pipeline evaluates drafts against these configured guidelines.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportJSON}
            className="px-3.5 py-2 rounded-xl bg-[#0A0912] hover:bg-[#151324] text-xs font-semibold text-[#EDE9FE] border border-[#2E2A4A] transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#B69DF8]" />
            <span>Export Brand Book</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-xl bg-[#B69DF8] hover:bg-[#a688f7] text-xs font-bold text-[#0A0912] transition flex items-center space-x-1.5 shadow-[0_0_15px_rgba(182,157,248,0.4)] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#0A0912]" />
            <span>Add Guideline</span>
          </button>
        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rules.map(rule => (
          <div
            key={rule.id}
            className="p-5 rounded-2xl bg-[#151324] border border-[#2E2A4A] hover:border-[#B69DF8]/50 transition shadow-xl space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#B69DF8] uppercase tracking-wider block mb-1">
                  {rule.sectionCode} • {rule.category}
                </span>
                <h3 className="text-sm font-bold text-white">{rule.ruleName}</h3>
              </div>

              {rule.isAmbiguousWarning && (
                <span className="px-2 py-0.5 rounded-full bg-[#E879F9]/20 text-[#E879F9] text-[10px] font-mono flex items-center space-x-1 border border-[#E879F9]/40">
                  <AlertCircle className="w-3 h-3" />
                  <span>Ambiguity Warning</span>
                </span>
              )}
            </div>

            <p className="text-xs text-[#EDE9FE]/80 leading-relaxed font-sans">
              {rule.description}
            </p>

            <div className="space-y-1.5 pt-2 border-t border-[#2E2A4A] text-xs font-mono">
              <div className="p-2 rounded-lg bg-[#0A0912] border border-[#E879F9]/30 text-[#E879F9]">
                <strong className="text-[10px] uppercase text-[#E879F9]/70 block font-sans">Flagged Pattern:</strong>
                "{rule.bannedExample}"
              </div>
              <div className="p-2 rounded-lg bg-[#0A0912] border border-[#B69DF8]/30 text-[#B69DF8]">
                <strong className="text-[10px] uppercase text-[#B69DF8]/70 block font-sans">Approved Alternative:</strong>
                "{rule.approvedAlternative}"
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#0A0912]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-[#151324] border border-[#2E2A4A] rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Add New Brand Guideline</h3>
            
            <form onSubmit={handleAddRule} className="space-y-3">
              <div>
                <label className="text-xs font-mono text-[#EDE9FE]/70 block mb-1 uppercase">Rule Name</label>
                <input
                  type="text"
                  value={newRule.ruleName}
                  onChange={(e) => setNewRule({ ...newRule, ruleName: e.target.value })}
                  placeholder="e.g., Substantiation of ESG Claims"
                  required
                  className="w-full text-xs bg-[#0A0912] border border-[#2E2A4A] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#B69DF8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-[#EDE9FE]/70 block mb-1 uppercase">Category</label>
                  <select
                    value={newRule.category}
                    onChange={(e) => setNewRule({ ...newRule, category: e.target.value })}
                    className="w-full text-xs bg-[#0A0912] border border-[#2E2A4A] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#B69DF8]"
                  >
                    <option value="Commercial Claims">Commercial Claims</option>
                    <option value="Brand Tone & Positioning">Brand Tone & Positioning</option>
                    <option value="Legal & Privacy Safeguards">Legal & Privacy Safeguards</option>
                    <option value="Editorial Tone">Editorial Tone</option>
                    <option value="Visual & Accessibility">Visual & Accessibility</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-mono text-[#EDE9FE]/70 block mb-1 uppercase">Section Code</label>
                  <input
                    type="text"
                    value={newRule.sectionCode}
                    onChange={(e) => setNewRule({ ...newRule, sectionCode: e.target.value })}
                    className="w-full text-xs font-mono bg-[#0A0912] border border-[#2E2A4A] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#B69DF8]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-[#EDE9FE]/70 block mb-1 uppercase">Rule Description</label>
                <textarea
                  value={newRule.description}
                  onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                  rows={2}
                  placeholder="Detailed criteria when this rule triggers..."
                  required
                  className="w-full text-xs bg-[#0A0912] border border-[#2E2A4A] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#B69DF8]"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[#EDE9FE]/70 block mb-1 uppercase">Banned Example</label>
                <input
                  type="text"
                  value={newRule.bannedExample}
                  onChange={(e) => setNewRule({ ...newRule, bannedExample: e.target.value })}
                  placeholder="Example phrase that violates this rule..."
                  required
                  className="w-full text-xs bg-[#0A0912] border border-[#2E2A4A] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#B69DF8]"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[#EDE9FE]/70 block mb-1 uppercase">Approved Alternative</label>
                <input
                  type="text"
                  value={newRule.approvedAlternative}
                  onChange={(e) => setNewRule({ ...newRule, approvedAlternative: e.target.value })}
                  placeholder="Recommended compliant alternative..."
                  required
                  className="w-full text-xs bg-[#0A0912] border border-[#2E2A4A] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#B69DF8]"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#0A0912] hover:bg-[#2E2A4A]/50 text-xs text-[#EDE9FE] border border-[#2E2A4A] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#B69DF8] hover:bg-[#a688f7] text-xs font-bold text-[#0A0912] cursor-pointer shadow-sm"
                >
                  Save Guideline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
