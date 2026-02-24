"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({ 
  title, 
  options, 
  categories = null, 
  moduleType = "default", 
  onSelect = () => {},
  className = ""
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  
  const moduleTypeIcons = {
    default: "fa-microchip",
    input: "fa-arrow-right", 
    output: "fa-arrow-left",
    processor: "fa-cogs",
    utility: "fa-tools",
    audio: "fa-volume-up",
    video: "fa-video",
    data: "fa-database"
  };
  
  const moduleTypeColors = {
    default: "from-gray-700 to-gray-900",
    input: "from-blue-700 to-blue-900",
    output: "from-green-700 to-green-900",
    processor: "from-purple-700 to-purple-900", 
    utility: "from-yellow-700 to-yellow-900",
    audio: "from-red-700 to-red-900",
    video: "from-indigo-700 to-indigo-900",
    data: "from-cyan-700 to-cyan-900"
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const filteredOptions = options.filter(option => 
    typeof option === 'string' 
      ? option.toLowerCase().includes(searchTerm.toLowerCase())
      : option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredCategories = categories 
    ? Object.keys(categories).reduce((acc, category) => {
        const filteredCategoryOptions = categories[category].filter(option => 
          typeof option === 'string' 
            ? option.toLowerCase().includes(searchTerm.toLowerCase())
            : option.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        if (filteredCategoryOptions.length > 0) {
          acc[category] = filteredCategoryOptions;
        }
        
        return acc;
      }, {})
    : null;
  
  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex justify-between items-center w-full rounded-md border-2 border-gray-600 px-4 py-2 text-sm font-medium text-white bg-gradient-to-b ${moduleTypeColors[moduleType]} hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500 shadow-[0_0_5px_rgba(0,0,0,0.5)] transition-all duration-200`}
      >
        <div className="flex items-center">
          <i className={`fas ${moduleTypeIcons[moduleType]} mr-2 text-[#FFCC00]`}></i>
          <span className="font-inter font-medium">{title}</span>
        </div>
        <i className={`fas fa-chevron-down ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>
      
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-64 md:w-72 rounded-md shadow-lg bg-gray-800 border-2 border-gray-600 ring-1 ring-black ring-opacity-5 z-10">
          <div className="p-2">
            <div className="relative mb-2">
              <input
                type="text"
                placeholder="Search modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500"
              />
              <i className="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            
            {searchTerm && filteredOptions.length === 0 && (!filteredCategories || Object.keys(filteredCategories).length === 0) && (
              <div className="py-2 px-3 text-sm text-gray-400">
                No modules found
              </div>
            )}
            
            {categories ? (
              Object.keys(filteredCategories || {}).length > 0 ? (
                Object.keys(filteredCategories).map((category, catIndex) => (
                  <div key={catIndex} className="mb-2 last:mb-0">
                    <div className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-700">
                      {category}
                    </div>
                    <div>
                      {filteredCategories[category].map((option, index) => {
                        const optionName = typeof option === 'string' ? option : option.name;
                        const optionType = typeof option === 'object' ? option.type || 'default' : 'default';
                        
                        return (
                          <a
                            key={index}
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              onSelect(option);
                              setIsOpen(false);
                            }}
                            className="flex items-center px-3 py-2 text-sm text-white hover:bg-gray-700 transition-colors duration-150"
                          >
                            <i className={`fas ${moduleTypeIcons[optionType]} mr-2 text-[#FFCC00]`}></i>
                            <span>{optionName}</span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : null
            ) : (
              filteredOptions.map((option, index) => {
                const optionName = typeof option === 'string' ? option : option.name;
                const optionType = typeof option === 'object' ? option.type || 'default' : 'default';
                
                return (
                  <a
                    key={index}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onSelect(option);
                      setIsOpen(false);
                    }}
                    className="flex items-center px-3 py-2 text-sm text-white hover:bg-gray-700 transition-colors duration-150"
                  >
                    <i className={`fas ${moduleTypeIcons[optionType]} mr-2 text-[#FFCC00]`}></i>
                    <span>{optionName}</span>
                  </a>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StoryComponent() {
  const specialtyWires = [
    { name: "Coaxial", type: "input" },
    { name: "Fiber Optic", type: "output" },
    { name: "Twisted Pair", type: "data" }
  ];
  
  const computerConnectors = [
    { name: "USB", type: "input" },
    { name: "HDMI", type: "video" },
    { name: "Ethernet", type: "data" }
  ];
  
  const audioModules = {
    "Oscillators": [
      { name: "Sine Wave", type: "audio" },
      { name: "Square Wave", type: "audio" },
      { name: "Sawtooth", type: "audio" }
    ],
    "Filters": [
      { name: "Low Pass", type: "processor" },
      { name: "High Pass", type: "processor" },
      { name: "Band Pass", type: "processor" }
    ],
    "Effects": [
      { name: "Reverb", type: "audio" },
      { name: "Delay", type: "audio" },
      { name: "Distortion", type: "audio" }
    ]
  };
  
  const videoModules = {
    "Cameras": [
      { name: "IP Camera", type: "video" },
      { name: "Analog Camera", type: "video" },
      { name: "Wireless Camera", type: "video" }
    ],
    "Recorders": [
      { name: "4 Channel DVR", type: "data" },
      { name: "8 Channel DVR", type: "data" },
      { name: "16 Channel DVR", type: "data" }
    ]
  };
  
  const handleSelect = (option) => {
    console.log("Selected:", option);
  };
  
  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-8 font-inter">Synthesizer Module Selection</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white mb-4 font-inter">Basic Dropdowns</h2>
          <MainComponent 
            title="Specialty Wires" 
            options={specialtyWires} 
            moduleType="input"
            onSelect={handleSelect}
            className="w-full"
          />
          <MainComponent 
            title="Computer Connectors" 
            options={computerConnectors} 
            moduleType="data"
            onSelect={handleSelect}
            className="w-full"
          />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white mb-4 font-inter">Categorized Dropdowns</h2>
          <MainComponent 
            title="Audio Modules" 
            categories={audioModules} 
            options={[]}
            moduleType="audio"
            onSelect={handleSelect}
            className="w-full"
          />
          <MainComponent 
            title="Video Modules" 
            categories={videoModules} 
            options={[]}
            moduleType="video"
            onSelect={handleSelect}
            className="w-full"
          />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white mb-4 font-inter">Module Types</h2>
          <MainComponent 
            title="Input Modules" 
            options={[
              { name: "MIDI Controller", type: "input" },
              { name: "Audio Input", type: "input" },
              { name: "CV Generator", type: "input" }
            ]} 
            moduleType="input"
            onSelect={handleSelect}
            className="w-full"
          />
          <MainComponent 
            title="Processor Modules" 
            options={[
              { name: "Envelope Generator", type: "processor" },
              { name: "LFO", type: "processor" },
              { name: "Sequencer", type: "processor" }
            ]} 
            moduleType="processor"
            onSelect={handleSelect}
            className="w-full"
          />
          <MainComponent 
            title="Output Modules" 
            options={[
              { name: "Audio Output", type: "output" },
              { name: "CV Output", type: "output" },
              { name: "Monitor", type: "output" }
            ]} 
            moduleType="output"
            onSelect={handleSelect}
            className="w-full"
          />
        </div>
      </div>
      
      <div className="mt-12">
        <h2 className="text-xl font-bold text-white mb-4 font-inter">Original Dropdowns (For Reference)</h2>
        <div className="space-y-4 max-w-md">
          <MainComponent title="Security Cams" options={["IP Camera", "Analog Camera", "Wireless Camera"]} />
          <MainComponent title="DVR" options={["4 Channel", "8 Channel", "16 Channel"]} />
          <MainComponent title="Automotive" options={["OBD-II", "CAN Bus", "GPS Antenna"]} />
        </div>
      </div>
    </div>
  );
});
}