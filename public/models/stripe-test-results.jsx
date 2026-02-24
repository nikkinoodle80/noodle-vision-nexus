"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({ testResult }) {
  if (!testResult) return null;

  return (
    <div className={`p-4 mb-4 rounded-md ${testResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
      <p className="font-bold">{testResult.message}</p>
      {testResult.success && testResult.accountDetails && (
        <div className="mt-2">
          <p>Account ID: {testResult.accountDetails.id}</p>
          <p>Business Type: {testResult.accountDetails.business_type}</p>
          <p>Email: {testResult.accountDetails.email}</p>
          <p>Country: {testResult.accountDetails.country}</p>
        </div>
      )}
      {!testResult.success && testResult.error && (
        <p className="mt-2">{testResult.error}</p>
      )}
    </div>
  );
}

function StoryComponent() {
  const successResult = {
    success: true,
    message: "Stripe connection successful!",
    accountDetails: {
      id: "acct_1234567890",
      business_type: "individual",
      email: "user@example.com",
      country: "US"
    }
  };

  const errorResult = {
    success: false,
    message: "Stripe connection failed",
    error: "Invalid API key provided"
  };

  const noDetailsResult = {
    success: true,
    message: "Connection successful but no details available"
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-4">Success Result</h2>
        <MainComponent testResult={successResult} />
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-4">Error Result</h2>
        <MainComponent testResult={errorResult} />
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-4">Success Without Details</h2>
        <MainComponent testResult={noDetailsResult} />
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-4">No Result (Empty State)</h2>
        <p className="text-gray-500 italic">Component returns null when no testResult is provided</p>
        <MainComponent testResult={null} />
      </div>
    </div>
  );
});
}