"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({ devices }) {
  return (
    <div className="bg-[#1B1B1B] p-4 rounded-lg">
      <div className="grid grid-cols-1 gap-4">
        {devices.map((device, index) => (
          <div
            key={index}
            className="bg-[#2C2C2C] p-4 rounded-md transform transition-transform hover:scale-105"
          >
            <h3 className="text-[#F6F6F6] text-lg font-inter font-medium">{device.name}</h3>
            <p className="text-[#B1B1B1] font-inter">{device.description}</p>
            <div className="flex items-center mt-2">
              <span className="text-green-400 mr-2">●</span>
              <span className="text-[#B1B1B1] font-inter">{device.status}</span>
            </div>
          </div>
        ))}
      </div>
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        .device {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  );
}

function StoryComponent() {
  const devices = [
    { name: "Router", description: "High-speed internet router", status: "Connected" },
    { name: "Switch", description: "24-port network switch", status: "Connected" },
    { name: "Server", description: "Rack-mounted server", status: "Active" },
  ];

  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-inter font-medium text-center text-[#F6F6F6]">Equipment Rack</h2>
      <MainComponent devices={devices} />
    </div>
  );
});
}