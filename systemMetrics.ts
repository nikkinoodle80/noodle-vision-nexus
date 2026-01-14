import { exec } from 'child_process';
import { promisify } from 'util';
import os from 'os';

const execAsync = promisify(exec);

export interface SystemMetrics {
  cpu: {
    usage: number;
    cores: number;
    model: string;
  };
  memory: {
    total: number;
    used: number;
    free: number;
    usagePercent: number;
  };
  disk: {
    total: number;
    used: number;
    free: number;
    usagePercent: number;
  };
  network: {
    bytesReceived: number;
    bytesSent: number;
  };
  uptime: number;
  timestamp: number;
}

/**
 * NOODLE-VISION SYSTEM METRICS TOOL
 * Real-time system monitoring for MCP Dashboard
 * First-class performance tracking
 */
export async function getSystemMetrics(): Promise<SystemMetrics> {
  const cpus = os.cpus();
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;

  // Calculate CPU usage
  let cpuUsage = 0;
  for (const cpu of cpus) {
    const total = Object.values(cpu.times).reduce((a, b) => a + b, 0);
    const idle = cpu.times.idle;
    cpuUsage += ((total - idle) / total) * 100;
  }
  cpuUsage = cpuUsage / cpus.length;

  // Get disk usage (cross-platform)
  let diskMetrics = {
    total: 0,
    used: 0,
    free: 0,
    usagePercent: 0,
  };

  try {
    if (process.platform === 'win32') {
      const { stdout } = await execAsync('wmic logicaldisk get size,freespace,caption');
      const lines = stdout.trim().split('\n').slice(1);
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 2) {
          const free = parseInt(parts[1], 10);
          const total = parseInt(parts[2], 10);
          if (!isNaN(free) && !isNaN(total)) {
            diskMetrics.free += free;
            diskMetrics.total += total;
          }
        }
      }
    } else {
      const { stdout } = await execAsync('df -k / | tail -1');
      const parts = stdout.trim().split(/\s+/);
      diskMetrics.total = parseInt(parts[1], 10) * 1024;
      diskMetrics.used = parseInt(parts[2], 10) * 1024;
      diskMetrics.free = parseInt(parts[3], 10) * 1024;
    }
    diskMetrics.used = diskMetrics.total - diskMetrics.free;
    diskMetrics.usagePercent = (diskMetrics.used / diskMetrics.total) * 100;
  } catch (error) {
    console.error('Failed to get disk metrics:', error);
  }

  // Get network stats (simplified - actual implementation would track deltas)
  const networkInterfaces = os.networkInterfaces();
  let bytesReceived = 0;
  let bytesSent = 0;

  // Note: Real network stats require platform-specific tools or libraries
  // This is a placeholder - use a library like 'systeminformation' for production

  return {
    cpu: {
      usage: Math.round(cpuUsage * 100) / 100,
      cores: cpus.length,
      model: cpus[0]?.model || 'Unknown',
    },
    memory: {
      total: totalMemory,
      used: usedMemory,
      free: freeMemory,
      usagePercent: Math.round((usedMemory / totalMemory) * 100 * 100) / 100,
    },
    disk: diskMetrics,
    network: {
      bytesReceived,
      bytesSent,
    },
    uptime: os.uptime(),
    timestamp: Date.now(),
  };
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Format uptime to human-readable string
 */
export function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
