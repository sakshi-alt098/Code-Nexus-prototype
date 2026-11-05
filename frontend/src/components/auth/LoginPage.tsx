import React, { useState } from 'react';
import { UserAccount, UserRole } from '../../types';
import { DEMO_ACCOUNTS } from '../../data/mockUsers';
import { Shield, Lock, ArrowRight, CheckCircle2, Play } from 'lucide-react';

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
    <div className="min-h-screen bg-[#0A0912] text-[#EDE9FE] flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#B69DF8]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#E879F9]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar */}
      <header className="relative z-10 max-w-6xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#B69DF8] to-[#E879F9] flex items-center justify-center font-black text-[#0A0912] shadow-[0_0_15px_rgba(182,157,248,0.4)]">
            <Shield className="w-5 h-5 text-[#0A0912]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-base font-bold tracking-tight text-white">Inkloom AI</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#B69DF8]/15 text-[#B69DF8] border border-[#B69DF8]/30">
                Brand Governance Platform
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onWatchIntro}
          className="px-3 py-1.5 rounded-xl bg-[#151324] hover:bg-[#201c36] text-xs text-[#EDE9FE] border border-[#B69DF8]/30 transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 text-[#B69DF8]" />
          <span>Watch Intro Animation</span>
        </button>
      </header>

      {/* Center Auth Portal */}
      <main className="relative z-10 max-w-4xl w-full mx-auto my-auto py-8">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Enterprise Brand Governance Portal
          </h1>
          <p className="text-xs sm:text-sm text-[#EDE9FE]/70 mt-2 max-w-lg mx-auto">
            Select your persona to preview intelligent brand & privacy verification, collaborative approvals, and visual audits.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column: 1-Click Persona Cards */}
          <div className="lg:col-span-7 space-y-3">
            <span className="text-xs font-mono uppercase text-[#EDE9FE]/70 block mb-1">
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
                        ? 'bg-[#151324] border-[#B69DF8] shadow-[0_0_15px_rgba(182,157,248,0.3)] translate-y-[-2px]'
                        : 'bg-[#0A0912] border-[#2E2A4A] hover:border-[#B69DF8]/40'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        account.role === 'CREATOR'
                          ? 'bg-[#B69DF8]/20 text-[#B69DF8]'
                          : account.role === 'MANAGER'
                          ? 'bg-[#C38EB4]/20 text-[#C38EB4]'
                          : account.role === 'REVIEWER'
                          ? 'bg-[#E879F9]/20 text-[#E879F9]'
                          : 'bg-white/20 text-white'
                      }`}>
                        {account.role}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#B69DF8]" />}
                    </div>

                    <h4 className="text-sm font-bold text-white mt-2">{account.name}</h4>
                    <p className="text-[11px] text-[#EDE9FE]/70">{account.department}</p>
                    <span className="text-[10px] font-mono text-[#B69DF8] block mt-2">
                      {account.badgeLabel}
                    </span>

                    <p className="text-[11px] text-[#EDE9FE]/60 mt-2 border-t border-[#2E2A4A] pt-2 leading-relaxed">
                      {account.role === 'CREATOR' && 'Upload company policy, test drafts against guidelines, and auto-remediate.'}
                      {account.role === 'MANAGER' && 'Review department submissions, inspect word diffs, and forward to legal.'}
                      {account.role === 'REVIEWER' && 'Audit high-risk claims, verify citations, and grant legal sign-off.'}
                      {account.role === 'ADMIN' && 'Manage Brand Rules Vault, banned terms, and governance insights.'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Sign-In Action */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl bg-[#151324] border border-[#2E2A4A] shadow-2xl">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-[#B69DF8] mb-4">
                <Lock className="w-3.5 h-3.5" />
                <span>SECURE ACCESS</span>
              </div>

              <h3 className="text-base font-bold text-white">Enter Workspace</h3>
              <p className="text-xs text-[#EDE9FE]/70 mt-1">
                Active Persona: <strong className="text-[#B69DF8]">{selectedRole}</strong>
              </p>

              <form onSubmit={handleFormSubmit} className="space-y-4 mt-5">
                <div>
                  <label className="text-xs font-mono text-[#EDE9FE]/70 block mb-1 uppercase">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full text-xs font-mono bg-[#0A0912] border border-[#2E2A4A] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#B69DF8]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-[#EDE9FE]/70 block mb-1 uppercase">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full text-xs font-mono bg-[#0A0912] border border-[#2E2A4A] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#B69DF8]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#B69DF8] hover:bg-[#a688f7] text-[#0A0912] font-bold text-xs tracking-wide transition shadow-[0_0_15px_rgba(182,157,248,0.4)] flex items-center justify-center space-x-2 mt-4 cursor-pointer"
                >
                  <span>Launch {selectedRole} Workspace</span>
                  <ArrowRight className="w-4 h-4 text-[#0A0912]" />
                </button>
              </form>
            </div>

            <div className="mt-6 pt-4 border-t border-[#2E2A4A] text-[11px] text-[#EDE9FE]/60 flex items-center justify-between">
              <span>OWASP Top 10 Compliant</span>
              <span className="text-[#B69DF8]">Role-Based Access Control</span>
            </div>
          </div>

        </div>

      </main>

      {/* Streamlined Footer without team name */}
      <footer className="relative z-10 max-w-6xl w-full mx-auto text-center text-xs text-[#EDE9FE]/50 font-mono py-2">
        Inkloom AI • Intelligent Brand Governance Platform
      </footer>

    </div>
  );
};
