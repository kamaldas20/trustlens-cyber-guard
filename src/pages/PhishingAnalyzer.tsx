import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link2, Search, Shield, AlertTriangle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

const PhishingAnalyzer = () => {
  const { t } = useLanguage();
  const [url, setUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{
    verdict: 'safe' | 'suspicious' | 'dangerous';
    threats: string[];
  } | null>(null);

  const analyze = async () => {
    if (!url.trim()) return;
    setScanning(true);
    setProgress(0);
    setResult(null);

    for (let i = 0; i <= 100; i += 3) {
      await new Promise((r) => setTimeout(r, 30));
      setProgress(i);
    }

    // Simulated result
    const rand = Math.random();
    const verdict = rand > 0.6 ? 'safe' : rand > 0.3 ? 'suspicious' : 'dangerous';
    const threats =
      verdict === 'dangerous'
        ? ['SOCIAL_ENGINEERING', 'MALWARE']
        : verdict === 'suspicious'
        ? ['SOCIAL_ENGINEERING']
        : [];

    setResult({ verdict, threats });
    setScanning(false);
  };

  const verdictConfig = {
    safe: {
      label: t('safe'),
      icon: Shield,
      color: 'text-accent',
      bg: 'bg-accent/10',
      border: 'border-accent/30',
      desc: 'No threats detected. This URL appears to be safe.',
    },
    suspicious: {
      label: t('suspicious'),
      icon: AlertTriangle,
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10',
      border: 'border-yellow-400/30',
      desc: 'This URL shows signs of potential social engineering. Proceed with caution.',
    },
    dangerous: {
      label: t('dangerous'),
      icon: XCircle,
      color: 'text-destructive',
      bg: 'bg-destructive/10',
      border: 'border-destructive/30',
      desc: 'This URL has been flagged for malware and social engineering threats. Do NOT proceed.',
    },
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <Link2 className="w-5 h-5 text-accent" />
          </div>
          <h1 className="text-2xl font-bold">{t('phishingAnalysis')}</h1>
        </div>

        <div className="glass-card p-6">
          <p className="text-sm text-muted-foreground mb-4">{t('pasteUrl')}</p>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={t('urlPlaceholder')}
                className="pl-10 bg-muted/30 border-border/50 focus:border-accent/50"
                onKeyDown={(e) => e.key === 'Enter' && analyze()}
              />
            </div>
            <Button onClick={analyze} disabled={scanning || !url.trim()} className="bg-accent text-accent-foreground hover:bg-accent/90">
              {scanning ? t('scanning') : t('analyze')}
            </Button>
          </div>
        </div>

        {scanning && (
          <div className="space-y-2 mt-4">
            <Progress value={progress} className="h-2" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs text-muted-foreground">{t('scanning')} {progress}%</span>
            </div>
          </div>
        )}

        {result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-4">
            {(() => {
              const v = verdictConfig[result.verdict];
              return (
                <div className={`${v.bg} border ${v.border} rounded-xl p-6`}>
                  <div className="flex items-center gap-3 mb-3">
                    <v.icon className={`w-8 h-8 ${v.color}`} />
                    <div>
                      <p className={`text-xl font-bold ${v.color}`}>{v.label}</p>
                      <p className="text-xs text-muted-foreground">{url}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{v.desc}</p>

                  {result.threats.length > 0 && (
                    <div className="mt-4 flex gap-2">
                      {result.threats.map((threat) => (
                        <span
                          key={threat}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${v.bg} ${v.color} border ${v.border}`}
                        >
                          {threat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default PhishingAnalyzer;
