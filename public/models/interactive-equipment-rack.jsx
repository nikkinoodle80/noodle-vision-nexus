"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({ backgroundImage, devices, adapters }) {
  const [dragging, setDragging] = React.useState(null);
  const [connections, setConnections] = React.useState([]);

  const handleDragStart = (e, device) => {
    setDragging(device);
  };

  const handleDrop = (e, targetDevice) => {
    if (dragging && dragging !== targetDevice) {
      setConnections((prev) => [
        ...prev,
        { from: dragging, to: targetDevice },
      ]);
    }
    setDragging(null);
  };

  return (
    <div
      className="relative bg-cover bg-center p-4 rounded-lg"
      style={{ backgroundImage: `url(${backgroundImage})`, height: '500px' }}
    >
      <div className="grid grid-cols-1 gap-4">
        {devices.map((device, index) => (
          <div
            key={index}
            className="bg-[#2C2C2C] p-4 rounded-md transform transition-transform hover:scale-105"
            draggable
            onDragStart={(e) => handleDragStart(e, device)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, device)}
          >
            <DeviceInputForm
              deviceType={device.type}
              brand={device.name}
              model={device.description}
              ports={device.status}
              onChange={() => {}}
            />
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-[#191919] bg-opacity-90 text-[#F6F6F6] p-4 font-inter text-xs overflow-auto" style={{ maxHeight: '30vh' }}>
        <h3 className="font-medium">Connections</h3>
        {connections.map((connection, index) => (
          <div key={index}>
            <span>{connection.from.name} to {connection.to.name}</span>
            <span className="text-[#6567EF]"> - Adapter: {adapters[connection.from.type][connection.to.type]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StoryComponent() {
  const devices = [
    { name: "Router", description: "High-speed internet router", status: "Connected", type: "ethernet" },
    { name: "Switch", description: "24-port network switch", status: "Connected", type: "ethernet" },
    { name: "Server", description: "Rack-mounted server", status: "Active", type: "fiber" },
  ];

  const adapters = {
    ethernet: {
      ethernet: "None",
      fiber: "Ethernet to Fiber Adapter",
    },
    fiber: {
      ethernet: "Fiber to Ethernet Adapter",
      fiber: "None",
    },
  };

  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-medium text-center text-[#F6F6F6]">Interactive Equipment Rack</h2>
      <MainComponent
        backgroundImage="https://ucarecdn.com/043d53c2-eee2-4275-ac79-6e4120aaf856/-/format/auto/"
        devices={devices}
        adapters={adapters}
      />
    </div>
  );
});
}