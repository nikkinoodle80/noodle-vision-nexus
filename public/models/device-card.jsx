"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({ device, onClick, isSelected }) {
  const ports = device.ports ? (typeof device.ports === 'string' ? JSON.parse(device.ports) : device.ports) : {};
  const portLayout = device.port_layout ? (typeof device.port_layout === 'string' ? JSON.parse(device.port_layout) : device.port_layout) : {};
  
  const renderPorts = () => {
    const portTypes = Object.keys(ports);
    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {portTypes.map((type, index) => (
          <div 
            key={`${type}-${index}`}
            className="text-xs px-1.5 py-0.5 rounded bg-gray-200 text-gray-700"
            title={`${ports[type]} ${type} port(s)`}
          >
            {type}: {ports[type]}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div 
      className={`border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${isSelected ? 'border-blue-500 bg-blue-50 shadow-md' : ''}`}
      onClick={() => onClick && onClick(device)}
    >
      <div className="flex items-center space-x-4">
        {device.image_url ? (
          <img 
            src={device.image_url} 
            alt={device.name} 
            className="w-16 h-16 object-contain"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded">
            <span className="text-xs text-gray-500">{device.type}</span>
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-medium text-lg">{device.name}</h3>
          <div className="text-sm text-gray-600">
            <p>{device.brand} {device.model}</p>
            <p>Type: {device.type}</p>
          </div>
          {renderPorts()}
        </div>
      </div>
      
      <div className="mt-2 text-xs text-gray-500 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
        </svg>
        Drag to connect or click to select
      </div>
    </div>
  );
}

function StoryComponent() {
  const sampleDevices = [
    {
      id: 1,
      name: "4K Monitor",
      brand: "ViewTech",
      model: "VT-4000", 
      type: "Display",
      image_url: "/images/monitor.jpg",
      ports: {"HDMI": 2, "DisplayPort": 1, "USB-C": 1},
      port_layout: {
        positions: [
          {id: "hdmi1", type: "HDMI", x: 50, y: 50, label: "HDMI 1"},
          {id: "hdmi2", type: "HDMI", x: 110, y: 50, label: "HDMI 2"},
          {id: "dp1", type: "DisplayPort", x: 170, y: 50, label: "DP"},
          {id: "usbc1", type: "USB-C", x: 230, y: 50, label: "USB-C"}
        ]
      }
    },
    {
      id: 2,
      name: "Gaming Laptop",
      brand: "GameForce", 
      model: "GF-X15",
      type: "Computer",
      image_url: null,
      ports: {"HDMI": 1, "USB-A": 3, "USB-C": 1, "Ethernet": 1, "Audio": 1},
      port_layout: {
        positions: [
          {id: "hdmi1", type: "HDMI", x: 50, y: 50, label: "HDMI"},
          {id: "usba1", type: "USB-A", x: 110, y: 50, label: "USB 1"},
          {id: "usba2", type: "USB-A", x: 170, y: 50, label: "USB 2"},
          {id: "usba3", type: "USB-A", x: 230, y: 50, label: "USB 3"},
          {id: "usbc1", type: "USB-C", x: 50, y: 100, label: "USB-C"},
          {id: "eth1", type: "Ethernet", x: 110, y: 100, label: "LAN"},
          {id: "audio1", type: "Audio", x: 170, y: 100, label: "Audio"}
        ]
      }
    },
    {
      id: 3,
      name: "Bluetooth Speaker",
      brand: "SoundWave",
      model: "SW-100",
      type: "Audio", 
      image_url: "/images/speaker.jpg",
      ports: {"Audio": 1, "USB-A": 1, "Bluetooth": 1},
      port_layout: {
        positions: [
          {id: "audio1", type: "Audio", x: 50, y: 50, label: "AUX"},
          {id: "usba1", type: "USB-A", x: 110, y: 50, label: "USB"},
          {id: "bt1", type: "Bluetooth", x: 170, y: 50, label: "BT"}
        ]
      }
    }
  ];

  const [selectedDevice, setSelectedDevice] = React.useState(null);

  const handleClick = (device) => {
    setSelectedDevice(device.id === selectedDevice?.id ? null : device);
    console.log("Device clicked:", device);
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold mb-4">Device Card Examples</h2>
      
      <div>
        <h3 className="text-lg font-medium mb-2">With Image</h3>
        <MainComponent 
          device={sampleDevices[0]} 
          onClick={handleClick}
          isSelected={selectedDevice?.id === sampleDevices[0].id}
        />
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Without Image</h3>
        <MainComponent 
          device={sampleDevices[1]} 
          onClick={handleClick}
          isSelected={selectedDevice?.id === sampleDevices[1].id}
        />
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Different Device Type</h3>
        <MainComponent 
          device={sampleDevices[2]} 
          onClick={handleClick}
          isSelected={selectedDevice?.id === sampleDevices[2].id}
        />
      </div>
    </div>
  );
});
}