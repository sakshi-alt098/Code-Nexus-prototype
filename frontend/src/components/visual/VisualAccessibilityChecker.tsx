import React, { useState, useRef, useEffect } from 'react';
import { OFFICIAL_BRAND_PALETTE } from '../../data/mockGuidelines';
import { extractDominantColorsFromImage, ImageAuditResult } from '../../services/imageColorExtractor';
import { 
  Layers, 
  Eye, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Image as ImageIcon, 
  Upload, 
  RefreshCw,
  Palette
} from 'lucide-react';

export const VisualAccessibilityChecker: React.FC = () => {
  const [fgColor, setFgColor] = useState('#EDE9FE');
  const [bgColor, setBgColor] = useState('#0A0912');
  const [altTextInput, setAltTextInput] = useState('Inkloom AI brand governance dashboard preview with real-time diagnostic findings and WCAG compliance analytics.');
  
  // Image Upload & Canvas Extraction State
  const [uploadedImageSrc, setUploadedImageSrc] = useState<string | null>(null);
  const [uploadedImageName, setUploadedImageName] = useState<string>('brand_banner_hero.png');
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [imageAuditResult, setImageAuditResult] = useState<ImageAuditResult | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Relative luminance calculation for WCAG 2.1
  const getLuminance = (hex: string): number => {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
    const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
    const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

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

  const isAltTextValid = altTextInput.trim().length >= 20 && !/^(image of|picture of|photo of|graphic of)/i.test(altTextInput.trim());

  // Handle Local File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedImageName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setUploadedImageSrc(src);
      analyzeLoadedImage(src);
    };
    reader.readAsDataURL(file);
  };

  const analyzeLoadedImage = (src: string) => {
    setIsAnalyzingImage(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const result = extractDominantColorsFromImage(img, 5);
      setImageAuditResult(result);
      setIsAnalyzingImage(false);
      if (result.dominantColors.length >= 2) {
        setBgColor(result.dominantColors[0].hex);
        setFgColor(result.dominantColors[1].hex);
      }
    };
    img.src = src;
  };

  // Generate a Default Procedural Brand Image with Lavender Black Palette
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Draw background gradient using Lavender Black
      const grad = ctx.createLinearGradient(0, 0, 400, 200);
      grad.addColorStop(0, '#0A0912');
      grad.addColorStop(0.5, '#151324');
      grad.addColorStop(1, '#B69DF8');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 400, 200);

      // Draw brand accent shapes
      ctx.fillStyle = '#EDE9FE';
      ctx.beginPath();
      ctx.arc(320, 60, 45, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#E879F9';
      ctx.fillRect(40, 140, 80, 25);

      // Add logo watermark
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('INKLOOM AI BRAND', 40, 60);

      const dataUrl = canvas.toDataURL();
      setUploadedImageSrc(dataUrl);
      analyzeLoadedImage(dataUrl);
    }
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Visual Header */}
      <div className="bg-[#151324] p-4 rounded-2xl border border-[#2E2A4A] flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Layers className="w-4 h-4 text-[#B69DF8]" />
            <span>Visual Consistency & WCAG 2.1 Accessibility Suite</span>
          </h2>
          <p className="text-xs text-[#EDE9FE]/70 mt-0.5">
            Extract dominant image palette tokens, compute WCAG 2.1 AA/AAA contrast ratios, and validate screen-reader alt text.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 rounded-xl bg-[#B69DF8] hover:bg-[#a688f7] text-[#0A0912] font-bold text-xs transition flex items-center space-x-1.5 shadow-[0_0_15px_rgba(182,157,248,0.4)] cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-[#0A0912]" />
            <span>Upload Image to Audit</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Official Brand Color Palette Registry & Extracted Image Colors (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Official Registry */}
          <div className="p-5 rounded-2xl bg-[#151324] border border-[#2E2A4A] shadow-xl space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#B69DF8]" />
                <span>Official Brand Tokens Registry</span>
              </h3>
              <p className="text-xs text-[#EDE9FE]/60 mt-0.5">
                The 5 immutable color tokens approved by brand governance.
              </p>
            </div>

            <div className="space-y-2">
              {OFFICIAL_BRAND_PALETTE.map(c => (
                <div
                  key={c.hex}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#0A0912] border border-[#2E2A4A] text-xs"
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className="w-5 h-5 rounded-md border border-white/20 shadow-sm"
                      style={{ backgroundColor: c.hex }}
                    />
                    <div>
                      <span className="font-semibold text-white block">{c.name}</span>
                      <span className="text-[10px] text-[#EDE9FE]/60">{c.role}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <code className="font-mono text-[#B69DF8] text-[11px] bg-[#151324] px-1.5 py-0.5 rounded border border-[#2E2A4A]">
                      {c.hex}
                    </code>
                    <button
                      onClick={() => setBgColor(c.hex)}
                      className="px-2 py-0.5 rounded bg-[#151324] text-[10px] text-[#EDE9FE] hover:text-[#B69DF8] border border-[#2E2A4A] cursor-pointer"
                      title="Set as Background"
                    >
                      Bg
                    </button>
                    <button
                      onClick={() => setFgColor(c.hex)}
                      className="px-2 py-0.5 rounded bg-[#151324] text-[10px] text-[#EDE9FE] hover:text-[#B69DF8] border border-[#2E2A4A] cursor-pointer"
                      title="Set as Foreground"
                    >
                      Fg
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Extracted Colors from Image */}
          <div className="p-5 rounded-2xl bg-[#151324] border border-[#2E2A4A] shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Palette className="w-4 h-4 text-[#B69DF8]" />
                  <span>Image Palette Extraction</span>
                </h3>
                <p className="text-xs text-[#EDE9FE]/60 mt-0.5">
                  Extracted via Canvas pixel analysis.
                </p>
              </div>
              {isAnalyzingImage && <RefreshCw className="w-4 h-4 text-[#B69DF8] animate-spin" />}
            </div>

            {uploadedImageSrc && (
              <div className="relative rounded-xl overflow-hidden border border-[#2E2A4A] max-h-36 bg-[#0A0912]">
                <img
                  src={uploadedImageSrc}
                  alt={uploadedImageName}
                  className="w-full h-36 object-cover"
                />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-[#0A0912]/80 backdrop-blur-md text-[10px] font-mono text-white">
                  {uploadedImageName}
                </div>
              </div>
            )}

            {imageAuditResult && (
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-[#EDE9FE]/70 block">
                  Dominant Swatches (Click to test WCAG contrast):
                </span>
                <div className="grid grid-cols-5 gap-2">
                  {imageAuditResult.dominantColors.map((swatch, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setBgColor(swatch.hex);
                      }}
                      className="group flex flex-col items-center p-2 rounded-xl bg-[#0A0912] border border-[#2E2A4A] hover:border-[#B69DF8] transition cursor-pointer"
                      title={`Click to set ${swatch.hex} as background`}
                    >
                      <div
                        className="w-7 h-7 rounded-lg border border-white/20 mb-1 shadow-sm"
                        style={{ backgroundColor: swatch.hex }}
                      />
                      <span className="text-[9px] font-mono text-[#EDE9FE]/70 group-hover:text-white">
                        {swatch.hex}
                      </span>
                      <span className="text-[9px] text-[#EDE9FE]/40">{swatch.percentage}%</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: WCAG 2.1 Contrast Simulator & Alt-Text Linter (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Contrast Simulator */}
          <div className="p-6 rounded-2xl bg-[#151324] border border-[#2E2A4A] shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#2E2A4A]">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-[#B69DF8]" />
                  <span>WCAG 2.1 Contrast Simulator</span>
                </h3>
                <p className="text-xs text-[#EDE9FE]/70 mt-0.5">
                  Real-time ratio analysis against WCAG 2.1 AA and AAA standards.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black font-mono text-white">{contrastRatio}:1</span>
              </div>
            </div>

            {/* Live Visual Preview Card */}
            <div
              className="p-6 rounded-2xl border transition-all shadow-inner"
              style={{ backgroundColor: bgColor, borderColor: fgColor + '40' }}
            >
              <h4
                className="text-lg font-bold transition-all"
                style={{ color: fgColor }}
              >
                Inkloom AI Brand Headline Preview
              </h4>
              <p
                className="text-xs mt-2 leading-relaxed font-sans transition-all"
                style={{ color: fgColor }}
              >
                Governed brand typography ensures consistent readability across diverse devices, light conditions, and visual impairments.
              </p>
              <div className="mt-4 flex items-center space-x-2">
                <span
                  className="px-3 py-1 rounded-lg text-xs font-bold shadow-sm"
                  style={{ backgroundColor: fgColor, color: bgColor }}
                >
                  Primary CTA
                </span>
                <span
                  className="text-xs font-mono px-2 py-1 rounded"
                  style={{ color: fgColor }}
                >
                  Bg: {bgColor} • Fg: {fgColor}
                </span>
              </div>
            </div>

            {/* Color Input Controls */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-[#0A0912] border border-[#2E2A4A] space-y-1.5">
                <label className="text-[11px] font-mono text-[#EDE9FE]/70 uppercase block">Foreground / Text</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-7 h-7 rounded border border-white/20 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="flex-1 text-xs font-mono bg-transparent text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0A0912] border border-[#2E2A4A] space-y-1.5">
                <label className="text-[11px] font-mono text-[#EDE9FE]/70 uppercase block">Background / Canvas</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-7 h-7 rounded border border-white/20 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="flex-1 text-xs font-mono bg-transparent text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Compliance Badges */}
            <div className="grid grid-cols-3 gap-3">
              <div className={`p-3 rounded-xl border text-center ${
                passesNormalAA
                  ? 'bg-[#B69DF8]/15 border-[#B69DF8]/40 text-[#B69DF8]'
                  : 'bg-[#E879F9]/15 border-[#E879F9]/40 text-[#E879F9]'
              }`}>
                <div className="text-xs font-bold">WCAG AA Normal</div>
                <div className="text-[11px] font-mono mt-0.5">{passesNormalAA ? 'PASS (≥ 4.5:1)' : 'FAIL (< 4.5:1)'}</div>
              </div>

              <div className={`p-3 rounded-xl border text-center ${
                passesLargeAA
                  ? 'bg-[#B69DF8]/15 border-[#B69DF8]/40 text-[#B69DF8]'
                  : 'bg-[#E879F9]/15 border-[#E879F9]/40 text-[#E879F9]'
              }`}>
                <div className="text-xs font-bold">WCAG AA Large</div>
                <div className="text-[11px] font-mono mt-0.5">{passesLargeAA ? 'PASS (≥ 3.0:1)' : 'FAIL (< 3.0:1)'}</div>
              </div>

              <div className={`p-3 rounded-xl border text-center ${
                passesAAA
                  ? 'bg-[#B69DF8]/15 border-[#B69DF8]/40 text-[#B69DF8]'
                  : 'bg-[#E879F9]/15 border-[#E879F9]/40 text-[#E879F9]'
              }`}>
                <div className="text-xs font-bold">WCAG AAA Enhanced</div>
                <div className="text-[11px] font-mono mt-0.5">{passesAAA ? 'PASS (≥ 7.0:1)' : 'FAIL (< 7.0:1)'}</div>
              </div>
            </div>
          </div>

          {/* Alt-Text Linter */}
          <div className="p-6 rounded-2xl bg-[#151324] border border-[#2E2A4A] shadow-xl space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <ImageIcon className="w-4 h-4 text-[#B69DF8]" />
                <span>Screen-Reader Alt-Text Linter</span>
              </h3>
              <p className="text-xs text-[#EDE9FE]/70 mt-0.5">
                Ensures descriptions are meaningful, avoid redundant prefixes ("image of..."), and satisfy accessibility requirements.
              </p>
            </div>

            <div>
              <textarea
                value={altTextInput}
                onChange={(e) => setAltTextInput(e.target.value)}
                rows={3}
                placeholder="Enter image description for screen readers..."
                className="w-full text-xs font-mono bg-[#0A0912] border border-[#2E2A4A] rounded-xl p-3 text-white focus:outline-none focus:border-[#B69DF8] leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                {isAltTextValid ? (
                  <span className="flex items-center space-x-1 text-[#B69DF8] font-bold">
                    <CheckCircle2 className="w-4 h-4 text-[#B69DF8]" />
                    <span>Compliant Alt Text ({altTextInput.length} chars)</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-1 text-[#E879F9] font-bold">
                    <AlertTriangle className="w-4 h-4 text-[#E879F9]" />
                    <span>Non-Compliant (Avoid "image of..." and provide descriptive detail)</span>
                  </span>
                )}
              </div>
              <span className="text-[#EDE9FE]/50 font-mono text-[11px]">WCAG 1.1.1 Non-Text Content</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
