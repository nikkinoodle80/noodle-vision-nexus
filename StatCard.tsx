import React from 'react';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  loading?: boolean;
}

/**
 * NOODLE-VISION STATCARD
 * First-class metric display with gradient styling
 * Supports live updates, trends, and loading states
 */
export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend = 'neutral',
  trendValue,
  color = 'primary',
  loading = false,
}) => {
  const colorMap = {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    success: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
    warning: 'linear-gradient(135deg, #f6ad55 0%, #ed8936 100%)',
    danger: 'linear-gradient(135deg, #fc8181 0%, #f56565 100%)',
    info: 'linear-gradient(135deg, #4ecdc4 0%, #44a8a0 100%)',
  };

  const trendIcons = {
    up: '↗',
    down: '↘',
    neutral: '→',
  };

  const trendColors = {
    up: '#48bb78',
    down: '#f56565',
    neutral: '#a0aec0',
  };

  return (
    <div className="stat-card" data-color={color}>
      {loading && (
        <div className="stat-card-loading">
          <div className="loading-pulse"></div>
        </div>
      )}

      <div className="stat-card-header">
        {icon && <span className="stat-icon">{icon}</span>}
        <h3 className="stat-title">{title}</h3>
      </div>

      <div className="stat-value">{value}</div>

      {(subtitle || trendValue) && (
        <div className="stat-footer">
          {subtitle && <span className="stat-subtitle">{subtitle}</span>}
          {trendValue && (
            <span className="stat-trend" data-trend={trend}>
              <span className="trend-icon">{trendIcons[trend]}</span>
              {trendValue}
            </span>
          )}
        </div>
      )}

      <style>{`
        .stat-card {
          position: relative;
          background: rgba(26, 26, 46, 0.6);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 1.5rem;
          border: 2px solid transparent;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }
        
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: ${colorMap[color]};
          opacity: 0.8;
          transition: opacity 0.3s;
        }
        
        .stat-card:hover {
          transform: translateY(-4px);
          border-color: rgba(78, 205, 196, 0.3);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }
        
        .stat-card:hover::before {
          opacity: 1;
        }
        
        .stat-card-loading {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: rgba(78, 205, 196, 0.2);
          overflow: hidden;
        }
        
        .loading-pulse {
          position: absolute;
          height: 100%;
          width: 50%;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(78, 205, 196, 0.8), 
            transparent
          );
          animation: pulse 1.5s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(200%); }
        }
        
        .stat-card-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        
        .stat-icon {
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: ${colorMap[color]};
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        
        .stat-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #a0aec0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0;
        }
        
        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          background: ${colorMap[color]};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
          line-height: 1.2;
        }
        
        .stat-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }
        
        .stat-subtitle {
          font-size: 0.875rem;
          color: #718096;
        }
        
        .stat-trend {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.875rem;
          font-weight: 600;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          background: rgba(78, 205, 196, 0.1);
        }
        
        .stat-trend[data-trend="up"] {
          color: ${trendColors.up};
        }
        
        .stat-trend[data-trend="down"] {
          color: ${trendColors.down};
        }
        
        .stat-trend[data-trend="neutral"] {
          color: ${trendColors.neutral};
        }
        
        .trend-icon {
          font-size: 1.125rem;
          line-height: 1;
        }
      `}</style>
    </div>
  );
};
