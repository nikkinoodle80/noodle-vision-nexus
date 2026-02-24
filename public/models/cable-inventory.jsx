"use client";
import React from "react";

function MainComponent({ cableInventory, setCableInventory, cableMetrics }) {
  const getCableUsagePercentage = (cable) => {
    return (cable.inUse / cable.available) * 100;
  };

  const handleUpdateInventory = (type, field, value) => {
    setCableInventory({
      ...cableInventory,
      [type]: {
        ...cableInventory[type],
        [field]: parseFloat(value),
      },
    });
  };

  return (
    <div className="bg-[#1B1B1B] rounded-lg p-4">
      <h2 className="text-2xl font-inter text-[#F6F6F6] mb-4">
        Cable Inventory
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(cableInventory).map(([type, cable]) => (
          <div key={type} className="border border-[#4B4B4B] rounded-md p-3">
            <h3 className="font-inter text-[#B1B1B1] capitalize mb-2">
              {type} Cable
            </h3>

            <div className="mb-2">
              <div className="flex justify-between text-sm text-[#B1B1B1]">
                <span>Available: {cable.available}m</span>
                <span>In Use: {cable.inUse}m</span>
              </div>
              <div className="h-2 bg-[#2C2C2C] rounded-full mt-1">
                <div
                  className={`h-full rounded-full ${
                    getCableUsagePercentage(cable) < 50
                      ? "bg-green-500"
                      : getCableUsagePercentage(cable) < 80
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${getCableUsagePercentage(cable)}%` }}
                />
              </div>
            </div>

            <div className="text-sm text-[#B1B1B1]">
              Max Length: {cable.maxLength}m
            </div>

            {cableMetrics &&
              cableMetrics.signalQuality &&
              cableMetrics.signalQuality[type] && (
                <div className="mt-2 text-sm text-[#B1B1B1]">
                  <div>Signal Quality: {cableMetrics.signalQuality[type]}</div>
                  {cableMetrics.interference &&
                    cableMetrics.interference[type] && (
                      <div>Interference: {cableMetrics.interference[type]}</div>
                    )}
                </div>
              )}

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs block mb-1 text-[#B1B1B1]">
                  Available (m)
                </label>
                <input
                  type="number"
                  name={`${type}-available`}
                  className="w-full p-1 text-sm border border-[#4B4B4B] rounded-md bg-[#2C2C2C] text-[#F6F6F6]"
                  value={cable.available}
                  onChange={(e) =>
                    handleUpdateInventory(type, "available", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="text-xs block mb-1 text-[#B1B1B1]">
                  Max Length (m)
                </label>
                <input
                  type="number"
                  name={`${type}-maxLength`}
                  className="w-full p-1 text-sm border border-[#4B4B4B] rounded-md bg-[#2C2C2C] text-[#F6F6F6]"
                  value={cable.maxLength}
                  onChange={(e) =>
                    handleUpdateInventory(type, "maxLength", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StoryComponent() {
  const [cableInventory, setCableInventory] = React.useState({
    power: {
      available: 100,
      inUse: 45,
      maxLength: 20,
    },
    speaker: {
      available: 200,
      inUse: 120,
      maxLength: 30,
    },
    rca: {
      available: 50,
      inUse: 40,
      maxLength: 15,
    },
    digital: {
      available: 30,
      inUse: 5,
      maxLength: 10,
    },
    ground: {
      available: 80,
      inUse: 35,
      maxLength: 15,
    },
    usb: {
      available: 25,
      inUse: 20,
      maxLength: 5,
    },
  });

  const cableMetrics = {
    signalQuality: {
      power: "Good",
      speaker: "Good",
      rca: "Moderate",
      digital: "Good",
      ground: "Good",
      usb: "Good",
    },
    interference: {
      power: "Low",
      speaker: "Low",
      rca: "Medium",
      digital: "Low",
      ground: "Low",
      usb: "Low",
    },
  };

  return (
    <div className="p-4 bg-[#1B1B1B]">
      <MainComponent
        cableInventory={cableInventory}
        setCableInventory={setCableInventory}
        cableMetrics={cableMetrics}
      />
    </div>
  );
}

export default CableInventory;