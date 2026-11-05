import React, { useState } from 'react';
import { BRAND_COLORS } from '../../config/colors';

interface StartingVideoIntroProps {
  onEnter?: () => void;
  showDismissButton?: boolean;
}

export const StartingVideoIntro: React.FC<StartingVideoIntroProps> = ({
  onEnter,
  showDismissButton = true
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const handleEnter = () => {
    setIsDismissed(true);
    if (onEnter) onEnter();
  };

  if (isDismissed) return null;

  return (
    <div className="relative w-full h-[460px] rounded-2xl overflow-hidden border border-brand-cyan/25 shadow-2xl bg-brand-petrol-deep flex flex-col justify-between">
      {/* Background Video */}
      <video
        autoPlay
        muted={isMuted}
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="/assets/intro-animation.mp4"
          type="video/mp4"
        />
        {/* Fallback to CDN if local asset is not yet loaded */}
        <source
          src="https://cdn.dribbble.com/userupload/22966989/file/original-17db4a9c646777730075eb37ab70cf0d.mp4"
          type="video/mp4"
        />
      </video>

      {/* Cinematic Tint Gradients with Team Colors */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-petrol-deep via-brand-petrol-deep/40 to-brand-petrol-deep/60 pointer-events-none" />
      <div className="absolute inset-0 bg-brand-petrol-surface/20 mix-blend-multiply pointer-events-none" />

      {/* Top Header Bar */}
      <div className="relative z-10 p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-brand-cyan flex items-center justify-center font-bold text-brand-petrol-deep text-sm shadow-[0_0_15px_rgba(15,164,175,0.5)]">
            IK
          </div>
          <span className="text-base font-bold tracking-tight text-brand-ice">Inkloom AI</span>
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30">
            Brand Governance
          </span>
        </div>

        {showDismissButton && (
          <button
            onClick={handleEnter}
            className="px-3.5 py-1.5 rounded-full bg-brand-petrol-deep/70 hover:bg-brand-petrol-deep border border-brand-ice/20 text-xs text-brand-ice backdrop-blur-md transition flex items-center space-x-1.5 shadow-sm"
          >
            <span>Skip Intro</span>
            <svg className="w-3.5 h-3.5 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Bottom Hero Pitch Overlay */}
      <div className="relative z-10 px-8 pb-8 max-w-xl">
        <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md bg-brand-petrol-surface/80 border border-brand-cyan/30 mb-3 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-ping" />
          <span className="text-[11px] font-mono font-medium text-brand-cyan tracking-wide uppercase">
            AI Compliance & Tone Verification
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
          Protect Brand Trust Before Publication.
        </h1>

        <p className="text-xs sm:text-sm text-brand-ice/80 mt-2 leading-relaxed">
          Intelligent pre-flight content reviews across all teams, agencies, and AI tools. Real-time tone checks, unsupported claim detection, and intent-preserving suggested fixes.
        </p>

        {/* Action Controls */}
        <div className="mt-5 flex items-center space-x-3">
          <button
            onClick={handleEnter}
            className="px-5 py-2.5 rounded-lg bg-brand-cyan hover:bg-brand-cyan-hover text-brand-petrol-deep font-semibold text-xs tracking-wide transition shadow-[0_0_20px_rgba(15,164,175,0.4)] flex items-center space-x-2"
          >
            <span>Enter Platform</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="px-3.5 py-2.5 rounded-lg bg-brand-petrol-surface/80 hover:bg-brand-petrol-surface border border-brand-cyan/30 text-xs text-brand-ice backdrop-blur-sm transition flex items-center space-x-1.5"
          >
            <span>{isMuted ? 'Muted' : 'Unmuted'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
