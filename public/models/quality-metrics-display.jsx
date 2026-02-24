"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({ qualityMetrics }) {
  const [activeTab, setActiveTab] = React.useState('overview');
  const [animationFrame, setAnimationFrame] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'good':
      case 'stable':
      case 'low':
        return 'text-[#10b981]';
      case 'moderate':
      case 'medium':
        return 'text-[#f59e0b]';
      case 'poor': 
      case 'unstable':
      case 'high':
        return 'text-[#ef4444]';
      default:
        return 'text-[#8C8C8C]';
    }
  };

  const renderAdapterChain = (adapters) => {
    if (!adapters || !adapters.length) return null;
    
    const width = 600;
    const height = 100;
    const adapterWidth = 80;
    const adapterHeight = 40;
    const spacing = (width - (adapters.length * adapterWidth)) / (adapters.length + 1);
    
    return (
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="border border-[#E4E7EA] rounded">
        {adapters.map((adapter, index) => {
          const x = spacing + index * (adapterWidth + spacing);
          const y = (height - adapterHeight) / 2;
          
          return (
            <g key={index}>
              <rect
                x={x}
                y={y}
                width={adapterWidth}
                height={adapterHeight}
                rx="4"
                fill={adapter.isWeakLink ? "#ef4444" : "#5D646C"}
                stroke={adapter.isWeakLink ? "#ef4444" : "#8C8C8C"}
                strokeWidth="2"
              />
              <text
                x={x + adapterWidth / 2}
                y={y + adapterHeight / 2}
                textAnchor="middle"
                fill="#F6F6F6"
                fontSize="10"
                dominantBaseline="middle"
              >
                {adapter.name}
              </text>
              
              {index < adapters.length - 1 && (
                <g>
                  <line
                    x1={x + adapterWidth}
                    y1={y + adapterHeight / 2}
                    x2={x + adapterWidth + spacing}
                    y2={y + adapterHeight / 2}
                    stroke="#8C8C8C"
                    strokeWidth="2"
                    strokeDasharray={adapter.signalDegradation > 20 ? "4,4" : "none"}
                  />
                  {adapter.signalDegradation > 0 && (
                    <text
                      x={x + adapterWidth + spacing / 2}
                      y={y + adapterHeight / 2 - 15}
                      textAnchor="middle"
                      fill={adapter.signalDegradation > 20 ? "#ef4444" : "#8C8C8C"}
                      fontSize="8"
                    >
                      -{adapter.signalDegradation}%
                    </text>
                  )}
                </g>
              )}
            </g>
          );
        })}
      </svg>
    );
  };

  const overviewTabActive = activeTab === 'overview';
  const showAdapterMetrics = qualityMetrics.adapterMetrics;
  const showAudioSystemMetricsOverview = overviewTabActive && !showAdapterMetrics;
  const showAdapterMetricsOverview = overviewTabActive && showAdapterMetrics;

  const signalQualityColorClass = getStatusColor(qualityMetrics.signalQuality);
  const signalQualityWidthStyle = qualityMetrics.signalQuality === 'Good' ? '90%' : 
                                  qualityMetrics.signalQuality === 'Moderate' ? '60%' : '30%';
  
  const powerStabilityColorClass = getStatusColor(qualityMetrics.powerStability);
  const powerStabilityWidthStyle = qualityMetrics.powerStability === 'Stable' ? '90%' : 
                                   qualityMetrics.powerStability === 'Fluctuating' ? '60%' : '30%';

  const groundNoiseColorClass = getStatusColor(qualityMetrics.groundNoise);
  const groundNoiseWidthStyle = qualityMetrics.groundNoise === 'Low' ? '30%' : 
                                qualityMetrics.groundNoise === 'Medium' ? '60%' : '90%';


  return (
    <div className="bg-white rounded-lg p-4 font-inter">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl text-[#191919]">
          {showAdapterMetrics ? 'Connection Quality Metrics' : 'Audio System Metrics'}
        </h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1 rounded ${overviewTabActive ? 'bg-[#6567EF] text-white' : 'bg-[#F6F6F6] text-[#191919] border border-[#E4E7EA]'}`}
          >
            Overview
          </button>
          {showAdapterMetrics ? (
            <>
              <button 
                onClick={() => setActiveTab('adapters')}
                className={`px-3 py-1 rounded ${activeTab === 'adapters' ? 'bg-[#6567EF] text-white' : 'bg-[#F6F6F6] text-[#191919] border border-[#E4E7EA]'}`}
              >
                Adapters
              </button>
              <button 
                onClick={() => setActiveTab('devices')}
                className={`px-3 py-1 rounded ${activeTab === 'devices' ? 'bg-[#6567EF] text-white' : 'bg-[#F6F6F6] text-[#191919] border border-[#E4E7EA]'}`}
              >
                Devices
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setActiveTab('audio')}
                className={`px-3 py-1 rounded ${activeTab === 'audio' ? 'bg-[#6567EF] text-white' : 'bg-[#F6F6F6] text-[#191919] border border-[#E4E7EA]'}`}
              >
                Audio
              </button>
              <button 
                onClick={() => setActiveTab('system')}
                className={`px-3 py-1 rounded ${activeTab === 'system' ? 'bg-[#6567EF] text-white' : 'bg-[#F6F6F6] text-[#191919] border border-[#E4E7EA]'}`}
              >
                System
              </button>
            </>
          )}
        </div>
      </div>
      
      {showAudioSystemMetricsOverview && qualityMetrics.connectionMetrics && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-[#E4E7EA] rounded p-3">
              <h3 className="text-[#5D646C] mb-2">Signal Quality</h3>
              <div className="flex items-center">
                <div className={signalQualityColorClass}>
                  {qualityMetrics.signalQuality}
                </div>
                <div className="ml-2 h-2 bg-[#F6F6F6] rounded-full flex-1">
                  <div 
                    className={`h-full rounded-full ${
                      qualityMetrics.signalQuality === 'Good' ? 'bg-[#10b981]' : 
                      qualityMetrics.signalQuality === 'Moderate' ? 'bg-[#f59e0b]' : 'bg-[#ef4444]'
                    }`}
                    style={{ width: signalQualityWidthStyle }}
                  />
                </div>
              </div>
            </div>
            
            <div className="border border-[#E4E7EA] rounded p-3">
              <h3 className="text-[#5D646C] mb-2">Power Stability</h3>
              <div className="flex items-center">
                <div className={powerStabilityColorClass}>
                  {qualityMetrics.powerStability}
                </div>
                <div className="ml-2 h-2 bg-[#F6F6F6] rounded-full flex-1">
                  <div 
                    className={`h-full rounded-full ${
                      qualityMetrics.powerStability === 'Stable' ? 'bg-[#10b981]' : 
                      qualityMetrics.powerStability === 'Fluctuating' ? 'bg-[#f59e0b]' : 'bg-[#ef4444]'
                    }`}
                    style={{ width: powerStabilityWidthStyle }}
                  />
                </div>
              </div>
            </div>
            
            <div className="border border-[#E4E7EA] rounded p-3">
              <h3 className="text-[#5D646C] mb-2">Ground Noise</h3>
              <div className="flex items-center">
                <div className={groundNoiseColorClass}>
                  {qualityMetrics.groundNoise}
                </div>
                <div className="ml-2 h-2 bg-[#F6F6F6] rounded-full flex-1">
                  <div 
                    className={`h-full rounded-full ${
                      qualityMetrics.groundNoise === 'Low' ? 'bg-[#10b981]' : 
                      qualityMetrics.groundNoise === 'Medium' ? 'bg-[#f59e0b]' : 'bg-[#ef4444]'
                    }`}
                    style={{ width: groundNoiseWidthStyle }}
                  />
                </div>
              </div>
            </div>
            
            <div className="border border-[#E4E7EA] rounded p-3">
              <h3 className="text-[#5D646C] mb-2">Bluetooth Range</h3>
              <div className="flex items-center">
                <div className="text-[#5D646C]">
                  {qualityMetrics.bluetoothRange}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 border border-[#E4E7EA] rounded p-3">
            <h3 className="text-[#5D646C] mb-2">Connection Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <h4 className="text-[#5D646C]">Power</h4>
                <div className="text-[#5D646C]">Voltage: {qualityMetrics.connectionMetrics.power.voltage}V</div>
                <div className="text-[#5D646C]">Current: {qualityMetrics.connectionMetrics.power.current}A</div>
              </div>
              <div>
                <h4 className="text-[#5D646C]">Ground</h4>
                <div className="text-[#5D646C]">Resistance: {qualityMetrics.connectionMetrics.ground.resistance}Ω</div>
              </div>
              {qualityMetrics.connectionMetrics.signalInfo && (
                <div>
                  <h4 className="text-[#5D646C]">Signal</h4>
                  <div className="text-[#5D646C]">Strength: {qualityMetrics.connectionMetrics.signalInfo.strength}%</div>
                  <div className="text-[#5D646C]">Noise: {qualityMetrics.connectionMetrics.signalInfo.noise}dB</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {showAdapterMetricsOverview && (
        <div className="space-y-4">
          <div className="border border-[#E4E7EA] rounded p-3">
            <h3 className="text-[#5D646C] mb-3">Adapter Chain</h3>
            {renderAdapterChain(qualityMetrics.adapterMetrics)}
          </div>
        </div>
      )}
    </div>
  );
}

function StoryComponent() {
  const qualityMetricsExample1 = {
    signalQuality: 'Good',
    powerStability: 'Stable',
    groundNoise: 'Low',
    bluetoothRange: '10m',
    connectionMetrics: {
      power: { voltage: 5, current: 1 },
      ground: { resistance: 0.5 },
      signalInfo: { strength: 95, noise: -60 } 
    }
  };

  const qualityMetricsExample2 = {
    adapterMetrics: [
      { name: 'Adapter 1', isWeakLink: false, signalDegradation: 10 },
      { name: 'Adapter 2', isWeakLink: true, signalDegradation: 30 },
      { name: 'Adapter 3', isWeakLink: false, signalDegradation: 5 }
    ]
  };
  
  const qualityMetricsExample3 = {
    signalQuality: 'Poor',
    powerStability: 'Unstable',
    groundNoise: 'High',
    bluetoothRange: '2m',
    connectionMetrics: {
      power: { voltage: 4.5, current: 0.8 },
      ground: { resistance: 2.1 },
      signalInfo: { strength: 40, noise: -30 }
    }
  };


  return (
    <div className="p-4 space-y-8 bg-[#F6F6F6]">
      <div>
        <h2 className="text-xl font-medium text-[#191919] mb-2">Audio System Metrics Example</h2>
        <MainComponent qualityMetrics={qualityMetricsExample1} />
      </div>
      <div>
        <h2 className="text-xl font-medium text-[#191919] mb-2">Connection Quality Metrics Example</h2>
        <MainComponent qualityMetrics={qualityMetricsExample2} />
      </div>
      <div>
        <h2 className="text-xl font-medium text-[#191919] mb-2">Poor Quality Audio Metrics Example</h2>
        <MainComponent qualityMetrics={qualityMetricsExample3} />
      </div>
    </div>
  );
});
}