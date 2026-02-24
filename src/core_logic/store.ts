import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { Equipment, Connection, Port } from './types';

interface SimulatorState {
  equipment: Equipment[];
  connections: Connection[];
  addEquipment: (name: string) => void;
  updateEquipmentPosition: (id: string, x: number, y: number) => void;
  connectPorts: (sourcePortId: string, targetPortId: string) => void;
  disconnectPort: (portId: string) => void;
}

export const useStore = create<SimulatorState>((set) => ({
  equipment: [],
  connections: [],
  
  addEquipment: (name) => {
    console.log('[Store] Adding new equipment:', name);
    set((state) => {
      const newEquipment: Equipment = {
        id: nanoid(),
        name,
        position: { x: 100, y: 100 },
        ports: [
          { id: nanoid(), type: 'HDMI', x: 0, y: 0 },
          { id: nanoid(), type: 'VGA', x: 0, y: 30 },
          { id: nanoid(), type: 'OPTICAL', x: 0, y: 60 },
          { id: nanoid(), type: 'RF', x: 0, y: 90 },
        ],
      };
      console.log('[Store] Created equipment:', newEquipment);
      return { equipment: [...state.equipment, newEquipment] };
    });
  },

  updateEquipmentPosition: (id, x, y) => {
    console.log('[Store] Updating equipment position:', { id, x, y });
    set((state) => ({
      equipment: state.equipment.map((eq) =>
        eq.id === id ? { ...eq, position: { x, y } } : eq
      ),
    }));
  },

  connectPorts: (sourcePortId, targetPortId) => {
    console.log('[Store] Connecting ports:', { sourcePortId, targetPortId });
    set((state) => {
      const sourcePort = state.equipment
        .flatMap((eq) => eq.ports)
        .find((p) => p.id === sourcePortId);
      
      if (!sourcePort) {
        console.warn('[Store] Source port not found:', sourcePortId);
        return state;
      }

      const connection = {
        id: nanoid(),
        sourcePortId,
        targetPortId,
        type: sourcePort.type,
      };

      console.log('[Store] Created connection:', connection);
      return {
        connections: [...state.connections, connection],
        equipment: state.equipment.map((eq) => ({
          ...eq,
          ports: eq.ports.map((p) =>
            p.id === sourcePortId || p.id === targetPortId
              ? { ...p, connected: p.id === sourcePortId ? targetPortId : sourcePortId }
              : p
          ),
        })),
      };
    });
  },

  disconnectPort: (portId) => {
    console.log('[Store] Disconnecting port:', portId);
    set((state) => ({
      connections: state.connections.filter(
        (c) => c.sourcePortId !== portId && c.targetPortId !== portId
      ),
      equipment: state.equipment.map((eq) => ({
        ...eq,
        ports: eq.ports.map((p) =>
          p.id === portId || p.connected === portId
            ? { ...p, connected: undefined }
            : p
        ),
      })),
    }));
  },
}));