"use client";
import React from "react";

export default function Index() {
  return function MainComponent() {
    // Component Definition for DeviceCard
    function DeviceCard({ device, onClick, isSelected }) {
      const ports = device.ports
        ? typeof device.ports === "string"
          ? JSON.parse(device.ports)
          : device.ports
        : {};
      // portLayout is parsed but not used in the current rendering of DeviceCard. Included for completeness.
      // const portLayout = device.port_layout ? (typeof device.port_layout === 'string' ? JSON.parse(device.port_layout) : device.port_layout) : {};

      const renderPorts = () => {
        const portTypes = Object.keys(ports);
        if (portTypes.length === 0) {
          return null;
        }
        return (
          <div className="flex flex-wrap gap-1 mt-2">
            {portTypes.map((type, index) => (
              <div
                key={`${type}-${index}`}
                className="text-xs px-1.5 py-0.5 rounded bg-[#F6F6F6] text-[#5D646C]"
                title={`${ports[type]} ${type} port(s)`}
              >
                {type}: {ports[type]}
              </div>
            ))}
          </div>
        );
      };

      const baseClasses =
        "border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer font-inter";
      const selectedClasses = "border-[#6567EF] bg-[#E4E7EA] shadow-md";
      const unselectedClasses = "border-[#E4E7EA]";
      const cardClasses = `${baseClasses} ${
        isSelected ? selectedClasses : unselectedClasses
      }`;

      return (
        <div className={cardClasses} onClick={() => onClick && onClick(device)}>
          <div className="flex items-center space-x-4">
            {device.image_url ? (
              <img
                src={device.image_url}
                alt={`${device.name} - ${device.type}`}
                className="w-16 h-16 object-contain"
              />
            ) : (
              <div className="w-16 h-16 bg-[#F6F6F6] flex items-center justify-center rounded">
                <span className="text-xs text-[#8C8C8C] p-1 text-center">
                  {device.type}
                </span>
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-medium text-lg text-[#191919]">
                {device.name}
              </h3>
              <div className="text-sm text-[#5D646C]">
                <p>
                  {device.brand} {device.model}
                </p>
                <p>Type: {device.type}</p>
              </div>
              {renderPorts()}
            </div>
          </div>

          <div className="mt-2 text-xs text-[#8C8C8C] flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1 icon-line"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 16V8m0 0L3 12m4-4l4-4m-4 4l4 4m6 0v8m0 0l4-4m-4 4l-4-4m4 4l4 4"
              />
            </svg>
            Drag to connect or click to select
          </div>
        </div>
      );
    }

    // StoryComponent to showcase DeviceCard
    function StoryComponent() {
      const sampleDevices = [
        {
          id: "dev-1",
          name: "4K Monitor",
          brand: "ViewTech",
          model: "VT-4000",
          type: "Display",
          image_url: "/images/sample-monitor.png", // Placeholder image path
          ports: { HDMI: 2, DisplayPort: 1, "USB-C": 1 },
          port_layout: {},
        },
        {
          id: "dev-2",
          name: "Gaming Laptop",
          brand: "GameForce",
          model: "GF-X15",
          type: "Computer",
          image_url: null,
          ports: {
            HDMI: 1,
            "USB-A": 3,
            "USB-C": 1,
            Ethernet: 1,
            "Audio Jack": 1,
          },
          port_layout: {},
        },
        {
          id: "dev-3",
          name: "Soundbar",
          brand: "AudioPro",
          model: "AP-SB200",
          type: "Audio Output",
          image_url: "/images/sample-soundbar.png", // Placeholder image path
          ports: { "HDMI (ARC)": 1, Optical: 1, AUX: 1 },
          port_layout: {},
        },
        {
          id: "dev-4",
          name: "Old Projector",
          brand: "CineMagic",
          model: "CM-P800",
          type: "Projector",
          image_url: null,
          ports: { VGA: 1, Composite: 1 },
          port_layout: {},
        },
      ];

      const [selectedDeviceId, setSelectedDeviceId] = React.useState(null);

      const handleDeviceClick = (device) => {
        setSelectedDeviceId((prevId) =>
          prevId === device.id ? null : device.id
        );
        console.log("Device clicked:", device);
      };

      return (
        <div className="p-4 bg-white font-inter">
          <h1 className="text-2xl font-medium text-[#191919] mb-6">
            DeviceCard Showcase
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sampleDevices.map((device) => (
              <DeviceCard
                key={device.id}
                device={device}
                onClick={handleDeviceClick}
                isSelected={selectedDeviceId === device.id}
              />
            ))}
          </div>

          <div className="mt-8 p-4 border-t border-[#E4E7EA]">
            <h2 className="text-xl font-medium text-[#191919] mb-3">
              Interactions
            </h2>
            <p className="text-[#5D646C] text-sm">
              Currently selected device ID:{" "}
              {selectedDeviceId ? selectedDeviceId : "None"}
            </p>
            <p className="text-[#5D646C] text-sm mt-2">
              Click on a device card to select or deselect it. The selection
              state uses a{" "}
              <code className="bg-[#F6F6F6] px-1 rounded">bg-[#E4E7EA]</code>{" "}
              background and a{" "}
              <code className="bg-[#F6F6F6] px-1 rounded">
                border-[#6567EF]
              </code>{" "}
              as per the style guide. Device information, including ports, is
              displayed. If an image URL is not provided, a placeholder with the
              device type is shown.
            </p>
          </div>
        </div>
      );
    }

    return <StoryComponent />;
  };
}