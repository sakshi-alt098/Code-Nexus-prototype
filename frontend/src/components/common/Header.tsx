import React from 'react';
import { UserAccount, UserRole } from '../../types';
import { 
  Shield, 
  Play, 
  LogOut, 
  FileText, 
  UserCheck, 
  Layers, 
  Sparkles, 
  BarChart3, 
  ListOrdered,
  Users
} from 'lucide-react';

interface HeaderProps {
  currentUser: UserAccount;
  onLogout: () => void;
  onSwitchRole: (role: UserRole) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onReplayIntro: () => void;
  pendingCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onLogout,
  onSwitchRole,
  activeTab,
  onTabChange,
  onReplayIntro,
  pendingCount
}) => {
  // Navigation tabs for full workflow exploration
  const navTabs = [
    { 
      id: 'STUDIO', 
      label: 'Policy & Content Studio', 
      icon: <FileText className="w-3.5 h-3.5" />,
      desc: 'Upload Policy & Check Draft'
    },
    { 
      id: 'REVIEW_HUB', 
      label: 'Review & Approvals', 
      icon: <UserCheck className="w-3.5 h-3.5" />, 
      badge: pendingCount,
      desc: 'Manager & Legal Sign-Off'
    },
    { 
      id: 'MY_SUBMISSIONS', 
      label: 'Draft Tracker', 
      icon: <ListOrdered className="w-3.5 h-3.5" />,
      desc: 'Audit & Revision History'
    },
    { 
      id: 'VISUAL_CHECKER', 
      label: 'Visual & WCAG Suite', 
      icon: <Layers className="w-3.5 h-3.5" />,
      desc: 'Contrast & Brand Tokens'
    },
    { 
      id: 'ANALYTICS', 
      label: 'Governance Insights', 
      icon: <BarChart3 className="w-3.5 h-3.5" />,
      desc: 'Repeated Errors & Trends'
    },
    { 
      id: 'KNOWLEDGE_BASE', 
      label: 'Brand Rules Vault', 
      icon: <Sparkles className="w-3.5 h-3.5" />,
      desc: 'Single Source of Truth'
    }
  ];

  const roles: { role: UserRole; label: string }[] = [
    { role: 'CREATOR', label: 'Creator' },
    { role: 'MANAGER', label: 'Manager' },
    { role: 'REVIEWER', label: 'Reviewer (Legal)' },
    { role: 'ADMIN', label: 'Admin' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0A0912]/95 backdrop-blur-md border-b border-[#2E2A4A] shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Row */}
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Title */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#B69DF8] to-[#E879F9] flex items-center justify-center font-black text-[#0A0912] shadow-[0_0_15px_rgba(182,157,248,0.4)]">
              <Shield className="w-5 h-5 text-[#0A0912]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-extrabold tracking-tight text-[#EDE9FE]">Inkloom AI</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#B69DF8]/15 text-[#B69DF8] border border-[#B69DF8]/30 font-bold uppercase">
                  Brand Governance
                </span>
              </div>
              <p className="text-[10px] text-[#EDE9FE]/60 font-mono hidden sm:block">
                Pre-Flight Policy & Multi-Format Brand Compliance
              </p>
            </div>
          </div>

          {/* Quick Persona Switcher & Global Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Quick 1-Click Role Switcher Pills */}
            <div className="hidden md:flex items-center bg-[#151324] p-1 rounded-xl border border-[#2E2A4A] space-x-1">
              <span className="text-[10px] font-mono uppercase px-2 text-[#EDE9FE]/50 flex items-center">
                <Users className="w-3 h-3 mr-1 text-[#B69DF8]" /> Persona:
              </span>
              {roles.map(r => {
                const isActive = currentUser.role === r.role;
                return (
                  <button
                    key={r.role}
                    onClick={() => onSwitchRole(r.role)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      isActive
                        ? 'bg-[#B69DF8] text-[#0A0912] shadow-[0_0_10px_rgba(182,157,248,0.4)]'
                        : 'text-[#EDE9FE]/70 hover:text-white hover:bg-[#2E2A4A]/50'
                    }`}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>

            {/* Current User Badge for Mobile */}
            <div className="md:hidden flex items-center bg-[#151324] px-2.5 py-1 rounded-lg border border-[#2E2A4A] text-[11px] font-mono text-[#B69DF8]">
              {currentUser.role}
            </div>

            {/* Replay Intro Animation Button */}
            <button
              onClick={onReplayIntro}
              className="px-2.5 py-1.5 rounded-xl bg-[#151324] hover:bg-[#201c36] text-xs text-[#EDE9FE] border border-[#B69DF8]/30 hover:border-[#B69DF8] transition flex items-center space-x-1.5 cursor-pointer shadow-sm"
              title="Watch starting animation again"
            >
              <Play className="w-3.5 h-3.5 text-[#B69DF8]" />
              <span className="hidden lg:inline text-xs font-medium">Intro Animation</span>
            </button>

            {/* Logout / Switch Account */}
            <button
              onClick={onLogout}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-[#151324] hover:bg-[#E879F9]/20 border border-[#2E2A4A] hover:border-[#E879F9]/60 text-xs text-[#EDE9FE]/80 hover:text-[#E879F9] transition flex items-center space-x-1.5 cursor-pointer"
              title="Sign out to persona selection"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>

          </div>
        </div>

        {/* Streamlined Navigation Tabs */}
        <div className="flex items-center space-x-1.5 border-t border-[#2E2A4A]/70 py-2 overflow-x-auto scrollbar-none">
          {navTabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center space-x-2 transition cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#151324] text-[#B69DF8] font-bold border border-[#B69DF8]/50 shadow-[0_0_12px_rgba(182,157,248,0.25)]'
                    : 'text-[#EDE9FE]/70 hover:text-white hover:bg-[#151324]/50'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {typeof tab.badge === 'number' && tab.badge > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#E879F9] text-[#0A0912] text-[10px] font-bold flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
