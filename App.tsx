import React from 'react';
import { PageWrapper } from './PageWrapper';
import { Dashboard } from './Dashboard';
import { MCPConsoleView } from './MCPConsoleView';

/**
 * NOODLE-VISION APP
 * Complete integration of all 3 finalized tasks:
 * 1. ✅ Error Boundaries in PageWrapper (HIGH PRIORITY)
 * 2. ✅ System Metrics bound to StatCards (MEDIUM PRIORITY)
 * 3. ✅ Real WebSocket for MCPConsoleView (LOW PRIORITY)
 */
export const App: React.FC = () => {
  return (
    <PageWrapper pageTitle="Noodle-Vision Control Center" showHeader={true}>
      <div className="app-container">
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

      <style>{`
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
        
        .dashboard-section {
          animation: fadeInUp 0.6s ease-out;
        }
        
        .console-section {
          animation: fadeInUp 0.6s ease-out 0.2s;
          animation-fill-mode: both;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
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
      `}</style>
    </PageWrapper>
  );
};

export default App;
