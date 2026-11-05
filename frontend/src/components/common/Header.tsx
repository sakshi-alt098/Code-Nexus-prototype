import React from 'react';
import { UserAccount } from '../../types';
import { Shield, Play, LogOut, FileText, UserCheck, Layers, Sparkles, CheckCircle, ListOrdered } from 'lucide-react';

interface HeaderProps {
  currentUser: UserAccount;
  onLogout: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onReplayIntro: () => void;
  pendingCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onLogout,
  activeTab,
  onTabChange,
  onReplayIntro,
  pendingCount
}) => {
  // Determine allowed tabs based on role
  const getNavTabs = () => {
    switch (currentUser.role) {
      case 'CREATOR':
        return [
          { id: 'STUDIO', label: 'Submission Studio', icon: <FileText className="w-3.5 h-3.5" /> },
          { id: 'MY_SUBMISSIONS', label: 'My Submissions', icon: <ListOrdered className="w-3.5 h-3.5" /> },
          { id: 'VISUAL_CHECKER', label: 'Visual & WCAG Suite', icon: <Layers className="w-3.5 h-3.5" /> }
        ];
      case 'MANAGER':
        return [
          { id: 'REVIEW_HUB', label: 'Department Review Queue', icon: <UserCheck className="w-3.5 h-3.5" />, badge: pendingCount }
        ];
      case 'REVIEWER':
        return [
          { id: 'REVIEW_HUB', label: 'Legal Sign-Off Console', icon: <UserCheck className="w-3.5 h-3.5" />, badge: pendingCount },
          { id: 'ANALYTICS', label: 'Compliance & Risk Insights', icon: <CheckCircle className="w-3.5 h-3.5" /> }
        ];
      case 'ADMIN':
        return [
          { id: 'KNOWLEDGE_BASE', label: 'Brand Knowledge Base', icon: <Sparkles className="w-3.5 h-3.5" /> },
          { id: 'ANALYTICS', label: 'Governance Analytics', icon: <CheckCircle className="w-3.5 h-3.5" /> },
          { id: 'REVIEW_HUB', label: 'All Submissions Audit', icon: <UserCheck className="w-3.5 h-3.5" /> }
        ];
    }
  };

  const tabs = getNavTabs();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B1B3D]/95 backdrop-blur-md border-b border-[#26425A] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Portal Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#86A8CF] to-[#C38EB4] flex items-center justify-center font-black text-[#0B1B3D] shadow-[0_0_15px_rgba(134,168,207,0.4)]">
              <Shield className="w-5 h-5 text-[#0B1B3D]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-bold tracking-tight text-white">Inkloom AI</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                  currentUser.role === 'CREATOR'
                    ? 'bg-[#86A8CF]/20 text-[#86A8CF] border border-[#86A8CF]/30'
                    : currentUser.role === 'MANAGER'
                    ? 'bg-[#E1CBD7]/20 text-[#E1CBD7] border border-[#E1CBD7]/30'
                    : currentUser.role === 'REVIEWER'
                    ? 'bg-[#C38EB4]/20 text-[#C38EB4] border border-[#C38EB4]/30'
                    : 'bg-white/20 text-white border border-white/30'
                }`}>
                  {currentUser.role} DASHBOARD
                </span>
              </div>
              <p className="text-[10px] text-[#E1CBD7]/70 hidden sm:block">
                {currentUser.role === 'CREATOR' && 'Authoring & Pre-Flight Compliance'}
                {currentUser.role === 'MANAGER' && 'Department Endorsement & Review Queue'}
                {currentUser.role === 'REVIEWER' && 'Authorised Legal & Brand Sign-Off'}
                {currentUser.role === 'ADMIN' && 'Brand Book Rules & Global Administration'}
              </p>
            </div>
          </div>

          {/* User Account Chip & Actions */}
          <div className="flex items-center space-x-3">
            
            {/* User Profile Info */}
            <div className="hidden md:flex items-center space-x-3 bg-[#07111C] px-3 py-1.5 rounded-xl border border-[#26425A]">
              <div className="w-7 h-7 rounded-lg bg-[#86A8CF]/20 border border-[#86A8CF]/40 flex items-center justify-center text-xs font-bold text-[#86A8CF]">
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="text-left text-xs">
                <span className="font-bold text-white block leading-tight">{currentUser.name}</span>
                <span className="text-[10px] text-[#E1CBD7]/60">{currentUser.department}</span>
              </div>
            </div>

            {/* Intro Video / Animation Replay Button */}
            <button
              onClick={onReplayIntro}
              className="px-2.5 py-1.5 rounded-lg bg-[#26425A] hover:bg-[#32526e] text-xs text-[#E1CBD7] border border-[#86A8CF]/30 transition flex items-center space-x-1.5 cursor-pointer"
              title="Replay intro animation"
            >
              <Play className="w-3.5 h-3.5 text-[#86A8CF]" />
              <span className="hidden lg:inline">Intro Animation</span>
            </button>

            {/* Switch Role / Logout */}
            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-lg bg-[#07111C] hover:bg-[#C38EB4]/20 border border-[#26425A] hover:border-[#C38EB4]/60 text-xs font-semibold text-[#E1CBD7] hover:text-[#C38EB4] transition flex items-center space-x-1.5 cursor-pointer"
              title="Switch user role or log out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Switch Role</span>
            </button>
          </div>
        </div>

        {/* Role-Specific Navigation Tabs */}
        <div className="flex items-center space-x-1 border-t border-[#26425A]/60 py-1.5 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-2 transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#26425A] text-[#86A8CF] font-bold border border-[#86A8CF]/40 shadow-sm'
                  : 'text-[#E1CBD7]/70 hover:text-white hover:bg-[#26425A]/50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {typeof tab.badge === 'number' && tab.badge > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#C38EB4] text-[#0B1B3D] text-[10px] font-bold flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
