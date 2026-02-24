"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({ 
  connectionSetup = null,
  commonIssues = [],
  userSubmittedSolutions = [],
  onReportHelpful = () => {},
  onSearchIssues = () => {}
}) {
  const [expandedCategory, setExpandedCategory] = React.useState(null);
  const [expandedIssue, setExpandedIssue] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filteredIssues, setFilteredIssues] = React.useState(commonIssues);

  React.useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredIssues(commonIssues);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = commonIssues.filter(category => 
        category.name.toLowerCase().includes(query) || 
        category.issues.some(issue => 
          issue.title.toLowerCase().includes(query) || 
          issue.description.toLowerCase().includes(query)
        )
      );
      setFilteredIssues(filtered);
      onSearchIssues(query);
    }
  }, [searchQuery, commonIssues, onSearchIssues]);

  const toggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const toggleIssue = (issueId) => {
    setExpandedIssue(expandedIssue === issueId ? null : issueId);
  };

  const handleReportHelpful = (issueId) => {
    onReportHelpful(issueId);
  };

  return (
    <div className="bg-[#1B1B1B] rounded-lg">
      <div className="p-6 border-b border-[#4B4B4B]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-2xl font-inter-tight-medium text-[#F6F6F6] mb-4 md:mb-0">
            Troubleshooting Tips
          </h2>
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#4B4B4B] rounded-lg focus:ring-2 focus:ring-[#DFFF4E] focus:border-[#DFFF4E] bg-[#1B1B1B] text-[#F6F6F6]"
            />
            <i className="fas fa-search absolute left-3 top-3 text-[#B1B1B1]"></i>
          </div>
        </div>

        {connectionSetup && (
          <div className="mb-6 p-4 bg-[#2C2C2C] rounded-lg">
            <h3 className="text-lg font-inter-tight-medium mb-2 text-[#F6F6F6]">
              <i className="fas fa-info-circle mr-2"></i>
              Tips for your current setup
            </h3>
            <div className="flex flex-col md:flex-row items-start">
              <div className="flex-1 mb-4 md:mb-0 md:mr-4">
                <p className="text-sm text-[#B1B1B1] mb-2">
                  Based on your connection between:
                </p>
                <div className="flex items-center">
                  <div className="flex flex-col items-center mr-4">
                    <img 
                      src={connectionSetup.source.image} 
                      alt={connectionSetup.source.name} 
                      className="w-12 h-12 object-contain mb-1"
                    />
                    <span className="text-xs font-medium">{connectionSetup.source.name}</span>
                  </div>
                  <div className="w-8 h-px bg-[#4B4B4B] mx-1"></div>
                  <div className="flex flex-col items-center mx-2">
                    <div className="text-xs font-medium px-2 py-1 bg-[#4B4B4B] rounded">
                      {connectionSetup.sourcePort.name} → {connectionSetup.targetPort.name}
                    </div>
                  </div>
                  <div className="w-8 h-px bg-[#4B4B4B] mx-1"></div>
                  <div className="flex flex-col items-center ml-4">
                    <img 
                      src={connectionSetup.target.image} 
                      alt={connectionSetup.target.name} 
                      className="w-12 h-12 object-contain mb-1"
                    />
                    <span className="text-xs font-medium">{connectionSetup.target.name}</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 p-3 bg-[#1B1B1B] rounded-lg border border-[#4B4B4B]">
                <h4 className="font-medium text-sm mb-2 text-[#F6F6F6]">Common issues with this setup:</h4>
                <ul className="text-sm space-y-1">
                  {connectionSetup.commonIssues.map((issue, index) => (
                    <li key={index} className="flex items-start">
                      <i className="fas fa-exclamation-triangle text-yellow-500 mt-1 mr-2"></i>
                      <span className="text-[#B1B1B1]">{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        {filteredIssues.length === 0 ? (
          <div className="text-center py-8">
            <i className="fas fa-search text-4xl text-[#B1B1B1] mb-4"></i>
            <p className="text-[#B1B1B1]">No issues found matching "{searchQuery}"</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredIssues.map(category => (
              <div key={category.id} className="border rounded-lg border-[#4B4B4B] overflow-hidden">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex justify-between items-center p-4 text-left bg-[#2C2C2C] hover:bg-[#B1B1B1]"
                >
                  <div className="flex items-center">
                    <i className={`fas ${category.icon} text-${category.color}-500 mr-3`}></i>
                    <span className="font-semibold text-[#F6F6F6]">{category.name}</span>
                    <span className="ml-2 text-xs bg-[#4B4B4B] text-[#F6F6F6] px-2 py-0.5 rounded-full">
                      {category.issues.length}
                    </span>
                  </div>
                  <i className={`fas fa-chevron-${expandedCategory === category.id ? 'up' : 'down'} text-[#B1B1B1]`}></i>
                </button>
                
                {expandedCategory === category.id && (
                  <div className="p-4 space-y-3">
                    {category.issues.map(issue => (
                      <div key={issue.id} className="border rounded-lg border-[#4B4B4B]">
                        <button
                          onClick={() => toggleIssue(issue.id)}
                          className="w-full flex justify-between items-center p-3 text-left hover:bg-[#2C2C2C]"
                        >
                          <div>
                            <h4 className="font-medium text-[#F6F6F6]">{issue.title}</h4>
                            <p className="text-sm text-[#B1B1B1]">{issue.description}</p>
                          </div>
                          <i className={`fas fa-chevron-${expandedIssue === issue.id ? 'up' : 'down'} text-[#B1B1B1]`}></i>
                        </button>
                        
                        {expandedIssue === issue.id && (
                          <div className="p-4 border-t border-[#4B4B4B]">
                            <div className="mb-6">
                              <h5 className="font-medium mb-3 text-[#F6F6F6]">Step-by-step solution:</h5>
                              <ol className="space-y-4">
                                {issue.steps.map((step, index) => (
                                  <li key={index} className="flex">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#DFFF4E] flex items-center justify-center mr-3 text-[#1B1B1B] font-medium">
                                      {index + 1}
                                    </div>
                                    <div className="flex-1">
                                      <p className="mb-2 text-[#B1B1B1]">{step.text}</p>
                                      {step.image && (
                                        <img 
                                          src={step.image} 
                                          alt={`Step ${index + 1} illustration`} 
                                          className="rounded-lg border border-[#4B4B4B] max-w-full h-auto mb-2"
                                        />
                                      )}
                                      {step.note && (
                                        <div className="text-sm bg-[#B1B1B1] p-2 rounded border-l-4 border-yellow-400 text-[#1B1B1B]">
                                          <i className="fas fa-lightbulb mr-1"></i> {step.note}
                                        </div>
                                      )}
                                    </div>
                                  </li>
                                ))}
                              </ol>
                            </div>
                            
                            {issue.manufacturerLinks && issue.manufacturerLinks.length > 0 && (
                              <div className="mb-6">
                                <h5 className="font-medium mb-2 text-[#F6F6F6]">Manufacturer Support:</h5>
                                <div className="flex flex-wrap gap-2">
                                  {issue.manufacturerLinks.map((link, index) => (
                                    <a 
                                      key={index}
                                      href={link.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center px-3 py-1 bg-[#2C2C2C] hover:bg-[#B1B1B1] rounded-full text-sm"
                                    >
                                      <img 
                                        src={link.logo} 
                                        alt={link.name} 
                                        className="w-4 h-4 mr-2"
                                      />
                                      {link.name}
                                      <i className="fas fa-external-link-alt ml-1 text-xs"></i>
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            <div className="mb-6">
                              <h5 className="font-medium mb-3 text-[#F6F6F6]">Community solutions:</h5>
                              {issue.communitySolutions && issue.communitySolutions.length > 0 ? (
                                <div className="space-y-3">
                                  {issue.communitySolutions.map((solution, index) => (
                                    <div key={index} className="p-3 bg-[#2C2C2C] rounded-lg">
                                      <div className="flex items-start">
                                        <div className="flex-shrink-0 mr-3">
                                          <div className="w-8 h-8 rounded-full bg-[#4B4B4B] flex items-center justify-center text-[#B1B1B1]">
                                            <i className="fas fa-user"></i>
                                          </div>
                                        </div>
                                        <div className="flex-1">
                                          <div className="flex justify-between items-center mb-1">
                                            <span className="font-medium text-[#F6F6F6]">{solution.user}</span>
                                            <span className="text-xs text-[#B1B1B1]">{solution.date}</span>
                                          </div>
                                          <p className="text-sm text-[#B1B1B1]">{solution.text}</p>
                                          <div className="mt-2 flex items-center text-sm">
                                            <span className="text-[#DFFF4E] flex items-center mr-3">
                                              <i className="fas fa-thumbs-up mr-1"></i> {solution.likes}
                                            </span>
                                            <span className="text-[#B1B1B1]">
                                              {solution.deviceInfo}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-4 text-[#B1B1B1]">
                                  <p>No community solutions yet. Be the first to contribute!</p>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-[#4B4B4B]">
                              <button 
                                onClick={() => handleReportHelpful(issue.id)}
                                className="mb-3 sm:mb-0 px-4 py-2 bg-[#DFFF4E] hover:bg-[#B1B1B1] text-[#1B1B1B] rounded-lg flex items-center"
                              >
                                <i className="fas fa-check-circle mr-2"></i>
                                This solution helped me
                              </button>
                              <div className="flex space-x-2">
                                <button className="px-3 py-1 text-sm border border-[#4B4B4B] hover:bg-[#B1B1B1] rounded-lg">
                                  <i className="fas fa-share-alt mr-1"></i> Share
                                </button>
                                <button className="px-3 py-1 text-sm border border-[#4B4B4B] hover:bg-[#B1B1B1] rounded-lg">
                                  <i className="fas fa-flag mr-1"></i> Report
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-6 border-t border-[#4B4B4B] bg-[#2C2C2C]">
        <h3 className="text-lg font-inter-tight-medium mb-4 text-[#F6F6F6]">User-submitted solutions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userSubmittedSolutions.map((solution, index) => (
            <div key={index} className="p-4 bg-[#1B1B1B] rounded-lg border border-[#4B4B4B]">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  <div className="w-10 h-10 rounded-full bg-[#DFFF4E] flex items-center justify-center">
                    <span className="font-medium text-[#1B1B1B]">
                      {solution.user.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <span className="font-medium text-[#F6F6F6]">{solution.user}</span>
                      <span className="ml-2 text-xs bg-[#4B4B4B] text-[#F6F6F6] px-2 py-0.5 rounded-full">
                        {solution.category}
                      </span>
                    </div>
                    <span className="text-xs text-[#B1B1B1]">{solution.date}</span>
                  </div>
                  <h4 className="font-medium text-sm mb-1 text-[#F6F6F6]">{solution.title}</h4>
                  <p className="text-sm text-[#B1B1B1] mb-2">{solution.description}</p>
                  <div className="flex items-center text-xs text-[#B1B1B1]">
                    <span className="flex items-center mr-3">
                      <i className="fas fa-thumbs-up mr-1"></i> {solution.helpfulCount}
                    </span>
                    <span className="flex items-center">
                      <i className="fas fa-comment mr-1"></i> {solution.commentCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <button className="px-4 py-2 bg-[#DFFF4E] hover:bg-[#B1B1B1] text-[#1B1B1B] rounded-lg">
            View all user solutions
          </button>
        </div>
      </div>
    </div>
  );
}

function StoryComponent() {
  const [helpfulReports, setHelpfulReports] = React.useState({});
  
  const handleReportHelpful = (issueId) => {
    setHelpfulReports(prev => ({
      ...prev,
      [issueId]: (prev[issueId] || 0) + 1
    }));
  };

  const handleSearchIssues = (query) => {
    console.log(`Searching for: ${query}`);
  };

  const sampleConnectionSetup = {
    source: {
      name: "MacBook Pro",
      image: "/devices/macbook.png",
    },
    sourcePort: {
      name: "USB-C",
      type: "output"
    },
    target: {
      name: "LG UltraFine 5K",
      image: "/devices/lg-monitor.png",
    },
    targetPort: {
      name: "USB-C",
      type: "input"
    },
    commonIssues: [
      "Display may not wake from sleep when MacBook lid is closed",
      "Brightness controls may not work properly",
      "USB devices connected to the monitor may disconnect intermittently"
    ]
  };

  const defaultIssues = [
    {
      id: 1,
      name: "Display Issues",
      icon: "fa-desktop",
      color: "red",
      issues: [
        {
          id: 101,
          title: "Screen flickering",
          description: "The screen flickers intermittently.",
          steps: [
            { text: "Check the cable connections.", image: null, note: null },
            { text: "Update the display drivers.", image: null, note: null }
          ],
          manufacturerLinks: [],
          communitySolutions: []
        }
      ]
    }
  ];

  const defaultUserSolutions = [
    {
      user: "John Doe",
      category: "Display Issues",
      date: "2025-01-01",
      title: "Fix for screen flickering",
      description: "I found that updating the drivers solved the issue.",
      helpfulCount: 5,
      commentCount: 2
    }
  ];

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Troubleshooting Tips Component</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">With Connection Setup</h2>
        <MainComponent 
          connectionSetup={sampleConnectionSetup}
          commonIssues={defaultIssues}
          userSubmittedSolutions={defaultUserSolutions}
          onReportHelpful={handleReportHelpful}
          onSearchIssues={handleSearchIssues}
        />
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Without Connection Setup</h2>
        <MainComponent 
          commonIssues={defaultIssues}
          userSubmittedSolutions={defaultUserSolutions}
          onReportHelpful={handleReportHelpful}
          onSearchIssues={handleSearchIssues}
        />
      </div>
    </div>
  );
});
}