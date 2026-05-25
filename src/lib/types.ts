import { ReactNode } from 'react';

// Navigation State
export enum NavView {
  DASHBOARD = 'DASHBOARD',
  FINANCE = 'FINANCE',
  PEOPLE = 'PEOPLE',
  TASKS = 'TASKS',
  CLIENTS = 'CLIENTS',
  SOP_LIBRARY = 'SOP_LIBRARY',
  LEGAL = 'LEGAL',
  GROWTH = 'GROWTH',
  MARKETPLACE = 'MARKETPLACE',
  IT_DATA = 'IT_DATA',
  SETTINGS = 'SETTINGS',
  SALES = 'SALES'
}

// Interaction Interfaces
export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

export interface ViewProps {
  onShowToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  onOpenModal: (title: string, content: ReactNode) => void;
}

// Data Interfaces
export interface KPI {
  id: string;
  label: string;
  value: string;
  subValue?: string;
  trend: 'up' | 'down' | 'neutral' | 'stable';
  trendValue?: string;
  color: 'success' | 'warning' | 'ai' | 'info';
}

export interface Alert {
  id: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  date: string;
  actionLabel: string;
}

export interface SOP {
  id: string;
  title: string;
  department: 'Ops' | 'Sales' | 'Finance' | 'HR';
  locked: boolean;
  iconName: string;
}

export interface Task {
  id: string;
  title: string;
  project: string;
  deadline: string;
  completed: boolean;
  sopLink?: string;
}

export interface Lead {
  id: string;
  name: string;
  value: string;
  status: 'Lead' | 'In Discussion' | 'Won';
}

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string;
}

export interface Agent {
    id: string;
    name: string;
    role: string;
    emoji: string;
    status: 'Running' | 'Idle' | 'Error';
    task: string;
    description?: string;
}

export interface ClientWidget {
    id: string;
    name: string;
    status: 'Active' | 'Onboarding' | 'Churn Risk';
}

export interface Transaction {
    id: string;
    date: string;
    clientName: string;
    clientAvatar: string; // Initial or color
    type: 'Invoice' | 'Expense';
    amount: string;
    status: 'Paid' | 'Pending' | 'Overdue';
}

export interface ClientProfile {
    id: string;
    name: string;
    logo: string; // Initials
    contactName: string;
    healthScore: number; // 0-100
    tier: string;
    status: 'Active' | 'Onboarding' | 'Churn Risk';
}

export interface TeamMember {
    id: string;
    name: string;
    role: string;
    avatar: string; // Initials
    type: 'Founder' | 'Freelance' | 'AI';
    load: number; // 0-100
}

export interface RoleAllocation {
    id: string;
    domain: string;
    ownerName: string;
    ownerAvatar: string;
}

export interface LegalDoc {
    id: string;
    title: string;
    type: 'PDF' | 'DOCX';
    date: string;
    status: 'Signed' | 'Pending' | 'Draft';
    category: 'Client' | 'Freelance' | 'Corporate';
}

export interface StackConnection {
    id: string;
    name: string;
    status: 'Connected' | 'Error' | 'Maintenance';
    latency: string;
    uptime: string;
    type: 'Database' | 'API' | 'Auth' | 'AI';
}