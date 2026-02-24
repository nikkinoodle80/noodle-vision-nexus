import React, { useEffect, useState } from 'react';
import { getCoins } from '../utils/smartcoin';

export default function SmartcoinHUD() {
  const [coins, setCoins] = useState(getCoins());
  useEffect(() => {
    const interval = setInterval(() => setCoins(getCoins()), 500);
    return () => clearInterval(interval);
  }, []);

  return <div className="fixed top-4 right-4 bg-yellow-500 text-black p-2 rounded">🪙 {coins} Smartcoins</div>;
}