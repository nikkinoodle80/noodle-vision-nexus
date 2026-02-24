"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({ onInventoryProcessed }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const { data: user } = useUser();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError(null);

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!previewImage) {
      setError('Please select an image to upload');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + Math.random() * 15;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 300);

      const response = await fetch('/api/process-inventory-upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: previewImage,
          userId: user?.id,
        }),
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to process inventory');
      }

      if (onInventoryProcessed) {
        onInventoryProcessed(data.inventory);
      }

      setPreviewImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err.message || 'Failed to upload inventory image');
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-blue-500', 'bg-blue-50');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];

      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB limit');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);

      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
      }
    }
  };

  return (
    <div className="bg-[#1B1B1B] rounded-lg p-6">
      <h3 className="text-lg font-inter-tight-medium text-[#F6F6F6] mb-4 flex items-center">
        <i className="fas fa-boxes mr-2 text-blue-500"></i>
        Upload Your Inventory
      </h3>

      <div className="space-y-4">
        <div
          className="border-2 border-dashed border-[#4B4B4B] rounded-lg p-6 text-center cursor-pointer transition-colors"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {previewImage ? (
            <div className="relative">
              <img
                src={previewImage}
                alt="Preview of uploaded inventory"
                className="max-h-64 mx-auto rounded-lg"
              />
              <button
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewImage(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
              >
                <i className="fas fa-times text-xs"></i>
              </button>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <i className="fas fa-camera text-blue-500 text-2xl"></i>
              </div>
              <p className="text-[#B1B1B1] mb-2 font-inter-tight-regular">
                Drag and drop an image of your inventory, or click to browse
              </p>
              <p className="text-xs text-[#B1B1B1] font-inter-tight-regular">
                Supported formats: JPG, PNG, WEBP (max 5MB)
              </p>
            </>
          )}

          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <i className="fas fa-exclamation-circle mr-1"></i>
            {error}
          </div>
        )}

        {isUploading ? (
          <div className="space-y-2">
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-[#B1B1B1] text-center font-inter-tight-regular">
              {uploadProgress < 100 ? 'Processing inventory...' : 'Processing complete!'}
            </p>
          </div>
        ) : (
          <button
            className="w-full py-2 px-4 bg-[#DFFF4E] hover:bg-[#2C2C2C] text-[#1B1B1B] hover:text-[#F6F6F6] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-inter-tight-regular"
            onClick={handleUpload}
            disabled={!previewImage}
          >
            <i className="fas fa-upload mr-2"></i>
            Upload & Process Inventory
          </button>
        )}

        <p className="text-xs text-[#B1B1B1] text-center font-inter-tight-regular">
          Our AI will analyze your image to identify adapters, cables, and devices
        </p>
      </div>
    </div>
  );
}

function StoryComponent() {
  const [inventory, setInventory] = useState(null);

  const handleInventoryProcessed = (data) => {
    setInventory(data);
    console.log("Inventory processed:", data);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-[#F6F6F6] font-inter-tight-medium">Inventory Uploader Component</h2>

      <MainComponent onInventoryProcessed={handleInventoryProcessed} />

      {inventory && (
        <div className="mt-8 bg-[#1B1B1B] rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-[#F6F6F6] font-inter-tight-medium">Processed Inventory</h3>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-blue-500 font-inter-tight-medium">Adapters</h4>
              <ul className="list-disc pl-5 mt-2">
                {inventory.adapters.map((adapter, index) => (
                  <li key={index} className="text-sm text-[#B1B1B1] font-inter-tight-regular">
                    {adapter.type} (Qty: {adapter.quantity}, Condition: {adapter.condition})
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-blue-500 font-inter-tight-medium">Devices</h4>
              <ul className="list-disc pl-5 mt-2">
                {inventory.devices.map((device, index) => (
                  <li key={index} className="text-sm text-[#B1B1B1] font-inter-tight-regular">
                    {device.brand} {device.model} ({device.type}) - Ports: {device.ports.join(', ')}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-blue-500 font-inter-tight-medium">Cables</h4>
              <ul className="list-disc pl-5 mt-2">
                {inventory.cables.map((cable, index) => (
                  <li key={index} className="text-sm text-[#B1B1B1] font-inter-tight-regular">
                    {cable.type} {cable.length} (Qty: {cable.quantity})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
}