import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  MessageSquare, 
  Users, 
  Trophy, 
  BookOpen, 
  Settings, 
  Bell, 
  User,
  GraduationCap
} from 'lucide-react';
import { cn } from '../lib/utils'; // I'll need to create this in UI package too

interface SidebarProps {
  className?: string;
}

const NAV_ITEMS = [
  { icon: Home, label: 'Dashboard', href: '/' },
  { icon: MessageSquare, label: 'Chat', href: '/chat' },
  { icon: GraduationCap, label: 'Mentors', href: '/mentors' },
  { icon: BookOpen, label: 'Resources', href: '/resources' },
  { icon: Users, label: 'Study Groups', href: '/study-groups' },
  { icon: Trophy, label: 'Leaderboard', href: '/leaderboard' },
  { icon: Bell, label: 'Notifications', href: '/notifications' },
  { icon: User, label: 'Profile', href: '/profile' },
];

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-screen w-64 glass border-r flex flex-col z-50 transition-all duration-300",
      className
    )}>
      {/* Brand Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200">
          <GraduationCap className="text-white h-6 w-6" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent heading">
          ClinIQ
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto pt-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                isActive 
                  ? "bg-emerald-50 text-emerald-600 shadow-sm" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
                isActive ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-600"
              )} />
              <span className="font-medium text-sm">{item.label}</span>
              
              {isActive && (
                <div className="absolute left-0 w-1 h-6 bg-emerald-600 rounded-r-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Actions / Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-200 group">
          <Settings className="h-5 w-5 text-slate-400 group-hover:text-slate-600" />
          <span className="text-sm font-medium text-slate-600">Settings</span>
        </button>
      </div>
    </aside>
  );
}
