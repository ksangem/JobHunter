import {
  LayoutDashboard,
  UserCircle,
  BriefcaseBusiness,
  Calendar,
  FileText,
  Settings,
} from 'lucide-react';

export const candidateSidebarItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/candidate/dashboard' },
  { label: 'My Profile', icon: UserCircle, path: '/candidate/profile' },
  { label: 'Job Matches', icon: BriefcaseBusiness, path: '/candidate/jobs', badge: '5' },
  { label: 'Interviews', icon: Calendar, path: '/candidate/interviews', badge: '2' },
  { label: 'Resume AI', icon: FileText, path: '/candidate/resume-ai' },
  { label: 'Settings', icon: Settings, path: '/candidate/settings' },
];
