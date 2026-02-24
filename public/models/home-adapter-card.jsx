"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({ adapter, onSelect, isSelected }) {
  return (
    <div 
      className={`border rounded-lg p-4 cursor-pointer transition-all ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'
      }`}
      onClick={() => onSelect(adapter)}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium">{adapter.name}</h3>
        {adapter.is_wireless && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Wireless</span>}
      </div>
      
      <div className="text-sm text-gray-700 mb-3">
        <div className="flex justify-between mb-1">
          <span>From:</span>
          <span className="font-medium">{adapter.input_type}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>To:</span>
          <span className="font-medium">{adapter.output_type}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>Brand:</span>
          <span className="font-medium">{adapter.brand}</span>
        </div>
      </div>
      
      {adapter.common_use_cases && (
        <div className="mt-2 text-xs text-gray-600">
          <div className="font-medium mb-1">Common Uses:</div>
          <p>{adapter.common_use_cases}</p>
        </div>
      )}
      
      {adapter.is_smart_home_compatible && (
        <div className="mt-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full inline-block">
          Smart Home Compatible
        </div>
      )}
      
      {adapter.average_range_feet && adapter.is_wireless && (
        <div className="mt-2 text-xs text-gray-600">
          Range: Up to {adapter.average_range_feet} feet
        </div>
      )}
    </div>
  );
}

function StoryComponent() {
  const [selectedAdapter, setSelectedAdapter] = React.useState(null);
  
  const mockAdapters = [
    {
      id: 1,
      name: "HDMI to DisplayPort",
      input_type: "HDMI",
      output_type: "DisplayPort",
      brand: "Cable Matters",
      is_wireless: false,
      is_smart_home_compatible: false,
      common_use_cases: "Connecting modern computers to DisplayPort monitors"
    },
    {
      id: 2,
      name: "Bluetooth Audio Transmitter",
      input_type: "3.5mm Audio",
      output_type: "Bluetooth",
      brand: "Anker",
      is_wireless: true,
      is_smart_home_compatible: true,
      common_use_cases: "Adding Bluetooth to non-wireless audio devices",
      average_range_feet: 30
    },
    {
      id: 3,
      name: "USB-C Hub",
      input_type: "USB-C",
      output_type: "Multiple (HDMI, USB-A, Ethernet)",
      brand: "Satechi",
      is_wireless: false,
      is_smart_home_compatible: false,
      common_use_cases: "Expanding ports on laptops with limited connectivity"
    }
  ];
  
  const handleSelectAdapter = (adapter) => {
    setSelectedAdapter(adapter.id === selectedAdapter?.id ? null : adapter);
  };
  
  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Home Adapter Cards</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockAdapters.map(adapter => (
          <MainComponent 
            key={adapter.id}
            adapter={adapter}
            onSelect={handleSelectAdapter}
            isSelected={selectedAdapter?.id === adapter.id}
          />
        ))}
      </div>
      
      {selectedAdapter && (
        <div className="mt-8 p-4 bg-white rounded-lg border">
          <h2 className="text-xl font-bold mb-2">Selected Adapter</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(selectedAdapter, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
});
}