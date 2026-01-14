import React, { useEffect, useState } from 'react';
import { PageWrapper } from './PageWrapper';
import { Dashboard } from './Dashboard';
import { MCPConsoleView } from './MCPConsoleView';

/**
 * NOODLE-VISION XR APP
 * Cross-device compatible: Desktop, Mobile, VR Headsets, AR Glasses
 * WebXR support for immersive experiences
 */

type DeviceMode = 'desktop' | 'mobile' | 'vr' | 'ar';

export const AppXR: React.FC = () => {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [xrSupported, setXrSupported] = useState(false);
  const [isImmersive, setIsImmersive] = useState(false);

  useEffect(() => {
    // Detect device type
    const detectDevice = () => {
      const ua = navigator.userAgent.toLowerCase();
      const isMobile = /mobile|android|iphone|ipad|tablet/.test(ua);
      const isVR = /quest|vive|pico|varjo|wmr/.test(ua);
      const isAR = /hololens|magic leap|nreal|rayneo/.test(ua);

      if (isVR) setDeviceMode('vr');
      else if (isAR) setDeviceMode('ar');
      else if (isMobile) setDeviceMode('mobile');
      else setDeviceMode('desktop');
    };

    detectDevice();

    // Check WebXR support
    if ('xr' in navigator) {
      Promise.all([
        (navigator as any).xr.isSessionSupported('immersive-vr'),
        (navigator as any).xr.isSessionSupported('immersive-ar'),
      ]).then(([vrSupported, arSupported]) => {
        setXrSupported(vrSupported || arSupported);
      }).catch(() => {
        setXrSupported(false);
      });
    }
  }, []);

  const enterXR = async (mode: 'vr' | 'ar') => {
    if (!('xr' in navigator)) {
      alert('WebXR not supported on this device');
      return;
    }

    try {
      const sessionMode = mode === 'vr' ? 'immersive-vr' : 'immersive-ar';
      const session = await (navigator as any).xr.requestSession(sessionMode, {
        requiredFeatures: ['local-floor', 'hand-tracking'],
        optionalFeatures: ['eye-tracking', 'spatial-tracking'],
      });

      setIsImmersive(true);
      console.log(`✅ ${mode.toUpperCase()} session started`);

      session.addEventListener('end', () => {
        setIsImmersive(false);
        console.log(`🔴 ${mode.toUpperCase()} session ended`);
      });

      // WebXR rendering would go here
      // For now, we show the 2D UI in XR space
      
    } catch (error) {
      console.error(`Failed to start ${mode.toUpperCase()} session:`, error);
      alert(`${mode.toUpperCase()} not available. Using 2D mode.`);
    }
  };

  return (
    <div className={`app-xr app-xr--${deviceMode}`}>
      {/* XR Controls - Only show if supported */}
      {xrSupported && !isImmersive && (
        <div className="xr-controls">
          <button 
            onClick={() => enterXR('vr')} 
            className="xr-btn xr-btn--vr"
            aria-label="Enter VR Mode"
          >
            🥽 Enter VR
          </button>
          <button 
            onClick={() => enterXR('ar')} 
            className="xr-btn xr-btn--ar"
            aria-label="Enter AR Mode"
          >
            👓 Enter AR
          </button>
        </div>
      )}

      <PageWrapper 
        pageTitle="Noodle-Vision Control Center" 
        showHeader={!isImmersive}
      >
        <div className="app-container">
          {/* Device Mode Indicator */}
          <div className="device-indicator">
            <span className="device-icon">
              {deviceMode === 'vr' && '🥽'}
              {deviceMode === 'ar' && '👓'}
              {deviceMode === 'mobile' && '📱'}
              {deviceMode === 'desktop' && '💻'}
            </span>
            <span className="device-label">
              {deviceMode.toUpperCase()} Mode
              {isImmersive && ' (Immersive)'}
            </span>
          </div>

          {/* SYSTEM METRICS DASHBOARD */}
          <section className="dashboard-section">
            <h2 className="section-title">System Metrics</h2>
            <Dashboard refreshInterval={5000} />
          </section>

          {/* MCP CONSOLE */}
          <section className="console-section">
            <h2 className="section-title">MCP Console</h2>
            <MCPConsoleView 
              wsUrl="ws://localhost:8080/mcp" 
              maxMessages={100}
              autoScroll={true}
            />
          </section>
        </div>
      </PageWrapper>

      <style>{`
        .app-xr {
          position: relative;
          min-height: 100vh;
        }
        
        /* XR CONTROLS */
        .xr-controls {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          display: flex;
          gap: 1rem;
          z-index: 9999;
          animation: slideInUp 0.5s ease-out;
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .xr-btn {
          padding: 1rem 2rem;
          font-size: 1.125rem;
          font-weight: 700;
          color: #fff;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(10px);
        }
        
        .xr-btn--vr {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .xr-btn--ar {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
        
        .xr-btn:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6);
        }
        
        .xr-btn:active {
          transform: translateY(-2px) scale(1.02);
        }
        
        /* DEVICE INDICATOR */
        .device-indicator {
          position: fixed;
          top: 1rem;
          right: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: rgba(26, 26, 46, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          border: 2px solid rgba(78, 205, 196, 0.3);
          z-index: 9998;
        }
        
        .device-icon {
          font-size: 1.5rem;
        }
        
        .device-label {
          font-size: 0.875rem;
          font-weight: 700;
          color: #4ecdc4;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .app-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          background: linear-gradient(135deg, #4ecdc4 0%, #44a8a0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        /* MOBILE OPTIMIZATIONS */
        .app-xr--mobile .app-container {
          padding: 0.5rem;
        }
        
        .app-xr--mobile .section-title {
          font-size: 1.25rem;
        }
        
        .app-xr--mobile .xr-controls {
          bottom: 1rem;
          right: 1rem;
          flex-direction: column;
        }
        
        .app-xr--mobile .xr-btn {
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
        }
        
        /* VR HEADSET OPTIMIZATIONS */
        .app-xr--vr .app-container {
          max-width: 1400px;
          margin: 0 auto;
          font-size: 1.125rem; /* Larger text for VR readability */
        }
        
        .app-xr--vr .section-title {
          font-size: 2rem;
        }
        
        /* AR GLASSES OPTIMIZATIONS */
        .app-xr--ar .app-container {
          /* Transparent background for AR pass-through */
          background: rgba(15, 15, 30, 0.7);
        }
        
        .app-xr--ar .device-indicator {
          background: rgba(26, 26, 46, 0.5);
        }
        
        /* RESPONSIVE GRID FOR LARGER SCREENS */
        @media (min-width: 1400px) {
          .app-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }
          
          .dashboard-section {
            grid-column: span 2;
          }
        }
        
        /* ACCESSIBILITY - HIGH CONTRAST MODE */
        @media (prefers-contrast: high) {
          .xr-btn,
          .device-indicator,
          .section-title {
            border: 3px solid #fff;
          }
        }
        
        /* ACCESSIBILITY - REDUCED MOTION */
        @media (prefers-reduced-motion: reduce) {
          .xr-btn,
          .device-indicator,
          .xr-controls {
            animation: none;
            transition: none;
          }
        }
        
        /* LANDSCAPE ORIENTATION (Smart Glasses) */
        @media (orientation: landscape) and (max-height: 600px) {
          .app-container {
            flex-direction: row;
          }
          
          .dashboard-section,
          .console-section {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
};
