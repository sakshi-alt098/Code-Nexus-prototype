import { UserAccount } from '../types';

export const DEMO_ACCOUNTS: UserAccount[] = [
  {
    id: 'user-creator',
    name: 'Alex Croft',
    email: 'creator@inkloom.ai',
    role: 'CREATOR',
    department: 'Corporate PR & Comms',
    badgeLabel: 'Content Author'
  },
  {
    id: 'user-manager',
    name: 'Purva Deshmukh',
    email: 'manager@inkloom.ai',
    role: 'MANAGER',
    department: 'Marketing Operations',
    badgeLabel: 'Reviewing Manager'
  },
  {
    id: 'user-reviewer',
    name: 'Sakshi Dharpure',
    email: 'reviewer@inkloom.ai',
    role: 'REVIEWER',
    department: 'Legal & Brand Compliance',
    badgeLabel: 'Authorised Sign-Off'
  },
  {
    id: 'user-admin',
    name: 'Khushi Rathi',
    email: 'admin@inkloom.ai',
    role: 'ADMIN',
    department: 'Brand Governance Office',
    badgeLabel: 'System Administrator'
  }
];
