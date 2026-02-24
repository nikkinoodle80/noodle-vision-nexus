"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({ 
  currentConnection, 
  alternatives = [], 
  onSelectAlternative,
  className = ""
}) {
  const [expandedOption, setExpandedOption] = useState(null);

  const toggleExpand = (id) => {
    setExpandedOption(expandedOption === id ? null : id);
  };

  if (!currentConnection || alternatives.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
        <div className="text-center py-8">
          <i className="fas fa-random text-4xl text-gray-400 mb-4"></i>
          <h3 className="text-xl font-medium mb-2">No Alternatives Available</h3>
          <p className="text-[#5D646C]">
            Select a connection first to see alternative options.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      <div className="border-b border-[#E4E7EA] p-4">
        <h2 className="text-xl font-medium">Alternative Connection Options</h2>
        <p className="text-[#5D646C] mt-1">
          We found {alternatives.length} better ways to connect your devices
        </p>
      </div>

      <div className="p-4">
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Current Connection</h3>
          <div className="bg-[#F6F6F6] rounded-lg p-4">
            <ConnectionSummary connection={currentConnection} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#F6F6F6]">
                <th className="p-3 text-left">Alternative</th>
                <th className="p-3 text-left">Quality</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Features</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {alternatives.map((alternative) => (
                <React.Fragment key={alternative.id}>
                  <tr className="border-b border-[#E4E7EA] hover:bg-[#F6F6F6]">
                    <td className="p-3">
                      <div className="flex items-center">
                        <button 
                          onClick={() => toggleExpand(alternative.id)}
                          className="mr-2 text-[#8C8C8C] hover:text-[#191919]"
                        >
                          <i className={`fas fa-chevron-${expandedOption === alternative.id ? 'down' : 'right'}`}></i>
                        </button>
                        <div>
                          <h4 className="font-medium">{alternative.name}</h4>
                          <p className="text-sm text-[#5D646C]">{alternative.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <QualityIndicator 
                        score={alternative.qualityScore} 
                        comparison={alternative.qualityComparison} 
                      />
                    </td>
                    <td className="p-3">
                      <div>
                        <span className="font-medium">${alternative.price.toFixed(2)}</span>
                        <PriceComparison 
                          difference={alternative.priceDifference} 
                          currentPrice={currentConnection.price} 
                        />
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {alternative.keyFeatures.slice(0, 2).map((feature, idx) => (
                          <span 
                            key={idx} 
                            className="inline-block px-2 py-1 text-xs bg-[#6567EF] text-white rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                        {alternative.keyFeatures.length > 2 && (
                          <span className="inline-block px-2 py-1 text-xs bg-[#E4E7EA] text-[#191919] rounded-full">
                            +{alternative.keyFeatures.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => onSelectAlternative(alternative)}
                        className="px-3 py-1 bg-[#6567EF] hover:bg-[#4b4de0] text-white rounded-lg text-sm"
                      >
                        Try this instead
                      </button>
                    </td>
                  </tr>
                  {expandedOption === alternative.id && (
                    <tr className="bg-[#F6F6F6]">
                      <td colSpan="5" className="p-4">
                        <ExpandedAlternativeDetails alternative={alternative} currentConnection={currentConnection} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ConnectionSummary({ connection }) {
  return (
    <div className="flex flex-col md:flex-row items-center">
      <div className="flex items-center mb-4 md:mb-0">
        <img 
          src={connection.source.image} 
          alt={connection.source.name} 
          className="w-12 h-12 object-contain"
        />
        <div className="mx-2">
          <p className="font-medium">{connection.source.name}</p>
          <p className="text-xs text-[#5D646C]">{connection.sourcePort.name}</p>
        </div>
      </div>
      
      <div className="flex items-center mx-4">
        <div className="w-16 h-2 bg-[#E4E7EA] relative">
          <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-[#8C8C8C] rounded-full"></div>
          <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-[#8C8C8C] rounded-full"></div>
        </div>
        {connection.adapter && (
          <div className="mx-2 px-2 py-1 bg-[#E4E7EA] rounded text-xs">
            {connection.adapter.name}
          </div>
        )}
      </div>
      
      <div className="flex items-center">
        <img 
          src={connection.target.image} 
          alt={connection.target.name} 
          className="w-12 h-12 object-contain"
        />
        <div className="mx-2">
          <p className="font-medium">{connection.target.name}</p>
          <p className="text-xs text-[#5D646C]">{connection.targetPort.name}</p>
        </div>
      </div>
      
      <div className="ml-auto flex flex-col items-end">
        <div className="flex items-center">
          <span className="text-sm font-medium mr-2">Quality:</span>
          <QualityIndicator score={connection.qualityScore} />
        </div>
        <div className="text-sm mt-1">
          <span className="font-medium">${connection.price.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

function QualityIndicator({ score, comparison }) {
  let color;
  if (score >= 8) color = "green";
  else if (score >= 5) color = "yellow";
  else color = "red";
  
  return (
    <div>
      <div className="flex items-center">
        <div className={`w-16 h-2 bg-[#E4E7EA] rounded-full overflow-hidden`}>
          <div 
            className={`h-full bg-${color}-500`} 
            style={{ width: `${score * 10}%` }}
          ></div>
        </div>
        <span className="ml-2 font-medium">{score}/10</span>
      </div>
      {comparison && (
        <div className="text-xs mt-1">
          {comparison > 0 ? (
            <span className="text-green-600">
              <i className="fas fa-arrow-up mr-1"></i>
              {comparison.toFixed(1)} points better
            </span>
          ) : (
            <span className="text-red-600">
              <i className="fas fa-arrow-down mr-1"></i>
              {Math.abs(comparison).toFixed(1)} points worse
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function PriceComparison({ difference, currentPrice }) {
  if (!difference) return null;
  
  const percentChange = ((difference / currentPrice) * 100).toFixed(0);
  
  return (
    <div className="text-xs mt-1">
      {difference < 0 ? (
        <span className="text-green-600">
          <i className="fas fa-arrow-down mr-1"></i>
          Save ${Math.abs(difference).toFixed(2)} ({Math.abs(percentChange)}%)
        </span>
      ) : (
        <span className="text-red-600">
          <i className="fas fa-arrow-up mr-1"></i>
          ${difference.toFixed(2)} more ({percentChange}%)
        </span>
      )}
    </div>
  );
}

function ExpandedAlternativeDetails({ alternative, currentConnection }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h4 className="font-medium mb-3">Visual Comparison</h4>
        <div className="bg-white p-4 rounded-lg border border-[#E4E7EA]">
          <div className="flex items-center justify-center mb-4">
            <img 
              src={alternative.source.image} 
              alt={alternative.source.name} 
              className="w-16 h-16 object-contain"
            />
            <div className="mx-4 flex items-center">
              <div className="w-20 h-2 bg-[#6567EF] relative">
                <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-[#6567EF] rounded-full"></div>
                <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-[#6567EF] rounded-full"></div>
              </div>
              {alternative.adapter && (
                <div className="mx-2 px-2 py-1 bg-[#6567EF] text-white rounded text-xs">
                  {alternative.adapter.name}
                </div>
              )}
            </div>
            <img 
              src={alternative.target.image} 
              alt={alternative.target.name} 
              className="w-16 h-16 object-contain"
            />
          </div>
          <div className="text-sm text-center">
            <p><span className="font-medium">{alternative.source.name}</span> ({alternative.sourcePort.name})</p>
            <p className="text-[#5D646C] text-xs mt-1 mb-2">connected to</p>
            <p><span className="font-medium">{alternative.target.name}</span> ({alternative.targetPort.name})</p>
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="font-medium mb-3">Pros & Cons</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h5 className="text-green-600 font-medium mb-2 flex items-center">
              <i className="fas fa-plus-circle mr-2"></i> Pros
            </h5>
            <ul className="text-sm space-y-2">
              {alternative.pros.map((pro, idx) => (
                <li key={idx} className="flex items-start">
                  <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="text-red-600 font-medium mb-2 flex items-center">
              <i className="fas fa-minus-circle mr-2"></i> Cons
            </h5>
            <ul className="text-sm space-y-2">
              {alternative.cons.map((con, idx) => (
                <li key={idx} className="flex items-start">
                  <i className="fas fa-times text-red-500 mt-1 mr-2"></i>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="md:col-span-2">
        <h4 className="font-medium mb-3">Detailed Comparison</h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#F6F6F6]">
                <th className="p-2 text-left">Metric</th>
                <th className="p-2 text-left">Current Setup</th>
                <th className="p-2 text-left">This Alternative</th>
                <th className="p-2 text-left">Difference</th>
              </tr>
            </thead>
            <tbody>
              {alternative.detailedComparison.map((item, idx) => (
                <tr key={idx} className="border-b border-[#E4E7EA]">
                  <td className="p-2 font-medium">{item.metric}</td>
                  <td className="p-2">{item.current}</td>
                  <td className="p-2">{item.alternative}</td>
                  <td className="p-2">
                    <ComparisonDifference 
                      difference={item.difference} 
                      higherIsBetter={item.higherIsBetter} 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="md:col-span-2">
        <h4 className="font-medium mb-3">Required Equipment</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {alternative.requiredEquipment.map((item, idx) => (
            <div key={idx} className="border border-[#E4E7EA] rounded-lg p-3 flex items-center">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-12 h-12 object-contain mr-3"
              />
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-[#5D646C]">${item.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ComparisonDifference({ difference, higherIsBetter }) {
  if (difference === 0) {
    return <span className="text-[#8C8C8C]">No change</span>;
  }
  
  const isPositive = higherIsBetter ? difference > 0 : difference < 0;
  const absValue = Math.abs(difference);
  
  return (
    <span className={isPositive ? "text-green-600" : "text-red-600"}>
      <i className={`fas fa-arrow-${isPositive ? 'up' : 'down'} mr-1`}></i>
      {typeof difference === 'number' ? absValue.toFixed(1) : absValue}
    </span>
  );
}

function StoryComponent() {
  const [selectedAlternative, setSelectedAlternative] = useState(null);
  
  const currentConnection = {
    id: "conn-1",
    source: {
      id: 1,
      name: "MacBook Pro",
      brand: "Apple",
      image: "/devices/macbook.png"
    },
    sourcePort: {
      id: 101,
      name: "USB-C",
      type: "output"
    },
    adapter: {
      id: "adpt-1",
      name: "USB-C to HDMI",
      image: "/adapters/usbc-hdmi.png"
    },
    target: {
      id: 4,
      name: "LG UltraFine 5K",
      brand: "LG",
      image: "/devices/lg-monitor.png"
    },
    targetPort: {
      id: 401,
      name: "HDMI",
      type: "input"
    },
    qualityScore: 6.5,
    price: 25.99
  };
  
  const alternatives = [
    {
      id: "alt-1",
      name: "Thunderbolt Direct Connection",
      description: "Connect directly using Thunderbolt for maximum quality",
      source: {
        id: 1,
        name: "MacBook Pro",
        brand: "Apple",
        image: "/devices/macbook.png"
      },
      sourcePort: {
        id: 102,
        name: "Thunderbolt 3",
        type: "output"
      },
      adapter: null,
      target: {
        id: 4,
        name: "LG UltraFine 5K",
        brand: "LG",
        image: "/devices/lg-monitor.png"
      },
      targetPort: {
        id: 402,
        name: "Thunderbolt 3",
        type: "input"
      },
      qualityScore: 9.8,
      qualityComparison: 3.3,
      price: 39.99,
      priceDifference: 14.00,
      keyFeatures: ["4K/5K Support", "Power Delivery", "Daisy Chaining"],
      pros: [
        "Maximum resolution support (5K)",
        "Single cable for video, audio and power",
        "Daisy chain multiple monitors",
        "40Gbps bandwidth"
      ],
      cons: [
        "More expensive cable",
        "Limited cable length (2m max)"
      ],
      detailedComparison: [
        {
          metric: "Max Resolution",
          current: "4K (3840×2160)",
          alternative: "5K (5120×2880)",
          difference: "33% more pixels",
          higherIsBetter: true
        },
        {
          metric: "Refresh Rate",
          current: "60Hz",
          alternative: "60Hz",
          difference: 0,
          higherIsBetter: true
        },
        {
          metric: "Bandwidth",
          current: "18 Gbps",
          alternative: "40 Gbps",
          difference: 22,
          higherIsBetter: true
        },
        {
          metric: "Power Delivery",
          current: "No",
          alternative: "Yes (96W)",
          difference: "Added feature",
          higherIsBetter: true
        },
        {
          metric: "Audio Support",
          current: "Yes",
          alternative: "Yes",
          difference: 0,
          higherIsBetter: true
        }
      ],
      requiredEquipment: [
        {
          id: "eq-1",
          name: "Thunderbolt 3 Cable (2m)",
          price: 39.99,
          image: "/equipment/thunderbolt-cable.png"
        }
      ]
    },
    {
      id: "alt-2",
      name: "DisplayPort Connection",
      description: "Use DisplayPort for better color accuracy",
      source: {
        id: 1,
        name: "MacBook Pro",
        brand: "Apple",
        image: "/devices/macbook.png"
      },
      sourcePort: {
        id: 101,
        name: "USB-C",
        type: "output"
      },
      adapter: {
        id: "adpt-2",
        name: "USB-C to DisplayPort",
        image: "/adapters/usbc-dp.png"
      },
      target: {
        id: 4,
        name: "LG UltraFine 5K",
        brand: "LG",
        image: "/devices/lg-monitor.png"
      },
      targetPort: {
        id: 403,
        name: "DisplayPort",
        type: "input"
      },
      qualityScore: 8.2,
      qualityComparison: 1.7,
      price: 19.99,
      priceDifference: -6.00,
      keyFeatures: ["4K Support", "Better Color", "Lower Latency"],
      pros: [
        "Better color accuracy",
        "Lower cost than current setup",
        "Support for HDR",
        "Lower latency"
      ],
      cons: [
        "No power delivery",
        "Requires separate audio cable"
      ],
      detailedComparison: [
        {
          metric: "Max Resolution",
          current: "4K (3840×2160)",
          alternative: "4K (3840×2160)",
          difference: 0,
          higherIsBetter: true
        },
        {
          metric: "Color Depth",
          current: "8-bit",
          alternative: "10-bit",
          difference: "2-bit improvement",
          higherIsBetter: true
        },
        {
          metric: "Refresh Rate",
          current: "60Hz",
          alternative: "60Hz",
          difference: 0,
          higherIsBetter: true
        },
        {
          metric: "Latency",
          current: "16ms",
          alternative: "12ms",
          difference: 4,
          higherIsBetter: false
        },
        {
          metric: "HDR Support",
          current: "No",
          alternative: "Yes",
          difference: "Added feature",
          higherIsBetter: true
        }
      ],
      requiredEquipment: [
        {
          id: "eq-2",
          name: "USB-C to DisplayPort Adapter",
          price: 19.99,
          image: "/equipment/usbc-dp-adapter.png"
        }
      ]
    },
    {
      id: "alt-3",
      name: "Wireless Connection",
      description: "Connect wirelessly for more flexibility",
      source: {
        id: 1,
        name: "MacBook Pro",
        brand: "Apple",
        image: "/devices/macbook.png"
      },
      sourcePort: {
        id: 103,
        name: "Wi-Fi",
        type: "output"
      },
      adapter: {
        id: "adpt-3",
        name: "Wireless Display Adapter",
        image: "/adapters/wireless-adapter.png"
      },
      target: {
        id: 4,
        name: "LG UltraFine 5K",
        brand: "LG",
        image: "/devices/lg-monitor.png"
      },
      targetPort: {
        id: 401,
        name: "HDMI",
        type: "input"
      },
      qualityScore: 5.8,
      qualityComparison: -0.7,
      price: 49.99,
      priceDifference: 24.00,
      keyFeatures: ["Wireless", "Flexibility", "No Cable Clutter"],
      pros: [
        "No cables needed",
        "Connect from anywhere in the room",
        "Easy to switch between devices"
      ],
      cons: [
        "Lower quality than wired connection",
        "Potential latency issues",
        "More expensive",
        "Requires power outlet"
      ],
      detailedComparison: [
        {
          metric: "Max Resolution",
          current: "4K (3840×2160)",
          alternative: "1080p (1920×1080)",
          difference: "75% fewer pixels",
          higherIsBetter: true
        },
        {
          metric: "Latency",
          current: "16ms",
          alternative: "45ms",
          difference: 29,
          higherIsBetter: false
        },
        {
          metric: "Reliability",
          current: "Very High",
          alternative: "Medium",
          difference: "Lower reliability",
          higherIsBetter: true
        },
        {
          metric: "Mobility",
          current: "Fixed position",
          alternative: "Up to 30ft range",
          difference: "Added mobility",
          higherIsBetter: true
        },
        {
          metric: "Setup Complexity",
          current: "Simple",
          alternative: "Moderate",
          difference: "More complex",
          higherIsBetter: false
        }
      ],
      requiredEquipment: [
        {
          id: "eq-3",
          name: "Wireless Display Adapter",
          price: 49.99,
          image: "/equipment/wireless-adapter.png"
        }
      ]
    }
  ];
  
  const handleSelectAlternative = (alternative) => {
    setSelectedAlternative(alternative);
    console.log("Selected alternative:", alternative.name);
  };
  
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-medium mb-6">Alternative Options Component</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-medium mb-4">Selected Alternative</h2>
        {selectedAlternative ? (
          <div className="p-4 bg-[#F6F6F6] rounded-lg">
            <p className="font-medium">You selected: {selectedAlternative.name}</p>
            <p className="text-sm text-[#5D646C] mt-1">
              This would normally update the main visualizer
            </p>
          </div>
        ) : (
          <p className="text-[#5D646C]">
            No alternative selected yet. Click "Try this instead" on any option below.
          </p>
        )}
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-medium mb-4">With Alternatives</h2>
        <MainComponent 
          currentConnection={currentConnection}
          alternatives={alternatives}
          onSelectAlternative={handleSelectAlternative}
        />
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-medium mb-4">Empty State (No Connection)</h2>
        <MainComponent 
          currentConnection={null}
          alternatives={[]}
          onSelectAlternative={handleSelectAlternative}
        />
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-medium mb-4">No Alternatives Available</h2>
        <MainComponent 
          currentConnection={currentConnection}
          alternatives={[]}
          onSelectAlternative={handleSelectAlternative}
        />
      </div>
    </div>
  );
});
}