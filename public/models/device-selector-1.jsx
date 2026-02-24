"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({
  onDeviceSelect,
  recentDevices = [],
  availableDevices = defaultDevices,
}) {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSource, setSelectedSource] = useState(null);
  const [selectedSourcePort, setSelectedSourcePort] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [selectedTargetPort, setSelectedTargetPort] = useState(null);

  const filteredDevices = useMemo(() => {
    let devices = availableDevices;

    if (activeTab !== "all") {
      devices = devices.filter((device) => device.category === activeTab);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      devices = devices.filter(
        (device) =>
          device.name.toLowerCase().includes(query) ||
          device.brand.toLowerCase().includes(query) ||
          device.type.toLowerCase().includes(query),
      );
    }

    return devices;
  }, [availableDevices, activeTab, searchQuery]);

  const handleSourceSelect = (device) => {
    setSelectedSource(device);
    setSelectedSourcePort(null);
  };

  const handleTargetSelect = (device) => {
    setSelectedTarget(device);
    setSelectedTargetPort(null);
  };

  const handleSourcePortSelect = (port) => {
    setSelectedSourcePort(port);
  };

  const handleTargetPortSelect = (port) => {
    setSelectedTargetPort(port);
  };

  const handleConfirm = () => {
    if (
      selectedSource &&
      selectedTarget &&
      selectedSourcePort &&
      selectedTargetPort
    ) {
      onDeviceSelect?.({
        source: selectedSource,
        sourcePort: selectedSourcePort,
        target: selectedTarget,
        targetPort: selectedTargetPort,
      });
    }
  };

  const categories = [
    { id: "all", name: "All Devices", icon: "fa-th-large" },
    { id: "audio", name: "Audio", icon: "fa-volume-up" },
    { id: "video", name: "Video", icon: "fa-video" },
    { id: "computer", name: "Computers", icon: "fa-laptop" },
    { id: "mobile", name: "Mobile", icon: "fa-mobile-alt" },
    { id: "display", name: "Displays", icon: "fa-desktop" },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <div className="border rounded-lg p-4 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4">Source Device</h2>

          {selectedSource ? (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Selected Source</h3>
                <button
                  onClick={() => setSelectedSource(null)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Change
                </button>
              </div>
              <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <img
                  src={selectedSource.image}
                  alt={selectedSource.name}
                  className="w-16 h-16 object-contain mr-3"
                />
                <div>
                  <p className="font-medium">{selectedSource.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedSource.brand}
                  </p>
                </div>
              </div>

              <h3 className="font-semibold mt-4 mb-2">Select Output Port</h3>
              <div className="grid grid-cols-2 gap-2">
                {selectedSource.ports
                  .filter((port) => port.type === "output")
                  .map((port) => (
                    <button
                      key={port.id}
                      onClick={() => handleSourcePortSelect(port)}
                      className={`p-2 border rounded text-left text-sm ${
                        selectedSourcePort?.id === port.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-400"
                          : "border-gray-300 dark:border-gray-700"
                      }`}
                    >
                      <div className="flex items-center">
                        <span
                          className={`w-3 h-3 rounded-full mr-2 bg-${port.color}-500`}
                        ></span>
                        <span>{port.name}</span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 block mt-1">
                        {port.description}
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          ) : (
            <DeviceSelector
              title="Select Source Device"
              devices={filteredDevices}
              recentDevices={recentDevices}
              onSelect={handleSourceSelect}
              categories={categories}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          )}
        </div>

        <div className="border rounded-lg p-4 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4">Target Device</h2>

          {selectedTarget ? (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Selected Target</h3>
                <button
                  onClick={() => setSelectedTarget(null)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Change
                </button>
              </div>
              <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <img
                  src={selectedTarget.image}
                  alt={selectedTarget.name}
                  className="w-16 h-16 object-contain mr-3"
                />
                <div>
                  <p className="font-medium">{selectedTarget.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedTarget.brand}
                  </p>
                </div>
              </div>

              <h3 className="font-semibold mt-4 mb-2">Select Input Port</h3>
              <div className="grid grid-cols-2 gap-2">
                {selectedTarget.ports
                  .filter((port) => port.type === "input")
                  .map((port) => (
                    <button
                      key={port.id}
                      onClick={() => handleTargetPortSelect(port)}
                      className={`p-2 border rounded text-left text-sm ${
                        selectedTargetPort?.id === port.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-400"
                          : "border-gray-300 dark:border-gray-700"
                      }`}
                    >
                      <div className="flex items-center">
                        <span
                          className={`w-3 h-3 rounded-full mr-2 bg-${port.color}-500`}
                        ></span>
                        <span>{port.name}</span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 block mt-1">
                        {port.description}
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          ) : (
            <DeviceSelector
              title="Select Target Device"
              devices={filteredDevices}
              recentDevices={recentDevices}
              onSelect={handleTargetSelect}
              categories={categories}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          )}
        </div>
      </div>

      <div className="p-4 border-t dark:border-gray-700 flex justify-end">
        <button
          onClick={handleConfirm}
          disabled={
            !selectedSource ||
            !selectedTarget ||
            !selectedSourcePort ||
            !selectedTargetPort
          }
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm Connection
        </button>
      </div>
    </div>
  );
}

function DeviceSelector({
  title,
  devices,
  recentDevices,
  onSelect,
  categories,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
}) {
  return (
    <div>
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search devices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 pl-10 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          />
          <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
        </div>
      </div>

      <div className="mb-4 overflow-x-auto">
        <div className="flex space-x-2 min-w-max">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`px-4 py-2 rounded-lg flex items-center ${
                activeTab === category.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <i className={`fas ${category.icon} mr-2`}></i>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {recentDevices.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Recently Used</h3>
          <div className="grid grid-cols-2 gap-2">
            {recentDevices.slice(0, 4).map((device) => (
              <button
                key={device.id}
                onClick={() => onSelect(device)}
                className="flex items-center p-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-700"
              >
                <img
                  src={device.image}
                  alt={device.name}
                  className="w-10 h-10 object-contain mr-2"
                />
                <div className="text-left">
                  <p className="text-sm font-medium truncate">{device.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {device.brand}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <h3 className="font-semibold mb-2">{title}</h3>
      <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
        {devices.map((device) => (
          <button
            key={device.id}
            onClick={() => onSelect(device)}
            className="flex flex-col p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-700"
          >
            <div className="flex items-center mb-2">
              <img
                src={device.image}
                alt={device.name}
                className="w-12 h-12 object-contain mr-2"
              />
              <div className="text-left">
                <p className="font-medium truncate">{device.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {device.brand}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {device.ports.slice(0, 3).map((port) => (
                <span
                  key={port.id}
                  className="inline-flex items-center text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded"
                >
                  <span
                    className={`w-2 h-2 rounded-full mr-1 bg-${port.color}-500`}
                  ></span>
                  {port.name}
                </span>
              ))}
              {device.ports.length > 3 && (
                <span className="inline-flex items-center text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">
                  +{device.ports.length - 3} more
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4">
        <button
          onClick={() => {
            // Show modal or inline form for user to enter make and model
            // Call /api/scrape-device-ports with make and model
            // Show loading and error states
            // If scraping succeeds, use the returned ports to create a temporary device object (with a placeholder image) and add it to the availableDevices for this session
            // If scraping fails, let user manually enter port info (name, type, color, description) and use that for the device
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Custom Device
        </button>
      </div>
    </div>
  );
}

const defaultDevices = [
  {
    id: 1,
    name: 'MacBook Pro 16"',
    brand: "Apple",
    type: "Laptop",
    category: "computer",
    image: "/devices/macbook.png",
    ports: [
      {
        id: 101,
        name: "USB-C 1",
        type: "output",
        color: "blue",
        description: "Thunderbolt 4",
      },
      {
        id: 102,
        name: "USB-C 2",
        type: "output",
        color: "blue",
        description: "Thunderbolt 4",
      },
      {
        id: 103,
        name: "USB-C 3",
        type: "output",
        color: "blue",
        description: "Thunderbolt 4",
      },
      {
        id: 104,
        name: "Headphone",
        type: "output",
        color: "green",
        description: "3.5mm Audio",
      },
    ],
  },
  {
    id: 2,
    name: "iPhone 15 Pro",
    brand: "Apple",
    type: "Smartphone",
    category: "mobile",
    image: "/devices/iphone.png",
    ports: [
      {
        id: 201,
        name: "USB-C",
        type: "output",
        color: "blue",
        description: "USB 3.1",
      },
      {
        id: 202,
        name: "Bluetooth",
        type: "output",
        color: "purple",
        description: "Bluetooth 5.3",
      },
    ],
  },
  {
    id: 3,
    name: "Dell XPS 15",
    brand: "Dell",
    type: "Laptop",
    category: "computer",
    image: "/devices/dell-xps.png",
    ports: [
      {
        id: 301,
        name: "USB-C 1",
        type: "output",
        color: "blue",
        description: "Thunderbolt 4",
      },
      {
        id: 302,
        name: "USB-C 2",
        type: "output",
        color: "blue",
        description: "Thunderbolt 4",
      },
      {
        id: 303,
        name: "USB-A",
        type: "output",
        color: "blue",
        description: "USB 3.2",
      },
      {
        id: 304,
        name: "HDMI",
        type: "output",
        color: "red",
        description: "HDMI 2.0",
      },
      {
        id: 305,
        name: "Headphone",
        type: "output",
        color: "green",
        description: "3.5mm Audio",
      },
    ],
  },
  {
    id: 4,
    name: "LG UltraFine 5K",
    brand: "LG",
    type: "Monitor",
    category: "display",
    image: "/devices/lg-monitor.png",
    ports: [
      {
        id: 401,
        name: "USB-C",
        type: "input",
        color: "blue",
        description: "Thunderbolt 3",
      },
      {
        id: 402,
        name: "USB-A 1",
        type: "input",
        color: "blue",
        description: "USB 3.0",
      },
      {
        id: 403,
        name: "USB-A 2",
        type: "input",
        color: "blue",
        description: "USB 3.0",
      },
    ],
  },
  {
    id: 5,
    name: "Samsung QLED TV",
    brand: "Samsung",
    type: "TV",
    category: "display",
    image: "/devices/samsung-tv.png",
    ports: [
      {
        id: 501,
        name: "HDMI 1",
        type: "input",
        color: "red",
        description: "HDMI 2.1",
      },
      {
        id: 502,
        name: "HDMI 2",
        type: "input",
        color: "red",
        description: "HDMI 2.1",
      },
      {
        id: 503,
        name: "HDMI 3",
        type: "input",
        color: "red",
        description: "HDMI 2.1",
      },
      {
        id: 504,
        name: "Optical",
        type: "output",
        color: "green",
        description: "Digital Audio",
      },
      {
        id: 505,
        name: "USB-A",
        type: "input",
        color: "blue",
        description: "USB 2.0",
      },
    ],
  },
  {
    id: 6,
    name: "Bose QuietComfort",
    brand: "Bose",
    type: "Headphones",
    category: "audio",
    image: "/devices/bose-headphones.png",
    ports: [
      {
        id: 601,
        name: "3.5mm",
        type: "input",
        color: "green",
        description: "Analog Audio",
      },
      {
        id: 602,
        name: "Bluetooth",
        type: "input",
        color: "purple",
        description: "Bluetooth 5.1",
      },
    ],
  },
  {
    id: 7,
    name: "Sony A7 IV",
    brand: "Sony",
    type: "Camera",
    category: "video",
    image: "/devices/sony-camera.png",
    ports: [
      {
        id: 701,
        name: "HDMI",
        type: "output",
        color: "red",
        description: "HDMI 2.0",
      },
      {
        id: 702,
        name: "USB-C",
        type: "output",
        color: "blue",
        description: "USB 3.2",
      },
      {
        id: 703,
        name: "Mic",
        type: "input",
        color: "green",
        description: "3.5mm Audio",
      },
    ],
  },
  {
    id: 8,
    name: "Sonos Beam",
    brand: "Sonos",
    type: "Soundbar",
    category: "audio",
    image: "/devices/sonos-beam.png",
    ports: [
      {
        id: 801,
        name: "HDMI",
        type: "input",
        color: "red",
        description: "HDMI ARC",
      },
      {
        id: 802,
        name: "Optical",
        type: "input",
        color: "green",
        description: "Digital Audio",
      },
      {
        id: 803,
        name: "Ethernet",
        type: "input",
        color: "yellow",
        description: "Gigabit",
      },
    ],
  },
];

function StoryComponent() {
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [recentDevices, setRecentDevices] = useState([
    defaultDevices[0],
    defaultDevices[3],
    defaultDevices[4],
    defaultDevices[6],
  ]);

  const handleDeviceSelect = (connection) => {
    setSelectedConnection(connection);

    if (!recentDevices.find((d) => d.id === connection.source.id)) {
      setRecentDevices((prev) => [connection.source, ...prev].slice(0, 4));
    }
    if (!recentDevices.find((d) => d.id === connection.target.id)) {
      setRecentDevices((prev) => [connection.target, ...prev].slice(0, 4));
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Device Selector</h1>

      <MainComponent
        onDeviceSelect={handleDeviceSelect}
        recentDevices={recentDevices}
        availableDevices={defaultDevices}
      />

      {selectedConnection && (
        <div className="mt-8 p-6 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4">Selected Connection</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
              <h3 className="font-semibold mb-2">Source Device</h3>
              <div className="flex items-center">
                <img
                  src={selectedConnection.source.image}
                  alt={selectedConnection.source.name}
                  className="w-12 h-12 object-contain mr-3"
                />
                <div>
                  <p className="font-medium">
                    {selectedConnection.source.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedConnection.source.brand}
                  </p>
                </div>
              </div>
              <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded">
                <p className="text-sm font-medium">
                  Port: {selectedConnection.sourcePort.name}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {selectedConnection.sourcePort.description}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-24 h-2 bg-blue-500 relative">
                <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-blue-600 rounded-full"></div>
                <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-blue-600 rounded-full"></div>
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
              <h3 className="font-semibold mb-2">Target Device</h3>
              <div className="flex items-center">
                <img
                  src={selectedConnection.target.image}
                  alt={selectedConnection.target.name}
                  className="w-12 h-12 object-contain mr-3"
                />
                <div>
                  <p className="font-medium">
                    {selectedConnection.target.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedConnection.target.brand}
                  </p>
                </div>
              </div>
              <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded">
                <p className="text-sm font-medium">
                  Port: {selectedConnection.targetPort.name}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {selectedConnection.targetPort.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Component Variants</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border p-4 rounded-lg dark:border-gray-700">
            <h3 className="font-semibold mb-4">Empty State</h3>
            <MainComponent
              onDeviceSelect={() => {}}
              recentDevices={[]}
              availableDevices={defaultDevices.slice(0, 4)}
            />
          </div>

          <div className="border p-4 rounded-lg dark:border-gray-700">
            <h3 className="font-semibold mb-4">With Source Selected</h3>
            <MainComponent
              onDeviceSelect={() => {}}
              recentDevices={[]}
              availableDevices={defaultDevices.slice(0, 4)}
              initialSource={defaultDevices[0]}
            />
          </div>
        </div>
      </div>
    </div>
  );
});
}