import { useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Image, Upload, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

const ImageDetection = () => {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{
    aiProbability: number;
    verdict: string;
    confidence: number;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith('image/')) handleFile(f);
  };

  const analyze = async () => {
    if (!file) return;
    setScanning(true);
    setProgress(0);
    setResult(null);

    // Simulate scanning progress
    for (let i = 0; i <= 100; i += 2) {
      await new Promise((r) => setTimeout(r, 40));
      setProgress(i);
    }

    // Simulated result (real API integration needs backend/edge function)
    const aiProb = Math.random() * 60 + 30;
    setResult({
      aiProbability: Math.round(aiProb),
      verdict: aiProb > 70 ? 'likely_ai' : aiProb > 45 ? 'suspicious' : 'likely_real',
      confidence: Math.round(Math.random() * 15 + 80),
    });
    setScanning(false);
  };

  const verdictConfig = {
    likely_ai: { label: t('likelyAI'), icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/30' },
    suspicious: { label: t('suspicious'), icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30' },
    likely_real: { label: t('likelyReal'), icon: CheckCircle, color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/30' },
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Image className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">{t('imageDetection')}</h1>
        </div>

        {/* Upload zone */}
        <div
          className="upload-zone rounded-xl p-8 text-center cursor-pointer"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          {preview ? (
            <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
          ) : (
            <div className="space-y-3">
              <Upload className="w-10 h-10 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">{t('dragDrop')}</p>
              <p className="text-xs text-muted-foreground/50">PNG, JPG, WEBP</p>
            </div>
          )}
        </div>

        {file && (
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-muted-foreground truncate">{file.name}</span>
            <Button onClick={analyze} disabled={scanning} className="bg-primary hover:bg-primary/90">
              {scanning ? t('scanning') : t('analyze')}
            </Button>
          </div>
        )}

        {/* Progress */}
        {scanning && (
          <div className="space-y-2 mt-4">
            <Progress value={progress} className="h-2" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs text-muted-foreground">{t('scanning')} {progress}%</span>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-4"
          >
            <h3 className="text-sm font-semibold">{t('results')}</h3>

            {/* Verdict badge */}
            {(() => {
              const v = verdictConfig[result.verdict as keyof typeof verdictConfig];
              return (
                <div className={`${v.bg} border ${v.border} rounded-xl p-4 flex items-center gap-3`}>
                  <v.icon className={`w-6 h-6 ${v.color}`} />
                  <div>
                    <p className={`font-semibold ${v.color}`}>{v.label}</p>
                    <p className="text-xs text-muted-foreground">{t('verdict')}</p>
                  </div>
                </div>
              );
            })()}

            {/* Meters */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-4">
                <p className="text-xs text-muted-foreground mb-2">{t('aiProbability')}</p>
                <p className="text-3xl font-bold text-primary">{result.aiProbability}%</p>
                <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000"
                    style={{ width: `${result.aiProbability}%` }}
                  />
                </div>
              </div>
              <div className="glass-card p-4">
                <p className="text-xs text-muted-foreground mb-2">{t('confidence')}</p>
                <p className="text-3xl font-bold text-accent">{result.confidence}%</p>
                <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-1000"
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ImageDetection;
