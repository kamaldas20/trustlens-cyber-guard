import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Image, Mic, Link2, FileSearch, Lock, EyeOff, UserCheck, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ParticlesBackground from '@/components/ParticlesBackground';
import { motion } from 'framer-motion';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
});

const Index = () => {
  const { t } = useLanguage();

  const features = [
    { icon: Image, title: t('imageDetection'), desc: t('imageDetectionDesc'), color: 'text-primary', glow: 'neon-glow-blue' },
    { icon: Mic, title: t('voiceDetection'), desc: t('voiceDetectionDesc'), color: 'text-secondary', glow: 'neon-glow-purple' },
    { icon: Link2, title: t('phishingAnalysis'), desc: t('phishingAnalysisDesc'), color: 'text-accent', glow: 'neon-glow-green' },
    { icon: FileSearch, title: t('malwareDetection'), desc: t('malwareDetectionDesc'), color: 'text-primary', glow: 'neon-glow-blue' },
  ];

  const trustItems = [
    { icon: Lock, title: t('privacyFirst'), desc: t('privacyFirstDesc') },
    { icon: Database, title: t('noStorage'), desc: t('noStorageDesc') },
    { icon: EyeOff, title: t('noSurveillance'), desc: t('noSurveillanceDesc') },
    { icon: UserCheck, title: t('userControlled'), desc: t('userControlledDesc') },
  ];

  return (
    <div className="relative min-h-screen">
      <ParticlesBackground />

      {/* Hero */}
      <section className="relative z-10 min-h-screen flex items-center justify-center gradient-bg-hero">
        <div className="max-w-5xl mx-auto px-4 text-center pt-20">
          <motion.div {...fadeUp(0)}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/30 border border-border/50 mb-8">
              <Shield className="w-4 h-4 text-accent" />
              <span className="text-xs text-muted-foreground font-medium tracking-wide uppercase">AI Safety Platform</span>
            </div>
          </motion.div>

          <motion.h1
            {...fadeUp(0.1)}
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6"
          >
            <span className="gradient-text">TrustLense-AI</span>
          </motion.h1>

          <motion.p {...fadeUp(0.2)} className="text-lg sm:text-xl md:text-2xl text-muted-foreground font-medium mb-4">
            {t('heroTitle')}
          </motion.p>

          <motion.p {...fadeUp(0.3)} className="text-sm sm:text-base text-muted-foreground/70 max-w-2xl mx-auto mb-10">
            {t('heroSubtitle')}
          </motion.p>

          <motion.div {...fadeUp(0.4)} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="bg-primary hover:bg-primary/90 px-8 py-6 text-base neon-glow-blue">
                {t('getStarted')}
              </Button>
            </Link>
            <a href="#features">
              <Button variant="outline" size="lg" className="border-border/50 hover:border-primary/50 px-8 py-6 text-base">
                {t('learnMore')}
              </Button>
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div {...fadeUp(0.5)} className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[['99.2%', 'Accuracy'], ['<1s', 'Analysis'], ['100%', 'Private']].map(([val, label]) => (
              <div key={label}>
                <div className="text-2xl font-bold gradient-text">{val}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t('featuresTitle')}</h2>
            <p className="text-muted-foreground">{t('featuresSubtitle')}</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} {...fadeUp(i * 0.1)}>
                <Link
                  to="/login"
                  className="glass-card-hover block p-6 h-full group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center mb-4 ${f.color} group-hover:${f.glow} transition-all`}>
                    <f.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-2 text-foreground">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t('trustTitle')}</h2>
            <p className="text-muted-foreground">{t('trustSubtitle')}</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustItems.map((item, i) => (
              <motion.div key={item.title} {...fadeUp(i * 0.1)} className="glass-card p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-2 text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold gradient-text">TrustLense-AI</span>
          </div>
          <p className="text-xs text-muted-foreground">{t('copyrightText')}</p>
          <p className="text-xs text-muted-foreground">{t('madeWith')}</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
