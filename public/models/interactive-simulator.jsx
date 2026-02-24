"use client";
import React from "react";



export default function Index() {
  return (function MainComponent() {
  const [selectedDevice, setSelectedDevice] = React.useState({
    deviceType: "",
    brand: "",
    model: "",
    ports: "",
  });
  const [feedback, setFeedback] = React.useState("");
  const [suggestions, setSuggestions] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [imageURL, setImageURL] = React.useState("");

  const handleDeviceChange = (e) => {
    const { name, value } = e.target;
    setSelectedDevice((prev) => ({ ...prev, [name]: value }));
  };

  const handleSimulation = async () => {
    if (!selectedDevice.deviceType) {
      setFeedback("Please enter device details to simulate.");
      return;
    }

    try {
      const response = await fetch("/api/ai-simulation", {
        method: "POST",
        body: JSON.stringify({ device: selectedDevice.deviceType }),
      });
      const data = await response.json();

      if (data.success) {
        setSuggestions(data.suggestions);
        setFeedback("Simulation complete. Here are some suggestions:");
      } else {
        setFeedback("Simulation failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during simulation:", error);
      setError("An error occurred during the simulation.");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageURL(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-4">Interactive Simulator</h1>
        <></>
        <button
          onClick={handleSimulation}
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
        >
          Start Simulation
        </button>
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
        {error && <div className="mt-4 text-red-500">{error}</div>}
        <div className="mt-4">
          <label htmlFor="imageUpload" className="block text-gray-700">
            Upload Image:
          </label>
          <input
            type="file"
            id="imageUpload"
            name="imageUpload"
            accept="image/*"
            onChange={handleImageUpload}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
          {imageURL && (
            <div className="mt-2">
              <p>Uploaded Image URL: {imageURL}</p>
            </div>
          )}
        </div>
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