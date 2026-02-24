import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  LayoutDashboard, Image, Mic, Link2, FileSearch, LogOut, Shield,
  ChevronLeft, ChevronRight, ShieldAlert, MessageSquareWarning,
} from 'lucide-react';

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  const { logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: t('overview') },
    { to: '/dashboard/image', icon: Image, label: t('imageDetection') },
    { to: '/dashboard/voice', icon: Mic, label: t('voiceDetection') },
    { to: '/dashboard/phishing', icon: Link2, label: t('phishingAnalysis') },
    { to: '/dashboard/malware', icon: FileSearch, label: t('malwareDetection') },
    { to: '/dashboard/fake-loan', icon: ShieldAlert, label: t('fakeLoanDetector') },
    { to: '/dashboard/fake-sms', icon: MessageSquareWarning, label: t('fakeSmsDetector') },
  ];

  return (
    <div className="flex min-h-screen pt-16">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 bottom-0 z-40 bg-sidebar border-r border-sidebar-border transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-60'
        } hidden md:flex flex-col`}
      >
        <div className="flex-1 py-4 space-y-1 px-2">
          {links.map((link) => {
            const active = pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  active
                    ? 'bg-sidebar-accent text-primary neon-glow-blue'
                    : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                } ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? link.label : undefined}
              >
                <link.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="truncate">{link.label}</span>}
              </Link>
            );
          })}
        </div>

        <div className="p-2 space-y-1 border-t border-sidebar-border">
          <button
            onClick={async () => { await logout(); navigate('/'); }}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:text-destructive hover:bg-sidebar-accent/50 transition-all w-full ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>{t('logout')}</span>}
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-full py-2 text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-card border-t border-border/50 flex justify-around py-2 px-1">
        {links.map((link) => {
          const active = pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg text-xs transition-all ${
                active ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <link.icon className="w-5 h-5" />
            </Link>
          );
        })}
      </div>

      {/* Main content */}
      <main className={`flex-1 transition-all duration-300 ${collapsed ? 'md:ml-16' : 'md:ml-60'} p-4 md:p-8 pb-20 md:pb-8`}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
