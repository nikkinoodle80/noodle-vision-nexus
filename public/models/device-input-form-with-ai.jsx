"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({ onSubmit }) {
  const [deviceType, setDeviceType] = useState('');
  const [ports, setPorts] = useState('');
  const [wireType, setWireType] = useState('');
  const [deviceName, setDeviceName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ deviceType, ports, wireType, deviceName });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow-md">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Device Type</label>
        <input
          type="text"
          name="deviceType"
          value={deviceType}
          onChange={(e) => setDeviceType(e.target.value)}
          placeholder="AI suggested device type"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Ports</label>
        <input
          type="text"
          name="ports"
          value={ports}
          onChange={(e) => setPorts(e.target.value)}
          placeholder="AI suggested ports"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Wire Type</label>
        <input
          type="text"
          name="wireType"
          value={wireType}
          onChange={(e) => setWireType(e.target.value)}
          placeholder="AI suggested wire type"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Device Name</label>
        <input
          type="text"
          name="deviceName"
          value={deviceName}
          onChange={(e) => setDeviceName(e.target.value)}
          placeholder="AI suggested device name"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <button
        type="submit"
        className="inline-block w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Submit
      </button>
    </form>
  );
}

function StoryComponent() {
  const handleFormSubmit = (data) => {
    console.log('Form submitted with data:', data);
  };

  return (
    <div className="space-y-4">
      <MainComponent onSubmit={handleFormSubmit} />
    </div>
  );
});
}