"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({ adapter, onClick }) {
  return (
    <div 
      className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick && onClick(adapter)}
    >
      <div className="flex items-center space-x-4">
        {adapter.image_url && (
          <img 
            src={adapter.image_url} 
            alt={adapter.name} 
            className="w-16 h-16 object-contain"
          />
        )}
        <div>
          <h3 className="font-medium text-lg">{adapter.name}</h3>
          <div className="text-sm text-gray-600">
            <p>{adapter.brand} {adapter.model}</p>
            <p>{adapter.input_type} to {adapter.output_type}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StoryComponent() {
  const sampleAdapters = [
    {
      id: 1,
      name: "HDMI to DisplayPort",
      brand: "TechConnect",
      model: "HD-DP100",
      input_type: "HDMI",
      output_type: "DisplayPort",
      image_url: "/images/hdmi-dp-adapter.jpg"
    },
    {
      id: 2,
      name: "USB-C to HDMI",
      brand: "CableMax",
      model: "CM-USBCH",
      input_type: "USB-C",
      output_type: "HDMI",
      image_url: null
    },
    {
      id: 3,
      name: "3.5mm to RCA",
      brand: "AudioPro",
      model: "AP-35RCA",
      input_type: "3.5mm",
      output_type: "RCA",
      image_url: "/images/35-rca-adapter.jpg"
    }
  ];

  const handleClick = (adapter) => {
    console.log("Adapter clicked:", adapter);
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold mb-4">Adapter Card Examples</h2>
      
      <div>
        <h3 className="text-lg font-medium mb-2">With Image</h3>
        <MainComponent 
          adapter={sampleAdapters[0]} 
          onClick={handleClick} 
        />
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Without Image</h3>
        <MainComponent 
          adapter={sampleAdapters[1]} 
          onClick={handleClick} 
        />
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Different Connector Types</h3>
        <MainComponent 
          adapter={sampleAdapters[2]} 
          onClick={handleClick} 
        />
      </div>
    </div>
  );
});
}