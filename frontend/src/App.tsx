import React, { useState } from 'react';
import { UserAccount, SubmissionItem } from './types';
import { DEMO_ACCOUNTS } from './data/mockUsers';
import { INITIAL_SUBMISSIONS } from './data/mockSubmissions';
import { Header } from './components/common/Header';
import { LoginPage } from './components/auth/LoginPage';
import { FullPageIntroAnimation } from './components/common/FullPageIntroAnimation';
import { SubmissionStudio } from './components/creator/SubmissionStudio';
import { MySubmissionsView } from './components/creator/MySubmissionsView';
import { ReviewApprovalHub } from './components/review/ReviewApprovalHub';
import { VisualAccessibilityChecker } from './components/visual/VisualAccessibilityChecker';
import { KnowledgeBaseManager } from './components/admin/KnowledgeBaseManager';
import { GovernanceAnalytics } from './components/analytics/GovernanceAnalytics';

export function App() {
  // Authentication & Session State - Default to Creator demo account for immediate usability, or allow login
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => DEMO_ACCOUNTS[0]);
  const [activeTab, setActiveTab] = useState<string>('STUDIO');
  
  // Submissions Data State
  const [submissions, setSubmissions] = useState<SubmissionItem[]>(INITIAL_SUBMISSIONS);
  const [activeSubmission, setActiveSubmission] = useState<SubmissionItem>(INITIAL_SUBMISSIONS[0]);
  
  // Starting Animation State: Display ONLY ONCE per session, preserved on reload
  const [showIntroModal, setShowIntroModal] = useState<boolean>(() => {
    try {
      const seen = sessionStorage.getItem('inkloom_intro_seen');
      return !seen;
    } catch {
      return false;
    }
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDismissIntro = () => {
    try {
      sessionStorage.setItem('inkloom_intro_seen', 'true');
    } catch {
      // ignore
    }
    setShowIntroModal(false);
  };

  const handleLogin = (user: UserAccount) => {
    setCurrentUser(user);
    if (user.role === 'CREATOR') setActiveTab('STUDIO');
    else if (user.role === 'MANAGER' || user.role === 'REVIEWER') setActiveTab('REVIEW_HUB');
    else if (user.role === 'ADMIN') setActiveTab('KNOWLEDGE_BASE');
    triggerToast(`Active persona: ${user.name} (${user.role})`);
  };

  const handleSwitchRole = (role: 'CREATOR' | 'MANAGER' | 'REVIEWER' | 'ADMIN') => {
    const acc = DEMO_ACCOUNTS.find(a => a.role === role) || DEMO_ACCOUNTS[0];
    setCurrentUser(acc);
    if (role === 'CREATOR') setActiveTab('STUDIO');
    else if (role === 'MANAGER' || role === 'REVIEWER') setActiveTab('REVIEW_HUB');
    else if (role === 'ADMIN') setActiveTab('KNOWLEDGE_BASE');
    triggerToast(`Switched persona to ${acc.name} (${role})`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    triggerToast('Logged out of workspace');
  };

  const handleNewSubmission = (newSub: SubmissionItem) => {
    setSubmissions(prev => {
      const exists = prev.some(s => s.id === newSub.id);
      if (exists) {
        return prev.map(s => s.id === newSub.id ? newSub : s);
      }
      return [newSub, ...prev];
    });
    triggerToast(`"${newSub.title}" submitted for Manager Review!`);
    setActiveTab('REVIEW_HUB');
  };

  const handleUpdateSubmission = (updated: SubmissionItem) => {
    setSubmissions(prev => prev.map(s => s.id === updated.id ? updated : s));
    if (activeSubmission.id === updated.id) {
      setActiveSubmission(updated);
    }
    triggerToast(`Status updated: ${updated.status.replace(/_/g, ' ')}`);
  };

  // Pending reviews count
  const pendingCount = submissions.filter(s => {
    if (!currentUser) return false;
    if (currentUser.role === 'MANAGER') return s.status === 'PENDING_MANAGER_REVIEW';
    if (currentUser.role === 'REVIEWER') return s.status === 'PENDING_LEGAL_REVIEW';
    return s.status.includes('PENDING');
  }).length;

  // 1. Full-Page Starting Animation (shown only once on first open or upon manual replay)
  if (showIntroModal) {
    return (
      <FullPageIntroAnimation 
        onEnter={handleDismissIntro}
        showDismissButton={true}
      />
    );
  }

  // 2. Fallback to Login if user logs out
  if (!currentUser) {
    return (
      <LoginPage
        onLogin={handleLogin}
        onWatchIntro={() => setShowIntroModal(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0912] text-[#EDE9FE] flex flex-col font-sans selection:bg-[#B69DF8]/30 selection:text-white">

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-xl bg-[#151324] border border-[#B69DF8]/40 text-[#EDE9FE] text-xs font-semibold shadow-[0_0_20px_rgba(182,157,248,0.25)] flex items-center space-x-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#B69DF8]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Role-Specific Header with 1-Click Role Switcher */}
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        onSwitchRole={handleSwitchRole}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onReplayIntro={() => setShowIntroModal(true)}
        pendingCount={pendingCount}
      />

      {/* Main Workspace Rendered by Tab */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {activeTab === 'STUDIO' && (
          <SubmissionStudio
            onNewSubmissionCreated={handleNewSubmission}
            activeItem={activeSubmission}
            setActiveItem={setActiveSubmission}
          />
        )}

        {activeTab === 'MY_SUBMISSIONS' && (
          <MySubmissionsView
            submissions={submissions}
            currentUserEmail={currentUser.email}
            onEditSubmission={(sub) => {
              setActiveSubmission(sub);
              setActiveTab('STUDIO');
            }}
          />
        )}

        {activeTab === 'REVIEW_HUB' && (
          <ReviewApprovalHub
            submissions={submissions}
            activeRole={currentUser.role}
            onUpdateSubmission={handleUpdateSubmission}
          />
        )}

        {activeTab === 'VISUAL_CHECKER' && (
          <VisualAccessibilityChecker />
        )}

        {activeTab === 'ANALYTICS' && (
          <GovernanceAnalytics />
        )}

        {activeTab === 'KNOWLEDGE_BASE' && (
          <KnowledgeBaseManager />
        )}

      </main>

      {/* Streamlined Footer */}
      <footer className="border-t border-[#2E2A4A] py-3 bg-[#0A0912] text-center text-xs text-[#EDE9FE]/50 font-mono">
        <p>Inkloom AI Brand Governance Platform • Active Session: {currentUser.name} ({currentUser.role})</p>
      </footer>

    </div>
  );
}

export default App;
