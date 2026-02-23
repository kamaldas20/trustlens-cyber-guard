import { useState } from 'react';
import { Phone, X, AlertTriangle, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

const CyberHelpline = () => {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-24 z-50 w-14 h-14 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-lg transition-transform hover:scale-110"
        style={{ boxShadow: '0 0 20px hsl(0 84% 60% / 0.4)' }}
      >
        <Phone className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-md glass-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="w-5 h-5" />
                  <h2 className="text-lg font-bold">{t('helplineTitle')}</h2>
                </div>
                <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Helpline number */}
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 mb-4">
                <p className="text-sm text-muted-foreground">{t('nationalHelpline')}</p>
                <a href="tel:1930" className="text-3xl font-bold text-destructive">{t('helplineNumber')}</a>
                <p className="text-xs text-muted-foreground mt-1">24/7 • Toll Free</p>
              </div>

              {/* Report online */}
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border/50 text-sm text-foreground hover:border-primary/50 transition-colors mb-4"
              >
                <ExternalLink className="w-4 h-4 text-primary" />
                {t('reportOnline')}
              </a>

              {/* Safety tips */}
              <div>
                <h3 className="text-sm font-semibold mb-2 text-accent">{t('safetyTips')}</h3>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span> {t('tip1')}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span> {t('tip2')}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span> {t('tip3')}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span> {t('tip4')}
                  </li>
                </ul>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default CyberHelpline;
