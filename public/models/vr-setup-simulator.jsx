"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({ setupId, devices, adapters }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [compatibilityResults, setCompatibilityResults] = useState(null);
  const [roomDimensions, setRoomDimensions] = useState({ width: 10, length: 10, height: 8 });
  const canvasRef = useRef(null);

  useEffect(() => {
    if ((setupId || (devices && devices.length > 0))) {
      analyzeCompatibility();
    } else {
      setLoading(false);
    }
  }, [setupId, devices, adapters]);

  useEffect(() => {
    if (compatibilityResults && canvasRef.current) {
      drawVRSetup();
    }
  }, [compatibilityResults, canvasRef.current]);

  const analyzeCompatibility = async () => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        setupId,
        deviceIds: devices?.map(d => d.id),
        roomDimensions
      };

      const response = await fetch('/api/analyze-vr-compatibility', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setCompatibilityResults(data);
      }
    } catch (err) {
      setError("Failed to analyze VR compatibility");
      console.error("Error analyzing compatibility:", err);
    } finally {
      setLoading(false);
    }
  };

  const drawVRSetup = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(50, 50, width - 100, height - 100);

    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 0.5;
    for (let x = 50; x <= width - 50; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 50);
      ctx.lineTo(x, height - 50);
      ctx.stroke();
    }
    for (let y = 50; y <= height - 50; y += 50) {
      ctx.beginPath();
      ctx.moveTo(50, y);
      ctx.lineTo(width - 50, y);
      ctx.stroke();
    }

    if (compatibilityResults?.spaceCompatible) {
      ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
    } else {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
    }
    ctx.fillRect(100, 100, width - 200, height - 200);

    if (compatibilityResults?.vrHeadsets?.length > 0) {
      ctx.fillStyle = '#4a90e2';
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 30, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('VR Headset', width / 2, height / 2 + 5);
    }

    if (compatibilityResults?.vrComputers?.length > 0) {
      ctx.fillStyle = '#50c878';
      ctx.fillRect(width - 150, height - 150, 80, 40);

      ctx.fillStyle = '#fff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('PC/Console', width - 110, height - 130);

      if (compatibilityResults.isCompatible) {
        ctx.strokeStyle = '#4a90e2';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(width / 2, height / 2);
        ctx.lineTo(width - 110, height - 150);
        ctx.stroke();

        if (compatibilityResults.neededAdapters?.length > 0) {
          const midX = (width / 2 + (width - 110)) / 2;
          const midY = (height / 2 + (height - 150)) / 2;

          ctx.fillStyle = '#f5a623';
          ctx.beginPath();
          ctx.arc(midX, midY, 15, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#fff';
          ctx.font = '10px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('Adapter', midX, midY + 3);
        }
      } else if (compatibilityResults.neededAdapters?.length > 0) {
        ctx.strokeStyle = '#e74c3c';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(width / 2, height / 2);
        ctx.lineTo(width - 110, height - 150);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    const headset = compatibilityResults?.vrHeadsets?.[0];
    if (headset?.vr_tracking_type === 'external') {
      ctx.fillStyle = '#9b59b6';

      ctx.beginPath();
      ctx.arc(80, 80, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(width - 80, 80, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(155, 89, 182, 0.3)';
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.moveTo(80, 80);
      ctx.lineTo(width / 2, height / 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(width - 80, 80);
      ctx.lineTo(width / 2, height / 2);
      ctx.stroke();
    }
  };

  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    setRoomDimensions(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  return (
    <div className="space-y-4">
      <div className="bg-[#1B1B1B] rounded-lg p-6">
        <h3 className="text-xl font-inter-tight-medium text-[#F6F6F6] mb-4">VR Setup Simulator</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-inter-tight-regular text-[#B1B1B1] mb-1">
              Room Width (feet)
            </label>
            <input
              type="number"
              name="width"
              value={roomDimensions.width}
              onChange={handleDimensionChange}
              min="1"
              step="0.5"
              className="w-full px-3 py-2 border border-[#4B4B4B] rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-inter-tight-regular text-[#B1B1B1] mb-1">
              Room Length (feet)
            </label>
            <input
              type="number"
              name="length"
              value={roomDimensions.length}
              onChange={handleDimensionChange}
              min="1"
              step="0.5"
              className="w-full px-3 py-2 border border-[#4B4B4B] rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-inter-tight-regular text-[#B1B1B1] mb-1">
              Ceiling Height (feet)
            </label>
            <input
              type="number"
              name="height"
              value={roomDimensions.height}
              onChange={handleDimensionChange}
              min="1"
              step="0.5"
              className="w-full px-3 py-2 border border-[#4B4B4B] rounded-md"
            />
          </div>
        </div>

        <button
          className={`inline-flex items-center px-4 py-2 text-sm font-inter-tight-regular text-[#1B1B1B] bg-[#DFFF4E] rounded-lg ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#2C2C2C] hover:text-[#F6F6F6]'}`}
          onClick={analyzeCompatibility}
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 mr-2 border-2 border-t-2 border-[#1B1B1B] border-t-transparent rounded-full animate-spin"></div>
              Analyzing...
            </>
          ) : 'Analyze VR Setup'}
        </button>

        {error && (
          <div className="p-4 mt-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        {compatibilityResults && (
          <div className="space-y-4 mt-4">
            <div className={`p-4 rounded-lg ${compatibilityResults.isCompatible ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {compatibilityResults.isCompatible 
                ? "Your setup is VR compatible!" 
                : "Your setup needs adjustments for VR compatibility."}
            </div>

            <div className="border-b border-[#4B4B4B]">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button className="border-blue-500 text-blue-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                  Visualization
                </button>
                <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                  Recommendations
                </button>
                <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                  Equipment
                </button>
              </nav>
            </div>

            <div>
              <div className="border rounded-lg p-2 bg-[#1B1B1B]">
                <canvas 
                  ref={canvasRef} 
                  width={600} 
                  height={400}
                  className="w-full h-auto border rounded"
                />
                <p className="text-sm font-inter-tight-regular text-[#B1B1B1] mt-2 text-center">
                  VR setup visualization (top-down view)
                </p>
              </div>
            </div>

            <div className="hidden">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-bold mb-2">Recommendations:</h4>
                {compatibilityResults.recommendations?.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {compatibilityResults.recommendations.map((rec, index) => (
                      <li key={index} className="mb-2">{rec}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No recommendations needed. Your setup looks good!</p>
                )}
              </div>
            </div>

            <div className="hidden">
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold mb-2">VR Headsets:</h4>
                  {compatibilityResults.vrHeadsets?.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {compatibilityResults.vrHeadsets.map((headset, index) => (
                        <li key={index}>
                          {headset.brand} {headset.name} 
                          {headset.vr_resolution && ` (${headset.vr_resolution})`}
                          {headset.vr_refresh_rate && `, ${headset.vr_refresh_rate}Hz`}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No VR headsets detected in your setup.</p>
                  )}
                </div>

                <div>
                  <h4 className="font-bold mb-2">VR-Ready Computers:</h4>
                  {compatibilityResults.vrComputers?.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {compatibilityResults.vrComputers.map((computer, index) => (
                        <li key={index}>
                          {computer.brand} {computer.name} {computer.model}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No VR-ready computers detected in your setup.</p>
                  )}
                </div>

                {compatibilityResults.neededAdapters?.length > 0 && (
                  <div>
                    <h4 className="font-bold mb-2">Needed Adapters:</h4>
                    <ul className="list-disc pl-5">
                      {compatibilityResults.neededAdapters.map((adapter, index) => (
                        <li key={index}>
                          {adapter.name} ({adapter.input_type} to {adapter.output_type})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <style jsx global>{`
        @keyframes fade {
          from {
            background-color: #dfff4e;
            color: #1b1b1b;
          }
          to {
            background-color: #2c2c2c;
            color: #f6f6f6;
          }
        }
      `}</style>
    </div>
  );
}

function StoryComponent() {
  const [activeTab, setActiveTab] = useState(0);

  const mockDevices = [
    {
      id: 1,
      name: "Oculus Quest 2",
      type: "vr_headset",
      brand: "Meta",
      is_vr_compatible: true,
      vr_tracking_type: "inside-out",
      vr_resolution: "1832x1920 per eye",
      vr_refresh_rate: 90,
      vr_field_of_view: 90
    },
    {
      id: 2,
      name: "Gaming PC",
      type: "computer",
      brand: "Custom",
      model: "VR Ready",
      is_vr_compatible: true
    }
  ];

  const mockAdapters = [
    {
      id: 1,
      name: "USB-C to DisplayPort Adapter",
      input_type: "usb-c",
      output_type: "displayport"
    }
  ];

  const emptySetup = {
    setupId: null,
    devices: [],
    adapters: []
  };

  const incompatibleSetup = {
    setupId: null,
    devices: [
      {
        id: 3,
        name: "Basic Laptop",
        type: "computer",
        brand: "Generic",
        model: "Basic",
        is_vr_compatible: false
      },
      {
        id: 4,
        name: "VR Headset",
        type: "vr_headset",
        brand: "Generic",
        is_vr_compatible: true,
        vr_tracking_type: "external",
        vr_resolution: "1080x1200 per eye",
        vr_refresh_rate: 60
      }
    ],
    adapters: []
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-inter-tight-medium text-[#F6F6F6] mb-6">VR Setup Simulator</h2>

      <div className="mb-8">
        <h3 className="text-lg font-inter-tight-medium text-[#F6F6F6] mb-4">Compatible Setup Example</h3>
        <MainComponent devices={mockDevices} adapters={mockAdapters} />
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-inter-tight-medium text-[#F6F6F6] mb-4">Empty Setup Example</h3>
        <MainComponent {...emptySetup} />
      </div>

      <div>
        <h3 className="text-lg font-inter-tight-medium text-[#F6F6F6] mb-4">Incompatible Setup Example</h3>
        <MainComponent {...incompatibleSetup} />
      </div>
    </div>
  );
});
}