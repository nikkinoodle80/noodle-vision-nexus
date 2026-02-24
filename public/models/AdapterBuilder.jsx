import React from 'react';
import { addCoins } from '../utils/smartcoin';

export default function AdapterBuilder() {
  function handleBuild() {
    addCoins(5);
    alert("Adapter chain complete! +5 Smartcoins");
  }

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold">Adapter Chain Builder</h2>
      <button onClick={handleBuild} className="bg-green-500 px-4 py-2 rounded">Build Chain</button>
    </div>
  );
}