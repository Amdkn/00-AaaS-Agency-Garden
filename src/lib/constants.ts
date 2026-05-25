import { KPI, Alert, SOP, Task, Lead, MarketplaceItem, Agent, ClientWidget, Transaction, ClientProfile, TeamMember, RoleAllocation, LegalDoc, StackConnection } from './types';

export const KPIS: KPI[] = [
  {
    id: 'finance',
    label: 'Finance',
    value: '€12,500',
    subValue: 'Cashflow MTD',
    trend: 'up',
    trendValue: '+12%',
    color: 'success'
  },
  {
    id: 'growth',
    label: 'Growth',
    value: '€45k',
    subValue: 'Pipeline Value',
    trend: 'up',
    trendValue: '8 Active Leads',
    color: 'info'
  },
  {
    id: 'ops',
    label: 'Operations',
    value: '92%',
    subValue: 'Delivery Health',
    trend: 'stable',
    trendValue: 'On-Time',
    color: 'ai'
  },
  {
    id: 'people',
    label: 'Founder Load',
    value: '12h',
    subValue: 'Weekly Ops Time',
    trend: 'down',
    trendValue: 'Target < 10h',
    color: 'warning'
  }
];

export const ALERTS: Alert[] = [
  { id: '1', message: 'Validation devis client TechFlow', severity: 'critical', date: 'Today', actionLabel: 'Valider' },
  { id: '2', message: 'Retard livraison projet GreenScale', severity: 'warning', date: 'Yesterday', actionLabel: 'Voir' },
  { id: '3', message: 'Mise à jour Stripe requise', severity: 'info', date: '2 days ago', actionLabel: 'Review' },
];

export const SOPS: SOP[] = [
  { id: '1', title: 'Onboarding Client', department: 'Ops', locked: true, iconName: 'UserPlus' },
  { id: '2', title: 'Qualification Lead', department: 'Sales', locked: true, iconName: 'Target' },
  { id: '3', title: 'Facturation Fin de Mois', department: 'Finance', locked: true, iconName: 'FileText' },
  { id: '4', title: 'Setup Environnement Dev', department: 'Ops', locked: true, iconName: 'Terminal' },
  { id: '5', title: 'Offboarding Employé', department: 'HR', locked: true, iconName: 'LogOut' },
  { id: '6', title: 'Crisis Management', department: 'Ops', locked: true, iconName: 'ShieldAlert' },
];

export const TASKS: Task[] = [
  { id: '1', title: 'Revue mensuelle', project: 'Internal', deadline: 'Aujourd\'hui', completed: false, sopLink: 'Ops Review' },
  { id: '2', title: 'Envoyer propal Alpha', project: 'Client Alpha', deadline: 'Demain', completed: false, sopLink: 'Sales Process' },
  { id: '3', title: 'Valider wireframes', project: 'Project Beta', deadline: '14 Oct', completed: true },
  { id: '4', title: 'Payer freelances', project: 'Finance', deadline: '30 Oct', completed: false, sopLink: 'Payout SOP' },
  { id: '5', title: 'Brief créatif', project: 'Client Gamma', deadline: '02 Nov', completed: false },
];

export const LEADS: Lead[] = [
  { id: '1', name: 'StartUp Nation', value: '€15k', status: 'Lead' },
  { id: '2', name: 'EduCorp', value: '€8k', status: 'Lead' },
  { id: '3', name: 'HealthPlus', value: '€25k', status: 'In Discussion' },
  { id: '4', name: 'LogiTech', value: '€12k', status: 'In Discussion' },
  { id: '5', name: 'GreenEnergy', value: '€40k', status: 'Won' },
  { id: '6', name: 'RetailKing', value: '€5k', status: 'Won' },
];

