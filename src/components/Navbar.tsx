import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage, Lang } from '@/contexts/LanguageContext';
import { Shield, Globe, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const langOptions: { value: Lang; label: string }[] = [
    { value: 'en', label: 'EN' },
    { value: 'hi', label: 'हि' },
    { value: 'od', label: 'ଓ' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Shield className="w-8 h-8 text-primary transition-all group-hover:text-accent" />
            <span className="text-lg font-bold gradient-text">TrustLense-AI</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t('home')}
            </Link>
            {user && (
              <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t('dashboard')}
              </Link>
            )}

            {/* Language Switcher */}
            <div className="flex items-center gap-1 rounded-lg bg-muted/50 p-1">
              <Globe className="w-3.5 h-3.5 text-muted-foreground ml-1" />
              {langOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setLang(opt.value)}
                  className={`px-2 py-1 text-xs rounded-md transition-all ${
                    lang === opt.value
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard">
                  <Button variant="outline" size="sm" className="border-border/50 hover:border-primary/50">
                    <LayoutDashboard className="w-4 h-4 mr-1" />
                    {t('dashboard')}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => { await logout(); navigate('/'); }}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  {t('login')}
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass-card border-t border-border/50 p-4 space-y-3 animate-fade-in-fast">
          <Link to="/" className="block text-sm text-muted-foreground" onClick={() => setMobileOpen(false)}>
            {t('home')}
          </Link>
          {user && (
            <Link to="/dashboard" className="block text-sm text-muted-foreground" onClick={() => setMobileOpen(false)}>
              {t('dashboard')}
            </Link>
          )}
          <div className="flex items-center gap-1">
            {langOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setLang(opt.value)}
                className={`px-3 py-1 text-xs rounded-md ${
                  lang === opt.value ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {user ? (
            <Button variant="ghost" size="sm" onClick={async () => { await logout(); navigate('/'); setMobileOpen(false); }}>
              <LogOut className="w-4 h-4 mr-2" /> {t('logout')}
            </Button>
          ) : (
            <Link to="/login" onClick={() => setMobileOpen(false)}>
              <Button size="sm" className="w-full bg-primary">{t('login')}</Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
