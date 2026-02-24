import React from 'react';
import { Connection } from '../types';

interface Props {
  connection: Connection;
  sourcePos: { x: number; y: number };
  targetPos: { x: number; y: number };
}

export const PatchCable: React.FC<Props> = ({ connection, sourcePos, targetPos }) => {
  const path = `M ${sourcePos.x} ${sourcePos.y} C ${sourcePos.x + 100} ${sourcePos.y}, ${
    targetPos.x - 100
  } ${targetPos.y}, ${targetPos.x} ${targetPos.y}`;

  const getStrokeColor = () => {
    switch (connection.type) {
      case 'HDMI':
        return '#3B82F6';
      case 'VGA':
        return '#22C55E';
      case 'OPTICAL':
        return '#EF4444';
      case 'RF':
        return '#EAB308';
      case 'TRIGGER':
        return '#A855F7';
      default:
        return '#000000';
    }
  };

  return (
    <svg className="patch-cable" style={{ width: '100%', height: '100%' }}>
      <path
        d={path}
        stroke={getStrokeColor()}
        strokeWidth="3"
        fill="none"
      />
    </svg>
  );
};