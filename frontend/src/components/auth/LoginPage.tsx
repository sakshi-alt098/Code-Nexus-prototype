import React, { useState } from 'react';
import { UserAccount, UserRole } from '../../types';
import { DEMO_ACCOUNTS } from '../../data/mockUsers';
import { Shield, Lock, ArrowRight, UserCheck, CheckCircle2, Sparkles, Play } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: UserAccount) => void;
  onWatchIntro: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onWatchIntro }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('CREATOR');
  const [email, setEmail] = useState('creator@inkloom.ai');
  const [password, setPassword] = useState('••••••••••••');

  const handleSelectRole = (account: UserAccount) => {
    setSelectedRole(account.role);
    setEmail(account.email);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const account = DEMO_ACCOUNTS.find(a => a.role === selectedRole) || DEMO_ACCOUNTS[0];
    onLogin(account);
  };

  return (
    <div className="min-h-screen bg-[#003135] text-[#AFDDE5] flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#0FA4AF]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#024950]/40 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar */}
      <header className="relative z-10 max-w-6xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-[#0FA4AF] flex items-center justify-center font-black text-[#003135] shadow-[0_0_15px_rgba(15,164,175,0.4)]">
            <Shield className="w-5 h-5 text-[#003135]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-base font-bold tracking-tight text-white">Inkloom AI</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0FA4AF]/15 text-[#0FA4AF] border border-[#0FA4AF]/30">
                RBAC Security Active
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onWatchIntro}
          className="px-3 py-1.5 rounded-lg bg-[#024950] hover:bg-[#035b64] text-xs text-[#AFDDE5] border border-[#0FA4AF]/30 transition flex items-center space-x-1.5 shadow-sm"
        >
          <Play className="w-3.5 h-3.5 text-[#0FA4AF]" />
          <span>Watch Intro Video</span>
        </button>
      </header>

      {/* Center Auth Portal */}
      <main className="relative z-10 max-w-4xl w-full mx-auto my-auto py-8">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Enterprise Brand Governance Portal
          </h1>
          <p className="text-xs sm:text-sm text-[#AFDDE5]/70 mt-2 max-w-lg mx-auto">
            Select your role to access role-specific workflows. Creators author, Managers endorse, Reviewers sign off, and Admins configure guidelines.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column: 1-Click Persona Cards (7 Cols) */}
          <div className="lg:col-span-7 space-y-3">
            <span className="text-xs font-mono uppercase text-[#AFDDE5]/70 block mb-1">
              Select Demo Persona (Instant 1-Click Login):
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DEMO_ACCOUNTS.map(account => {
                const isSelected = selectedRole === account.role;
                return (
                  <div
                    key={account.id}
                    onClick={() => handleSelectRole(account)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#024950] border-[#0FA4AF] shadow-[0_0_15px_rgba(15,164,175,0.25)] translate-y-[-2px]'
                        : 'bg-[#00272B] border-[#024950] hover:border-[#0FA4AF]/40'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        account.role === 'CREATOR'
                          ? 'bg-[#0FA4AF]/20 text-[#0FA4AF]'
                          : account.role === 'MANAGER'
                          ? 'bg-[#AFDDE5]/20 text-[#AFDDE5]'
                          : account.role === 'REVIEWER'
                          ? 'bg-[#964734]/20 text-[#964734]'
                          : 'bg-[#0FA4AF]/30 text-white'
                      }`}>
                        {account.role}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#0FA4AF]" />}
                    </div>

                    <h4 className="text-sm font-bold text-white mt-2">{account.name}</h4>
                    <p className="text-[11px] text-[#AFDDE5]/70">{account.department}</p>
                    <span className="text-[10px] font-mono text-[#0FA4AF] block mt-2">
                      {account.badgeLabel}
                    </span>

                    <p className="text-[11px] text-[#AFDDE5]/60 mt-2 border-t border-[#024950] pt-2 leading-relaxed">
                      {account.role === 'CREATOR' && 'Draft content, run diagnostics, and accept intent-preserving fixes.'}
                      {account.role === 'MANAGER' && 'Review department submissions, inspect diffs, and endorse to legal.'}
                      {account.role === 'REVIEWER' && 'Inspect high-risk claims, verify citations, and grant final sign-off.'}
                      {account.role === 'ADMIN' && 'Manage Brand Book rules, banned terms, and governance health.'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Credentials Form & Sign-In Action (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl bg-[#024950]/50 border border-[#0FA4AF]/30 shadow-2xl">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-[#0FA4AF] mb-4">
                <Lock className="w-3.5 h-3.5" />
                <span>SECURE JWT AUTHENTICATION</span>
              </div>

              <h3 className="text-base font-bold text-white">Sign In to Workspace</h3>
              <p className="text-xs text-[#AFDDE5]/70 mt-1">
                Active Role: <strong className="text-white">{selectedRole}</strong>
              </p>

              <form onSubmit={handleFormSubmit} className="space-y-4 mt-5">
                <div>
                  <label className="text-xs font-mono text-[#AFDDE5]/70 block mb-1 uppercase">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full text-xs font-mono bg-[#002225] border border-[#0FA4AF]/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#0FA4AF]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-[#AFDDE5]/70 block mb-1 uppercase">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full text-xs font-mono bg-[#002225] border border-[#0FA4AF]/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#0FA4AF]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#0FA4AF] hover:bg-[#0c8e98] text-[#003135] font-bold text-xs tracking-wide transition shadow-[0_0_15px_rgba(15,164,175,0.4)] flex items-center justify-center space-x-2 mt-4"
                >
                  <span>Launch {selectedRole} Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-[#003135]" />
                </button>
              </form>
            </div>

            <div className="mt-6 pt-4 border-t border-[#024950] text-[11px] text-[#AFDDE5]/60 flex items-center justify-between">
              <span>OWASP Top 10 Protected</span>
              <span className="text-[#0FA4AF]">Spring Security 6</span>
            </div>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-6xl w-full mx-auto text-center text-xs text-[#AFDDE5]/50 font-mono py-2">
        Inkloom AI • Intelligent Brand Governance Platform • Team: Ek Kachori Do Samosa
      </footer>

    </div>
  );
};
