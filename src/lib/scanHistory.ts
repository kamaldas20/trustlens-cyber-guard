export interface ScanRecord {
  id: string;
  type: 'image' | 'voice' | 'phishing' | 'malware' | 'loan_apk' | 'sms';
  label: string;
  result: 'safe' | 'suspicious' | 'dangerous';
  timestamp: number;
}

const STORAGE_KEY = 'trustlense-scan-history';

export const getScanHistory = (): ScanRecord[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { return []; }
};

export const addScanRecord = (record: Omit<ScanRecord, 'id' | 'timestamp'>) => {
  const history = getScanHistory();
  history.unshift({ ...record, id: crypto.randomUUID(), timestamp: Date.now() });
  if (history.length > 100) history.length = 100;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  return history;
};

export const getStats = () => {
  const h = getScanHistory();
  const threats = h.filter(r => r.result !== 'safe').length;
  const total = h.length;
  const safe = h.filter(r => r.result === 'safe').length;
  const score = total > 0 ? Math.round((safe / total) * 100) : 100;
  const dangerous = h.filter(r => r.result === 'dangerous').length;
  return { threats, total, score, dangerous };
};
