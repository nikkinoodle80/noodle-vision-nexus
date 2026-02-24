"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({ item, onStatusChange }) {
  const [isCompleted, setIsCompleted] = useState(item?.is_completed || false);
  const [notes, setNotes] = useState(item?.notes || '');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleStatusChange = async (newStatus) => {
    setIsSaving(true);
    setIsCompleted(newStatus);
    
    try {
      const result = await fetch('/api/update-checklist-item', {
        method: 'POST',
        body: JSON.stringify({
          id: item.id,
          is_completed: newStatus,
          notes
        })
      });
      
      const data = await result.json();
      
      if (data.success) {
        if (onStatusChange) {
          onStatusChange(data.item);
        }
      } else {
        // Revert on error
        setIsCompleted(item.is_completed);
        console.error("Failed to update item:", data.error);
      }
    } catch (error) {
      console.error("Error updating checklist item:", error);
      setIsCompleted(item.is_completed);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleNotesChange = async () => {
    setIsSaving(true);
    
    try {
      const result = await fetch('/api/update-checklist-item', {
        method: 'POST',
        body: JSON.stringify({
          id: item.id,
          notes
        })
      });
      
      const data = await result.json();
      
      if (!data.success) {
        console.error("Failed to update notes:", data.error);
      }
    } catch (error) {
      console.error("Error updating notes:", error);
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="border rounded-md p-4 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <input
              type="checkbox"
              checked={isCompleted}
              onChange={(e) => handleStatusChange(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              disabled={isSaving}
            />
            {isSaving && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          <div>
            <h3 className={`font-medium ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {item?.item_name}
            </h3>
            <p className="text-sm text-gray-500">{item?.description}</p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-gray-600"
        >
          {isExpanded ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
      
      {isExpanded && (
        <div className="mt-4 pt-3 border-t">
          <label htmlFor={`notes-${item?.id}`} className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            id={`notes-${item?.id}`}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={handleNotesChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Add notes about this item..."
          />
          {item?.completed_at && (
            <p className="text-xs text-gray-500 mt-2">
              Completed on: {new Date(item.completed_at).toLocaleString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function StoryComponent() {
  const [items, setItems] = useState([
    {
      id: "1",
      item_name: "Configure SSL Certificate",
      description: "Set up SSL certificate for secure connections",
      is_completed: false,
      notes: "",
      category: "security"
    },
    {
      id: "2",
      item_name: "Set up Environment Variables",
      description: "Configure all required environment variables for production",
      is_completed: true,
      notes: "Added all variables from the .env.example file",
      completed_at: "2025-03-15T14:30:00Z",
      category: "configuration"
    },
    {
      id: "3",
      item_name: "Database Backup Strategy",
      description: "Implement automated database backups",
      is_completed: false,
      notes: "Need to decide between daily or hourly backups",
      category: "database"
    }
  ]);

  const handleStatusChange = (updatedItem) => {
    setItems(items.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-gray-50">
      <h2 className="text-xl font-bold mb-4">Deployment Checklist Items</h2>
      <div className="space-y-3">
        {items.map(item => (
          <MainComponent 
            key={item.id} 
            item={item} 
            onStatusChange={handleStatusChange} 
          />
        ))}
      </div>
    </div>
  );
});
}