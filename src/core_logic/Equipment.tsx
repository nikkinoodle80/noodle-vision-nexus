import React from 'react';
import Draggable from 'react-draggable';
import { Equipment as EquipmentType } from '../types';
import { useStore } from '../store';

interface Props {
  equipment: EquipmentType;
}

export const Equipment: React.FC<Props> = ({ equipment }) => {
  const updatePosition = useStore((state) => state.updateEquipmentPosition);

  const handleDrag = (_: any, data: { x: number; y: number }) => {
    updatePosition(equipment.id, data.x, data.y);
  };

  return (
    <Draggable
      position={equipment.position}
      onDrag={handleDrag}
      bounds="parent"
    >
      <div className="equipment">
        <h3 className="text-lg font-bold mb-2">{equipment.name}</h3>
        <div className="flex flex-col gap-2">
          {equipment.ports.map((port) => (
            <div
              key={port.id}
              className={`port port-${port.type.toLowerCase()}`}
              data-port-id={port.id}
              data-port-type={port.type}
            />
          ))}
        </div>
      </div>
    </Draggable>
  );
};