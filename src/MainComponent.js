import React, { useState } from "react";
export default function MainComponent() {
  const [markup] = useState(1.30); // 30% Profit Guard
  const devices = [
    { brand: "Denon", model: "AVR-3313", ports: ["HDMI-IN", "OPTICAL-IN"] },
    { brand: "Sony", model: "KDL", ports: ["HDMI-1", "VGA"] }
  ];
  return (
    <div style={{ backgroundColor: "#0b0e14", color: "#00CED1", padding: "40px" }}>
      <h1>🛰️ NOODLE-VISION NEXUS | CLEAN SYNC</h1>
      <p>14 Builds Consolidated. Legacy Bots Removed.</p>
    </div>
  );
}
