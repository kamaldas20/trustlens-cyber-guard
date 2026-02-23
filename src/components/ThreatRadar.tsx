const ThreatRadar = () => {
  return (
    <div className="relative w-56 h-56 mx-auto">
      {/* Rings */}
      <div className="absolute inset-0 rounded-full border border-accent/20" />
      <div className="absolute inset-6 rounded-full border border-accent/15" />
      <div className="absolute inset-12 rounded-full border border-accent/10" />
      <div className="absolute inset-[4.5rem] rounded-full border border-accent/5" />
      {/* Cross lines */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-accent/10" />
      <div className="absolute top-0 left-1/2 w-px h-full bg-accent/10" />
      {/* Sweep */}
      <div
        className="absolute inset-0 origin-center"
        style={{ animation: 'radar-sweep 3s linear infinite' }}
      >
        <div
          className="absolute top-0 left-1/2 w-1/2 h-1/2 origin-bottom-left"
          style={{
            background: 'conic-gradient(from 0deg, transparent 0deg, hsl(152 76% 48% / 0.2) 30deg, transparent 60deg)',
          }}
        />
      </div>
      {/* Center */}
      <div className="absolute top-1/2 left-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent neon-glow-green" />
      {/* Blips */}
      <div className="absolute top-[22%] left-[62%] w-2 h-2 rounded-full bg-destructive animate-pulse" />
      <div className="absolute top-[68%] left-[28%] w-2 h-2 rounded-full bg-yellow-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-[38%] left-[78%] w-1.5 h-1.5 rounded-full bg-accent animate-pulse" style={{ animationDelay: '1s' }} />
    </div>
  );
};

export default ThreatRadar;
