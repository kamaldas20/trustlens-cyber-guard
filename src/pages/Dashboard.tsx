import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, AlertTriangle, BarChart3, Activity } from 'lucide-react';
import ThreatRadar from '@/components/ThreatRadar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';

const chartData = [
  { name: 'Mon', threats: 4, scans: 24, deepfakes: 2 },
  { name: 'Tue', threats: 3, scans: 18, deepfakes: 1 },
  { name: 'Wed', threats: 7, scans: 32, deepfakes: 4 },
  { name: 'Thu', threats: 2, scans: 28, deepfakes: 0 },
  { name: 'Fri', threats: 5, scans: 38, deepfakes: 3 },
  { name: 'Sat', threats: 8, scans: 42, deepfakes: 5 },
  { name: 'Sun', threats: 3, scans: 22, deepfakes: 1 },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

const Dashboard = () => {
  const { t } = useLanguage();

  const stats = [
    { label: t('threatsDetected'), value: '32', icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10' },
    { label: t('scansPerformed'), value: '204', icon: BarChart3, color: 'text-primary', bg: 'bg-primary/10' },
    { label: t('safetyScore'), value: '94%', icon: Shield, color: 'text-accent', bg: 'bg-accent/10' },
    { label: t('activeAlerts'), value: '3', icon: Activity, color: 'text-secondary', bg: 'bg-secondary/10' },
  ];

  return (
    <div className="space-y-6">
      <motion.h1 {...fadeUp()} className="text-2xl font-bold">{t('overview')}</motion.h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
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

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div {...fadeUp(0.3)} className="glass-card p-6">
          <h3 className="text-sm font-semibold mb-4">{t('threatOverview')}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 20%, 18%)" />
              <XAxis dataKey="name" stroke="hsl(220, 15%, 55%)" fontSize={12} />
              <YAxis stroke="hsl(220, 15%, 55%)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: 'hsl(222, 25%, 10%)',
                  border: '1px solid hsl(222, 20%, 22%)',
                  borderRadius: '8px',
                  color: 'hsl(210, 20%, 92%)',
                  fontSize: '12px',
                }}
              />
              <Area type="monotone" dataKey="threats" stroke="#3b82f6" fillOpacity={1} fill="url(#colorThreats)" strokeWidth={2} />
              <Area type="monotone" dataKey="deepfakes" stroke="#8b5cf6" fillOpacity={0.1} fill="#8b5cf6" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div {...fadeUp(0.4)} className="glass-card p-6">
          <h3 className="text-sm font-semibold mb-4">{t('scansPerformed')}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 20%, 18%)" />
              <XAxis dataKey="name" stroke="hsl(220, 15%, 55%)" fontSize={12} />
              <YAxis stroke="hsl(220, 15%, 55%)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: 'hsl(222, 25%, 10%)',
                  border: '1px solid hsl(222, 20%, 22%)',
                  borderRadius: '8px',
                  color: 'hsl(210, 20%, 92%)',
                  fontSize: '12px',
                }}
              />
              <Line type="monotone" dataKey="scans" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
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
            <div className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold">
              {t('low')}
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp(0.6)} className="glass-card p-6">
          <h3 className="text-sm font-semibold mb-4">{t('recentActivity')}</h3>
          <div className="space-y-3">
            {[
              { text: 'Image scan completed — AI Generated (87%)', time: '2 min ago', color: 'bg-destructive' },
              { text: 'Phishing check — URL is Safe', time: '5 min ago', color: 'bg-accent' },
              { text: 'Voice analysis — Human Voice confirmed', time: '12 min ago', color: 'bg-accent' },
              { text: 'File scan — Clean, no threats found', time: '18 min ago', color: 'bg-accent' },
              { text: 'Phishing check — Suspicious URL flagged', time: '25 min ago', color: 'bg-yellow-400' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{item.text}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
