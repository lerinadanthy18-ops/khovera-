import { Home, Trophy, FileText, BadgeCheck, ClipboardCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type ViewId = 'dashboard' | 'challenges' | 'submissions' | 'review' | 'passport';

export interface NavItem {
  id: ViewId;
  label: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'challenges', label: 'Skill Challenges', icon: Trophy },
  { id: 'submissions', label: 'My Submissions', icon: FileText },
  { id: 'review', label: 'Demo Review', icon: ClipboardCheck },
  { id: 'passport', label: 'Skill Passport', icon: BadgeCheck },
];
