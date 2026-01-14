/**
 * NOODLE-VISION MCP WEBSOCKET SERVER
 * Test server for MCPConsoleView
 * Run: node websocket-server.js
 */

const WebSocket = require('ws');

const PORT = 8080;
const wss = new WebSocket.Server({ port: PORT });

console.log(`🚀 MCP WebSocket Server running on ws://localhost:${PORT}/mcp`);

// Mock tool execution simulator
const mockTools = [
  'get_system_metrics',
  'fetch_cable_logic',
  'render_vr_scene',
  'process_automation',
  'sync_cloud_state',
];

function generateMockMessage(type) {
  const toolName = mockTools[Math.floor(Math.random() * mockTools.length)];
  
  const messages = {
    tool_call: {
      id: `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'tool_call',
      timestamp: Date.now(),
      data: {
        tool: toolName,
        params: {
          param1: 'value1',
          param2: 'value2',
        },
        status: 'executing',
      },
    },
    tool_result: {
      id: `result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'tool_result',
      timestamp: Date.now(),
      data: {
        tool: toolName,
        result: {
          success: true,
          output: 'Operation completed successfully',
          duration: Math.floor(Math.random() * 2000) + 100,
        },
      },
    },
    error: {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'error',
      timestamp: Date.now(),
      data: {
        tool: toolName,
        error: 'Connection timeout',
        code: 'ETIMEDOUT',
        stack: 'Error: Connection timeout\n    at MCPClient.execute...',
      },
    },
    status: {
      id: `status_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'status',
      timestamp: Date.now(),
      data: {
        message: 'System health check passed',
        uptime: 3600,
        activeConnections: Math.floor(Math.random() * 10) + 1,
      },
    },
  };
  
  return messages[type];
}

wss.on('connection', (ws) => {
  console.log('✅ Client connected');
  
  // Send welcome message
  ws.send(JSON.stringify({
    id: 'welcome',
    type: 'status',
    timestamp: Date.now(),
    data: {
      message: 'Connected to MCP WebSocket Server',
      version: '1.0.0',
    },
  }));
  
  // Simulate random tool executions
  const messageTypes = ['tool_call', 'tool_result', 'status', 'error'];
  const interval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      // Weighted random: more tool_calls and results, fewer errors
      const weights = [0.4, 0.4, 0.15, 0.05];
      const random = Math.random();
      let cumulative = 0;
      let selectedType = 'tool_call';
      
      for (let i = 0; i < weights.length; i++) {
        cumulative += weights[i];
        if (random < cumulative) {
          selectedType = messageTypes[i];
          break;
        }
      }
      
      const message = generateMockMessage(selectedType);
      ws.send(JSON.stringify(message));
      console.log(`📤 Sent ${selectedType} message`);
    }
  }, 2000); // Send a message every 2 seconds
  
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      console.log('📥 Received:', message);
      
      // Echo back with acknowledgment
      ws.send(JSON.stringify({
        id: `ack_${message.id}`,
        type: 'status',
        timestamp: Date.now(),
        data: {
          message: 'Message received',
          originalId: message.id,
        },
      }));
    } catch (err) {
      console.error('❌ Failed to parse message:', err);
    }
  });
  
  ws.on('close', () => {
    console.log('🔴 Client disconnected');
    clearInterval(interval);
  });
  
  ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error);
  });
});

wss.on('error', (error) => {
  console.error('❌ Server error:', error);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  wss.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
