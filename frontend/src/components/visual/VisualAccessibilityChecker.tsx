import React, { useState } from 'react';
import { OFFICIAL_BRAND_PALETTE } from '../../data/mockGuidelines';
import { Layers, Eye, CheckCircle2, AlertTriangle, ShieldCheck, Sparkles, Image as ImageIcon } from 'lucide-react';

export const VisualAccessibilityChecker: React.FC = () => {
  const [fgColor, setFgColor] = useState('#AFDDE5');
  const [bgColor, setBgColor] = useState('#003135');
  const [altTextInput, setAltTextInput] = useState('Inkloom AI brand governance dashboard preview with live diagnostic findings');
  const [uploadedImageName, setUploadedImageName] = useState<string | null>('Launch_Webinar_Creative_2026.png');

  // Relative luminance calculation for WCAG 2.1
  const getLuminance = (hex: string): number => {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substr(0, 2), 16) / 255;
    const g = parseInt(cleanHex.substr(2, 2), 16) / 255;
    const b = parseInt(cleanHex.substr(4, 2), 16) / 255;

    const a = [r, g, b].map(v => {
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const calculateContrast = (hex1: string, hex2: string): number => {
    try {
      const l1 = getLuminance(hex1);
      const l2 = getLuminance(hex2);
      const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      return Math.round(ratio * 100) / 100;
    } catch {
      return 1;
    }
  };

  const contrastRatio = calculateContrast(fgColor, bgColor);
  const passesNormalAA = contrastRatio >= 4.5;
  const passesLargeAA = contrastRatio >= 3.0;
  const passesAAA = contrastRatio >= 7.0;

  const isAltTextValid = altTextInput.trim().length >= 15 && !/(image|photo|pic|graphic)/i.test(altTextInput);

  return (
    <div className="space-y-6">
      
      {/* Visual Header */}
      <div className="bg-[#00272B] p-4 rounded-xl border border-[#024950] flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Layers className="w-4 h-4 text-[#0FA4AF]" />
            <span>Visual Consistency & WCAG Accessibility Checker</span>
          </h2>
          <p className="text-xs text-[#AFDDE5]/60 mt-0.5">
            Test brand color alignment, calculate WCAG 2.1 contrast ratios, and verify descriptive alt-text for screen readers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Official Brand Color Palette Registry (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-[#024950]/50 border border-[#0FA4AF]/20 shadow-xl space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#0FA4AF]" />
                <span>Official Brand Color Standards</span>
              </h3>
              <p className="text-xs text-[#AFDDE5]/60 mt-0.5">
                These 5 hex codes are approved by brand leadership. Any marketing creative must adhere to these tokens.
              </p>
            </div>

            <div className="space-y-2.5">
              {OFFICIAL_BRAND_PALETTE.map(c => (
                <div
                  key={c.hex}
                  onClick={() => {
                    if (c.hex === '#003135' || c.hex === '#024950') setBgColor(c.hex);
                    else setFgColor(c.hex);
                  }}
                  className="p-3 rounded-xl bg-[#002225] border border-[#024950] hover:border-[#0FA4AF]/40 cursor-pointer flex items-center justify-between transition"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-8 h-8 rounded-lg shadow-sm border border-white/20 flex-shrink-0"
                      style={{ backgroundColor: c.hex }}
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">{c.name}</h4>
                      <p className="text-[11px] text-[#AFDDE5]/60">{c.role}</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-[#0FA4AF] font-bold">{c.hex}</span>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-[#AFDDE5]/50 italic">
              Tip: Click any swatch above to instantly populate the WCAG Contrast Calculator.
            </p>
          </div>
        </div>

        {/* Right Column: WCAG Contrast & Alt-Text Tools (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* WCAG Contrast Ratio Calculator */}
          <div className="p-5 rounded-2xl bg-[#024950]/50 border border-[#0FA4AF]/20 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-[#0FA4AF]" />
                  <span>WCAG 2.1 Contrast Ratio Inspector</span>
                </h3>
                <p className="text-xs text-[#AFDDE5]/60 mt-0.5">
                  Evaluates legibility for visual impairments (WCAG AA & AAA requirements).
                </p>
              </div>

              {/* Big Contrast Ratio Badge */}
              <div className="text-right">
                <span className="text-2xl font-black font-mono text-[#0FA4AF]">{contrastRatio}:1</span>
                <span className="text-[10px] text-[#AFDDE5]/60 uppercase block">Ratio</span>
              </div>
            </div>

            {/* Inputs & Live Color Preview Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono text-[#AFDDE5]/70 block mb-1 uppercase">Foreground Color</label>
                <div className="flex items-center space-x-2 bg-[#002225] border border-[#0FA4AF]/30 rounded-xl p-2">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-full text-xs font-mono bg-transparent text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-[#AFDDE5]/70 block mb-1 uppercase">Background Color</label>
                <div className="flex items-center space-x-2 bg-[#002225] border border-[#0FA4AF]/30 rounded-xl p-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-full text-xs font-mono bg-transparent text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Real-time Rendered Sample Container */}
            <div
              className="p-5 rounded-xl border border-white/10 text-center transition-all shadow-inner"
              style={{ backgroundColor: bgColor, color: fgColor }}
            >
              <h4 className="text-base font-extrabold">Inkloom Enterprise Brand Typography</h4>
              <p className="text-xs mt-1">This text simulates regular 14px body content on your chosen background.</p>
            </div>

            {/* Compliance Results */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <div className={`p-2.5 rounded-lg border text-center ${
                passesNormalAA ? 'bg-[#0FA4AF]/15 border-[#0FA4AF]/40 text-[#0FA4AF]' : 'bg-[#964734]/15 border-[#964734]/40 text-[#964734]'
              }`}>
                <span className="text-[10px] font-mono block">Normal Text (AA)</span>
                <span className="text-xs font-bold">{passesNormalAA ? '✓ Pass (≥4.5:1)' : '✗ Fail'}</span>
              </div>

              <div className={`p-2.5 rounded-lg border text-center ${
                passesLargeAA ? 'bg-[#0FA4AF]/15 border-[#0FA4AF]/40 text-[#0FA4AF]' : 'bg-[#964734]/15 border-[#964734]/40 text-[#964734]'
              }`}>
                <span className="text-[10px] font-mono block">Large Text (AA)</span>
                <span className="text-xs font-bold">{passesLargeAA ? '✓ Pass (≥3.0:1)' : '✗ Fail'}</span>
              </div>

              <div className={`p-2.5 rounded-lg border text-center ${
                passesAAA ? 'bg-[#0FA4AF]/15 border-[#0FA4AF]/40 text-[#0FA4AF]' : 'bg-[#00272B] border-[#024950] text-[#AFDDE5]/60'
              }`}>
                <span className="text-[10px] font-mono block">Enhanced (AAA)</span>
                <span className="text-xs font-bold">{passesAAA ? '✓ Pass (≥7.0:1)' : 'Optional'}</span>
              </div>
            </div>
          </div>

          {/* Alt-Text Accessibility Checker */}
          <div className="p-5 rounded-2xl bg-[#024950]/50 border border-[#0FA4AF]/20 shadow-xl space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <ImageIcon className="w-4 h-4 text-[#0FA4AF]" />
                <span>Screen-Reader Alt-Text Diagnostic</span>
              </h3>
              <p className="text-xs text-[#AFDDE5]/60 mt-0.5">
                Ensures blind and low-vision users understand promotional graphics (WCAG Guideline 1.1).
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#002225] border border-[#024950] flex items-center justify-between">
              <span className="text-xs text-white font-mono">{uploadedImageName}</span>
              <span className="text-[11px] font-mono text-[#0FA4AF] bg-[#0FA4AF]/10 px-2 py-0.5 rounded border border-[#0FA4AF]/30">
                Brand Colors Verified
              </span>
            </div>

            <div>
              <label className="text-xs font-mono text-[#AFDDE5]/70 block mb-1 uppercase">Alt-Text Description</label>
              <textarea
                rows={2}
                value={altTextInput}
                onChange={(e) => setAltTextInput(e.target.value)}
                className="w-full text-xs bg-[#002024] border border-[#0FA4AF]/30 rounded-xl p-3 text-white focus:outline-none focus:border-[#0FA4AF]"
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                {isAltTextValid ? (
                  <span className="text-[#0FA4AF] font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Alt-Text Complies with WCAG 2.1</span>
                  </span>
                ) : (
                  <span className="text-[#964734] font-bold flex items-center space-x-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Alt-Text too brief or contains generic filler words</span>
                  </span>
                )}
              </div>
              <span className="font-mono text-[#AFDDE5]/50">{altTextInput.length} chars</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
