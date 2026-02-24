"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({ onSubmit, initialData = {} }) {
  const [formData, setFormData] = useState({
    name: '',
    roomType: '',
    floorLevel: 1,
    squareFootage: '',
    notes: '',
    ...initialData
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const roomTypes = [
    "Living Room", "Bedroom", "Kitchen", "Dining Room", "Office", 
    "Entertainment Room", "Basement", "Attic", "Bathroom", "Other"
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.message || "Failed to save room");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}
      
      <div>
        <label className="block text-sm font-medium text-[#191919] mb-1">Room Name*</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-[#E4E7EA] rounded-md"
          placeholder="Living Room"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-[#191919] mb-1">Room Type*</label>
        <select
          name="roomType"
          value={formData.roomType}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-[#E4E7EA] rounded-md"
        >
          <option value="">Select Room Type</option>
          {roomTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#191919] mb-1">Floor Level</label>
          <input
            type="number"
            name="floorLevel"
            value={formData.floorLevel}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-[#E4E7EA] rounded-md"
            min="0"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#191919] mb-1">Square Footage</label>
          <input
            type="number"
            name="squareFootage"
            value={formData.squareFootage}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-[#E4E7EA] rounded-md"
            min="0"
            placeholder="Optional"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-[#191919] mb-1">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-[#E4E7EA] rounded-md"
          rows="3"
          placeholder="Any additional details about this room..."
        />
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-[#6567EF] text-white font-inter rounded hover:bg-[#5D646C] disabled:opacity-50"
        >
          {loading ? 'Saving...' : initialData.id ? 'Update Room' : 'Add Room'}
        </button>
      </div>
    </form>
  );
}

function StoryComponent() {
  const [submittedData, setSubmittedData] = useState(null);
  
  const handleSubmit = async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setSubmittedData(data);
        resolve(data);
      }, 1000);
    });
  };
  
  const initialRoom = {
    id: 1,
    name: "Master Bedroom",
    roomType: "Bedroom",
    floorLevel: 2,
    squareFootage: 250,
    notes: "North-facing windows with good natural light"
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-medium mb-6 text-[#191919] font-inter">Home Room Form</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-4 border border-[#E4E7EA] rounded-lg">
          <h2 className="text-lg font-medium mb-4 text-[#191919] font-inter">Create New Room</h2>
          <MainComponent onSubmit={handleSubmit} />
        </div>
        
        <div className="p-4 border border-[#E4E7EA] rounded-lg">
          <h2 className="text-lg font-medium mb-4 text-[#191919] font-inter">Edit Existing Room</h2>
          <MainComponent onSubmit={handleSubmit} initialData={initialRoom} />
        </div>
      </div>
      
      {submittedData && (
        <div className="mt-8 p-4 bg-[#F6F6F6] rounded-lg border border-[#E4E7EA]">
          <h2 className="text-lg font-medium mb-2 text-[#191919] font-inter">Last Submitted Data:</h2>
          <pre className="bg-white p-4 rounded overflow-auto">
            {JSON.stringify(submittedData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
});
}