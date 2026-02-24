"use client";
import React from "react";

function EquipmentLibrary1({
  equipmentLibrary,
  setEquipmentLibrary,
  addToCart,
  showNewEquipmentForm,
  setShowNewEquipmentForm,
  newEquipment,
  setNewEquipment,
  addToRack,
  featuredModules,
}) {
  return <div>{/* Render the equipment library */}</div>;
}

function MainComponent({
  equipmentLibrary,
  setEquipmentLibrary,
  addToCart,
  showNewEquipmentForm,
  setShowNewEquipmentForm,
  newEquipment,
  setNewEquipment,
  addToRack,
  featuredModules,
}) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterType, setFilterType] = React.useState("all");
  const [filterCategory, setFilterCategory] = React.useState("all");
  const [filterBrand, setFilterBrand] = React.useState("all");
  const [filterModel, setFilterModel] = React.useState("all");
  const [filterConnectionType, setFilterConnectionType] = React.useState("all");
  const [filterAdapterType, setFilterAdapterType] = React.useState("all");
  const [showDetails, setShowDetails] = React.useState(null);
  const [draggedItem, setDraggedItem] = React.useState(null);
  const [sortBy, setSortBy] = React.useState("name");
  const [viewMode, setViewMode] = React.useState("grid");
  const [sourceDevice, setSourceDevice] = React.useState("");
  const [targetDevice, setTargetDevice] = React.useState("");
  const [showUnconventional, setShowUnconventional] = React.useState(false);
  const [showCompatibilityWarnings, setShowCompatibilityWarnings] =
    React.useState(true);
  const [showPowerRequirements, setShowPowerRequirements] =
    React.useState(true);
  const [showCompatibilityFilter, setShowCompatibilityFilter] =
    React.useState(false);
  const [selectedDeviceForCompatibility, setSelectedDeviceForCompatibility] =
    React.useState("");
  const [showUnconventionalSection, setShowUnconventionalSection] =
    React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState("all");

  const filteredEquipment = equipmentLibrary
    .filter((item) => {
      return true;
    })
    .sort((a, b) => {
      return 0;
    });

  return (
    <EquipmentLibrary1
      equipmentLibrary={filteredEquipment}
      setEquipmentLibrary={setEquipmentLibrary}
      addToCart={addToCart}
      showNewEquipmentForm={showNewEquipmentForm}
      setShowNewEquipmentForm={setShowNewEquipmentForm}
      newEquipment={newEquipment}
      setNewEquipment={setNewEquipment}
      addToRack={addToRack}
      featuredModules={featuredModules}
    />
  );
}

function StoryComponent() {
  const sampleEquipmentLibrary = [
    {
      id: "1",
      name: "HDMI Cable",
      type: "cable",
      category: "accessories",
      brand: "Generic",
      price: 10.99,
      inStock: true,
      inputs: [{ type: "hdmi", name: "HDMI" }],
      outputs: [{ type: "hdmi", name: "HDMI" }],
      description: "High-speed HDMI cable for connecting devices.",
      specifications: { "Max Resolution": "4K" },
      image: "/hdmi-cable.png",
      sourceDevices: ["Laptop", "Desktop"],
      targetDevices: ["Monitor", "TV"],
      isUnconventional: false,
      verifiedWorking: true,
      powerRequired: false,
      adapterType: "video",
      maxResolution: "4K",
      audioSupport: true,
      knownIssues: [],
      deviceCategory: "accessories",
    },
  ];

  return (
    <div>
      <MainComponent
        equipmentLibrary={sampleEquipmentLibrary}
        setEquipmentLibrary={() => {}}
        addToCart={() => {}}
        showNewEquipmentForm={false}
        setShowNewEquipmentForm={() => {}}
        newEquipment={{}}
        setNewEquipment={() => {}}
        addToRack={() => {}}
        featuredModules={[]}
      />
    </div>
  );
}

export default EquipmentLibrary;