"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({ 
  connectionData = {
    quality: 85,
    maxResolution: "4K (3840x2160)",
    maxRefreshRate: "60Hz",
    supportedFeatures: ["Audio", "HDR", "Charging (15W)"],
    powerRequirements: {
      direction: "Source to Target",
      voltage: "5V",
      current: "3A",
      power: "15W"
    },
    knownIssues: [
      "May experience occasional flickering at 4K 60Hz",
      "Audio may have slight delay"
    ],
    explanation: "This connection works because both devices support HDMI 2.0 standard which allows for 4K resolution at 60Hz. The cable quality is sufficient for this bandwidth requirement. Power delivery is supported through the USB-C connection."
  },
  onTestConnection = () => {},
  onShareResults = () => {},
  onExportResults = () => {}
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    features: false,
    power: false,
    issues: false,
    explanation: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleTestConnection = async () => {
    setIsLoading(true);
    await onTestConnection();
    setTimeout(() => setIsLoading(false), 2000);
  };

  const getQualityColor = (quality) => {
    if (quality >= 80) return "bg-[#10b981]";
    if (quality >= 60) return "bg-[#f59e0b]";
    return "bg-[#ef4444]";
  };

  const getQualityText = (quality) => {
    if (quality >= 80) return "Excellent";
    if (quality >= 60) return "Good";
    return "Poor";
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 border-b border-[#E4E7EA]">
        <h2 className="text-2xl font-medium mb-4 text-[#191919]">Connection Results</h2>
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-medium ${getQualityColor(connectionData.quality)}`}>
              {connectionData.quality}%
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-[#191919]">Connection Quality</h3>
              <p className="text-[#5D646C]">{getQualityText(connectionData.quality)}</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={handleTestConnection}
              className="px-4 py-2 bg-[#6567EF] text-white rounded-lg hover:bg-[#4b4de0] flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Testing...
                </>
              ) : (
                <>
                  <i className="fas fa-sync-alt mr-2"></i>
                  Test Connection
                </>
              )}
            </button>
            <button 
              onClick={onShareResults}
              className="px-4 py-2 bg-[#F6F6F6] rounded-lg hover:bg-[#E4E7EA] flex items-center"
            >
              <i className="fas fa-share-alt mr-2"></i>
              Share
            </button>
            <button 
              onClick={onExportResults}
              className="px-4 py-2 bg-[#F6F6F6] rounded-lg hover:bg-[#E4E7EA] flex items-center"
            >
              <i className="fas fa-download mr-2"></i>
              Export
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#F6F6F6] p-4 rounded-lg">
            <h3 className="font-medium mb-2 text-[#191919]">Maximum Resolution</h3>
            <p className="text-lg text-[#191919]">{connectionData.maxResolution}</p>
          </div>
          
          <div className="bg-[#F6F6F6] p-4 rounded-lg">
            <h3 className="font-medium mb-2 text-[#191919]">Maximum Refresh Rate</h3>
            <p className="text-lg text-[#191919]">{connectionData.maxRefreshRate}</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-4">
          <button 
            onClick={() => toggleSection('features')}
            className="w-full flex items-center justify-between p-4 bg-[#F6F6F6] rounded-lg hover:bg-[#E4E7EA]"
          >
            <span className="font-medium text-[#191919]">Supported Features</span>
            <i className={`fas fa-chevron-${expandedSections.features ? 'up' : 'down'}`}></i>
          </button>
          
          {expandedSections.features && (
            <div className="mt-2 p-4 bg-white border border-[#E4E7EA] rounded-lg">
              <div className="flex flex-wrap gap-2">
                {connectionData.supportedFeatures.map((feature, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-[#10b981] text-white rounded-full flex items-center"
                  >
                    <i className="fas fa-check mr-2"></i>
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <button 
            onClick={() => toggleSection('power')}
            className="w-full flex items-center justify-between p-4 bg-[#F6F6F6] rounded-lg hover:bg-[#E4E7EA]"
          >
            <span className="font-medium text-[#191919]">Power Requirements</span>
            <i className={`fas fa-chevron-${expandedSections.power ? 'up' : 'down'}`}></i>
          </button>
          
          {expandedSections.power && (
            <div className="mt-2 p-4 bg-white border border-[#E4E7EA] rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm text-[#5D646C]">Direction</h4>
                  <p className="font-medium text-[#191919]">{connectionData.powerRequirements.direction}</p>
                </div>
                <div>
                  <h4 className="text-sm text-[#5D646C]">Voltage</h4>
                  <p className="font-medium text-[#191919]">{connectionData.powerRequirements.voltage}</p>
                </div>
                <div>
                  <h4 className="text-sm text-[#5D646C]">Current</h4>
                  <p className="font-medium text-[#191919]">{connectionData.powerRequirements.current}</p>
                </div>
                <div>
                  <h4 className="text-sm text-[#5D646C]">Power</h4>
                  <p className="font-medium text-[#191919]">{connectionData.powerRequirements.power}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <i className="fas fa-bolt text-[#f59e0b] mr-2"></i>
                <span className="text-sm text-[#191919]">Power flows from source device to target device</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <button 
            onClick={() => toggleSection('issues')}
            className="w-full flex items-center justify-between p-4 bg-[#F6F6F6] rounded-lg hover:bg-[#E4E7EA]"
          >
            <span className="font-medium text-[#191919]">Known Issues</span>
            <i className={`fas fa-chevron-${expandedSections.issues ? 'up' : 'down'}`}></i>
          </button>
          
          {expandedSections.issues && (
            <div className="mt-2 p-4 bg-white border border-[#E4E7EA] rounded-lg">
              {connectionData.knownIssues.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {connectionData.knownIssues.map((issue, index) => (
                    <li key={index} className="text-[#f59e0b]">
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[#10b981]">No known issues with this connection.</p>
              )}
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <button 
            onClick={() => toggleSection('explanation')}
            className="w-full flex items-center justify-between p-4 bg-[#F6F6F6] rounded-lg hover:bg-[#E4E7EA]"
          >
            <span className="font-medium text-[#191919]">Technical Explanation</span>
            <i className={`fas fa-chevron-${expandedSections.explanation ? 'up' : 'down'}`}></i>
          </button>
          
          {expandedSections.explanation && (
            <div className="mt-2 p-4 bg-white border border-[#E4E7EA] rounded-lg">
              <p className="text-[#5D646C]">{connectionData.explanation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StoryComponent() {
  const [testResults, setTestResults] = useState({
    quality: 85,
    maxResolution: "4K (3840x2160)",
    maxRefreshRate: "60Hz",
    supportedFeatures: ["Audio", "HDR", "Charging (15W)"],
    powerRequirements: {
      direction: "Source to Target",
      voltage: "5V",
      current: "3A",
      power: "15W"
    },
    knownIssues: [
      "May experience occasional flickering at 4K 60Hz",
      "Audio may have slight delay"
    ],
    explanation: "This connection works because both devices support HDMI 2.0 standard which allows for 4K resolution at 60Hz. The cable quality is sufficient for this bandwidth requirement. Power delivery is supported through the USB-C connection."
  });

  const handleTestConnection = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  };

  const handleShareResults = () => {
    alert("Link copied to clipboard!");
  };

  const handleExportResults = () => {
    alert("Results exported!");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-medium mb-6 text-[#191919]">Connection Results Component</h1>
      
      <div className="mb-12">
        <h2 className="text-xl font-medium mb-4 text-[#191919]">Default View</h2>
        <MainComponent 
          connectionData={testResults}
          onTestConnection={handleTestConnection}
          onShareResults={handleShareResults}
          onExportResults={handleExportResults}
        />
      </div>
      
      <div className="mb-12">
        <h2 className="text-xl font-medium mb-4 text-[#191919]">Excellent Connection</h2>
        <MainComponent 
          connectionData={{
            ...testResults,
            quality: 95,
            knownIssues: []
          }}
          onTestConnection={handleTestConnection}
          onShareResults={handleShareResults}
          onExportResults={handleExportResults}
        />
      </div>
      
      <div className="mb-12">
        <h2 className="text-xl font-medium mb-4 text-[#191919]">Good Connection</h2>
        <MainComponent 
          connectionData={{
            ...testResults,
            quality: 75,
            maxResolution: "1080p (1920x1080)",
            maxRefreshRate: "120Hz",
            knownIssues: ["Limited to 1080p resolution", "No HDR support"]
          }}
          onTestConnection={handleTestConnection}
          onShareResults={handleShareResults}
          onExportResults={handleExportResults}
        />
      </div>
      
      <div className="mb-12">
        <h2 className="text-xl font-medium mb-4 text-[#191919]">Poor Connection</h2>
        <MainComponent 
          connectionData={{
            ...testResults,
            quality: 45,
            maxResolution: "720p (1280x720)",
            maxRefreshRate: "30Hz",
            supportedFeatures: ["Audio"],
            knownIssues: [
              "Limited to 720p resolution",
              "No HDR support",
              "No power delivery",
              "Potential signal dropouts"
            ],
            explanation: "This connection has limitations due to the use of an older HDMI 1.2 standard. The cable quality is also below recommended specifications which may result in signal degradation."
          }}
          onTestConnection={handleTestConnection}
          onShareResults={handleShareResults}
          onExportResults={handleExportResults}
        />
      </div>
      
      <div>
        <h2 className="text-xl font-medium mb-4 text-[#191919]">Failed Connection</h2>
        <MainComponent 
          connectionData={{
            ...testResults,
            quality: 0,
            maxResolution: "Not compatible",
            maxRefreshRate: "Not compatible",
            supportedFeatures: [],
            powerRequirements: {
              direction: "N/A",
              voltage: "N/A",
              current: "N/A",
              power: "N/A"
            },
            knownIssues: [
              "Incompatible connection types",
              "Adapter required",
              "No signal detected"
            ],
            explanation: "This connection cannot be established because the source device uses DisplayPort while the target device only accepts HDMI input. An active adapter would be required to convert the signal."
          }}
          onTestConnection={handleTestConnection}
          onShareResults={handleShareResults}
          onExportResults={handleExportResults}
        />
      </div>
    </div>
  );
});
}