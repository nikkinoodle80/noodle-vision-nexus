"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({ onRoomSelect, selectedRoomId, refreshTrigger }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRooms() {
      setLoading(true);
      try {
        const response = await fetch("/api/home-rooms", {
          method: "POST",
          body: JSON.stringify({}),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to load rooms: ${response.status} ${response.statusText}`,
          );
        }

        const data = await response.json();

        if (data.error) {
          setError(data.error);
        } else {
          setRooms(data.rooms || []);
        }
      } catch (err) {
        setError("Failed to load rooms: " + err.message);
        console.error("Error fetching rooms:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRooms();
  }, [refreshTrigger]);

  if (loading) return <div className="p-4 text-center">Loading rooms...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
  if (rooms.length === 0)
    return (
      <div className="p-4 text-center">
        No rooms found. Please add a room first.
      </div>
    );

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-medium mb-3">Select a Room</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {rooms.map((room) => (
          <div
            key={room.id}
            className={`p-3 border rounded-md cursor-pointer transition-colors ${
              selectedRoomId === room.id
                ? "bg-blue-100 border-blue-500"
                : "hover:bg-gray-50"
            }`}
            onClick={() => onRoomSelect(room)}
          >
            <div className="font-medium">{room.name}</div>
            <div className="text-sm text-gray-600">
              {room.room_type.replace("_", " ")}
            </div>
            {room.floor_level && (
              <div className="text-xs text-gray-500">
                Floor: {room.floor_level}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StoryComponent() {
  const [selectedRoom, setSelectedRoom] = useState(null);

  const mockRooms = [
    { id: 1, name: "Living Room", room_type: "Living Room", floor_level: 1 },
    { id: 2, name: "Master Bedroom", room_type: "Bedroom", floor_level: 2 },
    { id: 3, name: "Kitchen", room_type: "Kitchen", floor_level: 1 },
    { id: 4, name: "Home Office", room_type: "Office", floor_level: 2 },
    {
      id: 5,
      name: "Entertainment Room",
      room_type: "Media Room",
      floor_level: 1,
    },
  ];

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    console.log("Selected room:", room);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Room Selector Demo</h1>

      <div className="mb-6">
        <MainComponent
          onRoomSelect={handleRoomSelect}
          selectedRoomId={selectedRoom?.id}
        />
      </div>

      {selectedRoom && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-medium mb-2">Selected Room Details</h2>
          <p>
            <span className="font-medium">Name:</span> {selectedRoom.name}
          </p>
          <p>
            <span className="font-medium">Type:</span> {selectedRoom.room_type}
          </p>
          <p>
            <span className="font-medium">Floor:</span>{" "}
            {selectedRoom.floor_level}
          </p>
        </div>
      )}
    </div>
  );
});
}