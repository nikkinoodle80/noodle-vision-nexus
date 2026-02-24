"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({
  mode: initialMode = "test",
  onTestComplete = () => {},
}) {
  const [testResults, setTestResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState(initialMode);
  const [error, setError] = useState(null);
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

  const runTest = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/test-api-keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mode, keyType: "all" }),
      });

      const results = await response.json();
      setTestResults(results);
      onTestComplete(results);

      if (!results.success) {
        setError(results.error || "Test failed");
      }
    } catch (err) {
      setError(err.message || "An error occurred during testing");
    } finally {
      setIsLoading(false);
    }
  };

  const testWebhookConnection = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/test-stripe-webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      const result = await response.json();
      setTestResults({
        ...testResults,
        webhookStatus: result.webhookStatus,
      });
      if (!result.success) {
        setError(result.error || "Webhook test failed");
      }
    } catch (error) {
      setError(error.message || "An error occurred during webhook testing");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Stripe Connection Tester</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Test Mode
        </label>
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded ${mode === "test" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setMode("test")}
          >
            Test Mode
          </button>
          <button
            className={`px-4 py-2 rounded ${mode === "live" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setMode("live")}
          >
            Live Mode
          </button>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          onClick={runTest}
          disabled={isLoading || !user}
        >
          {isLoading ? "Testing API..." : "Test API Connection"}
        </button>

        <button
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          onClick={testWebhookConnection}
          disabled={isLoading || !user}
        >
          {isLoading ? "Testing Webhook..." : "Test Webhook"}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {testResults && !error && (
        <div className="mt-4">
          <h3 className="font-medium text-lg mb-2">Test Results</h3>
          <div className="bg-gray-50 p-4 rounded border">
            <div className="flex items-center mb-2">
              <div
                className={`w-4 h-4 rounded-full mr-2 ${testResults.apiConnection ? "bg-green-500" : "bg-red-500"}`}
              ></div>
              <span>
                API Connection:{" "}
                {testResults.apiConnection ? "Success" : "Failed"}
              </span>
            </div>

            {testResults.webhookStatus && (
              <div className="flex items-center mb-2">
                <div
                  className={`w-4 h-4 rounded-full mr-2 ${testResults.webhookStatus.configured ? "bg-green-500" : "bg-yellow-500"}`}
                ></div>
                <span>Webhook: {testResults.webhookStatus.message}</span>
              </div>
            )}

            {testResults.webhookStatus && testResults.webhookStatus.url && (
              <div className="mt-2 text-sm">
                <p>
                  URL:{" "}
                  <span className="font-mono">
                    {testResults.webhookStatus.url}
                  </span>
                </p>
                <p>
                  Registered:{" "}
                  {testResults.webhookStatus.registered ? "Yes" : "No"}
                </p>
                {testResults.webhookStatus.events &&
                  testResults.webhookStatus.events.length > 0 && (
                    <div>
                      <p className="mt-1">Events:</p>
                      <ul className="list-disc list-inside ml-2">
                        {testResults.webhookStatus.events.map(
                          (event, index) => (
                            <li key={index}>{event}</li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
              </div>
            )}

            {testResults.errors && testResults.errors.length > 0 && (
              <div className="mt-2">
                <h4 className="font-medium">Errors:</h4>
                <ul className="list-disc pl-5">
                  {testResults.errors.map((err, i) => (
                    <li key={i} className="text-red-600">
                      {err}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-600">
        <p className="font-medium">How to set up Stripe webhooks:</p>
        <ol className="list-decimal list-inside mt-1 space-y-1">
          <li>
            Go to the{" "}
            <a
              href="https://dashboard.stripe.com/webhooks"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Stripe Dashboard → Developers → Webhooks
            </a>
          </li>
          <li>Click "Add endpoint"</li>
          <li>
            Enter your webhook URL:{" "}
            <code className="bg-gray-100 px-1 py-0.5 rounded">
              {typeof window !== "undefined" ? window.location.origin : ""}
              /api/stripe-webhook
            </code>
          </li>
          <li>
            Select events to listen for (recommended:
            checkout.session.completed, customer.subscription.*)
          </li>
          <li>
            Save the webhook secret and add it to your Stripe configuration
          </li>
        </ol>
      </div>
    </div>
  );
}

function StoryComponent() {
  const [testMode, setTestMode] = useState("test");
  const [lastTestResult, setLastTestResult] = useState(null);

  const handleTestComplete = (results) => {
    setLastTestResult(results);
    console.log("Test completed with results:", results);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">
          Stripe Connection Tester Demo
        </h1>
        <div className="flex space-x-4 mb-4">
          <button
            className={`px-4 py-2 rounded ${testMode === "test" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setTestMode("test")}
          >
            Show Test Mode
          </button>
          <button
            className={`px-4 py-2 rounded ${testMode === "live" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setTestMode("live")}
          >
            Show Live Mode
          </button>
        </div>
      </div>

      <MainComponent mode={testMode} onTestComplete={handleTestComplete} />

      {lastTestResult && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h3 className="font-medium mb-2">Last Test Result (Debug):</h3>
          <pre className="text-xs overflow-auto p-2 bg-gray-800 text-white rounded">
            {JSON.stringify(lastTestResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
});
}