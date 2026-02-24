"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({ readinessData, onRefresh }) {
  if (!readinessData) {
    return (
      <div className="bg-white shadow rounded-lg p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-2 bg-gray-200 rounded w-full mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded w-full mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }
  
  const { 
    isReady, 
    completionPercentage, 
    totalItems, 
    completedItems,
    stripeConfigured,
    envVarsConfigured,
    pendingIssues
  } = readinessData;
  
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Deployment Readiness</h2>
        <button 
          onClick={onRefresh}
          className="p-1 rounded-full hover:bg-gray-100"
          title="Refresh status"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">Overall completion</span>
          <span className="text-sm font-medium text-gray-700">{completedItems}/{totalItems} items</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${isReady ? 'bg-green-600' : 'bg-blue-600'}`} 
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>
      
      <div className="space-y-3 mb-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 h-5 w-5 rounded-full ${stripeConfigured ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'} flex items-center justify-center`}>
            {stripeConfigured ? (
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
            ) : (
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            )}
          </div>
          <span className="ml-3 text-sm text-gray-700">Stripe configuration</span>
        </div>
        
        <div className="flex items-center">
          <div className={`flex-shrink-0 h-5 w-5 rounded-full ${envVarsConfigured ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'} flex items-center justify-center`}>
            {envVarsConfigured ? (
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
            ) : (
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            )}
          </div>
          <span className="ml-3 text-sm text-gray-700">Environment variables</span>
        </div>
      </div>
      
      {pendingIssues && pendingIssues.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Pending issues:</h3>
          <ul className="text-sm text-gray-600 space-y-1 pl-5 list-disc">
            {pendingIssues.slice(0, 3).map((issue, index) => (
              <li key={index}>
                {issue.category}: {issue.item_name}
              </li>
            ))}
            {pendingIssues.length > 3 && (
              <li className="text-gray-500">
                +{pendingIssues.length - 3} more issues...
              </li>
            )}
          </ul>
        </div>
      )}
      
      <div className="mt-5 pt-5 border-t border-gray-200">
        <div className="flex items-center">
          <div className={`flex-shrink-0 h-8 w-8 rounded-full ${isReady ? 'bg-green-100 text-green-500' : 'bg-yellow-100 text-yellow-500'} flex items-center justify-center`}>
            {isReady ? (
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
              </svg>
            )}
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-900">
              {isReady ? 'Ready for deployment' : 'Not ready for deployment'}
            </h3>
            <p className="text-sm text-gray-500">
              {isReady 
                ? 'All checks have passed. You can proceed with deployment.' 
                : 'Please address the pending issues before deploying.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StoryComponent() {
  const [readinessData, setReadinessData] = React.useState({
    isReady: false,
    completionPercentage: 65,
    totalItems: 12,
    completedItems: 8,
    stripeConfigured: true,
    envVarsConfigured: false,
    pendingIssues: [
      { category: "Security", item_name: "Configure SSL Certificate" },
      { category: "Environment", item_name: "Set up production environment variables" },
      { category: "Database", item_name: "Configure database backup strategy" },
      { category: "Monitoring", item_name: "Set up error tracking" }
    ]
  });

  const handleRefresh = () => {
    console.log("Refreshing deployment readiness data");
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Deployment Readiness Card</h1>
      
      <div className="space-y-6">
        <MainComponent 
          readinessData={readinessData} 
          onRefresh={handleRefresh} 
        />
        
        <MainComponent 
          readinessData={{
            ...readinessData,
            isReady: true,
            completionPercentage: 100,
            completedItems: 12,
            envVarsConfigured: true,
            pendingIssues: []
          }} 
          onRefresh={handleRefresh} 
        />
        
        <MainComponent 
          readinessData={null} 
          onRefresh={handleRefresh} 
        />
      </div>
    </div>
  );
});
}