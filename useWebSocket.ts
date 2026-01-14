import { useEffect, useRef, useState, useCallback } from 'react';

export interface MCPMessage {
  id: string;
  type: 'tool_call' | 'tool_result' | 'error' | 'status';
  timestamp: number;
  data: any;
}

export interface WebSocketHookOptions {
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  onMessage?: (message: MCPMessage) => void;
  onError?: (error: Event) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export interface WebSocketHookReturn {
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  sendMessage: (message: any) => void;
  lastMessage: MCPMessage | null;
  reconnect: () => void;
  disconnect: () => void;
}

/**
 * NOODLE-VISION WEBSOCKET HOOK
 * First-class real-time communication for MCP Console
 * Auto-reconnect, error handling, and message queuing
 */
export function useWebSocket(options: WebSocketHookOptions): WebSocketHookReturn {
  const {
    url,
    reconnectInterval = 3000,
    maxReconnectAttempts = 10,
    onMessage,
    onError,
    onConnect,
    onDisconnect,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    'connecting' | 'connected' | 'disconnected' | 'error'
  >('disconnected');
  const [lastMessage, setLastMessage] = useState<MCPMessage | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const messageQueueRef = useRef<any[]>([]);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setConnectionStatus('connecting');

    try {
      const ws = new WebSocket(url);

      ws.onopen = () => {
        console.log('🟢 WebSocket connected');
        setIsConnected(true);
        setConnectionStatus('connected');
        reconnectAttemptsRef.current = 0;
        onConnect?.();

        // Flush message queue
        while (messageQueueRef.current.length > 0) {
          const msg = messageQueueRef.current.shift();
          ws.send(JSON.stringify(msg));
        }
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as MCPMessage;
          setLastMessage(message);
          onMessage?.(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('🔴 WebSocket error:', error);
        setConnectionStatus('error');
        onError?.(error);
      };

      ws.onclose = () => {
        console.log('🔴 WebSocket disconnected');
        setIsConnected(false);
        setConnectionStatus('disconnected');
        wsRef.current = null;
        onDisconnect?.();

        // Auto-reconnect logic
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          console.log(
            `🔄 Reconnecting... Attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts}`
          );
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        } else {
          console.error('❌ Max reconnection attempts reached');
          setConnectionStatus('error');
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      setConnectionStatus('error');
    }
  }, [url, reconnectInterval, maxReconnectAttempts, onConnect, onDisconnect, onError, onMessage]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
    setConnectionStatus('disconnected');
  }, []);

  const sendMessage = useCallback(
    (message: any) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify(message));
      } else {
        // Queue message if not connected
        console.warn('WebSocket not connected, queueing message');
        messageQueueRef.current.push(message);
      }
    },
    []
  );

  const reconnect = useCallback(() => {
    disconnect();
    reconnectAttemptsRef.current = 0;
    setTimeout(connect, 100);
  }, [connect, disconnect]);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    connectionStatus,
    sendMessage,
    lastMessage,
    reconnect,
    disconnect,
  };
}
