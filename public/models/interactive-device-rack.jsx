"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({ devices = [], adapters = [], onConnectionChange }) {
  const [connections, setConnections] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [deviceDetails, setDeviceDetails] = useState({});
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (selectedDevice) {
      fetchDeviceDetails(selectedDevice.id);
    }
  }, [selectedDevice]);

  const fetchDeviceDetails = async (deviceId) => {
    try {
      const response = await fetch(`/api/get-device-with-ports`, {
        method: "POST", 
        body: JSON.stringify({ deviceId })
      });
      const data = await response.json();
      
      if (data.success) {
        setDeviceDetails(prev => ({
          ...prev,
          [deviceId]: data.device
        }));
      }
    } catch (error) {
      console.error("Error fetching device details:", error);
    }
  };

  const handleAddConnection = (connection) => {
    setConnections(prev => [...prev, connection]);
    if (onConnectionChange) {
      onConnectionChange([...connections, connection]);
    }
  };

  const handleRemoveConnection = (index) => {
    setConnections(prev => prev.filter((_, i) => i !== index));
    if (onConnectionChange) {
      onConnectionChange(connections.filter((_, i) => i !== index));
    }
  };

  const handleSimulate = async () => {
    if (connections.length === 0) {
      setFeedback({
        success: false,
        message: "No connections to simulate. Please connect devices first."
      });
      return;
    }
    
    try {
      const sourceDeviceId = connections[0].sourceDeviceId;
      const targetDeviceId = connections[connections.length - 1].targetDeviceId;
      
      const response = await fetch('/api/simulate-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceDeviceId,
          targetDeviceId,
          connections,
          useInventoryOnly: false
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setFeedback({
          success: data.simulationResult.success,
          message: data.simulationResult.feedback,
          alternatives: data.simulationResult.alternatives,
          missingItems: data.simulationResult.missingItems
        });
      } else {
        setFeedback({
          success: false,
          message: data.error || "Simulation failed"
        });
      }
    } catch (error) {
      console.error("Error simulating connection:", error);
      setFeedback({
        success: false,
        message: "An error occurred during simulation"
      });
    }
  };

  return (
    <></>
  );
}

function DeviceItem({ device, onSelect, isSelected }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'DEVICE',
    item: { id: device.id, type: 'device', device },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  
  return (
    <div
      ref={drag}
      className={`p-3 mb-2 border rounded cursor-pointer ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} ${isDragging ? 'opacity-50' : 'opacity-100'}`}
      onClick={onSelect}
    >
      <div className="flex items-center">
        {device.image_url && (
          <img 
            src={device.image_url} 
            alt={device.name} 
            className="w-12 h-12 object-contain mr-3"
          />
        )}
        <div>
          <h4 className="font-medium">{device.name}</h4>
          <p className="text-sm text-gray-600">{device.brand} {device.model}</p>
        </div>
      </div>
    </div>
  );
}

