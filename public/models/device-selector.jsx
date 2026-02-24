"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({ onSelectDevice, selectedSource, selectedTarget }) {
  const [devices, setDevices] = useState({
    source: [],
    target: []
  });
  const [loading, setLoading] = useState({
    source: false,
    target: false
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('popular');
  const [recentDevices, setRecentDevices] = useState([]);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('source');
  const [message, setMessage] = useState('');
  
  const categories = [
    { id: 'popular', name: 'Popular', icon: 'star' },
    { id: 'smartphone', name: 'Smartphones', icon: 'mobile-alt' },
    { id: 'laptop', name: 'Laptops', icon: 'laptop' },
    { id: 'monitor', name: 'Monitors', icon: 'desktop' },
    { id: 'tv', name: 'TVs', icon: 'tv' },
    { id: 'console', name: 'Consoles', icon: 'gamepad' },
    { id: 'other', name: 'Other', icon: 'ellipsis-h' }
  ];
  
  useEffect(() => {
    fetchDevices('source');
    fetchDevices('target');
    
    try {
      const recent = localStorage.getItem('recentDevices');
      if (recent) {
        setRecentDevices(JSON.parse(recent));
      }
    } catch (err) {
      console.error('Error loading recent devices:', err);
      setRecentDevices([]);
    }
  }, []);
  
  const fetchDevices = async (deviceType, categoryType = null) => {
    setLoading(prev => ({ ...prev, [deviceType]: true }));
    setError(null);
    setMessage('');
    
    try {
      const response = await fetch("/api/get-devices", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: {
            type: categoryType && categoryType !== 'popular' && categoryType !== 'other' ? categoryType : undefined,
            search: searchTerm || undefined,
            limit: 50,
            offset: 0
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching devices: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.devices && Array.isArray(data.devices)) {
        setDevices(prev => ({
          ...prev,
          [deviceType]: data.devices
        }));
        
        if (data.devices.length === 0) {
          setMessage(`No ${deviceType} devices found. Try adjusting your search criteria.`);
        }
      } else {
        setDevices(prev => ({
          ...prev,
          [deviceType]: []
        }));
        if (data.error) {
          setError(data.error);
        }
      }
    } catch (error) {
      console.error(`Error fetching ${deviceType} devices:`, error);
      setDevices(prev => ({
        ...prev,
        [deviceType]: []
      }));
      setError(`Failed to load ${deviceType} devices. Please try again.`);
    } finally {
      setLoading(prev => ({ ...prev, [deviceType]: false }));
    }
  };
  
  const searchDevices = async (deviceType) => {
    if (!searchTerm || searchTerm.length < 2) return;
    
    setLoading(prev => ({ ...prev, [deviceType]: true }));
    setError(null);
    setMessage('');
    
    try {
      const response = await fetch("/api/search-devices", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          term: searchTerm,
          deviceType: activeTab !== 'popular' && activeTab !== 'other' ? activeTab : undefined,
          maxResults: 20
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error searching devices: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.devices && Array.isArray(data.devices)) {
        setDevices(prev => ({
          ...prev,
          [deviceType]: data.devices
        }));
        
        if (data.message) {
          setMessage(data.message);
        } else if (data.devices.length === 0) {
          setMessage(`No ${deviceType} devices found matching "${searchTerm}". Try a different search term.`);
        }
      } else {
        setDevices(prev => ({
          ...prev,
          [deviceType]: []
        }));
        
        if (data.error) {
          setError(data.error);
        }
      }
    } catch (error) {
      console.error(`Error searching ${deviceType} devices:`, error);
      setError(`Failed to search ${deviceType} devices. Please try again.`);
      
      fetchDevices(deviceType, activeTab !== 'popular' && activeTab !== 'other' ? activeTab : null);
    } finally {
      setLoading(prev => ({ ...prev, [deviceType]: false }));
    }
  };
  
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    fetchDevices('source', tabId);
    fetchDevices('target', tabId);
  };
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchDevices('source');
    searchDevices('target');
  };
  
  const handleDeviceSelect = (device, type, port = null) => {
    try {
      const updatedRecent = [device, ...recentDevices.filter(d => d.id !== device.id)].slice(0, 5);
      setRecentDevices(updatedRecent);
      localStorage.setItem('recentDevices', JSON.stringify(updatedRecent));
    } catch (err) {
      console.error('Error saving recent devices:', err);
    }
    
    onSelectDevice(type, device, port);
  };
  
  const getDeviceIcon = (device, type) => {
    if (device.type === 'smartphone') return 'mobile-alt';
    if (device.type === 'laptop') return 'laptop';
    if (device.type === 'monitor') return 'desktop';
    if (device.type === 'tv') return 'tv';
    if (device.type === 'console') return 'gamepad';
    
    return type === 'source' ? 'desktop' : 'hdd';
  };
  
  const getDeviceColor = (device) => {
    switch(device.type) {
      case 'smartphone': return 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300';
      case 'laptop': return 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300';
      case 'monitor': return 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300';
      case 'tv': return 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300';
      case 'console': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  const renderDeviceList = (type) => {
    const deviceList = devices[type] || [];
    const isLoading = loading[type];
    
    if (isLoading) {
      return (
        <div className="flex justify-center py-8">
          <div className="flex flex-col items-center">
            <i className="fas fa-spinner fa-spin text-blue-600 text-2xl mb-2"></i>
            <span className="text-sm text-gray-500">Loading devices...</span>
          </div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="text-center py-8 px-4">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <i className="fas fa-exclamation-circle text-red-500 text-xl mb-2"></i>
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button 
              onClick={() => fetchDevices(type, activeTab !== 'popular' && activeTab !== 'other' ? activeTab : null)}
              className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 rounded-md hover:bg-red-200 dark:hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }
    
    if (!deviceList || !Array.isArray(deviceList) || deviceList.length === 0) {
      return (
        <div className="text-center py-8 px-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <i className="fas fa-search text-gray-400 text-xl mb-2"></i>
            <p className="text-gray-500 dark:text-gray-400">No devices found</p>
            {searchTerm && (
              <p className="text-sm text-gray-500 mt-1">
                Try adjusting your search or category filter
              </p>
            )}
            {message && (
              <p className="text-sm text-blue-500 mt-2">{message}</p>
            )}
          </div>
        </div>
      );
    }
    
    const selectedDevice = type === 'source' ? selectedSource : selectedTarget;
    
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-1 pb-1">
        {deviceList.map(device => (
          <div 
            key={device.id}
            onClick={() => handleDeviceSelect(device, type)}
            className={`relative p-3 border rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedDevice?.id === device.id 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md ring-2 ring-blue-500 ring-opacity-50' 
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="flex flex-col items-center">
              {device.image_url ? (
                <div className="h-16 w-full flex items-center justify-center mb-2">
                  <img 
                    src={device.image_url} 
                    alt={device.name} 
                    className="h-full w-auto object-contain"
                  />
                </div>
              ) : (
                <div className={`h-16 w-16 flex items-center justify-center mb-2 rounded-full ${getDeviceColor(device)}`}>
                  <i className={`fas fa-${getDeviceIcon(device, type)} text-2xl`}></i>
                </div>
              )}
              
              <div className="text-center">
                <div className="font-medium truncate max-w-full">{device.name}</div>
                <div className="text-xs text-gray-500 truncate max-w-full">{device.brand} {device.model}</div>
              </div>
              
              {selectedDevice?.id === device.id && (
                <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                  <i className="fas fa-check text-xs"></i>
                </div>
              )}
              
              {device.ports && Object.keys(device.ports).length > 0 && (
                <div className="mt-2 flex flex-wrap justify-center gap-1">
                  {Object.entries(device.ports).slice(0, 3).map(([portType, count], idx) => (
                    <span key={idx} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                      {portType} ({count})
                    </span>
                  ))}
                  {Object.keys(device.ports).length > 3 && (
                    <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                      +{Object.keys(device.ports).length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  const renderRecentDevices = () => {
    if (!Array.isArray(recentDevices) || recentDevices.length === 0) return null;
    
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Recently Used</h3>
          <button 
            onClick={() => {
              localStorage.removeItem('recentDevices');
              setRecentDevices([]);
            }}
            className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Clear
          </button>
        </div>
        
        <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-thin">
          {recentDevices.map(device => (
            <div 
              key={device.id}
              onClick={() => handleDeviceSelect(device, 'source')}
              className="flex-shrink-0 w-24 p-2 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex flex-col items-center">
                <div className={`h-10 w-10 flex items-center justify-center mb-1 rounded-full ${getDeviceColor(device)}`}>
                  <i className={`fas fa-${getDeviceIcon(device, 'source')} text-lg`}></i>
                </div>
                <div className="text-xs font-medium text-center truncate w-full">{device.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const renderConnectionSummary = () => {
    return (
      <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Selected Connection</h3>
        
        <div className="flex items-center">
          <div className="flex-1">
            {selectedSource ? (
              <div className="flex items-center">
                <div className={`h-10 w-10 flex items-center justify-center mr-2 rounded-full ${getDeviceColor(selectedSource)}`}>
                  <i className={`fas fa-${getDeviceIcon(selectedSource, 'source')} text-lg`}></i>
                </div>
                <div>
                  <div className="font-medium">{selectedSource.name}</div>
                  <div className="text-xs text-gray-500">{selectedSource.brand} {selectedSource.model}</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <div className="h-10 w-10 flex items-center justify-center mr-2 rounded-full bg-gray-100 dark:bg-gray-700">
                  <i className="fas fa-question text-gray-400 text-lg"></i>
                </div>
                <div className="text-gray-500">Select source device</div>
              </div>
            )}
          </div>
          
          <div className="px-4">
            <div className="w-16 h-0.5 bg-blue-500 relative">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-1 border border-blue-500">
                <i className="fas fa-arrow-right text-blue-500"></i>
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            {selectedTarget ? (
              <div className="flex items-center">
                <div className={`h-10 w-10 flex items-center justify-center mr-2 rounded-full ${getDeviceColor(selectedTarget)}`}>
                  <i className={`fas fa-${getDeviceIcon(selectedTarget, 'target')} text-lg`}></i>
                </div>
                <div>
                  <div className="font-medium">{selectedTarget.name}</div>
                  <div className="text-xs text-gray-500">{selectedTarget.brand} {selectedTarget.model}</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <div className="h-10 w-10 flex items-center justify-center mr-2 rounded-full bg-gray-100 dark:bg-gray-700">
                  <i className="fas fa-question text-gray-400 text-lg"></i>
                </div>
                <div className="text-gray-500">Select target device</div>
              </div>
            )}
          </div>
        </div>
        
        {selectedSource && selectedTarget && (
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Find Compatible Connections
            </button>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="device-selector bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
      <div className="mb-5">
        <form onSubmit={handleSearchSubmit}>
          <div className="relative flex">
            <input
              type="text"
              name="search"
              placeholder="Search devices by name, brand or model..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            {searchTerm && (
              <button 
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  fetchDevices('source', activeTab !== 'popular' && activeTab !== 'other' ? activeTab : null);
                  fetchDevices('target', activeTab !== 'popular' && activeTab !== 'other' ? activeTab : null);
                }}
                className="absolute right-14 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
            <button 
              type="submit"
              className="ml-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <i className="fas fa-search"></i>
            </button>
          </div>
        </form>
      </div>
      
      {message && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg">
          <p className="text-sm">{message}</p>
        </div>
      )}
      
      <div className="mb-5">
        <div className="flex overflow-x-auto pb-2 scrollbar-thin">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleTabChange(category.id)}
              className={`flex items-center px-4 py-2 whitespace-nowrap mr-2 rounded-lg transition-all ${
                activeTab === category.id 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <i className={`fas fa-${category.icon} mr-2`}></i>
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      {activeTab === 'popular' && renderRecentDevices()}
      
      <div className="mb-2">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveSection('source')}
            className={`flex-1 py-3 text-center font-medium ${
              activeSection === 'source' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Source Devices
          </button>
          <button
            onClick={() => setActiveSection('target')}
            className={`flex-1 py-3 text-center font-medium ${
              activeSection === 'target' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Target Devices
          </button>
        </div>
      </div>
      
      <div className="py-3">
        {activeSection === 'source' ? renderDeviceList('source') : renderDeviceList('target')}
      </div>
      
      {renderConnectionSummary()}
    </div>
  );
}

function StoryComponent() {
  const [selectedSource, setSelectedSource] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState(null);
  
  const handleSelectDevice = (type, device) => {
    if (type === 'source') {
      setSelectedSource(device);
    } else if (type === 'target') {
      setSelectedTarget(device);
    }
  };
  
  // Sample data for demonstration
  const sampleSourceDevice = {
    id: 'source-1',
    name: 'MacBook Pro 16"',
    brand: 'Apple',
    model: 'M1 Pro',
    type: 'laptop',
    image_url: '/macbook.png',
    ports: {
      'USB-C': 3,
      'HDMI': 1
    }
  };
  
  const sampleTargetDevice = {
    id: 'target-1',
    name: 'LG UltraFine 5K',
    brand: 'LG',
    model: '27MD5KL-B',
    type: 'monitor',
    image_url: '/monitor.png',
    ports: {
      'USB-C': 1,
      'DisplayPort': 1
    }
  };
  
  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Device Selector</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">Default State</h2>
          <MainComponent 
            onSelectDevice={handleSelectDevice}
            selectedSource={null}
            selectedTarget={null}
          />
        </div>
        
        <div>
          <h2 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">With Selected Devices</h2>
          <MainComponent 
            onSelectDevice={handleSelectDevice}
            selectedSource={sampleSourceDevice}
            selectedTarget={sampleTargetDevice}
          />
        </div>
      </div>
    </div>
  );
});
}