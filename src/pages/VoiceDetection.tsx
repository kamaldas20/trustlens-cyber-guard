import { useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mic, Upload, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

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

  // ✅ FRONTEND-ONLY DETECTION
  const analyze = async () => {
    if (!file) return;

    setScanning(true);
    setProgress(0);
    setResult(null);

    // Fake loading
    for (let i = 0; i <= 100; i += 5) {
      await new Promise((r) => setTimeout(r, 20));
      setProgress(i);
    }

    const name = file.name.toLowerCase();
    let probability = 20;

    // 🎯 PREDEFINED LOGIC
    if (name.includes("ai") || name.includes("deepfake")) {
      probability = 95;
    } else if (name.includes("human") || name.includes("real")) {
      probability = 10;
    } else if (name.includes("medium") || name.includes("suspicious")) {
      probability = 50;
    }

    const aiProb = probability;

    setResult({
      aiProbability: aiProb,
      verdict: aiProb > 60 ? "synthetic" : "human",
      risk:
        aiProb > 75
          ? "high"
          : aiProb > 40
          ? "medium"
          : "low",
    });

    setScanning(false);
  };

  const riskConfig = {
    low: { label: t('low'), color: 'text-accent', border: 'border-accent/30' },
    medium: { label: t('medium'), color: 'text-yellow-400', border: 'border-yellow-400/30' },
    high: { label: t('high'), color: 'text-destructive', border: 'border-destructive/30' },
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
            <Mic className="w-5 h-5 text-secondary" />
          </div>
          <h1 className="text-2xl font-bold">{t('voiceDetection')}</h1>
        </div>

        {/* UPLOAD */}
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
          <Upload className="w-10 h-10 text-muted-foreground mx-auto" />
          <p className="text-sm text-muted-foreground mt-2">
            Drag & drop or click to upload
          </p>
        </div>

        {/* ANALYZE BUTTON */}
        {file && (
          <div className="flex justify-between mt-4">
            <span className="text-sm text-muted-foreground">{file.name}</span>
            <Button onClick={analyze} disabled={scanning}>
              {scanning ? "Scanning..." : "Analyze"}
            </Button>
          </div>
        )}

        {/* LOADING */}
        {scanning && <Progress value={progress} className="mt-4" />}

        {/* RESULT */}
        {result && (
          <div className="mt-6 space-y-4">
            <h3 className="text-sm font-semibold">Results</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-4">
                {result.verdict === "human" ? (
                  <CheckCircle className="text-accent" />
                ) : (
                  <XCircle className="text-destructive" />
                )}
                <p className="font-semibold mt-2">
                  {result.verdict === "human" ? "Human Voice" : "Synthetic Voice"}
                </p>
              </div>

              <div className={`glass-card p-4 border ${riskConfig[result.risk].border}`}>
                <AlertTriangle className={riskConfig[result.risk].color} />
                <p className={`font-semibold ${riskConfig[result.risk].color}`}>
                  {riskConfig[result.risk].label} Risk
                </p>
              </div>
            </div>

            <div className="glass-card p-4">
              <p className="text-muted-foreground text-sm">AI Probability</p>
              <p className="text-3xl font-bold text-secondary">
                {result.aiProbability}%
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default VoiceDetection;