export const MARKETPLACE_ITEMS: MarketplaceItem[] = [
  { id: '1', title: 'Module Recrutement IA', description: 'Automatisez 80% du tri des CVs avec notre agent IA.', price: '€49/mo', category: 'HR' },
  { id: '2', title: 'Pack Audit Juridique', description: 'Templates de contrats validés par avocats spécialisés.', price: '€299', category: 'Legal' },
  { id: '3', title: 'Growth Engine v2', description: 'Systeme complet de cold outreach + CRM setup.', price: '€129/mo', category: 'Growth' },
  { id: '4', title: 'Dashboard Finance Pro', description: 'Connecteurs bancaires et prévisionnel de trésorerie.', price: '€89/mo', category: 'Finance' },
];

// THE JUSTICE LEAGUE / E-MYTH BOARD
export const AI_AGENTS: Agent[] = [
    { id: '1', name: 'Jerry', role: 'Orchestrator', emoji: '🧠', status: 'Running', task: 'Synthesizing business pulse...', description: 'Your Co-Pilot and Chief of Staff.' },
    { id: '2', name: 'Superman', role: 'Growth Manager', emoji: '🚀', status: 'Running', task: 'Scanning for market opportunities...', description: 'Leads, Sales, and Marketing Engine.' },
    { id: '3', name: 'Batman', role: 'Ops Manager', emoji: '🦇', status: 'Idle', task: 'Optimizing workflow protocols...', description: 'Project Delivery and Quality Control.' },
    { id: '4', name: 'Flash', role: 'Product Manager', emoji: '⚡', status: 'Running', task: 'Accelerating feature delivery...', description: 'Product Roadmap and Velocity.' },
    { id: '5', name: 'Wonder Woman', role: 'Finance Manager', emoji: '💫', status: 'Idle', task: 'Auditing cashflow projections...', description: 'Financial Health and Strategy.' },
    { id: '6', name: 'Green Lantern', role: 'People Manager', emoji: '💚', status: 'Idle', task: 'Reviewing team capacity...', description: 'HR, Culture, and Recruiting.' },
    { id: '7', name: 'Cyborg', role: 'IT Manager', emoji: '🦾', status: 'Running', task: 'Maintaing system integrity...', description: 'Tech Stack and Automation.' },
    { id: '8', name: 'Aquaman', role: 'Legal Manager', emoji: '🔱', status: 'Idle', task: 'Monitoring compliance depth...', description: 'Contracts and Risk Management.' },
];

export const CLIENT_WIDGETS: ClientWidget[] = [
    { id: '1', name: 'TechFlow', status: 'Active' },
    { id: '2', name: 'GreenScale', status: 'Onboarding' },
    { id: '3', name: 'Alpha Corp', status: 'Active' },
];

export const FINANCE_KPI_CARDS: KPI[] = [
    { id: 'f1', label: 'Net Cashflow', value: '€24,500', subValue: 'Last 30 days', trend: 'up', trendValue: '+18%', color: 'success' },
    { id: 'f2', label: 'Pending Invoices', value: '€8,200', subValue: '3 Clients', trend: 'down', trendValue: 'Action needed', color: 'warning' },
    { id: 'f3', label: 'Expenses', value: '€6,400', subValue: 'Run rate', trend: 'stable', trendValue: 'On budget', color: 'info' },
];

export const TRANSACTIONS: Transaction[] = [
    { id: '1', date: 'Oct 24, 2023', clientName: 'TechFlow Systems', clientAvatar: 'TF', type: 'Invoice', amount: '+€4,500.00', status: 'Paid' },
    { id: '2', date: 'Oct 23, 2023', clientName: 'AWS EMEA', clientAvatar: 'AW', type: 'Expense', amount: '-€124.50', status: 'Paid' },
    { id: '3', date: 'Oct 21, 2023', clientName: 'GreenScale Inc', clientAvatar: 'GS', type: 'Invoice', amount: '+€2,800.00', status: 'Overdue' },
    { id: '4', date: 'Oct 20, 2023', clientName: 'Freelance: M. Design', clientAvatar: 'MD', type: 'Expense', amount: '-€650.00', status: 'Pending' },
    { id: '5', date: 'Oct 18, 2023', clientName: 'Alpha Corp', clientAvatar: 'AC', type: 'Invoice', amount: '+€1,200.00', status: 'Paid' },
];

