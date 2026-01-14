import React, { useEffect, useRef, useState } from 'react';
import { useWebSocket, MCPMessage } from './useWebSocket';

interface MCPConsoleViewProps {
  wsUrl?: string;
  maxMessages?: number;
  autoScroll?: boolean;
}

/**
 * NOODLE-VISION MCP CONSOLE VIEW
 * Real-time tool execution monitoring with WebSocket
 * First-class live logging with syntax highlighting
 */
export const MCPConsoleView: React.FC<MCPConsoleViewProps> = ({
  wsUrl = 'ws://localhost:8080/mcp',
  maxMessages = 100,
  autoScroll = true,
}) => {
  const [messages, setMessages] = useState<MCPMessage[]>([]);
  const [filter, setFilter] = useState<'all' | 'tool_call' | 'error'>('all');
  const consoleRef = useRef<HTMLDivElement>(null);

  const { isConnected, connectionStatus, sendMessage, lastMessage, reconnect } =
    useWebSocket({
      url: wsUrl,
      onMessage: (msg) => {
        setMessages((prev) => {
          const updated = [...prev, msg];
          return updated.slice(-maxMessages);
        });
      },
      onConnect: () => {
        console.log('✅ MCP Console connected');
      },
      onDisconnect: () => {
        console.log('⚠️ MCP Console disconnected');
      },
    });

  // Auto-scroll to bottom
  useEffect(() => {
    if (autoScroll && consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [messages, autoScroll]);

  const filteredMessages = messages.filter((msg) => {
    if (filter === 'all') return true;
    return msg.type === filter;
  });

  const clearMessages = () => {
    setMessages([]);
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'tool_call':
        return '🔧';
      case 'tool_result':
        return '✅';
      case 'error':
        return '❌';
      case 'status':
        return 'ℹ️';
      default:
        return '📝';
    }
  };

  const getMessageColor = (type: string) => {
    switch (type) {
      case 'tool_call':
        return '#4ecdc4';
      case 'tool_result':
        return '#48bb78';
      case 'error':
        return '#fc8181';
      case 'status':
        return '#667eea';
      default:
        return '#a0aec0';
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
    });
  };

  return (
    <div className="mcp-console">
      {/* Header */}
      <div className="console-header">
        <div className="header-left">
          <h3 className="console-title">🔌 MCP Console</h3>
          <div className="connection-status" data-status={connectionStatus}>
            <span className="status-indicator"></span>
            <span className="status-text">
              {connectionStatus === 'connected'
                ? 'Live'
                : connectionStatus === 'connecting'
                ? 'Connecting...'
                : connectionStatus === 'error'
                ? 'Error'
                : 'Disconnected'}
            </span>
          </div>
        </div>

        <div className="header-controls">
          {/* Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="filter-select"
          >
            <option value="all">All Messages</option>
            <option value="tool_call">Tool Calls</option>
            <option value="error">Errors Only</option>
          </select>

          {/* Actions */}
          <button onClick={clearMessages} className="control-btn">
            🗑️ Clear
          </button>
          {!isConnected && (
            <button onClick={reconnect} className="control-btn reconnect">
              🔄 Reconnect
            </button>
          )}
        </div>
      </div>

      {/* Message Feed */}
      <div className="console-messages" ref={consoleRef}>
        {filteredMessages.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📡</span>
            <p>Waiting for messages...</p>
          </div>
        ) : (
          filteredMessages.map((msg, idx) => (
            <div
              key={`${msg.id}-${idx}`}
              className="message"
              data-type={msg.type}
            >
              <span className="message-icon">{getMessageIcon(msg.type)}</span>
              <span className="message-time">{formatTimestamp(msg.timestamp)}</span>
              <span
                className="message-type"
                style={{ color: getMessageColor(msg.type) }}
              >
                {msg.type}
              </span>
              <div className="message-data">
                <pre>{JSON.stringify(msg.data, null, 2)}</pre>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        .mcp-console {
          display: flex;
          flex-direction: column;
          height: 600px;
          background: rgba(15, 15, 30, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          border: 2px solid rgba(78, 205, 196, 0.3);
          overflow: hidden;
        }
        
        .console-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          background: rgba(26, 26, 46, 0.6);
          border-bottom: 2px solid rgba(78, 205, 196, 0.2);
        }
        
        .header-left {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        
        .console-title {
          margin: 0;
          font-size: 1.125rem;
          font-weight: 700;
          color: #4ecdc4;
        }
        
        .connection-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.375rem 0.75rem;
          border-radius: 8px;
          background: rgba(78, 205, 196, 0.1);
          font-size: 0.875rem;
          font-weight: 600;
        }
        
        .status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #48bb78;
        }
        
        .connection-status[data-status="connecting"] .status-indicator {
          background: #f6ad55;
          animation: pulse-status 1s ease-in-out infinite;
        }
        
        .connection-status[data-status="disconnected"] .status-indicator,
        .connection-status[data-status="error"] .status-indicator {
          background: #fc8181;
        }
        
        @keyframes pulse-status {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        
        .status-text {
          color: #4ecdc4;
        }
        
        .header-controls {
          display: flex;
          gap: 0.75rem;
        }
        
        .filter-select {
          padding: 0.5rem 1rem;
          background: rgba(26, 26, 46, 0.6);
          color: #4ecdc4;
          border: 1px solid rgba(78, 205, 196, 0.3);
          border-radius: 8px;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .filter-select:hover {
          border-color: #4ecdc4;
        }
        
        .control-btn {
          padding: 0.5rem 1rem;
          background: rgba(78, 205, 196, 0.1);
          color: #4ecdc4;
          border: 1px solid rgba(78, 205, 196, 0.3);
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .control-btn:hover {
          background: rgba(78, 205, 196, 0.2);
          border-color: #4ecdc4;
          transform: translateY(-1px);
        }
        
        .control-btn.reconnect {
          background: rgba(246, 173, 85, 0.1);
          color: #f6ad55;
          border-color: rgba(246, 173, 85, 0.3);
        }
        
        .console-messages {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          font-family: 'Monaco', 'Courier New', monospace;
          font-size: 0.875rem;
          line-height: 1.6;
        }
        
        .console-messages::-webkit-scrollbar {
          width: 8px;
        }
        
        .console-messages::-webkit-scrollbar-track {
          background: rgba(26, 26, 46, 0.3);
        }
        
        .console-messages::-webkit-scrollbar-thumb {
          background: rgba(78, 205, 196, 0.4);
          border-radius: 4px;
        }
        
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #718096;
        }
        
        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }
        
        .message {
          display: grid;
          grid-template-columns: auto auto auto 1fr;
          gap: 1rem;
          padding: 0.75rem;
          margin-bottom: 0.5rem;
          background: rgba(26, 26, 46, 0.4);
          border-radius: 8px;
          border-left: 3px solid transparent;
          transition: all 0.2s;
          animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .message:hover {
          background: rgba(26, 26, 46, 0.7);
          border-left-color: #4ecdc4;
        }
        
        .message[data-type="error"] {
          border-left-color: #fc8181;
          background: rgba(252, 129, 129, 0.05);
        }
        
        .message-icon {
          font-size: 1.125rem;
        }
        
        .message-time {
          color: #718096;
          font-size: 0.75rem;
        }
        
        .message-type {
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.75rem;
        }
        
        .message-data {
          grid-column: 1 / -1;
          margin-top: 0.5rem;
        }
        
        .message-data pre {
          margin: 0;
          padding: 0.75rem;
          background: rgba(15, 15, 30, 0.8);
          border-radius: 6px;
          overflow-x: auto;
          color: #4ecdc4;
          font-size: 0.8125rem;
        }
      `}</style>
    </div>
  );
};
