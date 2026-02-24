"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({ sourceDevice, targetDevice, adapters, onAddAdapter, onRemoveAdapter, selectedPorts, connectionQuality, connectionPath }) {
  const [availableAdapters, setAvailableAdapters] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [rotationAngle, setRotationAngle] = React.useState(0);
  const [showAdapterSelector, setShowAdapterSelector] = React.useState(false);
  const [signalFlow, setSignalFlow] = React.useState(false);

  React.useEffect(() => {
    if (sourceDevice && targetDevice) {
      fetchCompatibleAdapters();
    }
  }, [sourceDevice, targetDevice]);

  const fetchCompatibleAdapters = async () => {
    if (!sourceDevice || !targetDevice) return;
    
    setLoading(true);
    try {
      const sourcePort = selectedPorts?.source || Object.keys(sourceDevice.ports)[0];
      const targetPort = selectedPorts?.target || Object.keys(targetDevice.ports)[0];
      
      const lastAdapter = adapters.length > 0 ? adapters[adapters.length - 1] : null;
      const inputType = lastAdapter ? lastAdapter.output_type : sourceDevice.ports[sourcePort].type;
      
      const params = new URLSearchParams();
      params.append('inputType', inputType);
      
      if (adapters.length === 0 || (lastAdapter && lastAdapter.output_type !== targetDevice.ports[targetPort].type)) {
        params.append('outputType', targetDevice.ports[targetPort].type);
      }
      
      const response = await fetch(`/api/adapters/list?${params.toString()}`);
      const data = await response.json();
      
      if (data.adapters) {
        setAvailableAdapters(data.adapters);
      } else {
        setAvailableAdapters([]);
      }
    } catch (error) {
      console.error('Error fetching compatible adapters:', error);
      setAvailableAdapters([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdapter = (adapter) => {
    onAddAdapter(adapter);
    setShowAdapterSelector(false);
    fetchCompatibleAdapters();
  };

  const handleRotate = (direction) => {
    if (direction === 'left') {
      setRotationAngle(prev => prev - 90);
    } else {
      setRotationAngle(prev => prev + 90);
    }
  };

  const toggleSignalFlow = () => {
    setSignalFlow(prev => !prev);
  };

  const getQualityColor = (quality) => {
    if (!quality) return '#cccccc';
    if (quality >= 80) return '#10b981';
    if (quality >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getDeviceIcon = (device) => {
    if (!device) return 'question-circle';
    
    switch(device.type) {
      case 'smartphone':
        return 'mobile-alt';
      case 'laptop':
        return 'laptop';
      case 'tv':
        return 'tv';
      case 'monitor':
        return 'desktop';
      case 'console':
        return 'gamepad';
      default:
        return device.type === 'source' ? 'desktop' : 'hdd';
    }
  };

  return (
    <div className="adapter-visualizer">
      <div className="flex justify-between mb-4">
        <div>
          <button 
            onClick={() => handleRotate('left')}
            className="p-2 bg-gray-200 dark:bg-gray-700 rounded-l-lg"
          >
            <i className="fas fa-undo"></i>
          </button>
          <button 
            onClick={() => handleRotate('right')}
            className="p-2 bg-gray-200 dark:bg-gray-700 rounded-r-lg"
          >
            <i className="fas fa-redo"></i>
          </button>
        </div>
        
        <div>
          <button 
            onClick={toggleSignalFlow}
            className={`p-2 rounded-lg ${
              signalFlow 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <i className="fas fa-bolt mr-1"></i>
            Signal Flow
          </button>
        </div>
        
        <div>
          <button 
            onClick={() => setShowAdapterSelector(true)}
            disabled={!sourceDevice || !targetDevice}
            className="p-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            <i className="fas fa-plus mr-1"></i>
            Add Adapter
          </button>
        </div>
      </div>
      
      <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg p-4 h-80 flex items-center justify-center overflow-hidden">
        {!sourceDevice || !targetDevice ? (
          <div className="text-center text-gray-500">
            <i className="fas fa-plug text-4xl mb-2"></i>
            <p>Select source and target devices to visualize connection</p>
          </div>
        ) : (
          <div 
            className="flex items-center justify-between w-full transition-transform duration-500"
            style={{ transform: `rotateY(${rotationAngle}deg)` }}
          >
            <div className="device-box source-device">
              <div className="device-icon-container">
                {sourceDevice.image_url ? (
                  <img 
                    src={sourceDevice.image_url} 
                    alt={sourceDevice.name} 
                    className="h-20 w-auto object-contain mb-2"
                  />
                ) : (
                  <div className="h-20 w-full flex items-center justify-center mb-2 bg-gray-200 dark:bg-gray-700 rounded">
                    <i className={`fas fa-${getDeviceIcon(sourceDevice)} text-4xl text-gray-400`}></i>
                  </div>
                )}
              </div>
              <div className="text-sm font-medium">{sourceDevice.name}</div>
              <div className="port-indicator">
                <i className="fas fa-circle text-green-500 mr-1"></i>
                <span className="text-xs">{selectedPorts?.source || Object.keys(sourceDevice.ports)[0]}</span>
              </div>
            </div>
            
            <div className="flex-1 flex items-center justify-center relative">
              {adapters.length === 0 ? (
                <div className="text-center text-gray-500 absolute inset-0 flex items-center justify-center">
                  <div>
                    <i className="fas fa-exclamation-triangle text-2xl mb-2"></i>
                    <p className="text-sm">No direct connection</p>
                    <button 
                      onClick={() => setShowAdapterSelector(true)}
                      className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded-lg"
                    >
                      Add Adapter
                    </button>
                  </div>
                </div>
              ) : (
                <div className="connection-path w-full flex items-center">
                  {adapters.map((adapter, index) => (
                    <div key={index} className="flex items-center flex-1">
                      <div className="connection-line flex-1">
                        <div 
                          className="h-2 w-full rounded-full" 
                          style={{ backgroundColor: getQualityColor(connectionQuality) }}
                        >
                          {signalFlow && (
                            <div className="signal-dot-container">
                              <div className="signal-dot"></div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="adapter-box relative">
                        <div className="adapter-icon-container">
                          {adapter.image_url ? (
                            <img 
                              src={adapter.image_url} 
                              alt={adapter.name} 
                              className="h-16 w-auto object-contain"
                            />
                          ) : (
                            <div className="h-16 w-16 flex items-center justify-center bg-blue-100 dark:bg-blue-800 rounded">
                              <i className="fas fa-plug text-2xl text-blue-500 dark:text-blue-300"></i>
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-center mt-1 font-medium">{adapter.name}</div>
                        <div className="text-xs text-center text-gray-500">
                          {adapter.input_type} → {adapter.output_type}
                        </div>
                        
                        {adapter.requires_power && (
                          <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center">
                            <i className="fas fa-bolt text-xs"></i>
                          </div>
                        )}
                        
                        <button 
                          onClick={() => onRemoveAdapter(index)}
                          className="absolute -top-2 -left-2 bg-gray-700 text-white rounded-full h-5 w-5 flex items-center justify-center"
                        >
                          <i className="fas fa-times text-xs"></i>
                        </button>
                      </div>
                      
                      {index === adapters.length - 1 && (
                        <div className="connection-line flex-1">
                          <div 
                            className="h-2 w-full rounded-full" 
                            style={{ backgroundColor: getQualityColor(connectionQuality) }}
                          >
                            {signalFlow && (
                              <div className="signal-dot-container">
                                <div className="signal-dot"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="device-box target-device">
              <div className="device-icon-container">
                {targetDevice.image_url ? (
                  <img 
                    src={targetDevice.image_url} 
                    alt={targetDevice.name} 
                    className="h-20 w-auto object-contain mb-2"
                  />
                ) : (
                  <div className="h-20 w-full flex items-center justify-center mb-2 bg-gray-200 dark:bg-gray-700 rounded">
                    <i className={`fas fa-${getDeviceIcon(targetDevice)} text-4xl text-gray-400`}></i>
                  </div>
                )}
              </div>
              <div className="text-sm font-medium">{targetDevice.name}</div>
              <div className="port-indicator">
                <i className="fas fa-circle text-green-500 mr-1"></i>
                <span className="text-xs">{selectedPorts?.target || Object.keys(targetDevice.ports)[0]}</span>
              </div>
            </div>
          </div>
        )}
        
        {connectionQuality && (
          <div className="absolute bottom-2 right-2 bg-white dark:bg-gray-900 rounded-lg px-3 py-1 shadow-md">
            <div className="flex items-center">
              <div 
                className="h-3 w-3 rounded-full mr-2"
                style={{ backgroundColor: getQualityColor(connectionQuality) }}
              ></div>
              <span className="text-sm font-medium">{connectionQuality}% Quality</span>
            </div>
          </div>
        )}
      </div>
      
      {showAdapterSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Select an Adapter</h3>
              <button 
                onClick={() => setShowAdapterSelector(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <i className="fas fa-spinner fa-spin text-blue-600 text-2xl"></i>
              </div>
            ) : !availableAdapters || availableAdapters.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <i className="fas fa-exclamation-circle text-2xl mb-2"></i>
                <p>No compatible adapters found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {Array.isArray(availableAdapters) && availableAdapters.map(adapter => (
                  <div 
                    key={adapter.id}
                    onClick={() => handleAddAdapter(adapter)}
                    className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <div className="flex items-center">
                      <div className="adapter-icon-container mr-3">
                        {adapter.image_url ? (
                          <img 
                            src={adapter.image_url} 
                            alt={adapter.name} 
                            className="h-12 w-12 object-contain"
                          />
                        ) : (
                          <div className="h-12 w-12 flex items-center justify-center bg-blue-100 dark:bg-blue-800 rounded">
                            <i className="fas fa-plug text-blue-500 dark:text-blue-300"></i>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="font-medium">{adapter.name}</div>
                        <div className="text-sm text-gray-500">{adapter.brand} {adapter.model}</div>
                        <div className="flex flex-wrap items-center mt-1 text-xs">
                          <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded mr-2 mb-1">
                            {adapter.input_type} → {adapter.output_type}
                          </span>
                          {adapter.max_resolution && (
                            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded mr-2 mb-1">
                              {adapter.max_resolution}
                            </span>
                          )}
                          {adapter.requires_power && (
                            <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded mb-1">
                              <i className="fas fa-bolt mr-1"></i>
                              Power
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm font-medium">{adapter.price_range}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      <style jsx>{`
        .connection-path {
          position: relative;
          z-index: 5;
        }
        
        .connection-line {
          position: relative;
          padding: 0 5px;
        }
        
        .signal-dot-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .signal-dot {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: white;
          top: -3px;
          left: -8px;
          box-shadow: 0 0 5px 2px rgba(255, 255, 255, 0.5);
          animation: moveDot 2s infinite linear;
        }
        
        @keyframes moveDot {
          0% { left: -8px; }
          100% { left: calc(100% + 8px); }
        }
        
        .device-box {
          width: 120px;
          padding: 10px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          z-index: 10;
          text-align: center;
        }
        
        .device-icon-container, .adapter-icon-container {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .adapter-box {
          padding: 8px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          z-index: 10;
          margin: 0 10px;
          min-width: 80px;
          text-align: center;
        }
        
        .port-indicator {
          display: inline-flex;
          align-items: center;
          background: rgba(0,0,0,0.05);
          padding: 2px 6px;
          border-radius: 12px;
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
}

function StoryComponent() {
  const sourceDevice = {
    name: "MacBook Pro",
    type: "laptop",
    image_url: "/devices/macbook.png",
    ports: {
      "USB-C": { type: "usb-c" },
      "HDMI": { type: "hdmi" }
    }
  };

  const targetDevice = {
    name: "LG Monitor",
    type: "monitor",
    image_url: "/devices/lg-monitor.png",
    ports: {
      "USB-C": { type: "usb-c" },
      "HDMI": { type: "hdmi" }
    }
  };

  const adapters = [
    {
      name: "USB-C to HDMI Adapter",
      input_type: "usb-c",
      output_type: "hdmi",
      image_url: "/adapters/usb-c-hdmi.png",
      requires_power: false
    }
  ];

  const handleAddAdapter = (adapter) => {
    console.log("Adapter added:", adapter);
  };

  const handleRemoveAdapter = (index) => {
    console.log("Adapter removed at index:", index);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Adapter Visualizer Story</h1>
      <MainComponent
        sourceDevice={sourceDevice}
        targetDevice={targetDevice}
        adapters={adapters}
        onAddAdapter={handleAddAdapter}
        onRemoveAdapter={handleRemoveAdapter}
        selectedPorts={{ source: "USB-C", target: "HDMI" }}
        connectionQuality={85}
        connectionPath={[]}
      />
    </div>
  );
});
}