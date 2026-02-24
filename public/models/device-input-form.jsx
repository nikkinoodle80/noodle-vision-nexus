"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({ deviceType, brand, model, ports, onChange }) {
  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700" htmlFor="deviceType">Device Type</label>
        <input
          type="text"
          name="deviceType"
          value={deviceType}
          onChange={onChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700" htmlFor="brand">Brand</label>
        <input
          type="text"
          name="brand"
          value={brand}
          onChange={onChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700" htmlFor="model">Model</label>
        <input
          type="text"
          name="model"
          value={model}
          onChange={onChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700" htmlFor="ports">Ports</label>
        <input
          type="text"
          name="ports"
          value={ports}
          onChange={onChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
    </div>
  );
}

function StoryComponent() {
  const [deviceInput, setDeviceInput] = React.useState({
    deviceType: '',
    brand: '',
    model: '',
    ports: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeviceInput((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-4">
      <MainComponent
        deviceType={deviceInput.deviceType}
        brand={deviceInput.brand}
        model={deviceInput.model}
        ports={deviceInput.ports}
        onChange={handleChange}
      />
    </div>
  );
});
}