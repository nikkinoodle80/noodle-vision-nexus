"use client";
import React from "react";



export default function Index() {
  return (function MainComponent() {
  const [formData, setFormData] = useState({
    test_secret_key: '',
    live_secret_key: '',
    test_webhook_secret: '',
    live_webhook_secret: '',
    test_webhook_url: '',
    live_webhook_url: '',
    basic_price_id: '',
    pro_price_id: '',
    enterprise_price_id: '',
    is_test_mode: true,
    use_env_variables: false,
    env_prefix: 'STRIPE_'
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const { data: user } = useUser();
  
  useEffect(() => {
    async function loadConfig() {
      if (!user) return;
      
      try {
        const response = await fetch('/api/get-stripe-configuration', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const data = await response.json();
        
        if (data.exists && data.config) {
          setFormData({
            ...data.config,
            use_env_variables: data.config.use_env_variables || false,
            env_prefix: data.config.env_prefix || 'STRIPE_'
          });
        }
      } catch (err) {
        setError("Failed to load configuration");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    loadConfig();
  }, [user]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    
    try {
      const response = await fetch('/api/save-stripe-configuration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage(data.message || "Configuration saved successfully");
        
        if (data.usingEnvVariables) {
          setMessage((prev) => `${prev}. Your keys are now secure! Remember to set up your environment variables.`);
        }
      } else {
        setError(data.error || "Failed to save configuration");
      }
    } catch (err) {
      setError("An error occurred while saving");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return <div className="p-4 text-center">Loading configuration...</div>;
  }
  
  if (!user) {
    return <div className="p-4">Please sign in to manage Stripe configuration</div>;
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Stripe Configuration</h2>
      
      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
          {message}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h3 className="text-lg font-semibold mb-2">Security Settings</h3>
          
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="use_env_variables"
                checked={formData.use_env_variables}
                onChange={handleChange}
                className="mr-2 h-5 w-5"
              />
              <span className="font-medium">Use Environment Variables (Recommended for Security)</span>
            </label>
            <p className="text-sm text-gray-600 mt-1">
              When enabled, API keys will be read from environment variables instead of being stored in the database.
              You'll need to set these variables in your hosting environment.
            </p>
          </div>
          
          {formData.use_env_variables && (
            <div className="mb-4">
              <label className="block mb-1 font-medium">Environment Variable Prefix</label>
              <input
                type="text"
                name="env_prefix"
                value={formData.env_prefix}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="STRIPE_"
              />
              <p className="text-sm text-gray-600 mt-1">
                Your environment variables should be named like: {formData.env_prefix}TEST_SECRET_KEY, {formData.env_prefix}LIVE_WEBHOOK_URL, etc.
              </p>
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">API Keys</h3>
          
          {!formData.use_env_variables ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-1 font-medium">Test Secret Key</label>
                  <input
                    type="password"
                    name="test_secret_key"
                    value={formData.test_secret_key || ''}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    placeholder="sk_test_..."
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Live Secret Key</label>
                  <input
                    type="password"
                    name="live_secret_key"
                    value={formData.live_secret_key || ''}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    placeholder="sk_live_..."
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-1 font-medium">Test Webhook Secret</label>
                  <input
                    type="password"
                    name="test_webhook_secret"
                    value={formData.test_webhook_secret || ''}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    placeholder="whsec_..."
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Live Webhook Secret</label>
                  <input
                    type="password"
                    name="live_webhook_secret"
                    value={formData.live_webhook_secret || ''}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    placeholder="whsec_..."
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-1 font-medium">Test Webhook URL</label>
                  <input
                    type="text"
                    name="test_webhook_url"
                    value={formData.test_webhook_url || ''}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    placeholder="https://your-app.com/api/stripe-webhook"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Live Webhook URL</label>
                  <input
                    type="text"
                    name="live_webhook_url"
                    value={formData.live_webhook_url || ''}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    placeholder="https://your-app.com/api/stripe-webhook"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="p-4 bg-blue-50 rounded mb-4">
              <p className="text-sm">
                Your API keys will be read from environment variables. Make sure to set these variables in your hosting environment:
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm">
                <li>{formData.env_prefix}TEST_SECRET_KEY</li>
                <li>{formData.env_prefix}LIVE_SECRET_KEY</li>
                <li>{formData.env_prefix}TEST_WEBHOOK_SECRET</li>
                <li>{formData.env_prefix}LIVE_WEBHOOK_SECRET</li>
                <li>{formData.env_prefix}TEST_WEBHOOK_URL</li>
                <li>{formData.env_prefix}LIVE_WEBHOOK_URL</li>
              </ul>
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Product Pricing</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block mb-1 font-medium">Basic Plan Price ID</label>
              <input
                type="text"
                name="basic_price_id"
                value={formData.basic_price_id || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="price_..."
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Pro Plan Price ID</label>
              <input
                type="text"
                name="pro_price_id"
                value={formData.pro_price_id || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="price_..."
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Enterprise Plan Price ID</label>
              <input
                type="text"
                name="enterprise_price_id"
                value={formData.enterprise_price_id || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="price_..."
              />
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Mode</h3>
          
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_test_mode"
                checked={formData.is_test_mode}
                onChange={handleChange}
                className="mr-2 h-5 w-5"
              />
              <span className="font-medium">Test Mode</span>
            </label>
            <p className="text-sm text-gray-600 mt-1">
              When enabled, all Stripe operations will use test keys and endpoints.
            </p>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
}

function StoryComponent() {
  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <MainComponent />
    </div>
  );
});
}