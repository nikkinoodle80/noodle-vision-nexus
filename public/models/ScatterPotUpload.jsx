import React from 'react';

export default function ScatterPotUpload() {
  function handleUpload(e) {
    const file = e.target.files?.[0];
    if (file) {
      alert(`Uploaded: ${file.name}`);
    }
  }

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold">ScatterPot Upload</h2>
      <input 
        type="file" 
        onChange={handleUpload}
        className="border p-2 rounded"
      />
    </div>
  );
}
