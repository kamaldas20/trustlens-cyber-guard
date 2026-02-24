import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShieldAlert, Search, AlertTriangle, CheckCircle, XCircle, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { addScanRecord } from '@/lib/scanHistory';

const KNOWN_FAKE_PATTERNS = [
  'instant cash', 'fast loan', 'rupee click', 'cash bus', 'loan zone', 'okash', 'opesa',
  'kashway', 'happy loan', 'easy cash', 'money click', 'snap it loan', 'go cash',
  'flash rupee', 'koko loan', 'loan spot', 'credit bus', 'cash papa', 'loan cube',
  'cash elephant', 'money vela', 'dhani loan', 'creditmantri fake', 'paisabazaar fake',
  'loan trick', 'quick rupee', 'fast cash', 'instant rupee', 'gold loan app', 'mini loan',
];

const SUSPICIOUS_INDICATORS = [
  { pattern: /loan/i, weight: 1, reason: 'Contains "loan" keyword' },
  { pattern: /cash/i, weight: 1, reason: 'Contains "cash" keyword' },
  { pattern: /instant|fast|quick|flash|easy/i, weight: 2, reason: 'Uses urgency language' },
  { pattern: /rupee|₹|paisa/i, weight: 1, reason: 'Currency reference in name' },
  { pattern: /\.apk$/i, weight: 3, reason: 'Direct APK download (not from Play Store)' },
  { pattern: /bit\.ly|tinyurl|shorturl/i, weight: 3, reason: 'Uses URL shortener' },
  { pattern: /t\.me|telegram|whatsapp/i, weight: 2, reason: 'Distributed via messaging apps' },
  { pattern: /drive\.google\.com.*\.apk/i, weight: 3, reason: 'APK hosted on Google Drive' },
  { pattern: /mediafire|mega\.nz|dropbox.*\.apk/i, weight: 3, reason: 'APK on file-sharing site' },
  { pattern: /play\.google\.com/i, weight: -2, reason: 'Available on Google Play Store' },
];

const FakeLoanDetector = () => {
  const { t } = useLanguage();
  const [input, setInput] = useState('');
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{
    score: number;
    verdict: 'safe' | 'suspicious' | 'dangerous';
    reasons: string[];
    matchedFake: string | null;
  } | null>(null);

  const analyze = async () => {
    if (!input.trim()) return;
    setScanning(true);
    setProgress(0);
    setResult(null);

    for (let i = 0; i <= 100; i += 2) {
      await new Promise(r => setTimeout(r, 25));
      setProgress(i);
    }

    const lower = input.toLowerCase().trim();
    let score = 0;
    const reasons: string[] = [];

    // Check against known fake apps
    const matchedFake = KNOWN_FAKE_PATTERNS.find(p => lower.includes(p));
    if (matchedFake) {
      score += 5;
      reasons.push(`Matches known fake loan app pattern: "${matchedFake}"`);
    }

    // Run indicator checks
    for (const ind of SUSPICIOUS_INDICATORS) {
      if (ind.pattern.test(input)) {
        score += ind.weight;
        reasons.push(ind.reason);
      }
    }

    // Additional heuristics
    if (lower.length < 5 && /loan|cash/i.test(lower)) {
      score += 1;
      reasons.push('Very short app name with financial keyword');
    }
    if (/[0-9]{2,}%/i.test(input)) {
      score += 2;
      reasons.push('Contains percentage claims in name/link');
    }
    if (/no.*kyc|without.*kyc|kyc.*not.*required/i.test(input)) {
      score += 3;
      reasons.push('Claims no KYC required (regulatory red flag)');
    }
    if (/guarantee|100%|assured/i.test(input)) {
      score += 2;
      reasons.push('Uses guarantee language (common in scams)');
    }

    if (reasons.length === 0) {
      reasons.push('No suspicious patterns detected');
    }

    const clampedScore = Math.max(0, Math.min(10, score));
    const verdict: 'safe' | 'suspicious' | 'dangerous' =
      clampedScore >= 6 ? 'dangerous' : clampedScore >= 3 ? 'suspicious' : 'safe';

    setResult({ score: clampedScore, verdict, reasons, matchedFake });
    addScanRecord({
      type: 'loan_apk',
      label: input.slice(0, 50),
      result: verdict,
    });
    setScanning(false);
  };

  const verdictConfig = {
    safe: { label: t('safe'), icon: CheckCircle, color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/30' },
    suspicious: { label: t('suspicious'), icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30' },
    dangerous: { label: t('dangerous'), icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/30' },
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t('fakeLoanDetector')}</h1>
            <p className="text-xs text-muted-foreground">{t('fakeLoanDesc')}</p>
          </div>
        </div>

        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Smartphone className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{t('enterAppNameOrLink')}</span>
          </div>
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="e.g. EasyCash Loan or https://bit.ly/fakeapp.apk"
              className="flex-1"
              onKeyDown={e => e.key === 'Enter' && analyze()}
            />
            <Button onClick={analyze} disabled={scanning || !input.trim()} className="bg-primary hover:bg-primary/90">
              {scanning ? t('scanning') : <><Search className="w-4 h-4 mr-2" />{t('analyze')}</>}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">{t('fakeLoanHint')}</p>
        </div>

        {scanning && (
          <div className="space-y-3 mt-4">
            <Progress value={progress} className="h-2" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs text-muted-foreground">{t('analyzingApp')}</span>
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
                      <p className="text-xs text-muted-foreground">{t('riskScore')}: {result.score}/10</p>
                    </div>
                  </div>
                  {result.matchedFake && (
                    <div className="px-3 py-1.5 rounded-lg bg-destructive/20 text-destructive text-sm mb-3">
                      ⚠️ Matched known fake loan app database
                    </div>
                  )}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase">{t('findings')}:</p>
                    {result.reasons.map((r, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <span className={result.verdict === 'safe' ? 'text-accent' : 'text-yellow-400'}>•</span>
                        <span className="text-muted-foreground">{r}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            <div className="glass-card p-4">
              <p className="text-xs text-muted-foreground mb-2">{t('riskScore')}</p>
              <div className="mt-2 h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    result.score >= 6 ? 'bg-destructive' : result.score >= 3 ? 'bg-yellow-400' : 'bg-accent'
                  }`}
                  style={{ width: `${result.score * 10}%` }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default FakeLoanDetector;
