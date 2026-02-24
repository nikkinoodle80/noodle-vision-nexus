"use client";
import React from "react";



export default function Index() {
  return (function MainComponent() {
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState(null);
  const [error, setError] = React.useState(null);

  const testKeys = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/test-stripe-api-keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setResults(data.results);
      } else {
        setError(data.error || "Failed to test Stripe API keys");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-medium mb-4">Stripe API Key Tester</h2>

      <button
        onClick={testKeys}
        disabled={loading}
        className="px-4 py-2 bg-[#6567EF] text-white rounded hover:bg-[#5D646C] disabled:bg-[#8C8C8C]"
      >
        {loading ? "Testing..." : "Test Stripe API Keys"}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-800 rounded">
          {error}
        </div>
      )}

      {results && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Test Results</h3>
          <div className="space-y-4">
            <div className="p-3 border rounded">
              <h4 className="font-medium">Test Mode</h4>
              <div className="mt-2 space-y-1">
                <p>
                  API Key Configured:{" "}
                  {results.testMode.keyConfigured ? "✅" : "❌"}
                </p>
                {results.testMode.keyConfigured && (
                  <>
                    <p>
                      API Connection:{" "}
                      {results.testMode.apiConnection ? "✅" : "❌"}
                    </p>
                    {results.testMode.error && (
                      <p className="text-red-600">
                        Error: {results.testMode.error}
                      </p>
                    )}
                    {results.testMode.details && (
                      <p>
                        Available Balance:{" "}
                        {JSON.stringify(results.testMode.details)}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="p-3 border rounded">
              <h4 className="font-medium">Live Mode</h4>
              <div className="mt-2 space-y-1">
                <p>
                  API Key Configured:{" "}
                  {results.liveMode.keyConfigured ? "✅" : "❌"}
                </p>
                {results.liveMode.keyConfigured && (
                  <>
                    <p>
                      API Connection:{" "}
                      {results.liveMode.apiConnection ? "✅" : "❌"}
                    </p>
                    {results.liveMode.error && (
                      <p className="text-red-600">
                        Error: {results.liveMode.error}
                      </p>
                    )}
                    {results.liveMode.details && (
                      <p>
                        Available Balance:{" "}
                        {JSON.stringify(results.liveMode.details)}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm text-[#5D646C]">
            Tested at: {new Date(results.timestamp).toLocaleString()}
          </p>
        </div>
      )}

      <div className="mt-6 text-sm text-[#5D646C]">
        <h3 className="font-medium mb-1">Environment Variables Required:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>STRIPE_TEST_SECRET_KEY - For testing mode</li>
          <li>STRIPE_LIVE_SECRET_KEY - For production mode</li>
        </ul>
      </div>
    </div>
  );
}

function StoryComponent() {
  const { data: user, loading } = useUser();
  if (loading) return <div>Loading...</div>;
  if (!user || user.email !== "YOUR_ADMIN_EMAIL_HERE") {
    return (
      <div
        style={{
          color: "red",
          fontWeight: "bold",
          padding: 32,
          textAlign: "center",
        }}
      >
        Access Denied
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Stripe Key Tester Component</h1>
      <MainComponent />
    </div>
  );
});
}