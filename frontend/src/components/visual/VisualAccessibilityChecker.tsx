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
  const [fgColor, setFgColor] = useState('#E1CBD7');
  const [bgColor, setBgColor] = useState('#0B1B3D');
  const [altTextInput, setAltTextInput] = useState('Inkloom AI brand governance dashboard preview with real-time diagnostic findings and WCAG compliance analytics.');
  
  // Image Upload & Canvas Extraction State
  const [uploadedImageSrc, setUploadedImageSrc] = useState<string | null>(null);
  const [uploadedImageName, setUploadedImageName] = useState<string>('brand_banner_hero.png');
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [imageAuditResult, setImageAuditResult] = useState<ImageAuditResult | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgElementRef = useRef<HTMLImageElement>(null);

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

  // Generate a Default Procedural Brand Image with the new Palette
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Draw background gradient using the new brand palette
      const grad = ctx.createLinearGradient(0, 0, 400, 200);
      grad.addColorStop(0, '#0B1B3D');
      grad.addColorStop(0.5, '#26425A');
      grad.addColorStop(1, '#86A8CF');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 400, 200);

      // Draw brand accent shapes in Dusty Orchid & Pale Blush
      ctx.fillStyle = '#E1CBD7';
      ctx.beginPath();
      ctx.arc(320, 60, 45, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#C38EB4';
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
      <div className="bg-[#0B1B3D] p-4 rounded-xl border border-[#26425A] flex flex-wrap items-center justify-between gap-4 shadow-md">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Layers className="w-4 h-4 text-[#86A8CF]" />
            <span>Multimodal Visual Consistency & WCAG 2.1 Accessibility Suite</span>
          </h2>
          <p className="text-xs text-[#E1CBD7]/70 mt-0.5">
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
            className="px-3 py-1.5 rounded-lg bg-[#86A8CF] hover:bg-[#7297c0] text-[#0B1B3D] font-bold text-xs transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-[#0B1B3D]" />
            <span>Upload Image to Audit</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Official Brand Color Palette Registry & Extracted Image Colors (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Official Registry */}
          <div className="p-5 rounded-2xl bg-[#26425A]/60 border border-[#86A8CF]/25 shadow-xl space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#86A8CF]" />
                <span>Official Brand Tokens Registry</span>
              </h3>
              <p className="text-xs text-[#E1CBD7]/60 mt-0.5">
                The 5 immutable color tokens approved by brand governance.
              </p>
            </div>

            <div className="space-y-2">
              {OFFICIAL_BRAND_PALETTE.map(c => (
                <div
                  key={c.hex}
                  onClick={() => {
                    if (c.hex === '#0B1B3D' || c.hex === '#26425A') setBgColor(c.hex);
                    else setFgColor(c.hex);
                  }}
                  className="p-2.5 rounded-xl bg-[#0B1B3D] border border-[#26425A] hover:border-[#86A8CF]/50 cursor-pointer flex items-center justify-between transition group"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-7 h-7 rounded-lg shadow-sm border border-white/20 flex-shrink-0"
                      style={{ backgroundColor: c.hex }}
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-[#86A8CF] transition">{c.name}</h4>
                      <p className="text-[10px] text-[#E1CBD7]/60">{c.role}</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-[#86A8CF] font-bold">{c.hex}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-[#E1CBD7]/50 italic">
              Tip: Click any swatch to populate Foreground / Background in the WCAG calculator.
            </p>
          </div>

          {/* Real-time Extracted Canvas Palette Card */}
          <div className="p-5 rounded-2xl bg-[#26425A]/60 border border-[#86A8CF]/25 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Palette className="w-4 h-4 text-[#86A8CF]" />
                  <span>Multimodal Extracted Palette</span>
                </h3>
                <p className="text-xs text-[#E1CBD7]/60 mt-0.5">
                  Extracted via Canvas pixel histogram from {uploadedImageName}
                </p>
              </div>

              {imageAuditResult && (
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  imageAuditResult.brandAdherenceScore >= 80 
                    ? 'bg-[#86A8CF]/20 text-[#86A8CF] border border-[#86A8CF]/40' 
                    : 'bg-[#C38EB4]/20 text-[#C38EB4] border border-[#C38EB4]/40'
                }`}>
                  {imageAuditResult.brandAdherenceScore}% Match
                </span>
              )}
            </div>

            {uploadedImageSrc && (
              <div className="relative rounded-xl overflow-hidden border border-[#26425A] bg-[#07111C] max-h-44 flex items-center justify-center">
                <img
                  ref={imgElementRef}
                  src={uploadedImageSrc}
                  alt="Uploaded brand creative preview"
                  className="w-full h-auto max-h-44 object-contain"
                />
                {isAnalyzingImage && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-xs font-bold text-[#86A8CF] flex items-center space-x-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Sampling Pixels...</span>
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Extracted Swatches */}
            {imageAuditResult && (
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-mono uppercase text-[#E1CBD7]/70 block">
                  Dominant Colors in Graphic ({imageAuditResult.dominantColors.length})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {imageAuditResult.dominantColors.map((col, idx) => (
                    <div
                      key={idx}
                      onClick={() => setFgColor(col.hex)}
                      className="p-2 rounded-lg bg-[#0B1B3D] border border-[#26425A] hover:border-[#86A8CF]/40 cursor-pointer flex items-center justify-between text-xs transition"
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-5 h-5 rounded border border-white/20"
                          style={{ backgroundColor: col.hex }}
                        />
                        <span className="font-mono text-white text-[11px]">{col.hex}</span>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] block font-semibold ${
                          col.nearestBrandColor.isMatch ? 'text-[#86A8CF]' : 'text-[#C38EB4]'
                        }`}>
                          {col.nearestBrandColor.isMatch ? '✓ Brand' : '✗ Off-brand'}
                        </span>
                        <span className="text-[9px] text-[#E1CBD7]/50">{col.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                {imageAuditResult.warnings.length > 0 && (
                  <div className="p-2.5 rounded-lg bg-[#C38EB4]/15 border border-[#C38EB4]/40 text-[#E1CBD7] text-xs space-y-1">
                    {imageAuditResult.warnings.map((w, idx) => (
                      <p key={idx} className="flex items-start space-x-1 text-[11px]">
                        <AlertTriangle className="w-3.5 h-3.5 text-[#C38EB4] flex-shrink-0 mt-0.5" />
                        <span>{w}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

        {/* Right Column: WCAG Contrast & Alt-Text Tools (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* WCAG Contrast Ratio Calculator */}
          <div className="p-5 rounded-2xl bg-[#26425A]/60 border border-[#86A8CF]/25 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-[#86A8CF]" />
                  <span>WCAG 2.1 Contrast Ratio Inspector</span>
                </h3>
                <p className="text-xs text-[#E1CBD7]/60 mt-0.5">
                  Calculates relative luminance ratios to prevent illegible marketing designs.
                </p>
              </div>

              {/* Big Contrast Ratio Badge */}
              <div className="text-right">
                <span className="text-2xl font-black font-mono text-[#86A8CF]">{contrastRatio}:1</span>
                <span className="text-[10px] text-[#E1CBD7]/60 uppercase block">Ratio</span>
              </div>
            </div>

            {/* Inputs & Live Color Preview Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono text-[#E1CBD7]/70 block mb-1 uppercase">Foreground Color</label>
                <div className="flex items-center space-x-2 bg-[#0B1B3D] border border-[#86A8CF]/30 rounded-xl p-2">
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
                <label className="text-xs font-mono text-[#E1CBD7]/70 block mb-1 uppercase">Background Color</label>
                <div className="flex items-center space-x-2 bg-[#0B1B3D] border border-[#86A8CF]/30 rounded-xl p-2">
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
              <p className="text-xs mt-1">This text simulates 14px regular body copy rendered with your selected color pairing.</p>
            </div>

            {/* Compliance Results */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <div className={`p-2.5 rounded-lg border text-center ${
                passesNormalAA ? 'bg-[#86A8CF]/15 border-[#86A8CF]/40 text-[#86A8CF]' : 'bg-[#C38EB4]/15 border-[#C38EB4]/40 text-[#C38EB4]'
              }`}>
                <span className="text-[10px] font-mono block">Normal Text (AA)</span>
                <span className="text-xs font-bold">{passesNormalAA ? '✓ Pass (≥4.5:1)' : '✗ Fail'}</span>
              </div>

              <div className={`p-2.5 rounded-lg border text-center ${
                passesLargeAA ? 'bg-[#86A8CF]/15 border-[#86A8CF]/40 text-[#86A8CF]' : 'bg-[#C38EB4]/15 border-[#C38EB4]/40 text-[#C38EB4]'
              }`}>
                <span className="text-[10px] font-mono block">Large Text (AA)</span>
                <span className="text-xs font-bold">{passesLargeAA ? '✓ Pass (≥3.0:1)' : '✗ Fail'}</span>
              </div>

              <div className={`p-2.5 rounded-lg border text-center ${
                passesAAA ? 'bg-[#86A8CF]/15 border-[#86A8CF]/40 text-[#86A8CF]' : 'bg-[#0B1B3D] border-[#26425A] text-[#E1CBD7]/60'
              }`}>
                <span className="text-[10px] font-mono block">Enhanced (AAA)</span>
                <span className="text-xs font-bold">{passesAAA ? '✓ Pass (≥7.0:1)' : 'Optional'}</span>
              </div>
            </div>
          </div>

          {/* Alt-Text Accessibility Checker */}
          <div className="p-5 rounded-2xl bg-[#26425A]/60 border border-[#86A8CF]/25 shadow-xl space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <ImageIcon className="w-4 h-4 text-[#86A8CF]" />
                <span>Screen-Reader Alt-Text Diagnostic (WCAG 1.1)</span>
              </h3>
              <p className="text-xs text-[#E1CBD7]/60 mt-0.5">
                Ensures visually impaired users receive informative descriptions rather than redundant placeholders.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#0B1B3D] border border-[#26425A] flex items-center justify-between">
              <span className="text-xs text-white font-mono truncate max-w-xs">{uploadedImageName}</span>
              <span className="text-[11px] font-mono text-[#86A8CF] bg-[#86A8CF]/10 px-2 py-0.5 rounded border border-[#86A8CF]/30">
                Active Graphic
              </span>
            </div>

            <div>
              <label className="text-xs font-mono text-[#E1CBD7]/70 block mb-1 uppercase">Alt-Text Description</label>
              <textarea
                rows={2}
                value={altTextInput}
                onChange={(e) => setAltTextInput(e.target.value)}
                placeholder="Provide a descriptive, objective summary of the visual content..."
                className="w-full text-xs bg-[#07111C] border border-[#86A8CF]/30 rounded-xl p-3 text-white focus:outline-none focus:border-[#86A8CF]"
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                {isAltTextValid ? (
                  <span className="text-[#86A8CF] font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Alt-Text Complies with WCAG 2.1 Non-Text Content Standard</span>
                  </span>
                ) : (
                  <span className="text-[#C38EB4] font-bold flex items-center space-x-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Warning: Alt-text is under 20 chars or starts with generic prefixes</span>
                  </span>
                )}
              </div>
              <span className="font-mono text-[#E1CBD7]/50">{altTextInput.length} chars</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
