"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({ device, onSelect, isSelected }) {
  const categoryIcons = {
    "tv": "📺",
    "audio": "🔊",
    "gaming": "🎮",
    "computer": "💻",
    "smart_home": "🏠",
    "streaming": "📱",
    "networking": "🌐"
  };

  const icon = categoryIcons[device?.category?.toLowerCase()] || "📱";

  return (
    <div 
      className={`border rounded-lg p-4 cursor-pointer transition-all ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'
      }`}
      onClick={() => onSelect(device)}
    >
      <div className="flex items-center mb-3">
        <span className="text-2xl mr-2">{icon}</span>
        <h3 className="font-medium">{device?.name}</h3>
      </div>
      
      <div className="text-sm text-gray-700">
        <div className="flex justify-between mb-1">
          <span>Brand:</span>
          <span className="font-medium">{device?.brand}</span>
        </div>
        
        {device?.model && (
          <div className="flex justify-between mb-1">
            <span>Model:</span>
            <span className="font-medium">{device.model}</span>
          </div>
        )}
        
        {device?.category && (
          <div className="flex justify-between mb-1">
            <span>Category:</span>
            <span className="font-medium capitalize">{device.category.replace('_', ' ')}</span>
          </div>
        )}
        
        {device?.is_wireless !== undefined && (
          <div className="flex justify-between mb-1">
            <span>Connection:</span>
            <span className="font-medium">{device.is_wireless ? 'Wireless' : 'Wired'}</span>
          </div>
        )}
      </div>
      
      {device?.ports && (
        <div className="mt-3 pt-3 border-t">
          <div className="text-xs text-gray-500 mb-1">Available Ports:</div>
          <div className="flex flex-wrap gap-1">
            {Object.keys(device.ports).map(port => (
              <span key={port} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                {port}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StoryComponent() {
  const [selectedDevice, setSelectedDevice] = React.useState(null);
  
  const mockDevices = [
    {
      id: 1,
      name: "Samsung Smart TV",
      brand: "Samsung",
      model: "QN90A",
      category: "tv",
      is_wireless: true,
      ports: {
        "HDMI": 4,
        "USB": 2,
        "Optical": 1,
        "Ethernet": 1
      }
    },
    {
      id: 2,
      name: "Sonos Beam",
      brand: "Sonos",
      model: "Gen 2",
      category: "audio",
      is_wireless: true,
      ports: {
        "HDMI": 1,
        "Ethernet": 1,
        "Power": 1
      }
    },
    {
      id: 3,
      name: "PlayStation 5",
      brand: "Sony",
      model: "Digital Edition",
      category: "gaming",
      is_wireless: false,
      ports: {
        "HDMI": 1,
        "USB": 3,
        "Ethernet": 1,
        "Power": 1
      }
    }
  ];
  
  const handleSelectDevice = (device) => {
    setSelectedDevice(device.id === selectedDevice?.id ? null : device);
  };
  
  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Home Device Cards</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockDevices.map(device => (
          <MainComponent 
            key={device.id}
            device={device}
            onSelect={handleSelectDevice}
            isSelected={selectedDevice?.id === device.id}
          />
        ))}
      </div>
      
      {selectedDevice && (
        <div className="mt-8 p-4 bg-white rounded-lg border">
          <h2 className="text-xl font-bold mb-2">Selected Device</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(selectedDevice, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
});
}