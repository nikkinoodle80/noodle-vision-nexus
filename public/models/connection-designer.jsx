"use client";
import React from "react";



export default function Index() {
  return (function MainComponent() {
  const [nodes, setNodes] = React.useState([
    {
      id: 'device-1',
      x: 200, 
      y: 150,
      type: 'device',
      name: 'Laptop Pro',
      width: 180,
      height: 120,
      inputs: [],
      outputs: [
        { id: 'out1', x: 170, y: 40, label: 'HDMI Out', signalType: 'hdmi' },
        { id: 'out2', x: 170, y: 80, label: 'USB-C Out', signalType: 'usb-c' }
      ]
    },
    {
      id: 'device-2',
      x: 500,
      y: 150,
      type: 'device', 
      name: '4K Monitor',
      width: 180,
      height: 120,
      inputs: [
        { id: 'in1', x: 10, y: 40, label: 'HDMI In', signalType: 'hdmi' },
        { id: 'in2', x: 10, y: 80, label: 'DisplayPort In', signalType: 'displayport' }
      ],
      outputs: []
    },
    {
      id: 'device-3',
      x: 200,
      y: 350,
      type: 'device',
      name: 'Streaming Box',
      width: 150,
      height: 100,
      inputs: [{ id: 'in1-dev3', x:10, y:50, label: 'Ethernet In', signalType: 'ethernet'}],
      outputs: [{ id: 'out1-dev3', x:140, y:50, label: 'HDMI Out', signalType: 'hdmi'}]
    }
  ]);

  const [connections, setConnections] = React.useState([
    {
      id: 'conn-1',
      source: 'device-1',
      target: 'device-2',
      sourcePort: 'out1',
      targetPort: 'in1',
      type: 'hdmi'
    },
    {
      id: 'conn-2',
      source: 'device-3',
      target: 'device-2',
      sourcePort: 'out1-dev3',
      targetPort: 'in2',
      type: 'displayport'
    }
  ]);

  const [selectedNode, setSelectedNode] = React.useState(null);
  const [zoom, setZoom] = React.useState(1.1);
  const [is3DMode, setIs3DMode] = React.useState(false);
  const [cameraAngle, setCameraAngle] = React.useState({x: 30, y: -20, z: 0});
  const [viewPreset, setViewPreset] = React.useState('top-down');

  const addHistoryState = () => { console.log("History state added (placeholder)"); }; 
  const getCableColor = (type) => {
    switch(type) {
      case 'hdmi': return '#6567EF';
      case 'displayport': return '#34D399';
      case 'usb-c': return '#F59E0B';
      default: return '#8C8C8C';
    }
  };

  const toggle3DMode = () => setIs3DMode(prev => !prev);
  const selectNode = (nodeId) => setSelectedNode(nodeId);

  return (
    <div className="font-inter">
      <div className="mb-4 p-2 flex space-x-2">
        <button onClick={toggle3DMode} className="px-3 py-1.5 text-sm bg-[#F6F6F6] text-[#191919] border border-[#E4E7EA] rounded-md hover:bg-[#E4E7EA]">
          Toggle 3D: {is3DMode ? 'On' : 'Off'}
        </button>
        <button onClick={() => selectNode('device-1')} className="px-3 py-1.5 text-sm bg-[#F6F6F6] text-[#191919] border border-[#E4E7EA] rounded-md hover:bg-[#E4E7EA]">
          Select Laptop
        </button>
        <button onClick={() => selectNode(null)} className="px-3 py-1.5 text-sm bg-[#F6F6F6] text-[#191919] border border-[#E4E7EA] rounded-md hover:bg-[#E4E7EA]">
          Deselect Node
        </button>
      </div>
      <></>
    </div>
  );
}

function StoryComponent() {
  return (
    <div className="p-4">
      <h1 className="text-lg font-medium mb-4">Connection Designer Story</h1>
      <MainComponent />
    </div>
  );
});
}