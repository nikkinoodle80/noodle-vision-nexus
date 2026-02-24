"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({ start, end, onDragEnd }) {
  const [position, setPosition] = React.useState({ x: start.x, y: start.y });
  const [isDragging, setIsDragging] = React.useState(false);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    onDragEnd(position);
  };

  return (
    <svg
      className="absolute"
      style={{ left: 0, top: 0 }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <line
        x1={start.x}
        y1={start.y}
        x2={position.x}
        y2={position.y}
        stroke="black"
        strokeWidth="2"
        onMouseDown={handleMouseDown}
        className={
          isDragging ? "stroke-blue-500 animate-pulse" : "stroke-black"
        }
      />
    </svg>
  );
}

function StoryComponent() {
  const [cableEnd, setCableEnd] = React.useState({ x: 300, y: 300 });

  return (
    <div className="relative w-full h-[500px] bg-gray-100">
      <MainComponent
        start={{ x: 100, y: 100 }}
        end={cableEnd}
        onDragEnd={(newPosition) => setCableEnd(newPosition)}
      />
    </div>
  );
});
}