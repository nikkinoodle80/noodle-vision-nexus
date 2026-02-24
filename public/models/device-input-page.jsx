"use client";
import React from "react";



export default function Index() {
  return (function MainComponent() {
  const [deviceType, setDeviceType] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [ports, setPorts] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [feedback, setFeedback] = useState('');

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const handleSubmit = async () => {
    const aiSuggestions = await fetch('/api/ai-suggestions', {
      method: 'POST',
      body: JSON.stringify({ deviceType, brand, model, ports }),
    }).then(res => res.json());

    if (aiSuggestions.success) {
      setSuggestions(aiSuggestions.suggestions);
      setFeedback('Here are some suggested configurations based on your inputs.');
    } else {
      setFeedback('Could not fetch suggestions. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-4">Device Input</h1>
        <div className="space-y-4">
          <input
            type="text"
            name="deviceType"
            placeholder="Device Type"
            value={deviceType}
            onChange={handleInputChange(setDeviceType)}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="brand"
            placeholder="Brand"
            value={brand}
            onChange={handleInputChange(setBrand)}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="model"
            placeholder="Model"
            value={model}
            onChange={handleInputChange(setModel)}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="ports"
            placeholder="Ports"
            value={ports}
            onChange={handleInputChange(setPorts)}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleSubmit}
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
        {feedback && <div className="mt-4 text-gray-600">{feedback}</div>}
        {suggestions.length > 0 && (
          <ul className="mt-4 space-y-2">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="p-2 bg-gray-100 rounded">
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StoryComponent() {
  return (
    <div>
      <MainComponent />
    </div>
  );
});
}