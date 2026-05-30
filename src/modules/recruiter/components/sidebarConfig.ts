import {
  LayoutDashboard,
  FileText,
  Users,
  Calendar,
  Phone,
  Mail,
  BarChart3,
  TrendingUp,
  Settings,
} from 'lucide-react';

export const recruiterSidebarItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/recruiter/dashboard' },
  { label: 'Job Descriptions', icon: FileText, path: '/recruiter/jobs' },
  { label: 'Candidate Pipeline', icon: Users, path: '/recruiter/pipeline' },
  { label: 'Interviews', icon: Calendar, path: '/recruiter/interviews', badge: '3' },
  { label: 'Voice AI', icon: Phone, path: '/recruiter/voice-ai' },
  { label: 'Email Campaigns', icon: Mail, path: '/recruiter/email' },
  { label: 'Analytics', icon: BarChart3, path: '/recruiter/analytics' },
  { label: 'Market Intel', icon: TrendingUp, path: '/recruiter/market' },
  { label: 'Settings', icon: Settings, path: '/recruiter/settings' },
];
