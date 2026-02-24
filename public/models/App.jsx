import React, { useEffect } from "react";
import AdapterBuilder from "./components/AdapterBuilder.jsx";
import CrisisMode from "./components/CrisisMode.jsx";
import PatchRigScene from "./components/PatchRigScene.jsx";
import ScatterPotUpload from "./components/ScatterPotUpload.jsx";
import SmartcoinHUD from "./components/SmartcoinHUD.jsx";

export default function App() {
  useEffect(() => {
    let isMounted = true;

    async function pollMCP() {
      while (isMounted) {
        try {
          const sceneRes = await fetch(`${window.location.origin}/scene`);
          const sceneData = await sceneRes.text();
          const sceneHud = document.getElementById("sceneHud");
          if (sceneHud) sceneHud.textContent = `Scene Stream: ${sceneData}`;

          const triggerRes = await fetch(`${window.location.origin}/trigger`);
          const triggerData = await triggerRes.text();
          const triggerHud = document.getElementById("triggerHud");
          if (triggerHud) triggerHud.textContent = `Trigger Stream: ${triggerData}`;
        } catch (err) {
          console.error("Polling error:", err);
        }

        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      return () => {
        isMounted = false;
      };
    }

    pollMCP();
  }, []);

  return (
    <div style={{ padding: "2em", backgroundColor: "#111", color: "#0ff", fontFamily: "sans-serif" }}>
      <h1>Noodle-VISION Cockpit</h1>
      <AdapterBuilder />
      <CrisisMode />
      <PatchRigScene />
      <ScatterPotUpload />
      <SmartcoinHUD />
      <div id="sceneHud" style={{ marginTop: "1em" }}>Scene Stream: waiting...</div>
      <div id="triggerHud" style={{ marginTop: "1em" }}>Trigger Stream: waiting...</div>
    </div>
  );
}
