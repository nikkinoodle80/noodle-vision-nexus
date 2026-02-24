"use client";
import React from "react";



export default function Index() {
  return (function ModuleCard({ 
  module, 
  onDragStart, 
  isConnected = false, 
  onConnect = () => {},
  onDisconnect = () => {},
  className = ""
}) {
  const [showDetails, setShowDetails] = useState(false);
  
  const portColors = {
    audio: "#FF5555",
    cv: "#55FF55", 
    gate: "#5555FF",
    midi: "#FFAA00",
    clock: "#AA00FF",
    default: "#AAAAAA"
  };
  
  return (
    <div 
      className={`bg-[#1D1D1F] border border-[#424245] rounded-lg p-4 hover:border-[#0066FF] transition-all duration-200 ${isConnected ? 'ring-2 ring-[#0066FF]' : ''} ${className}`}
      draggable
      onDragStart={(e) => onDragStart(e, module.id)}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-white font-semibold text-lg">{module.name}</h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="text-[#86868B] hover:text-white"
            title="Show specifications"
          >
            <i className="fas fa-info-circle"></i>
          </button>
          {isConnected ? (
            <button 
              onClick={() => onDisconnect(module.id)}
              className="text-[#FF5555] hover:text-[#FF0000]"
              title="Disconnect module"
            >
              <i className="fas fa-unlink"></i>
            </button>
          ) : (
            <button 
              onClick={() => onConnect(module.id)}
              className="text-[#55FF55] hover:text-[#00FF00]"
              title="Connect module"
            >
              <i className="fas fa-link"></i>
            </button>
          )}
        </div>
      </div>
      
      <div className="relative bg-[#2A2A2A] border border-[#424245] rounded-md p-3 mb-3">
        <div className="absolute top-2 right-2 bg-[#0066FF] text-white text-xs px-2 py-1 rounded-full">
          {module.type || "Generic"}
        </div>
        
        <div className="flex justify-center items-center h-[100px]">
          {module.image ? (
            <img src={module.image} alt={module.name} className="max-h-full" />
          ) : (
            <i className={`fas ${module.icon || 'fa-microchip'} text-4xl text-[#86868B]`}></i>
          )}
        </div>
        
        <div className="flex justify-around mt-4 mb-2">
          {(module.inputs || []).map((input, index) => (
            <div key={`input-${index}`} className="flex flex-col items-center">
              <div 
                className="w-4 h-4 rounded-full cursor-pointer mb-1"
                style={{ backgroundColor: portColors[input.type] || portColors.default }}
                title={`${input.name} (${input.type})`}
              ></div>
              <span className="text-xs text-[#86868B]">{input.name}</span>
            </div>
          ))}
          {(!module.inputs || module.inputs.length === 0) && (
            <div className="text-xs text-[#86868B]">No inputs</div>
          )}
        </div>
        
        <div className="flex justify-around mt-4">
          {(module.outputs || []).map((output, index) => (
            <div key={`output-${index}`} className="flex flex-col items-center">
              <div 
                className="w-4 h-4 rounded-full cursor-pointer mb-1"
                style={{ backgroundColor: portColors[output.type] || portColors.default }}
                title={`${output.name} (${output.type})`}
              ></div>
              <span className="text-xs text-[#86868B]">{output.name}</span>
            </div>
          ))}
          {(!module.outputs || module.outputs.length === 0) && (
            <div className="text-xs text-[#86868B]">No outputs</div>
          )}
        </div>
      </div>
      
      <div className="text-[#86868B] text-sm">
        <div className="flex justify-between">
          <span>Power: {module.power || "N/A"}</span>
          <span>Width: {module.width || "N/A"}HP</span>
        </div>
      </div>
      
      {showDetails && (
        <div className="mt-3 pt-3 border-t border-[#424245] text-xs text-[#86868B]">
          <h4 className="text-white text-sm mb-2">Specifications</h4>
          <ul className="space-y-1">
            {module.specifications && Object.entries(module.specifications).map(([key, value], index) => (
              <li key={index} className="flex justify-between">
                <span>{key}:</span>
                <span>{value}</span>
              </li>
            ))}
          </ul>
          
          <h4 className="text-white text-sm mt-3 mb-2">Compatibility</h4>
          <div className="flex flex-wrap gap-1">
            {module.compatibility && module.compatibility.map((item, index) => (
              <span key={index} className="bg-[#2A2A2A] px-2 py-1 rounded-md text-xs">
                {item}
              </span>
            ))}
            {(!module.compatibility || module.compatibility.length === 0) && (
              <span>Universal compatibility</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MainComponent({ modules, connections, handleDragStart, handleDrop, feedback }) {
  const handleConnect = (moduleId) => {
    console.log(`Connect module ${moduleId}`);
  };
  
  const handleDisconnect = (moduleId) => {
    console.log(`Disconnect module ${moduleId}`);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="bg-[#1D1D1F] p-6 rounded-lg border border-[#424245]">
        <h2 className="text-xl font-bold text-white mb-4">
          Available Modules
          <i
            className="fas fa-info-circle text-[#86868B] ml-2"
            title="Drag these modules to the workspace to connect them."
          ></i>
        </h2>
        <div className="space-y-4">
          {modules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              onDragStart={handleDragStart}
              onConnect={handleConnect}
            />
          ))}
        </div>
      </div>

      <div
        className="bg-[#1D1D1F] p-6 rounded-lg border border-[#424245] min-h-[400px]"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <h2 className="text-xl font-bold text-white mb-4">
          Workspace
          <i
            className="fas fa-info-circle text-[#86868B] ml-2"
            title="Drop modules here to connect them."
          ></i>
        </h2>
        <div className="border-2 border-dashed border-[#424245] rounded-lg h-full p-4">
          <div className="text-center text-[#86868B]">
            Drag modules here to connect
            <i
              className="fas fa-info-circle text-[#86868B] ml-2"
              title="This area is for connecting your modules."
            ></i>
          </div>
          <ul className="text-white mt-4 space-y-4">
            {connections.map((moduleId, index) => {
              const module = modules.find((m) => m.id === parseInt(moduleId));
              return module ? (
                <li key={index}>
                  <ModuleCard
                    module={module}
                    isConnected={true}
                    onDragStart={handleDragStart}
                    onDisconnect={handleDisconnect}
                  />
                </li>
              ) : null;
            })}
          </ul>
          {feedback && <div className="text-green-500 mt-4">{feedback}</div>}
        </div>
      </div>

      <div className="bg-[#1D1D1F] p-6 rounded-lg border border-[#424245]">
        <h2 className="text-xl font-bold text-white mb-4">
          Connections
          <i
            className="fas fa-info-circle text-[#86868B] ml-2"
            title="View your connected modules here."
          ></i>
        </h2>
        <ul className="text-sm text-[#86868B] space-y-2">
          {connections.length === 0 ? (
            <li>No connections made</li>
          ) : (
            connections.map((moduleId, index) => {
              const module = modules.find((m) => m.id === parseInt(moduleId));
              return module ? (
                <li key={index} className="flex justify-between items-center p-2 border border-[#424245] rounded-md">
                  <span>{module.name}</span>
                  <span className="text-xs bg-[#2A2A2A] px-2 py-1 rounded-full">
                    {module.type || "Generic"}
                  </span>
                </li>
              ) : null;
            })
          )}
        </ul>
      </div>
    </div>
  );
}

function StoryComponent() {
  const [connections, setConnections] = useState([]);
  const [feedback, setFeedback] = useState("");
  
  const modules = [
    { 
      id: 1, 
      name: "VCO-1", 
      type: "Oscillator",
      icon: "fa-wave-square",
      power: "25mA",
      width: "10",
      inputs: [
        { name: "1V/Oct", type: "cv" },
        { name: "FM", type: "cv" },
        { name: "Sync", type: "gate" }
      ],
      outputs: [
        { name: "Sine", type: "audio" },
        { name: "Square", type: "audio" },
        { name: "Saw", type: "audio" }
      ],
      specifications: {
        "Frequency Range": "20Hz - 20kHz",
        "CV Input Range": "0-5V", 
        "Output Level": "10Vpp"
      },
      compatibility: ["Eurorack", "Doepfer A-100"]
    },
    { 
      id: 2, 
      name: "VCF-2", 
      type: "Filter",
      icon: "fa-filter",
      power: "30mA",
      width: "12",
      inputs: [
        { name: "Audio In", type: "audio" },
        { name: "Cutoff CV", type: "cv" },
        { name: "Resonance CV", type: "cv" }
      ],
      outputs: [
        { name: "LP", type: "audio" },
        { name: "HP", type: "audio" },
        { name: "BP", type: "audio" }
      ],
      specifications: {
        "Filter Type": "24dB/Oct",
        "Cutoff Range": "20Hz - 20kHz",
        "Resonance": "0-10"
      },
      compatibility: ["Eurorack", "MOTM"]
    },
    { 
      id: 3, 
      name: "ADSR", 
      type: "Envelope",
      icon: "fa-chart-line",
      power: "15mA",
      width: "8",
      inputs: [
        { name: "Gate", type: "gate" },
        { name: "Trigger", type: "gate" }
      ],
      outputs: [
        { name: "Env Out", type: "cv" }
      ],
      specifications: {
        "Attack": "1ms - 10s",
        "Decay": "1ms - 10s",
        "Sustain": "0-100%",
        "Release": "1ms - 10s"
      },
      compatibility: ["Eurorack", "Buchla", "Serge"]
    },
    { 
      id: 4, 
      name: "LFO", 
      type: "Modulator",
      icon: "fa-wave-sine",
      power: "20mA",
      width: "6",
      inputs: [
        { name: "Rate CV", type: "cv" },
        { name: "Reset", type: "gate" }
      ],
      outputs: [
        { name: "Sine", type: "cv" },
        { name: "Triangle", type: "cv" },
        { name: "Square", type: "cv" }
      ],
      specifications: {
        "Rate Range": "0.01Hz - 100Hz",
        "Output Level": "0-5V",
        "Phase Shift": "0-360°"
      },
      compatibility: ["Eurorack", "5U Format"]
    }
  ];

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("moduleId", id);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const moduleId = e.dataTransfer.getData("moduleId");
    if (!connections.includes(moduleId)) {
      setConnections([...connections, moduleId]);
      setFeedback(`Module ${modules.find(m => m.id === parseInt(moduleId)).name} connected successfully!`);
      setTimeout(() => setFeedback(""), 3000);
    }
  };

  return (
    <div className="p-6 bg-black min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-8">Modular Synthesizer Builder</h1>
      
      <MainComponent
        modules={modules}
        connections={connections}
        handleDragStart={handleDragStart}
        handleDrop={handleDrop}
        feedback={feedback}
      />
      
      <div className="mt-12 bg-[#1D1D1F] p-6 rounded-lg border border-[#424245]">
        <h2 className="text-xl font-bold text-white mb-4">Module Card Examples</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map(module => (
            <ModuleCard
              key={module.id}
              module={module}
              onDragStart={() => {}}
              className="w-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
});
}