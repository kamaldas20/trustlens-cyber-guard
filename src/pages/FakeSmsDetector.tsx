import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { MessageSquareWarning, Search, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { addScanRecord } from '@/lib/scanHistory';


const SCAM_PATTERNS: { pattern: RegExp; weight: number; reason: string }[] = [
  { pattern: /your.*account.*blocked|account.*suspend/i, weight: 3, reason: 'Account suspension threat' },
  { pattern: /click.*link|tap.*here|visit.*now/i, weight: 2, reason: 'Urgent click-bait language' },
  { pattern: /otp|one.time.password/i, weight: 3, reason: 'OTP phishing attempt' },
  { pattern: /kyc.*expir|update.*kyc|complete.*kyc/i, weight: 3, reason: 'Fake KYC update request' },
  { pattern: /won|winner|prize|reward|lottery|jackpot/i, weight: 3, reason: 'Prize/lottery scam language' },
  { pattern: /₹\s*\d{4,}|rs\.?\s*\d{4,}|lakh|crore/i, weight: 2, reason: 'Large monetary amount mentioned' },
  { pattern: /bit\.ly|tinyurl|shorturl|goo\.gl/i, weight: 2, reason: 'Shortened URL (hides real destination)' },
  { pattern: /urgent|immediate|within.*hour|expire.*today/i, weight: 2, reason: 'Creates false urgency' },
  { pattern: /pan.*card|aadhar|aadhaar/i, weight: 2, reason: 'Requests government ID details' },
  { pattern: /credit.*card.*number|cvv|expiry.*date/i, weight: 3, reason: 'Requests financial card details' },
  { pattern: /bank.*transfer|upi.*id|send.*money/i, weight: 2, reason: 'Asks for money transfer' },
  { pattern: /dear.*customer|valued.*customer/i, weight: 1, reason: 'Generic customer greeting (impersonation)' },
  { pattern: /whatsapp.*support|call.*helpline/i, weight: 2, reason: 'Fake support contact' },
  { pattern: /free.*recharge|cashback.*offer/i, weight: 2, reason: 'Too-good-to-be-true offer' },
  { pattern: /deliver.*fail|package.*held|customs/i, weight: 2, reason: 'Fake delivery notification' },
  { pattern: /verify.*identity|confirm.*detail/i, weight: 2, reason: 'Identity verification phishing' },
];

const FakeSmsDetector = () => {
  const { t } = useLanguage();
  const [smsText, setSmsText] = useState('');
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{
    score: number;
    verdict: 'safe' | 'suspicious' | 'dangerous';
    matches: string[];
    tips: string[];
  } | null>(null);

  const analyze = async () => {
    if (!smsText.trim()) return;
    setScanning(true);
    setProgress(0);
    setResult(null);

    for (let i = 0; i <= 100; i += 2) {
      await new Promise(r => setTimeout(r, 20));
      setProgress(i);
    }

    let score = 0;
    const matches: string[] = [];

    for (const p of SCAM_PATTERNS) {
      if (p.pattern.test(smsText)) {
        score += p.weight;
        matches.push(p.reason);
      }
    }

    // Check for URLs
    const urlCount = (smsText.match(/https?:\/\/\S+/gi) || []).length;
    if (urlCount > 0) {
      score += 1;
      matches.push(`Contains ${urlCount} URL(s)`);
    }

    // Check for ALL CAPS words
    const capsWords = smsText.split(/\s+/).filter(w => w.length > 3 && w === w.toUpperCase()).length;
    if (capsWords >= 2) {
      score += 1;
      matches.push('Excessive use of CAPITAL LETTERS');
    }

    // Check for phone numbers
    if (/\+?\d{10,}/.test(smsText)) {
      score += 1;
      matches.push('Contains phone number (potential callback scam)');
    }

    if (matches.length === 0) matches.push('No suspicious patterns detected');

    const clampedScore = Math.max(0, Math.min(10, score));
    const verdict: 'safe' | 'suspicious' | 'dangerous' =
      clampedScore >= 6 ? 'dangerous' : clampedScore >= 3 ? 'suspicious' : 'safe';

    const tips = verdict !== 'safe' ? [
      'Do not click any links in this message',
      'Never share OTP, passwords, or bank details via SMS',
      'Verify by contacting the official organization directly',
      'Report this number to your carrier or cybercrime.gov.in',
    ] : ['This message appears safe, but always stay vigilant'];

    setResult({ score: clampedScore, verdict, matches, tips });
    addScanRecord({
      type: 'sms',
      label: smsText.slice(0, 50),
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
          <div className="w-10 h-10 rounded-xl bg-yellow-400/10 flex items-center justify-center">
            <MessageSquareWarning className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t('fakeSmsDetector')}</h1>
            <p className="text-xs text-muted-foreground">{t('fakeSmsDesc')}</p>
          </div>
        </div>

        <div className="glass-card p-6 space-y-4">
          <Textarea
            value={smsText}
            onChange={e => setSmsText(e.target.value)}
            placeholder={t('pasteSmsHere')}
            rows={5}
            className="resize-none"
          />
          <Button onClick={analyze} disabled={scanning || !smsText.trim()} className="w-full bg-primary hover:bg-primary/90">
            {scanning ? t('scanning') : <><Search className="w-4 h-4 mr-2" />{t('analyzeSms')}</>}
          </Button>
        </div>

        {scanning && (
          <div className="space-y-3 mt-4">
            <Progress value={progress} className="h-2" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs text-muted-foreground">{t('analyzingSms')}</span>
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
                  <div className="space-y-2 mb-4">
                    <p className="text-xs font-medium text-muted-foreground uppercase">{t('findings')}:</p>
                    {result.matches.map((m, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <span className={result.verdict === 'safe' ? 'text-accent' : 'text-yellow-400'}>•</span>
                        <span className="text-muted-foreground">{m}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border/30 pt-3 space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase">{t('safetyTips')}:</p>
                    {result.tips.map((tip, i) => (
                      <p key={i} className="text-xs text-muted-foreground">💡 {tip}</p>
                    ))}
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default FakeSmsDetector;
