"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({ onTestComplete, apiKey, className }) {
  const [testingStripe, setTestingStripe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const testStripeConnection = async () => {
    try {
      setTestingStripe(true);
      setErrorMessage("");
      
      const response = await fetch('/api/test-stripe-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ apiKey: apiKey || "" })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to test Stripe connection: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      if (onTestComplete) {
        onTestComplete(result);
      }
    } catch (error) {
      console.error("Stripe test error:", error);
      setErrorMessage(error.message);
      if (onTestComplete) {
        onTestComplete({
          success: false,
          timestamp: new Date().toISOString(),
          stripe: {
            connected: false,
            message: "Error testing Stripe connection",
            error: error.message
          }
        });
      }
    } finally {
      setTestingStripe(false);
    }
  };

  return (
    <div>
      <button 
        onClick={testStripeConnection}
        className={`px-4 py-2 bg-[#6567EF] text-white rounded-md hover:bg-[#5D646C] transition-colors disabled:opacity-70 ${className || ""}`}
        disabled={testingStripe}
        type="button"
      >
        {testingStripe ? "Testing..." : "Test Stripe Connection"}
      </button>
      
      {errorMessage && (
        <div className="mt-2 text-red-600 text-sm">
          {errorMessage}
        </div>
      )}
    </div>
  );
}

function StoryComponent() {
  const [testResult, setTestResult] = useState(null);
  const [customApiKey, setCustomApiKey] = useState("");
  
  const handleTestComplete = (result) => {
    setTestResult(result);
    console.log("Test completed with result:", result);
  };

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-xl font-medium text-[#191919]">Stripe Test Button</h2>
      
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-medium text-[#5D646C] mb-2">Default Button</h3>
          <MainComponent onTestComplete={handleTestComplete} />
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-[#5D646C] mb-2">Custom API Key</h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              name="apiKey"
              value={customApiKey}
              onChange={(e) => setCustomApiKey(e.target.value)}
              placeholder="Enter Stripe API Key"
              className="border rounded-md px-3 py-2 flex-grow"
            />
            <MainComponent 
              onTestComplete={handleTestComplete} 
              apiKey={customApiKey}
            />
          </div>
          <p className="text-sm text-[#8C8C8C] mt-1">
            Example: REDACTED_BY_MCP
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-[#5D646C] mb-2">Custom Styling</h3>
          <MainComponent 
            onTestComplete={handleTestComplete} 
            className="bg-blue-500 hover:bg-blue-600 rounded-full"
          />
        </div>
        
        {testResult && (
          <div className={`p-4 rounded-md mt-6 ${testResult.stripe?.connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <p className="font-medium">{testResult.stripe?.message}</p>
            {!testResult.stripe?.connected && testResult.stripe?.error && (
              <p className="mt-2">{testResult.stripe.error}</p>
            )}
            {testResult.stripe?.connected && testResult.stripe?.details && (
              <div className="mt-2">
                <p><span className="font-medium">Mode:</span> {testResult.stripe.details.mode}</p>
                <p><span className="font-medium">Account ID:</span> {testResult.stripe.details.account?.id}</p>
                <p><span className="font-medium">Country:</span> {testResult.stripe.details.account?.country}</p>
                <p><span className="font-medium">Capabilities:</span> {testResult.stripe.details.capabilities?.join(', ') || 'None'}</p>
                {testResult.stripe.details.available && (
                  <div className="mt-2">
                    <p className="font-medium">Available Balances:</p>
                    <ul className="list-disc list-inside">
                      {testResult.stripe.details.available.map((bal, index) => (
                        <li key={index}>{bal.currency.toUpperCase()}: {(bal.amount / 100).toFixed(2)}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <p><span className="font-medium">Timestamp:</span> {new Date(testResult.timestamp).toLocaleString()}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});
}
