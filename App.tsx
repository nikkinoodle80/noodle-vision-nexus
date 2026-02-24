import React from 'react';
import { Equipment } from './components/Equipment';
import { PatchCable } from './components/PatchCable';
import { useStore } from './store';

function App() {
  const { equipment, connections, addEquipment } = useStore();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mb-4">
        <button
          onClick={() => addEquipment(`Equipment ${equipment.length + 1}`)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Equipment
        </button>
      </div>
      
      <div className="relative bg-white rounded-xl shadow-xl h-[800px] overflow-hidden">
        {equipment.map((eq) => (
          <Equipment key={eq.id} equipment={eq} />
        ))}
        
        {connections.map((connection) => {
          const sourceEquipment = equipment.find((eq) =>
            eq.ports.some((p) => p.id === connection.sourcePortId)
          );
          const targetEquipment = equipment.find((eq) =>
            eq.ports.some((p) => p.id === connection.targetPortId)
          );
          
          if (!sourceEquipment || !targetEquipment) return null;
          
          const sourcePort = sourceEquipment.ports.find(
            (p) => p.id === connection.sourcePortId
          );
          const targetPort = targetEquipment.ports.find(
            (p) => p.id === connection.targetPortId
          );
          
          if (!sourcePort || !targetPort) return null;
          
          return (
            <PatchCable
              key={connection.id}
              connection={connection}
              sourcePos={{
                x: sourceEquipment.position.x + sourcePort.x,
                y: sourceEquipment.position.y + sourcePort.y,
              }}
              targetPos={{
                x: targetEquipment.position.x + targetPort.x,
                y: targetEquipment.position.y + targetPort.y,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default App;