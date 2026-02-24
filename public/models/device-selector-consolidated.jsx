"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({ 
  onSelect, 
  selectedDevice, 
  filterType, 
  showDetails = true,
  compact = false
}) {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [error, setError] = useState(null);
  
  // Fetch devices once on component mount
  useEffect(() => {
    async function fetchDevices() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch("/api/get-devices-consolidated", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            type: filterType || undefined,
            search: search || undefined
          })
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch devices: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data) {
          throw new Error("No data returned from API");
        }
        
        setDevices(Array.isArray(data) ? data : []);
        setFilteredDevices(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching devices:", error);
        setError("Failed to load devices. Please try again later.");
        setDevices([]);
        setFilteredDevices([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchDevices();
  }, [filterType, search]);
  
  // Filter devices based on search - now handled by API
  useEffect(() => {
    if (!devices || devices.length === 0) {
      return;
    }
    
    if (!search.trim()) {
      setFilteredDevices(devices);
      return;
    }
    
    const filtered = devices.filter(device => 
      (device.name && device.name.toLowerCase().includes(search.toLowerCase())) ||
      (device.brand && device.brand.toLowerCase().includes(search.toLowerCase())) ||
      (device.model && device.model.toLowerCase().includes(search.toLowerCase()))
    );
    
    setFilteredDevices(filtered);
  }, [search, devices]);
  
  if (loading) {
    return (
      <div className="p-4 flex justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <div className="mb-2"><i className="fas fa-exclamation-circle"></i></div>
        <p>{error}</p>
      </div>
    );
  }
  
  return (
    <div className="w-full">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search devices..."
          className="w-full p-2 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      
      {!filteredDevices || filteredDevices.length === 0 ? (
        <div className="text-center p-4 text-gray-500">
          No devices found. Try a different search.
        </div>
      ) : (
        <div className={`grid ${compact ? 'grid-cols-2 md:grid-cols-3 gap-2' : 'grid-cols-1 md:grid-cols-2 gap-4'}`}>
          {filteredDevices.map(device => (
            <div 
              key={device.id}
              className={`border rounded p-3 ${selectedDevice?.id === device.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} 
                         cursor-pointer hover:bg-gray-50 transition-colors`}
              onClick={() => onSelect(device)}
            >
              <div className="flex items-center">
                {device.image_url && (
                  <div className="mr-3">
                    <img 
                      src={device.image_url} 
                      alt={`${device.name || 'Device'}`} 
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                )}
                <div>
                  <h3 className="font-medium">{device.name || 'Unnamed Device'}</h3>
                  <p className="text-sm text-gray-600">
                    {device.brand || ''} {device.model || ''}
                  </p>
                </div>
              </div>
              
              {showDetails && selectedDevice?.id === device.id && (
                <div className="mt-3 text-sm">
                  <p><span className="font-medium">Type:</span> {device.type || 'Unknown'}</p>
                  {device.ports && (
                    <p><span className="font-medium">Ports:</span> {Object.keys(device.ports).join(", ")}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StoryComponent() {
  const [selectedDevice, setSelectedDevice] = useState(null);
  
  const mockDevices = [
    {
      id: "1",
      name: "MacBook Pro",
      brand: "Apple",
      model: "2021",
      type: "laptop",
      image_url: "/images/macbook.jpg",
      ports: {
        "USB-C": 4,
        "Headphone": 1
      }
    },
    {
      id: "2",
      name: "Dell XPS 15",
      brand: "Dell",
      model: "9510",
      type: "laptop",
      image_url: "/images/dell-xps.jpg",
      ports: {
        "USB-C": 2,
        "USB-A": 1,
        "HDMI": 1,
        "Headphone": 1
      }
    },
    {
      id: "3",
      name: "LG UltraFine 5K",
      brand: "LG",
      model: "27MD5KL-B",
      type: "monitor",
      image_url: "/images/lg-monitor.jpg",
      ports: {
        "USB-C": 3,
        "Thunderbolt": 1
      }
    }
  ];
  
  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-4">Standard View</h2>
        <MainComponent 
          onSelect={setSelectedDevice}
          selectedDevice={selectedDevice}
          showDetails={true}
          compact={false}
        />
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-4">Compact View</h2>
        <MainComponent 
          onSelect={setSelectedDevice}
          selectedDevice={selectedDevice}
          showDetails={true}
          compact={true}
        />
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-4">Without Details</h2>
        <MainComponent 
          onSelect={setSelectedDevice}
          selectedDevice={selectedDevice}
          showDetails={false}
          compact={false}
        />
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-4">Filtered by Type</h2>
        <MainComponent 
          onSelect={setSelectedDevice}
          selectedDevice={selectedDevice}
          filterType="laptop"
          showDetails={true}
          compact={false}
        />
      </div>
    </div>
  );
});
}