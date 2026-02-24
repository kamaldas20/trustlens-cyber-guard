import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, AlertTriangle, BarChart3, Activity, RefreshCw } from 'lucide-react';
import ThreatRadar from '@/components/ThreatRadar';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { getScanHistory, getStats, ScanRecord } from '@/lib/scanHistory';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

const COLORS = ['hsl(152, 76%, 48%)', 'hsl(45, 93%, 58%)', 'hsl(0, 84%, 60%)'];

const Dashboard = () => {
  const { t } = useLanguage();
  const [history, setHistory] = useState<ScanRecord[]>([]);
  const [stats, setStats] = useState({ threats: 0, total: 0, score: 100, dangerous: 0 });

  const refresh = () => {
    setHistory(getScanHistory());
    setStats(getStats());
  };

  useEffect(() => { refresh(); }, []);

  // Build chart data from real history
  const typeCounts = history.reduce((acc, r) => {
    const key = r.type;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const typeLabels: Record<string, string> = {
    image: t('imageDetection'),
    voice: t('voiceDetection'),
    phishing: t('phishingAnalysis'),
    malware: t('malwareDetection'),
    loan_apk: t('fakeLoanDetector'),
    sms: t('fakeSmsDetector'),
  };

  const pieData = Object.entries(typeCounts).map(([key, value]) => ({
    name: typeLabels[key] || key,
    value,
  }));

  const resultCounts = [
    { name: t('safe'), value: history.filter(r => r.result === 'safe').length },
    { name: t('suspicious'), value: history.filter(r => r.result === 'suspicious').length },
    { name: t('dangerous'), value: history.filter(r => r.result === 'dangerous').length },
  ].filter(d => d.value > 0);

  // Build time-series from last 7 days
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayStr = d.toLocaleDateString('en', { weekday: 'short' });
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const dayEnd = dayStart + 86400000;
    const dayScans = history.filter(r => r.timestamp >= dayStart && r.timestamp < dayEnd);
    return {
      name: dayStr,
      scans: dayScans.length,
      threats: dayScans.filter(r => r.result !== 'safe').length,
    };
  });

  const statCards = [
    { label: t('threatsDetected'), value: String(stats.threats), icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10' },
    { label: t('scansPerformed'), value: String(stats.total), icon: BarChart3, color: 'text-primary', bg: 'bg-primary/10' },
    { label: t('safetyScore'), value: `${stats.score}%`, icon: Shield, color: 'text-accent', bg: 'bg-accent/10' },
    { label: t('activeAlerts'), value: String(stats.dangerous), icon: Activity, color: 'text-secondary', bg: 'bg-secondary/10' },
  ];

  const recentScans = history.slice(0, 6);
  const resultColors: Record<string, string> = { safe: 'bg-accent', suspicious: 'bg-yellow-400', dangerous: 'bg-destructive' };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.h1 {...fadeUp()} className="text-2xl font-bold">{t('overview')}</motion.h1>
        <button onClick={refresh} className="p-2 rounded-lg hover:bg-muted/30 transition-colors" title="Refresh">
          <RefreshCw className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <motion.div key={s.label} {...fadeUp(i * 0.1)} className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {stats.total === 0 && (
        <motion.div {...fadeUp(0.2)} className="glass-card p-8 text-center">
          <Shield className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No scans yet. Use the tools on the left to start scanning!</p>
        </motion.div>
      )}

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div {...fadeUp(0.3)} className="glass-card p-6">
          <h3 className="text-sm font-semibold mb-4">{t('threatOverview')} — Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={last7}>
              <defs>
                <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 20%, 18%)" />
              <XAxis dataKey="name" stroke="hsl(220, 15%, 55%)" fontSize={12} />
              <YAxis stroke="hsl(220, 15%, 55%)" fontSize={12} allowDecimals={false} />
              <Tooltip contentStyle={{ background: 'hsl(222, 25%, 10%)', border: '1px solid hsl(222, 20%, 22%)', borderRadius: '8px', color: 'hsl(210, 20%, 92%)', fontSize: '12px' }} />
              <Area type="monotone" dataKey="scans" stroke="#3b82f6" fillOpacity={1} fill="url(#colorScans)" strokeWidth={2} />
              <Area type="monotone" dataKey="threats" stroke="#ef4444" fillOpacity={0.1} fill="#ef4444" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div {...fadeUp(0.4)} className="glass-card p-6">
          <h3 className="text-sm font-semibold mb-4">Scan Results Distribution</h3>
          {resultCounts.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={resultCounts} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
                  {resultCounts.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'hsl(222, 25%, 10%)', border: '1px solid hsl(222, 20%, 22%)', borderRadius: '8px', color: 'hsl(210, 20%, 92%)', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
              Run some scans to see distribution
            </div>
          )}
        </motion.div>
      </div>

      {/* Radar + Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div {...fadeUp(0.5)} className="glass-card p-6 flex flex-col items-center">
          <h3 className="text-sm font-semibold mb-6 self-start">Live Threat Radar</h3>
          <ThreatRadar />
          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
              stats.threats > 5 ? 'bg-destructive/10 text-destructive' : stats.threats > 2 ? 'bg-yellow-400/10 text-yellow-400' : 'bg-accent/10 text-accent'
            }`}>
              {stats.threats > 5 ? t('high') : stats.threats > 2 ? t('medium') : t('low')}
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp(0.6)} className="glass-card p-6">
          <h3 className="text-sm font-semibold mb-4">{t('recentActivity')}</h3>
          <div className="space-y-3">
            {recentScans.length > 0 ? recentScans.map((scan) => (
              <div key={scan.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${resultColors[scan.result]}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{typeLabels[scan.type]}: {scan.label}</p>
                  <p className="text-xs text-muted-foreground">{new Date(scan.timestamp).toLocaleString()}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  scan.result === 'safe' ? 'bg-accent/10 text-accent' : scan.result === 'suspicious' ? 'bg-yellow-400/10 text-yellow-400' : 'bg-destructive/10 text-destructive'
                }`}>{scan.result}</span>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground text-center py-4">No activity yet</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