export const CLIENT_PROFILES: ClientProfile[] = [
    { id: '1', name: 'TechFlow Systems', logo: 'TF', contactName: 'Sarah Conner', healthScore: 92, tier: 'Tier 3: Enterprise', status: 'Active' },
    { id: '2', name: 'GreenScale Inc', logo: 'GS', contactName: 'Mike Ross', healthScore: 45, tier: 'Tier 1: Starter', status: 'Churn Risk' },
    { id: '3', name: 'Alpha Corp', logo: 'AC', contactName: 'Jessica Pearson', healthScore: 78, tier: 'Tier 2: Sovereign Box', status: 'Active' },
    { id: '4', name: 'EduCorp Global', logo: 'EG', contactName: 'Harvey Specter', healthScore: 100, tier: 'Tier 2: Sovereign Box', status: 'Onboarding' },
    { id: '5', name: 'RetailKing', logo: 'RK', contactName: 'Louis Litt', healthScore: 88, tier: 'Tier 1: Starter', status: 'Active' },
];

export const TEAM_MEMBERS: TeamMember[] = [
    { id: '1', name: 'John Doe', role: 'Founder & CEO', avatar: 'JD', type: 'Founder', load: 85 },
    { id: '2', name: 'Mike Ross', role: 'Lead Developer', avatar: 'MR', type: 'Freelance', load: 95 },
    { id: '3', name: 'Billing-Bot', role: 'Finance Auto-Pilot', avatar: 'BB', type: 'AI', load: 20 },
    { id: '4', name: 'Sarah Key', role: 'Ops Manager', avatar: 'SK', type: 'Freelance', load: 60 },
    { id: '5', name: 'Intake-Agent', role: 'CRM Automation', avatar: 'IA', type: 'AI', load: 45 },
];

export const ROLE_ALLOCATIONS: RoleAllocation[] = [
    { id: '1', domain: 'Finance & Legal', ownerName: 'John Doe', ownerAvatar: 'JD' },
    { id: '2', domain: 'Operations & Delivery', ownerName: 'Sarah Key', ownerAvatar: 'SK' },
    { id: '3', domain: 'Tech & Infrastructure', ownerName: 'Mike Ross', ownerAvatar: 'MR' },
    { id: '4', domain: 'Growth & Marketing', ownerName: 'John Doe', ownerAvatar: 'JD' },
];

export const LEGAL_DOCS: LegalDoc[] = [
    { id: '1', title: 'MSA - TechFlow Systems', type: 'PDF', date: 'Oct 10, 2023', status: 'Signed', category: 'Client' },
    { id: '2', title: 'Freelance Agreement - Mike Ross', type: 'PDF', date: 'Sep 01, 2023', status: 'Signed', category: 'Freelance' },
    { id: '3', title: 'NDA - GreenScale Project', type: 'DOCX', date: 'Oct 22, 2023', status: 'Pending', category: 'Client' },
    { id: '4', title: 'Service Proposal - EduCorp', type: 'PDF', date: 'Oct 24, 2023', status: 'Draft', category: 'Client' },
    { id: '5', title: 'SaaS Terms of Service v2', type: 'DOCX', date: 'Aug 15, 2023', status: 'Signed', category: 'Corporate' },
];

export const STACK_CONNECTIONS: StackConnection[] = [
    { id: '1', name: 'Stripe Payments', status: 'Connected', latency: '45ms', uptime: '99.99%', type: 'API' },
    { id: '2', name: 'Supabase DB', status: 'Connected', latency: '12ms', uptime: '99.95%', type: 'Database' },
    { id: '3', name: 'OpenAI API', status: 'Connected', latency: '240ms', uptime: '99.90%', type: 'AI' },
    { id: '4', name: 'Google Workspace', status: 'Connected', latency: '65ms', uptime: '99.99%', type: 'Auth' },
    { id: '5', name: 'SendGrid Email', status: 'Maintenance', latency: '-', uptime: '98.50%', type: 'API' },
];