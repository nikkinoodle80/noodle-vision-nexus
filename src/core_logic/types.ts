export type PortType = 'HDMI' | 'VGA' | 'OPTICAL' | 'RF' | 'TRIGGER';

export interface Port {
  id: string;
  type: PortType;
  x: number;
  y: number;
  connected?: string;
}

export interface Equipment {
  id: string;
  name: string;
  ports: Port[];
  position: {
    x: number;
    y: number;
  };
}

export interface Connection {
  id: string;
  sourcePortId: string;
  targetPortId: string;
  type: PortType;
}