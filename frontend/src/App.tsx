import React, { useState } from 'react';
import { UserAccount, SubmissionItem } from './types';
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
  // Authentication & Session State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [activeTab, setActiveTab] = useState<string>('STUDIO');
  
  // Data State
  const [submissions, setSubmissions] = useState<SubmissionItem[]>(INITIAL_SUBMISSIONS);
  const [activeSubmission, setActiveSubmission] = useState<SubmissionItem>(INITIAL_SUBMISSIONS[0]);
  
  // Modals & Full-Page Intro (Default to true for cinematic full-page starting animation)
  const [showIntroModal, setShowIntroModal] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Role-Specific Login Dispatcher
  const handleLogin = (user: UserAccount) => {
    setCurrentUser(user);
    switch (user.role) {
      case 'CREATOR':
        setActiveTab('STUDIO');
        break;
      case 'MANAGER':
        setActiveTab('REVIEW_HUB');
        break;
      case 'REVIEWER':
        setActiveTab('REVIEW_HUB');
        break;
      case 'ADMIN':
        setActiveTab('KNOWLEDGE_BASE');
        break;
    }
    triggerToast(`Logged in as ${user.name} (${user.role})`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    triggerToast('Logged out successfully');
  };

  const handleNewSubmission = (newSub: SubmissionItem) => {
    setSubmissions(prev => {
      const exists = prev.some(s => s.id === newSub.id);
      if (exists) {
        return prev.map(s => s.id === newSub.id ? newSub : s);
      }
      return [newSub, ...prev];
    });
    triggerToast(`"${newSub.title}" sent for Manager Review!`);
    setActiveTab('MY_SUBMISSIONS');
  };

  const handleUpdateSubmission = (updated: SubmissionItem) => {
    setSubmissions(prev => prev.map(s => s.id === updated.id ? updated : s));
    if (activeSubmission.id === updated.id) {
      setActiveSubmission(updated);
    }
    triggerToast(`Submission status: ${updated.status.replace(/_/g, ' ')}`);
  };

  // Calculate pending reviews for Manager and Reviewer badges
  const pendingCount = submissions.filter(s => {
    if (!currentUser) return false;
    if (currentUser.role === 'MANAGER') return s.status === 'PENDING_MANAGER_REVIEW';
    if (currentUser.role === 'REVIEWER') return s.status === 'PENDING_LEGAL_REVIEW';
    return false;
  }).length;

  // 1. Full-Page Starting Animation (Active on load or triggered on demand)
  if (showIntroModal) {
    return (
      <FullPageIntroAnimation 
        onEnter={() => setShowIntroModal(false)}
        showDismissButton={true}
      />
    );
  }

  // 2. If not logged in, render Role Login Page
  if (!currentUser) {
    return (
      <LoginPage
        onLogin={handleLogin}
        onWatchIntro={() => setShowIntroModal(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1B3D] text-[#E1CBD7] flex flex-col font-sans selection:bg-[#86A8CF]/30 selection:text-white">

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-xl bg-[#26425A] border border-[#86A8CF] text-white text-xs font-semibold shadow-2xl flex items-center space-x-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#86A8CF]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Role-Specific Header with RBAC Tabs */}
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onReplayIntro={() => setShowIntroModal(true)}
        pendingCount={pendingCount}
      />

      {/* Main Workspace Rendered by Role Security */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* ==================== CREATOR ONLY VIEWS ==================== */}
        {currentUser.role === 'CREATOR' && (
          <>
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

            {activeTab === 'VISUAL_CHECKER' && (
              <VisualAccessibilityChecker />
            )}
          </>
        )}

        {/* ==================== MANAGER ONLY VIEWS ==================== */}
        {currentUser.role === 'MANAGER' && (
          <>
            {activeTab === 'REVIEW_HUB' && (
              <ReviewApprovalHub
                submissions={submissions}
                activeRole={currentUser.role}
                onUpdateSubmission={handleUpdateSubmission}
              />
            )}
          </>
        )}

        {/* ==================== REVIEWER ONLY VIEWS ==================== */}
        {currentUser.role === 'REVIEWER' && (
          <>
            {activeTab === 'REVIEW_HUB' && (
              <ReviewApprovalHub
                submissions={submissions}
                activeRole={currentUser.role}
                onUpdateSubmission={handleUpdateSubmission}
              />
            )}

            {activeTab === 'ANALYTICS' && (
              <GovernanceAnalytics />
            )}
          </>
        )}

        {/* ==================== ADMIN ONLY VIEWS ==================== */}
        {currentUser.role === 'ADMIN' && (
          <>
            {activeTab === 'KNOWLEDGE_BASE' && (
              <KnowledgeBaseManager />
            )}

            {activeTab === 'ANALYTICS' && (
              <GovernanceAnalytics />
            )}

            {activeTab === 'REVIEW_HUB' && (
              <ReviewApprovalHub
                submissions={submissions}
                activeRole={currentUser.role}
                onUpdateSubmission={handleUpdateSubmission}
              />
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-[#26425A] py-4 bg-[#07111C] text-center text-xs text-[#E1CBD7]/60 font-mono">
        <p>Inkloom AI Brand Governance Platform • Logged in as: {currentUser.name} ({currentUser.role})</p>
      </footer>

    </div>
  );
}

export default App;
