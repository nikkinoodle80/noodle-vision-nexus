import React, { useState, useMemo } from 'react';
import { Activity, Zap, ShieldAlert, Coins } from 'lucide-react';
const SmartCoinMeter = ({ userTier = 'lite' }) => {
  const tiers = {
    free: { name: 'Sovereign Free', limit: 0, color: 'text-gray-400' },
    lite: { name: 'Nexus Lite', limit: 50, price: 14.99, color: 'text-cyan-400' },
    pro: { name: 'ProActive', limit: 150, price: 29.99, color: 'text-magenta-400' }
  };
  const currentTier = tiers[userTier] || tiers.free;
  const [coinsUsed, setCoinsUsed] = useState(0);
  const balance = useMemo(() => Math.max(0, currentTier.limit - coinsUsed), [coinsUsed, currentTier.limit]);
  const overage = useMemo(() => Math.max(0, coinsUsed - currentTier.limit), [coinsUsed, currentTier.limit]);
  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-md text-slate-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">GPU Credits</h2>
          <p className={"text-xl font-black " + currentTier.color}>{currentTier.name}</p>
        </div>
        <div className="bg-slate-800 p-3 rounded-full">
          <Coins className={coinsUsed > currentTier.limit ? 'text-amber-500' : 'text-cyan-400'} size={24} />
        </div>
      </div>
      <div className="relative pt-1 mb-6">
        <div className="flex mb-2 items-center justify-between">
          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-slate-800 text-slate-300">
            Usage: {coinsUsed.toFixed(1)} / {currentTier.limit} Units
          </span>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-slate-400">
              {((coinsUsed / (currentTier.limit || 1)) * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>
      {overage > 0 && (
        <div className="mb-6 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start gap-3">
          <ShieldAlert className="text-amber-500 shrink-0" size={18} />
          <p className="text-xs text-amber-200">
            <strong>Overage Detected:</strong> {overage.toFixed(1)} units will be billed to Stripe.
          </p>
        </div>
      )}
    </div>
  );
};
export default SmartCoinMeter;
