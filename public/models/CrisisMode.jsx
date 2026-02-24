import React, { useState } from 'react';
import { addCoins } from '../utils/smartcoin';

export default function CrisisMode() {
  const [solved, setSolved] = useState(false);

  function handleSolve() {
    addCoins(10);
    setSolved(true);
  }

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold">Live Gig Crisis Simulator</h2>
      {solved ? <p>🎉 Crisis Averted! +10 Smartcoins</p> : <button onClick={handleSolve} className="bg-red-500 px-4 py-2 rounded">Fix Emergency</button>}
    </div>
  );
}