function DeviceVisualizer({ device, details, adapters, onAddConnection }) {
  const [selectedPort, setSelectedPort] = useState(null);  
  const [showAdapterMenu, setShowAdapterMenu] = useState(false);
  const [selectedAdapter, setSelectedAdapter] = useState(null);
  const [targetDevice, setTargetDevice] = useState(null);
  
  const handlePortClick = (port) => {
    setSelectedPort(port);
    setShowAdapterMenu(true); 
  };
  
  const handleAdapterSelect = (adapter) => {
    setSelectedAdapter(adapter);
    setShowAdapterMenu(false);
  };
  
  const handleTargetDeviceSelect = (targetDev) => {
    setTargetDevice(targetDev);
    
    if (selectedPort && selectedAdapter && targetDev) {
      onAddConnection({
        sourceDeviceId: device.id,
        sourceName: device.name,
        sourcePortType: selectedPort.type,
        sourcePortId: selectedPort.id,
        adapterTypeId: selectedAdapter.id,
        adapterName: selectedAdapter.name,
        targetDeviceId: targetDev.id,
        targetName: targetDev.name,
        targetPortType: selectedAdapter.output_type
      });
      
      setSelectedPort(null);
      setSelectedAdapter(null);
      setTargetDevice(null);
    }
  };
  
  if (!details) {
    return <div className="flex justify-center items-center h-full">Loading device details...</div>;
  }
  
  const portLayout = details.port_layout || { positions: [] };
  
  return (
    <div className="relative min-h-[200px] bg-gray-50 rounded p-4">
      <h3 className="text-center font-medium mb-4">{device.name}</h3>
      
      <div className="flex justify-center mb-4">
        {device.image_url ? (
          <img 
            src={device.image_url} 
            alt={device.name} 
            className="h-32 object-contain"
          />
        ) : (
          <div className="h-32 w-64 bg-gray-200 flex items-center justify-center rounded">
            <span className="text-gray-500">{device.name}</span>
          </div>
        )}
      </div>
      
      <div className="relative border-t-2 border-gray-300 pt-4">
        <h4 className="text-sm font-medium mb-2">Available Ports:</h4>
        <div className="flex flex-wrap gap-2">
          {portLayout.positions.map((port) => (
            <div 
              key={port.id}
              className={`relative p-2 border rounded-md cursor-pointer ${selectedPort?.id === port.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
              onClick={() => handlePortClick(port)}
            >
              <div className="text-xs font-medium">{port.label}</div>
              <div className="text-xs text-gray-500">{port.type}</div>
            </div>
          ))}
        </div>
      </div>
      
      {showAdapterMenu && selectedPort && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-white bg-opacity-90 z-10 p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Select an Adapter for {selectedPort.type} Port</h3>
            <button 
              onClick={() => {
                setShowAdapterMenu(false);
                setSelectedPort(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {adapters
              .filter(adapter => adapter.input_type === selectedPort.type)
              .map(adapter => (
                <div 
                  key={adapter.id}
                  className="border p-2 rounded cursor-pointer hover:bg-gray-50"
                  onClick={() => handleAdapterSelect(adapter)}
                >
                  <div className="font-medium text-sm">{adapter.name}</div>
                  <div className="text-xs text-gray-600">
                    {adapter.input_type} → {adapter.output_type}
                  </div>
                  {adapter.brand && (
                    <div className="text-xs text-gray-500">{adapter.brand} {adapter.model}</div>
                  )}
                </div>
              ))}
          </div>
          
          {adapters.filter(adapter => adapter.input_type === selectedPort.type).length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No compatible adapters found for {selectedPort.type} port
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StoryComponent() {
  const sampleDevices = [
    {
      id: "device1",
      name: "MacBook Pro", 
      brand: "Apple",
      model: "2021",
      image_url: "/images/macbook.jpg"
    },
    {
      id: "device2", 
      name: "Dell Monitor",
      brand: "Dell", 
      model: "U2720Q",
      image_url: "/images/dell-monitor.jpg"
    },
    {
      id: "device3",
      name: "HDMI Projector",
      brand: "Epson",
      model: "PowerLite", 
      image_url: "/images/projector.jpg"
    }
  ];

  const sampleAdapters = [
    {
      id: "adapter1",
      name: "USB-C to HDMI Adapter",
      brand: "Anker",
      model: "555",
      input_type: "USB-C",
      output_type: "HDMI"
    },
    {
      id: "adapter2", 
      name: "HDMI to DisplayPort",
      brand: "Cable Matters",
      model: "101",
      input_type: "HDMI",
      output_type: "DisplayPort"
    },
    {
      id: "adapter3",
      name: "DisplayPort to DVI",
      brand: "StarTech",
      model: "DP2DVI", 
      input_type: "DisplayPort",
      output_type: "DVI"
    }
  ];

  const handleConnectionChange = (connections) => {
    console.log("Connections updated:", connections);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Interactive Device Rack Demo</h1>
      <MainComponent 
        devices={sampleDevices}
        adapters={sampleAdapters}
        onConnectionChange={handleConnectionChange}
      />
    </div>
  );
});
}