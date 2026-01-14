import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppXR } from './AppXR';

/**
 * NOODLE-VISION BOOTSTRAP
 * Cross-device entry point supporting:
 * - Desktop & Laptops
 * - Mobile & Tablets
 * - VR Headsets (Quest, Vive, Pico)
 * - AR Glasses (HoloLens, Magic Leap, Nreal)
 * - Smart Rings (via gestures)
 */

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <AppXR />
  </React.StrictMode>
);

// PWA Install Prompt
let deferredPrompt: any;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log('💾 PWA Install available');
  
  // Show custom install UI (optional)
  // You can trigger this with a button click
});

window.addEventListener('appinstalled', () => {
  console.log('✅ PWA Installed successfully');
  deferredPrompt = null;
});

// Export install function for use in UI
(window as any).installPWA = async () => {
  if (!deferredPrompt) {
    console.log('⚠️ PWA already installed or not available');
    return;
  }
  
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  console.log(`PWA install: ${outcome}`);
  deferredPrompt = null;
};
