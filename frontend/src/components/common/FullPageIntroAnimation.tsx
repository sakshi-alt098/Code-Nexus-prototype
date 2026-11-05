import React, { useState } from 'react';
import { ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react';

interface FullPageIntroAnimationProps {
  onEnter: () => void;
  showDismissButton?: boolean;
}

export const FullPageIntroAnimation: React.FC<FullPageIntroAnimationProps> = ({
  onEnter,
  showDismissButton = true
}) => {
  const [showLight, setShowLight] = useState(true);

  return (
    <div className="fixed inset-0 z-50 w-screen h-screen overflow-hidden bg-[#0B1B3D] select-none font-sans">
      
      {/* Scoped CSS for Keyframe Rotations & Stroke Animation */}
      <style>{`
        #intro-wrapper {
          width: 100%;
          height: 100vh;
          position: relative;
          overflow: hidden;
          background: #0B1B3D url('https://user-images.githubusercontent.com/26748614/112761068-a9015e80-8ff9-11eb-9574-58724ea6e397.jpg');
          background-size: cover;
          background-position: 50% 50%;
        }

        #intro-svg {
          display: block;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100vh;
        }

        .intro-rotate {
          transform-origin: 50% 230%;
          animation: introRotateAnim 4s cubic-bezier(.29,.45,.76,.55) infinite alternate;
        }

        @keyframes introRotateAnim {
          0% {
            transform: rotate(-27deg);
          }
          100% {
            transform: rotate(27deg);
          }
        }

        .wordsFill {
          fill: rgb(11, 27, 61);
        }

        .wordsStroke {
          fill: none;
          stroke: #E1CBD7;
          stroke-miterlimit: 10;
          stroke-width: 2px;
          stroke-dasharray: 100;
          stroke-dashoffset: 550;
          animation: introStrokeAnimation 5s linear infinite alternate;
        }

        @keyframes introStrokeAnimation {
          100% {
            stroke-dashoffset: 100;
            stroke-dasharray: 100;
          }
        }
      `}</style>

      <div id="intro-wrapper">
        
        {/* Top Floating Branding Bar */}
        <div className="absolute top-0 left-0 right-0 z-20 p-6 flex items-center justify-between bg-gradient-to-b from-[#0B1B3D]/90 via-[#0B1B3D]/50 to-transparent backdrop-blur-[2px]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#86A8CF] to-[#C38EB4] flex items-center justify-center font-black text-[#0B1B3D] text-base shadow-[0_0_20px_rgba(134,168,207,0.5)]">
              IK
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-extrabold tracking-tight text-[#E1CBD7]">Inkloom AI</span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#86A8CF]/20 text-[#86A8CF] border border-[#86A8CF]/40">
                  Brand Governance
                </span>
              </div>
              <p className="text-[11px] text-[#E1CBD7]/70 font-mono">Team: Ek Kachori Do Samosa</p>
            </div>
          </div>

          {showDismissButton && (
            <button
              onClick={onEnter}
              className="px-5 py-2.5 rounded-xl bg-[#86A8CF] hover:bg-[#7297c0] text-[#0B1B3D] font-bold text-xs tracking-wide transition shadow-[0_0_25px_rgba(134,168,207,0.6)] flex items-center space-x-2 cursor-pointer transform hover:scale-105 active:scale-95"
            >
              <span>Enter Platform</span>
              <ArrowRight className="w-4 h-4 text-[#0B1B3D]" />
            </button>
          )}
        </div>

        {/* The Exact User SVG Animation */}
        <svg id="intro-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 450">
          <defs>
            <linearGradient id="gradiantLight" x1="50%" y1="100%" x2="50%" y2="0%">
              <stop offset="60%" stopColor="rgba(195,142,180,0.4)" />
              <stop offset="80%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>

            <filter id="blurFilter">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
            </filter>
            
            <mask id="maskStrokeShow">
              <ellipse className="intro-rotate" fill="url(#gradientMask)" cx="640" cy="154.9" rx="148.7" ry="129.9" transform="translate(-0.3 1.4)" />
            </mask>

            <radialGradient id="gradientMask" cx="50%" cy="38%" r="62%" fx="50%" fy="50%">
              <stop offset="40%" stopColor="#fff" />
              <stop offset="60%" stopColor="rgba(255,255,255,0.2)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>

            <mask id="maskHideFill">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <ellipse className="intro-rotate" cx="640" cy="146.8" rx="149" ry="129.9" transform="translate(-0.3 1.4)" fill="black" />
            </mask>

            <g id="words">
              <path d="M185.2,317.2l-4.3,2.3V210.4l4.3-2.3Zm8.6-4.4-4.3,2.2V205.9l4.3-2.2Zm8.6-4.3-4.3,2.1V201.5l4.3-2.2Zm8.6-28c15.3-7.4,30.7-14.5,46.4-21.1v4.7c-15.7,6.6-31.1,13.8-46.4,21.1V290c15.3-7.4,30.7-14.5,46.4-21.1v4.7c-15.7,6.6-31.1,13.8-46.4,21.1v4.8c15.3-7.4,30.7-14.5,46.4-21.1v4.7q-25.6,11.1-50.7,23.2V197.2q25.1-12.1,50.7-23.2v4.7c-15.7,6.6-31.1,13.8-46.4,21.1v4.8c15.3-7.4,30.7-14.5,46.4-21.1v4.7c-15.7,6.6-31.1,13.8-46.4,21.1v4.8c15.3-7.4,30.7-14.5,46.4-21.1v4.7c-15.7,6.6-31.1,13.8-46.4,21.1v19c9.4-4.6,14.2-6.8,23.7-11.1v4.7c-9.5,4.3-14.3,6.5-23.7,11.1v4.8c9.4-4.6,14.2-6.8,23.7-11.2v4.8c-9.5,4.3-14.3,6.5-23.7,11.1v4.8c9.4-4.6,14.2-6.8,23.7-11.2v4.8c-9.5,4.3-14.3,6.5-23.7,11.1Z"/>
              <path d="M302.8,232.5c10.3-3.8,15.6-5.6,26-9.1a42.4,42.4,0,0,0,12.8-7,55.2,55.2,0,0,0,10.7-10.9,50.5,50.5,0,0,0,7.3-13.8,45.7,45.7,0,0,0,2.7-15.3,27.4,27.4,0,0,0-4.6-16,22.6,22.6,0,0,0-12.3-9.2,27.1,27.1,0,0,0-16.6.5c-18.9,6.3-37.7,13.2-56.2,20.7V276.8l-4.4,1.8V169.5q30-12.1,60.6-22.5a29.7,29.7,0,0,1,18.8-.6,25.3,25.3,0,0,1,14,10.5,31.2,31.2,0,0,1,5.3,18.1,56.1,56.1,0,0,1-3.1,18.2,58.9,58.9,0,0,1-8.3,15.5,62.5,62.5,0,0,1-12.2,11.9,54.5,54.5,0,0,1-14.5,7.6c-10.4,3.4-15.7,5.3-26,9.1Zm0-9.5c10.3-3.8,15.6-5.6,26-9.1a31.9,31.9,0,0,0,12.1-7.3,40.6,40.6,0,0,0,8.9-12.4,34.8,34.8,0,0,0,3.5-15.1c0-6.8-2.5-12-7.4-15.7s-10.6-4.4-17.1-2.2c-15.9,5.3-31.7,11.1-47.3,17.2v94.9l-4.4,1.7V175.4q25.6-10.1,51.7-18.9a22.7,22.7,0,0,1,14.3-.5,19.9,19.9,0,0,1,10.7,8,23.1,23.1,0,0,1,4,13.7,41.8,41.8,0,0,1-4,17.5,46.8,46.8,0,0,1-10.7,14.7,38.1,38.1,0,0,1-14.3,8.8c-10.4,3.5-15.7,5.3-26,9.1Zm0-9.5c10.3-3.7,15.6-5.6,26-9.1a22,22,0,0,0,10.9-8.1,23.3,23.3,0,0,0,4.5-14.4,11.4,11.4,0,0,0-4.7-9.7c-3.1-2.4-6.7-2.8-10.7-1.5-12.9,4.3-25.7,8.9-38.4,13.7v85.4l-4.5,1.7V181.4c14.3-5.4,28.5-10.5,42.9-15.4,5.3-1.8,9.9-1.2,13.9,1.8s6,7.2,6,12.7a29.6,29.6,0,0,1-5.8,18,29.1,29.1,0,0,1-14.1,10.7c-10.4,3.5-15.7,5.3-26,9.1Zm-3.5,53-4.5,1.6V187.5c11.3-4.2,22.6-8.3,34-12.1a8.2,8.2,0,0,1,7.7.9,8.4,8.4,0,0,1,3.2,7c0,8.6-3.6,14-10.9,16.4-10.4,3.5-15.7,5.3-26,9.1v-4.7c10.3-3.8,15.6-5.7,26-9.2a8.5,8.5,0,0,0,4.7-3.3c1.1-1.5,1.7-3.8,1.7-6.8a4.7,4.7,0,0,0-1.9-4.2,4.7,4.7,0,0,0-4.5-.4c-9.9,3.3-19.7,6.7-29.5,10.4Z"/>
              <path d="M376.8,132.3l4.6-1.3V240.1l-4.6,1.3Zm9.2-2.5,4.5-1.2V237.7l-4.5,1.2Zm9.1-2.4,4.6-1.2V235.3l-4.6,1.2Zm55.1-12.6,4.7-.9V223.1l-4.7.9V181.2c-13.8,2.8-27.6,5.8-41.4,9.1v42.8l-4.6,1.1V125.1l4.6-1.2v42.7c13.8-3.3,27.6-6.3,41.4-9.1Zm0,52.2v-4.8c-13.8,2.8-27.6,5.9-41.4,9.1v4.8C422.6,172.8,436.4,169.8,450.2,167Zm0,9.4v-4.7c-13.8,2.8-27.6,5.8-41.4,9.1v4.7C422.6,182.3,436.4,179.3,450.2,176.4Zm9.3-63.3,4.6-.9V221.3l-4.6.9Zm9.2-1.7,4.7-.8V219.7l-4.7.8Zm9.3-1.6,4.7-.8V218.1l-4.7.8Z"/>
              <path d="M499.6,215.5l-4.7.7V107.1l4.7-.7Zm9.3-1.3-4.7.7V105.8l4.7-.7Zm9.3-1.2-4.7.6V104.5l4.7-.6Zm9.3-24.8c16.5-1.9,33.1-3.4,49.7-4.5v4.8c-16.6,1-33.2,2.5-49.7,4.4v4.8c16.5-1.9,33.1-3.4,49.7-4.5V198c-16.6,1-33.2,2.5-49.7,4.4v4.8c16.5-1.9,33.1-3.5,49.7-4.5v4.8c-18.2,1.2-36.3,2.9-54.4,5V103.3c18.1-2,36.2-3.7,54.4-5v4.8c-16.6,1-33.2,2.6-49.7,4.4v4.8c16.5-1.9,33.1-3.4,49.7-4.5v4.8c-16.6,1-33.2,2.5-49.7,4.4v4.8c16.5-1.9,33.1-3.5,49.7-4.5v4.8c-16.6,1-33.2,2.5-49.7,4.4v19c10.2-1.2,15.3-1.7,25.5-2.6v4.7c-10.2.9-15.3,1.5-25.5,2.6V155c10.2-1.2,15.3-1.7,25.5-2.6v4.7c-10.2.9-15.3,1.4-25.5,2.6v4.8c10.2-1.2,15.3-1.7,25.5-2.6v4.7c-10.2.9-15.3,1.4-25.5,2.6Z"/>
              <path d="M635.9,177h-5.2c-12.4-23.5-24.8-47.1-37.3-70.5v100l-4.7.3V97.7l5.3-.3Q615.2,137.2,635.9,177Zm-37.8-55,4.6,8.8v75.3l-4.6.2Zm48.4,55h-5.3q-20.9-40-41.9-79.8l5.3-.2Q625.8,136.9,646.5,177Zm-39.1-37.3,4.7,8.8v57.3l-4.7.2Zm87-32.8c-12.5,23.3-25,46.8-37.3,70.2h-5.4Q631,136.8,609.9,96.8l5.3-.2q19.8,37.7,39.3,75.5c13-24.8,26-49.6,39.2-74.3l5.3.3V207.2l-4.6-.3Zm-77.6,50.6,4.7,8.8v39.3h-4.7Zm31.4-4.4-2.8-5q13.5-25.6,27.1-51.2l5.3.2Q663,125,648.2,153.1Zm5.4,10.4-2.7-5q16.1-30.6,32.3-61.2l5.2.2C676.8,119.5,665.1,141.5,653.6,163.5Zm12.7,2.5,4.6-8.8v48.7h-4.6Zm9.3-17.9,4.7-8.8v67l-4.7-.2Zm9.4-17.5,4.7-8.8v84.9l-4.7-.2Z"/>
              <path d="M716.1,208.4l-4.7-.4V98.9l4.7.4Zm9.3.8-4.7-.4V99.6l4.7.4Zm9.4.8-4.7-.4V100.5l4.7.4Zm9.3-22.7c16.5,1.7,33.1,3.9,49.5,6.5v4.8c-16.4-2.7-33-4.8-49.5-6.6v4.7c16.5,1.8,33.1,4,49.5,6.6V208c-16.4-2.6-33-4.7-49.5-6.5v4.7c16.5,1.8,33.1,4,49.5,6.6v4.7c-18-2.7-36-5.1-54.2-7V101.4c18.2,1.9,36.2,4.3,54.2,7v4.8c-16.4-2.7-33-4.8-49.5-6.6v4.7c16.5,1.8,33.1,4,49.5,6.6v4.7c-16.4-2.6-33-4.7-49.5-6.5v4.7c16.5,1.8,33.1,4,49.5,6.6v4.7c-16.4-2.6-33-4.7-49.5-6.5v19c10.2,1,15.3,1.7,25.4,3v4.7c-10.1-1.3-15.2-1.9-25.4-3V154c10.2,1.1,15.3,1.7,25.4,3.1v4.7c-10.1-1.3-15.2-1.9-25.4-3v4.7c10.2,1.1,15.3,1.7,25.4,3.1v4.7c-10.1-1.3-15.2-1.9-25.4-3Z"/>
              <path d="M839.9,190.7c9.3,1.9,18.6,4,27.8,6.2a28.8,28.8,0,0,0,16.5-.5,23.1,23.1,0,0,0,12.2-9.4c3-4.6,4.5-10.2,4.5-16.7a39.9,39.9,0,0,0-4.5-18,50.4,50.4,0,0,0-12.2-15.7,39.1,39.1,0,0,0-16.5-8.8c-19.2-4.5-38.6-8.6-58.1-12V220.2l-4.6-.8V110.3q31.5,5.5,62.7,12.8a43.9,43.9,0,0,1,18.7,10A55.1,55.1,0,0,1,900.3,151a45.2,45.2,0,0,1,5.2,20.5c0,7.8-1.6,14.3-4.8,19.3a25.1,25.1,0,0,1-13.2,10.4l11.8,39.1-4.8-1.3c-3.8-12.2-7.5-24.5-11.3-36.7l-3.9.5c3.6,11.6,7.1,23.3,10.6,35l-4.8-1.3c-3.4-11.2-6.9-22.5-10.4-33.7l-4-.6,9.8,33.2-4.8-1.2c-3.3-11-6.5-22-9.8-33l-4.1-.9,9.3,32.7-4.8-1.1c-3.2-10.9-6.3-21.9-9.4-32.8l-17-3.7Zm0-9.5c9.3,1.9,18.6,4,27.8,6.2,6.6,1.6,12.3.6,17-3s7.1-9.1,7.1-16.6-2.4-12.8-7.2-18.9-10.5-10-16.9-11.6c-16.2-3.9-32.5-7.3-48.8-10.3v94.9l-4.6-.9V121.4c17.9,3.3,35.6,7.1,53.4,11.2a33.8,33.8,0,0,1,14.2,7.5,45,45,0,0,1,10.6,13.5,34.5,34.5,0,0,1,3.9,15.4c0,8.7-2.8,15.1-8.5,19.5s-12.4,5.5-20.2,3.6-18.5-4.2-27.8-6.1Zm0-9.5c9.3,1.9,18.6,4,27.8,6.2,4.2,1,7.7.5,10.6-1.6s4.4-5.7,4.4-10.9-1.5-7.6-4.6-11.5-6.5-6.2-10.4-7.1c-13.1-3.1-26.3-6-39.5-8.6q0,42.8-.1,85.4l-4.6-.9V132.6c14.8,2.9,29.5,6.1,44.2,9.5,5.1,1.2,9.7,4.3,13.6,9.3s6,10,6,15.2-1.9,10.9-5.8,13.7-8.4,3.7-13.8,2.4c-9.2-2.3-18.5-4.3-27.8-6.2Zm-2.5,53.8-4.6-.9V143.9c11.6,2.3,23.3,4.9,34.9,7.7a12.7,12.7,0,0,1,7.3,4.7,12.2,12.2,0,0,1,3.1,8c0,7.6-3.5,10.5-10.4,8.9-9.2-2.2-18.5-4.3-27.8-6.2v-4.8c9.3,1.9,18.6,4,27.8,6.2a5.1,5.1,0,0,0,4.3-.4c1-.8,1.5-2.4,1.5-4.9a6,6,0,0,0-1.7-4.2,7.3,7.3,0,0,0-4.1-2.6c-10.1-2.4-20.2-4.7-30.3-6.7Z"/>
              <path d="M916.4,245.2l-5-1.5q20.6-48.1,41.2-96.3l4.8,1.7q20.6,62,40.6,124l-4.8-1.9Q974.3,212.9,955,154.6,935.7,199.9,916.4,245.2Zm39.2-79.1,2.5,6.9q-16.1,37.5-32,75.1l-4.9-1.5C932.6,219.8,944.1,192.9,955.6,166.1Zm5,14.2c.9,3,1.4,4.4,2.3,7.4l-27,63.4-4.9-1.5Q945.7,215,960.6,180.3Zm4.7,14.7c.9,3,1.4,4.5,2.4,7.5l-22.2,51.7-4.8-1.6Zm-12.2,48.7,1.7-4.2q14.9,5,29.4,10.5c.7,2.2,1.1,3.3,1.8,5.4C975.1,251.4,964.1,247.5,953.1,243.7Zm3.5-8.3,1.7-4.2c9,3.1,13.4,4.7,22.3,8l2,5.4C972.2,240.8,967,238.9,956.6,235.4Zm3.5-8.3c.7-1.7,1-2.5,1.8-4.1l15.3,5.4c.7,2.2,1,3.3,1.8,5.4C971.4,231,967.6,229.7,960.1,227.1Zm6.9-74.7c13.7,41.5,27.2,82.9,40.5,124.5l-4.8-1.9q-20-62.2-40.5-124.3Zm9.7,3.5q20.4,62.4,40.3,124.9l-4.7-2q-19.9-62.4-40.4-124.6Zm49.8,128.9-4.7-2q-19.9-62.7-40.3-125.1l4.8,1.8C999.8,201.2,1013.3,243,1026.5,284.8Z"/>
              <path d="M1034.2,179l4.4,1.9V290l-4.4-1.9Zm8.7,3.9,4.4,2V294l-4.4-2Zm8.8,4,4.3,2V298l-4.3-2Zm8.7,4,4.3,2.1v85.4c11.6,5.6,23,11.3,34.4,17.4v4.7c-11.4-6-22.8-11.8-34.4-17.4v4.8c11.6,5.5,23,11.3,34.4,17.3V310c-11.4-6-22.8-11.8-34.4-17.4v4.8c11.6,5.5,23,11.3,34.4,17.3v4.8c-12.8-6.7-25.7-13.2-38.7-19.4Z"/>
            </g>
          </defs>

          <use href="#words" className="wordsFill" mask="url(#maskHideFill)" />
          
          {showLight && (
            <g id="reflector" className="intro-rotate" filter="url(#blurFilter)">
              <polygon fill="url(#gradiantLight)" points="491.3 155.2 595.8 908.4 688.7 908.2 788.7 154.5 491.3 155.2" />
              <ellipse fill="rgba(255,255,255,0.15)" cx="640" cy="154.9" rx="148.7" ry="129.9" transform="translate(-0.3 1.4)" />
            </g>
          )}

          <use href="#words" mask="url(#maskStrokeShow)" className="wordsStroke" />
        </svg>
      
        {/* Toggle Light Button */}
        <button
          onClick={() => setShowLight(!showLight)}
          className="absolute right-8 bottom-16 z-20 px-4 py-2.5 rounded-xl bg-[#26425A]/90 hover:bg-[#26425A] text-[#E1CBD7] hover:text-white text-xs font-semibold border border-[#86A8CF]/30 transition shadow-lg flex items-center space-x-2 cursor-pointer backdrop-blur-sm"
        >
          {showLight ? <EyeOff className="w-3.5 h-3.5 text-[#C38EB4]" /> : <Eye className="w-3.5 h-3.5 text-[#86A8CF]" />}
          <span>{showLight ? 'Hide Light' : 'Show Light'}</span>
        </button>

        {/* Info Text Footer */}
        <div className="absolute left-0 bottom-0 z-20 w-full py-2.5 px-4 bg-[#07111C]/80 border-t border-[#26425A]/50 text-center text-xs text-[#E1CBD7]/70 font-mono backdrop-blur-sm">
          * For the best visual experience, use Chrome, Edge, or Opera Browser • Inkloom AI Pre-Flight Brand Governance
        </div>

      </div>

    </div>
  );
};
