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
          { id: 'VISUAL_CHECKER', label: 'Visual & WCAG Checker', icon: <Layers className="w-3.5 h-3.5" /> }
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
    <header className="sticky top-0 z-40 w-full bg-[#00272B]/95 backdrop-blur-md border-b border-[#024950]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Portal Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#0FA4AF] flex items-center justify-center font-black text-[#003135] shadow-[0_0_15px_rgba(15,164,175,0.4)]">
              <Shield className="w-5 h-5 text-[#003135]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-bold tracking-tight text-white">Inkloom AI</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                  currentUser.role === 'CREATOR'
                    ? 'bg-[#0FA4AF]/20 text-[#0FA4AF] border border-[#0FA4AF]/30'
                    : currentUser.role === 'MANAGER'
                    ? 'bg-[#AFDDE5]/20 text-[#AFDDE5] border border-[#AFDDE5]/30'
                    : currentUser.role === 'REVIEWER'
                    ? 'bg-[#964734]/20 text-[#964734] border border-[#964734]/30'
                    : 'bg-white/20 text-white border border-white/30'
                }`}>
                  {currentUser.role} DASHBOARD
                </span>
              </div>
              <p className="text-[10px] text-[#AFDDE5]/60 hidden sm:block">
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
            <div className="hidden md:flex items-center space-x-3 bg-[#002024] px-3 py-1.5 rounded-xl border border-[#024950]">
              <div className="w-7 h-7 rounded-lg bg-[#0FA4AF]/20 border border-[#0FA4AF]/40 flex items-center justify-center text-xs font-bold text-[#0FA4AF]">
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="text-left text-xs">
                <span className="font-bold text-white block leading-tight">{currentUser.name}</span>
                <span className="text-[10px] text-[#AFDDE5]/60">{currentUser.department}</span>
              </div>
            </div>

            {/* Intro Video Button */}
            <button
              onClick={onReplayIntro}
              className="px-2.5 py-1.5 rounded-lg bg-[#024950] hover:bg-[#035b64] text-xs text-[#AFDDE5] border border-[#0FA4AF]/30 transition flex items-center space-x-1.5"
              title="Replay intro animation"
            >
              <Play className="w-3.5 h-3.5 text-[#0FA4AF]" />
              <span className="hidden lg:inline">Intro</span>
            </button>

            {/* Switch Role / Logout */}
            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-lg bg-[#002024] hover:bg-[#964734]/20 border border-[#024950] hover:border-[#964734]/60 text-xs font-semibold text-[#AFDDE5] hover:text-[#964734] transition flex items-center space-x-1.5"
              title="Switch user role or log out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Switch Role</span>
            </button>
          </div>
        </div>

        {/* Role-Specific Navigation Tabs */}
        <div className="flex items-center space-x-1 border-t border-[#024950]/60 py-1.5 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-2 transition ${
                activeTab === tab.id
                  ? 'bg-[#024950] text-[#0FA4AF] font-bold border border-[#0FA4AF]/40 shadow-sm'
                  : 'text-[#AFDDE5]/70 hover:text-white hover:bg-[#024950]/50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {typeof tab.badge === 'number' && tab.badge > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#964734] text-white text-[10px] font-bold flex items-center justify-center">
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
