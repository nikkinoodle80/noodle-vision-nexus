"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({ onEquipmentIdentified }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const identifyEquipment = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setProgress(0);
    setError(null);

    try {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const formData = new FormData();
      formData.append("image", file);

      await new Promise((resolve) => setTimeout(resolve, 3000));

      const simulatedResults = {
        identifiedDevices: [
          {
            id: 1,
            name: "Oculus Quest 2",
            type: "vr_headset",
            brand: "Meta",
            confidence: 0.92,
            is_vr_compatible: true,
            vr_tracking_type: "inside-out",
            vr_resolution: "1832x1920 per eye",
            vr_refresh_rate: 90,
            vr_field_of_view: 90,
          },
        ],
        possibleAdapters: [
          {
            id: 5,
            name: "USB-C to DisplayPort Adapter",
            input_type: "usb-c",
            output_type: "displayport",
            confidence: 0.85,
          },
        ],
      };

      clearInterval(progressInterval);
      setProgress(100);
      setResults(simulatedResults);

      if (onEquipmentIdentified) {
        onEquipmentIdentified(simulatedResults);
      }
    } catch (err) {
      setError("Failed to analyze equipment. Please try again.");
      console.error("Error identifying equipment:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-[#1B1B1B] rounded-lg p-6">
        <h3 className="text-xl font-inter-tight-medium text-[#F6F6F6] mb-4">
          VR Equipment Identifier
        </h3>
        <p className="mb-4 font-inter-tight-regular text-[#B1B1B1]">
          Upload a photo of your VR equipment, and we'll help identify it and
          analyze compatibility.
        </p>

        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        {preview && (
          <div className="mb-4">
            <img
              src={preview}
              alt="Equipment preview"
              className="max-h-64 rounded-lg mx-auto"
            />
          </div>
        )}

        {isAnalyzing && (
          <div className="mb-4">
            <p className="mb-2 font-inter-tight-regular text-[#B1B1B1]">
              Analyzing your equipment...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        {results && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-bold mb-2 font-inter-tight-medium text-[#F6F6F6]">
              Identified Equipment:
            </h4>
            <ul className="list-disc pl-5 mb-4 font-inter-tight-regular text-[#B1B1B1]">
              {results.identifiedDevices.map((device, index) => (
                <li key={index}>
                  {device.brand} {device.name} (
                  {Math.round(device.confidence * 100)}% confidence)
                </li>
              ))}
            </ul>

            {results.possibleAdapters.length > 0 && (
              <>
                <h4 className="font-bold mb-2 font-inter-tight-medium text-[#F6F6F6]">
                  Possible Adapters Needed:
                </h4>
                <ul className="list-disc pl-5 font-inter-tight-regular text-[#B1B1B1]">
                  {results.possibleAdapters.map((adapter, index) => (
                    <li key={index}>
                      {adapter.name} (
                      {Math.round(adapter.confidence * 100)}% confidence)
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}

        <button
          className={`inline-flex items-center px-4 py-2 text-sm font-medium text-[#1B1B1B] bg-[#DFFF4E] rounded-lg ${
            !file || isAnalyzing
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-[#2C2C2C] hover:text-[#F6F6F6]"
          }`}
          onClick={identifyEquipment}
          disabled={!file || isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 mr-2 border-2 border-t-2 border-[#1B1B1B] border-t-transparent rounded-full animate-spin"></div>
              Analyzing...
            </>
          ) : (
            "Identify Equipment"
          )}
        </button>
      </div>
      <style jsx global>{`
        @keyframes fade {
          from {
            background-color: #dfff4e;
            color: #1b1b1b;
          }
          to {
            background-color: #2c2c2c;
            color: #f6f6f6;
          }
        }
      `}</style>
    </div>
  );
}

function StoryComponent() {
  const [identifiedEquipment, setIdentifiedEquipment] = useState(null);

  const handleEquipmentIdentified = (results) => {
    setIdentifiedEquipment(results);
    console.log("Equipment identified:", results);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 font-inter-tight-medium text-[#F6F6F6]">
        VR Equipment Identifier
      </h2>

      <MainComponent onEquipmentIdentified={handleEquipmentIdentified} />

      {identifiedEquipment && (
        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 font-inter-tight-medium text-[#F6F6F6]">
            Parent Component Received:
          </h3>
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto font-inter-tight-regular text-[#B1B1B1]">
            {JSON.stringify(identifiedEquipment, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
});
}