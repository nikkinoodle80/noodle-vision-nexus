"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({ setup, onSelect, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSetup, setEditedSetup] = useState(setup);
  
  const setupTypes = {
    "entertainment": { icon: "🎬", color: "bg-purple-100" },
    "smart_home": { icon: "🏠", color: "bg-blue-100" },
    "office": { icon: "💻", color: "bg-green-100" },
    "gaming": { icon: "🎮", color: "bg-red-100" },
    "audio": { icon: "🎵", color: "bg-yellow-100" }
  };

  const typeInfo = setupTypes[setup?.setup_type] || { icon: "📱", color: "bg-gray-100" };
  
  const handleEditClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };
  
  const handleSave = (e) => {
    e.stopPropagation();
    onEdit(editedSetup);
    setIsEditing(false);
  };
  
  const handleCancel = (e) => {
    e.stopPropagation();
    setEditedSetup(setup);
    setIsEditing(false);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedSetup(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleToggleComplete = (e) => {
    e.stopPropagation();
    setEditedSetup(prev => ({
      ...prev,
      is_complete: !prev.is_complete
    }));
  };

  if (isEditing) {
    return (
      <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow" onClick={e => e.stopPropagation()}>
        <div className={`p-4 ${typeInfo.color}`}>
          <div className="flex justify-between items-center">
            <select 
              name="setup_type" 
              value={editedSetup.setup_type}
              onChange={handleChange}
              className="bg-white/80 rounded px-2 py-1 text-sm"
            >
              <option value="entertainment">Entertainment</option>
              <option value="smart_home">Smart Home</option>
              <option value="office">Office</option>
              <option value="gaming">Gaming</option>
              <option value="audio">Audio</option>
            </select>
            <div className="flex space-x-2">
              <button 
                onClick={handleSave} 
                className="p-1 rounded bg-green-500 text-white px-2 text-sm"
              >
                Save
              </button>
              <button 
                onClick={handleCancel} 
                className="p-1 rounded bg-gray-300 text-gray-700 px-2 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <input
            type="text"
            name="name"
            value={editedSetup.name}
            onChange={handleChange}
            className="font-medium text-lg w-full border-b border-gray-300 mb-2 pb-1 focus:outline-none focus:border-blue-500"
            placeholder="Setup Name"
          />
          
          <textarea
            name="description"
            value={editedSetup.description || ""}
            onChange={handleChange}
            className="w-full border rounded-md p-2 text-sm text-gray-700 mt-2 focus:outline-none focus:border-blue-500"
            placeholder="Description"
            rows="2"
          />
          
          <div className="mt-3 flex justify-between items-center">
            <button
              onClick={handleToggleComplete}
              className={`px-2 py-1 rounded-full text-xs ${editedSetup.is_complete ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
            >
              {editedSetup.is_complete ? 'Complete' : 'In Progress'}
            </button>
            <span className="text-sm text-gray-500">
              {new Date(setup.updated_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className={`p-4 ${typeInfo.color}`}>
        <div className="flex justify-between items-center">
          <div className="text-2xl">{typeInfo.icon}</div>
          <div className="flex space-x-2">
            <button 
              onClick={handleEditClick} 
              className="p-1 rounded hover:bg-white/30"
            >
              ✏️
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(setup.id); }} 
              className="p-1 rounded hover:bg-white/30"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4 cursor-pointer" onClick={() => onSelect(setup)}>
        <h3 className="font-medium text-lg">{setup.name}</h3>
        {setup.room_name && <div className="text-sm text-gray-600">Room: {setup.room_name}</div>}
        <div className="text-sm text-gray-500 mt-1 capitalize">{setup.setup_type.replace('_', ' ')}</div>
        
        {setup.description && (
          <p className="mt-2 text-sm text-gray-700 line-clamp-2">{setup.description}</p>
        )}
        
        <div className="mt-3 flex justify-between items-center">
          <span className={`px-2 py-1 rounded-full text-xs ${setup.is_complete ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {setup.is_complete ? 'Complete' : 'In Progress'}
          </span>
          <span className="text-sm text-gray-500">
            {new Date(setup.updated_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}

function StoryComponent() {
  const mockSetups = [
    {
      id: 1,
      name: "Living Room Entertainment",
      setup_type: "entertainment",
      description: "Complete home theater setup with surround sound and smart TV integration",
      room_name: "Living Room",
      is_complete: true,
      updated_at: "2025-03-15T14:30:00Z"
    },
    {
      id: 2,
      name: "Smart Home Hub",
      setup_type: "smart_home",
      description: "Central hub for controlling all smart devices throughout the house",
      room_name: "Office",
      is_complete: false,
      updated_at: "2025-03-10T09:15:00Z"
    },
    {
      id: 3,
      name: "Gaming Station",
      setup_type: "gaming",
      description: "High-performance gaming setup with console and PC integration",
      room_name: "Bedroom",
      is_complete: true,
      updated_at: "2025-03-05T18:45:00Z"
    }
  ];

  const handleSelect = (setup) => {
    console.log("Selected setup:", setup);
  };

  const handleEdit = (setup) => {
    console.log("Edit setup:", setup);
  };

  const handleDelete = (id) => {
    console.log("Delete setup with ID:", id);
  };

  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Home Setup Cards</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockSetups.map(setup => (
          <MainComponent 
            key={setup.id}
            setup={setup}
            onSelect={handleSelect}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
});
}