import { useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mic, Upload, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { detectVoiceAI } from '../utils/resembleVoice';

const VoiceDetection = () => {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{
    aiProbability: number;
    verdict: string;
    risk: string;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setResult(null);
  };

  const analyze = async () => {
  if (!file) return;

  setScanning(true);
  setProgress(0);
  setResult(null);

  try {
    const apiResult = await detectVoiceAI(file);
    console.log("Resemble:", apiResult);

    // REAL RESPONSE PARSE
    const aiScore = apiResult?.deepfake_probability ?? 0;
    const aiProb = Math.round(aiScore * 100);

    setResult({
      aiProbability: aiProb,
      verdict: aiProb > 60 ? "synthetic" : "human",
      risk:
        aiProb > 75 ? "high" :
        aiProb > 40 ? "medium" :
        "low",
    });

  } catch (err) {
    console.error(err);
    alert("Voice AI scan failed");
  }

  setScanning(false);
};
  const riskConfig = {
    low: { label: t('low'), color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/30' },
    medium: { label: t('medium'), color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30' },
    high: { label: t('high'), color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/30' },
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
            <Mic className="w-5 h-5 text-secondary" />
          </div>
          <h1 className="text-2xl font-bold">{t('voiceDetection')}</h1>
        </div>

        <div
          className="upload-zone rounded-xl p-8 text-center cursor-pointer"
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <div className="space-y-3">
            <Upload className="w-10 h-10 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">{t('dragDrop')}</p>
            <p className="text-xs text-muted-foreground/50">MP3, WAV, OGG, M4A</p>
          </div>
        </div>

        {file && (
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-secondary" />
              <span className="text-sm text-muted-foreground truncate">{file.name}</span>
            </div>
            <Button onClick={analyze} disabled={scanning} className="bg-secondary hover:bg-secondary/90">
              {scanning ? t('scanning') : t('analyze')}
            </Button>
          </div>
        )}

        {scanning && (
          <div className="space-y-2 mt-4">
            <Progress value={progress} className="h-2" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-xs text-muted-foreground">{t('scanning')} {progress}%</span>
            </div>
            {/* Audio waveform animation */}
            <div className="flex items-end justify-center gap-1 h-16 mt-4">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-secondary/60 rounded-full"
                  style={{
                    height: `${Math.random() * 60 + 10}%`,
                    animation: `pulse 0.5s ease-in-out ${i * 0.05}s infinite alternate`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-4">
            <h3 className="text-sm font-semibold">{t('results')}</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className={`glass-card p-4 border ${result.verdict === 'human' ? 'border-accent/30' : 'border-destructive/30'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {result.verdict === 'human' ? (
                    <CheckCircle className="w-5 h-5 text-accent" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive" />
                  )}
                  <p className="text-sm font-semibold">
                    {result.verdict === 'human' ? t('humanVoice') : t('syntheticVoice')}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">{t('verdict')}</p>
              </div>

              {(() => {
                const r = riskConfig[result.risk as keyof typeof riskConfig];
                return (
                  <div className={`glass-card p-4 border ${r.border}`}>
                    <AlertTriangle className={`w-5 h-5 ${r.color} mb-2`} />
                    <p className={`text-sm font-semibold ${r.color}`}>{r.label}</p>
                    <p className="text-xs text-muted-foreground">Risk Level</p>
                  </div>
                );
              })()}
            </div>

            <div className="glass-card p-4">
              <p className="text-xs text-muted-foreground mb-2">{t('aiProbability')}</p>
              <p className="text-3xl font-bold text-secondary">{result.aiProbability}%</p>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-secondary to-primary rounded-full transition-all duration-1000"
                  style={{ width: `${result.aiProbability}%` }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default VoiceDetection;
