import React, { useEffect, useState } from 'react';
import { StatCard } from './StatCard';
import { 
  getSystemMetrics, 
  formatBytes, 
  formatUptime, 
  SystemMetrics 
} from './systemMetrics';

interface DashboardProps {
  refreshInterval?: number; // milliseconds
}

/**
 * NOODLE-VISION DASHBOARD
 * Real-time system monitoring with auto-refresh
 * First-class metrics visualization
 */
export const Dashboard: React.FC<DashboardProps> = ({ 
  refreshInterval = 5000 
}) => {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      const data = await getSystemMetrics();
      setMetrics(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
      console.error('Metrics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (error) {
    return (
      <div className="dashboard-error">
        <span className="error-icon">⚠️</span>
        <h3>Metrics Unavailable</h3>
        <p>{error}</p>
        <button onClick={fetchMetrics} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-grid">
        {/* CPU METRICS */}
        <StatCard
          title="CPU Usage"
          value={metrics ? `${metrics.cpu.usage.toFixed(1)}%` : '--'}
          subtitle={metrics ? `${metrics.cpu.cores} cores` : 'Loading...'}
          icon="🔥"
          color={
            metrics && metrics.cpu.usage > 80
              ? 'danger'
              : metrics && metrics.cpu.usage > 60
              ? 'warning'
              : 'primary'
          }
          trend={
            metrics && metrics.cpu.usage > 70
              ? 'up'
              : metrics && metrics.cpu.usage < 30
              ? 'down'
              : 'neutral'
          }
          loading={loading}
        />

        {/* MEMORY METRICS */}
        <StatCard
          title="Memory"
          value={metrics ? formatBytes(metrics.memory.used) : '--'}
          subtitle={
            metrics
              ? `${formatBytes(metrics.memory.free)} free of ${formatBytes(
                  metrics.memory.total
                )}`
              : 'Loading...'
          }
          icon="💾"
          color={
            metrics && metrics.memory.usagePercent > 85
              ? 'danger'
              : metrics && metrics.memory.usagePercent > 70
              ? 'warning'
              : 'success'
          }
          trendValue={
            metrics ? `${metrics.memory.usagePercent.toFixed(1)}%` : undefined
          }
          trend={
            metrics && metrics.memory.usagePercent > 80
              ? 'up'
              : 'neutral'
          }
          loading={loading}
        />

        {/* DISK METRICS */}
        <StatCard
          title="Disk Usage"
          value={metrics ? formatBytes(metrics.disk.used) : '--'}
          subtitle={
            metrics
              ? `${formatBytes(metrics.disk.free)} free of ${formatBytes(
                  metrics.disk.total
                )}`
              : 'Loading...'
          }
          icon="💿"
          color={
            metrics && metrics.disk.usagePercent > 90
              ? 'danger'
              : metrics && metrics.disk.usagePercent > 75
              ? 'warning'
              : 'info'
          }
          trendValue={
            metrics ? `${metrics.disk.usagePercent.toFixed(1)}%` : undefined
          }
          trend={
            metrics && metrics.disk.usagePercent > 85
              ? 'up'
              : 'neutral'
          }
          loading={loading}
        />

        {/* UPTIME METRICS */}
        <StatCard
          title="System Uptime"
          value={metrics ? formatUptime(metrics.uptime) : '--'}
          subtitle="Online & stable"
          icon="⏱️"
          color="success"
          loading={loading}
        />

        {/* NETWORK METRICS (Placeholder) */}
        <StatCard
          title="Network"
          value={metrics ? formatBytes(metrics.network.bytesReceived) : '--'}
          subtitle={
            metrics
              ? `↑ ${formatBytes(metrics.network.bytesSent)} sent`
              : 'Loading...'
          }
          icon="🌐"
          color="info"
          loading={loading}
        />

        {/* CPU MODEL INFO */}
        <StatCard
          title="Processor"
          value={metrics ? `${metrics.cpu.cores}×` : '--'}
          subtitle={
            metrics
              ? metrics.cpu.model.substring(0, 30) + '...'
              : 'Loading...'
          }
          icon="⚡"
          color="primary"
          loading={loading}
        />
      </div>

      <style>{`
        .dashboard {
          width: 100%;
        }
        
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          animation: fadeIn 0.5s ease-in-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .dashboard-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          background: rgba(252, 129, 129, 0.1);
          border: 2px solid rgba(252, 129, 129, 0.3);
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
        }
        
        .error-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }
        
        .dashboard-error h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          color: #fc8181;
        }
        
        .dashboard-error p {
          color: #a0aec0;
          margin-bottom: 1.5rem;
        }
        
        .retry-btn {
          padding: 0.75rem 2rem;
          font-size: 1rem;
          font-weight: 600;
          color: #fff;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: transform 0.2s;
        }
        
        .retry-btn:hover {
          transform: scale(1.05);
        }
        
        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
