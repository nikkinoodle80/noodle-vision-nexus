"use client";
import React from "react";

function MainComponent() {
  const { data: user, loading } = useUser();
  const [modules, setModules] = React.useState([
    {
      id: 1,
      type: "AV Receiver",
      x: 1,
      y: 1,
      desc: "Central hub for audio/video sources and outputs.",
    },
    {
      id: 2,
      type: "Speaker",
      x: 4,
      y: 1,
      desc: "Outputs audio from the receiver or amp.",
    },
    {
      id: 3,
      type: "Projector",
      x: 1,
      y: 4,
      desc: "Displays video from sources like Blu-ray or streaming.",
    },
    {
      id: 4,
      type: "Synth",
      x: 4,
      y: 4,
      desc: "Generates audio signals for music production.",
    },
    {
      id: 5,
      type: "Mixer",
      x: 2,
      y: 2,
      desc: "Combines multiple audio signals into one output.",
    },
    {
      id: 6,
      type: "HDMI Adapter",
      x: 3,
      y: 3,
      desc: "Converts HDMI to other formats (e.g., RCA, USB).",
    },
    {
      id: 7,
      type: "RCA Adapter",
      x: 2,
      y: 5,
      desc: "Converts RCA to other formats (e.g., XLR, HDMI).",
    },
    {
      id: 8,
      type: "XLR Adapter",
      x: 5,
      y: 2,
      desc: "Converts XLR to other formats (e.g., RCA, USB).",
    },
    {
      id: 9,
      type: "USB Audio Interface",
      x: 5,
      y: 5,
      desc: "Connects audio gear to computers via USB.",
    },
    {
      id: 10,
      type: "External Circuit",
      x: 3,
      y: 1,
      desc: "Represents custom or external wiring/circuit.",
    },
    {
      id: 11,
      type: "Audio to Video Adapter",
      x: 6,
      y: 1,
      desc: "Bridges audio signals to video-compatible outputs (e.g., embed audio in HDMI).",
    },
    {
      id: 12,
      type: "Video to Audio Adapter",
      x: 6,
      y: 2,
      desc: "Extracts audio from video signals (e.g., HDMI audio extractor).",
    },
    {
      id: 13,
      type: "Analog to Digital Adapter",
      x: 6,
      y: 3,
      desc: "Converts analog signals (RCA/XLR) to digital (USB/HDMI).",
    },
    {
      id: 14,
      type: "Digital to Analog Adapter",
      x: 6,
      y: 4,
      desc: "Converts digital signals (USB/HDMI) to analog (RCA/XLR).",
    },
    {
      id: 15,
      type: "HDMI Splitter",
      x: 6,
      y: 5,
      desc: "Splits one HDMI signal into multiple outputs.",
    },
    {
      id: 16,
      type: "Audio Splitter",
      x: 6,
      y: 6,
      desc: "Splits one audio signal into multiple outputs.",
    },
    {
      id: 17,
      type: "AVR",
      x: 1,
      y: 6,
      desc: "Audio/Video Receiver for home theater.",
    },
    {
      id: 18,
      type: "VR Headset",
      x: 2,
      y: 6,
      desc: "Virtual Reality headset device.",
    },
    {
      id: 19,
      type: "AR Glasses",
      x: 3,
      y: 6,
      desc: "Augmented Reality glasses device.",
    },
    { id: 20, type: "Car Stereo", x: 4, y: 6, desc: "Car audio head unit." },
    {
      id: 21,
      type: "PC",
      x: 5,
      y: 6,
      desc: "Personal Computer (desktop/laptop).",
    },
    {
      id: 22,
      type: "VGA to HDMI Adapter",
      x: 1,
      y: 7,
      desc: "Converts VGA to HDMI.",
    },
    {
      id: 23,
      type: "HDMI to VGA Adapter",
      x: 2,
      y: 7,
      desc: "Converts HDMI to VGA.",
    },
    {
      id: 24,
      type: "USB-C to USB Adapter",
      x: 3,
      y: 7,
      desc: "Converts USB-C to USB-A.",
    },
  ]);
  const [draggedId, setDraggedId] = React.useState(null);
  const [showHelp, setShowHelp] = React.useState(null);
  const [view, setView] = React.useState("front");
  const [cables, setCables] = React.useState([]);
  const [patching, setPatching] = React.useState(null);
  const [cableToRemove, setCableToRemove] = React.useState(null);
  const [colorBlindMode, setColorBlindMode] = React.useState(false);

  const [_, setRerender] = React.useState(0);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const id = setInterval(() => {
      setRerender((r) => r + 1);
    }, 100);
    return () => clearInterval(id);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-800 font-roboto">
            Sign in required
          </h1>
          <p className="mb-6 text-gray-600 font-roboto">
            Please sign in to access the app.
          </p>
          <a
            href="/account/signin"
            className="inline-block rounded-lg bg-[#357AFF] px-4 py-3 text-base font-medium text-white transition-colors hover:bg-[#2E69DE] focus:outline-none focus:ring-2 focus:ring-[#357AFF] focus:ring-offset-2 font-roboto"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  const onDragStart = (id) => setDraggedId(id);
  const onDragEnd = () => setDraggedId(null);
  const onDrop = (x, y) => {
    if (draggedId) {
      setModules((mods) =>
        mods.map((m) => (m.id === draggedId ? { ...m, x, y } : m))
      );
      setDraggedId(null);
    }
  };

  const onJackClick = (modId, jackType, signalType) => {
    if (!patching) {
      setPatching({ fromId: modId, fromType: jackType, type: signalType });
    } else if (
      patching.fromId !== modId &&
      patching.fromType !== jackType &&
      patching.type === signalType // Only allow patching same signal type
    ) {
      // Prevent duplicate cables
      const exists = cables.some(
        (c) =>
          c.fromId === patching.fromId &&
          c.fromType === patching.fromType &&
          c.toId === modId &&
          c.toType === jackType &&
          c.type === patching.type
      );
      if (!exists) {
        setCables((c) => [
          ...c,
          {
            fromId: patching.fromId,
            fromType: patching.fromType,
            toId: modId,
            toType: jackType,
            type: patching.type,
          },
        ]);
      }
      setPatching(null);
    } else {
      setPatching(null);
    }
  };

  const gridSize = 6;
  const grid = [];
  for (let y = 1; y <= gridSize; y++) {
    const row = [];
    for (let x = 1; x <= gridSize; x++) {
      const mod = modules.find((m) => m.x === x && m.y === y);
      let modContent = null;
      if (mod) {
        const isHelpVisible = showHelp === mod.id;
        modContent = (
          <div
            draggable
            onDragStart={() => onDragStart(mod.id)}
            onDragEnd={onDragEnd}
            className="relative flex h-24 w-24 flex-col items-center justify-center rounded-xl border border-blue-300 bg-gradient-to-br from-gray-200 via-blue-100 to-blue-200 shadow-2xl cursor-move transition-transform hover:scale-105 hover:shadow-blue-300/40"
          >
            <div className="flex w-full items-center justify-between px-2 pt-1">
              <span className="font-bold text-xs text-blue-900 font-roboto">
                {mod.type}
              </span>
              <button
                className="ml-2 text-blue-500 hover:text-blue-700"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowHelp(isHelpVisible ? null : mod.id);
                }}
                title="Show help"
                type="button"
              >
                ?
              </button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center gap-1">
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-center">
                  <div
                    className="h-4 w-4 rounded-full bg-black border-2 border-red-700 cursor-pointer"
                    title="Audio Input (-)"
                    onClick={() => onJackClick(mod.id, "input", "audio")}
                    style={{
                      boxShadow:
                        patching &&
                        patching.fromId === mod.id &&
                        patching.fromType === "input" &&
                        patching.type === "audio"
                          ? "0 0 0 4px #2563eb88"
                          : undefined,
                    }}
                  />
                  <span className="text-[10px] text-[#dcfd88] font-roboto flex items-center gap-1">
                    <span role="img" aria-label="Audio In">
                      🔈
                    </span>
                    In
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <div
                    className="h-4 w-4 rounded-full bg-red-600 border-2 border-black cursor-pointer"
                    title="Audio Output (+)"
                    onClick={() => onJackClick(mod.id, "output", "audio")}
                    style={{
                      boxShadow:
                        patching &&
                        patching.fromId === mod.id &&
                        patching.fromType === "output" &&
                        patching.type === "audio"
                          ? "0 0 0 4px #2563eb88"
                          : undefined,
                    }}
                  />
                  <span className="text-[10px] text-[#dcfd88] font-roboto flex items-center gap-1">
                    <span role="img" aria-label="Audio Out">
                      🔊
                    </span>
                    Out
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <div
                    className="h-4 w-4 rounded-full bg-blue-400 border-2 border-blue-700 cursor-pointer"
                    title="Video Input"
                    onClick={() => onJackClick(mod.id, "input", "video")}
                    style={{
                      boxShadow:
                        patching &&
                        patching.fromId === mod.id &&
                        patching.fromType === "input" &&
                        patching.type === "video"
                          ? "0 0 0 4px #2563eb88"
                          : undefined,
                    }}
                  />
                  <span className="text-[10px] text-[#dcfd88] font-roboto flex items-center gap-1">
                    <span role="img" aria-label="Video In">
                      🎥
                    </span>
                    In
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <div
                    className="h-4 w-4 rounded-full bg-blue-700 border-2 border-blue-400 cursor-pointer"
                    title="Video Output"
                    onClick={() => onJackClick(mod.id, "output", "video")}
                    style={{
                      boxShadow:
                        patching &&
                        patching.fromId === mod.id &&
                        patching.fromType === "output" &&
                        patching.type === "video"
                          ? "0 0 0 4px #2563eb88"
                          : undefined,
                    }}
                  />
                  <span className="text-[10px] text-[#dcfd88] font-roboto flex items-center gap-1">
                    <span role="img" aria-label="Video Out">
                      📺
                    </span>
                    Out
                  </span>
                </div>
              </div>
            </div>
            {isHelpVisible && (
              <div className="absolute left-0 top-0 z-10 w-full rounded-xl bg-white p-2 text-xs text-gray-700 shadow-lg border border-blue-200 font-roboto">
                {mod.desc}
              </div>
            )}
          </div>
        );
      }
      row.push(
        <div
          key={x + "," + y}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => onDrop(x, y)}
          className="relative flex h-28 w-28 items-center justify-center border border-gray-200 bg-[#01050a] bg-[url('blob:https://www.create.xyz/d047e8c7-040b-4240-8c6f-d5417974450f')] transition-colors hover:bg-blue-50 text-[#070400]"
        >
          {modContent}
        </div>
      );
    }
    grid.push(
      <div key={y} className="flex flex-row gap-2">
        {row}
      </div>
    );
  }

  // Caustic 3 style cable animation: cables are thicker, more wavy, and have a subtle gradient
  const jackPositions = {
    // For each jack, define its offset from the module center
    // Order: [audio input, audio output, video input, video output]
    input: {
      audio: { dx: -28, dy: 0 }, // left
      video: { dx: 0, dy: 28 }, // bottom
    },
    output: {
      audio: { dx: 28, dy: 0 }, // right
      video: { dx: 0, dy: -28 }, // top
    },
  };

  const cableLines = cables.map((c, i) => {
    const fromMod = modules.find((m) => m.id === c.fromId);
    const toMod = modules.find((m) => m.id === c.toId);
    if (!fromMod || !toMod) return null;
    const cellSize = 112;
    const offset = 56;
    // Jack offsets: snap to center of port (use jackPositions)
    function getJackOffset(jackType, signalType) {
      return jackPositions[jackType][signalType] || { dx: 0, dy: 0 };
    }
    const fromOffset = getJackOffset(c.fromType, c.type);
    const toOffset = getJackOffset(c.toType, c.type);
    const fromX = (fromMod.x - 1) * cellSize + offset + fromOffset.dx;
    const fromY = (fromMod.y - 1) * cellSize + offset + fromOffset.dy;
    const toX = (toMod.x - 1) * cellSize + offset + toOffset.dx;
    const toY = (toMod.y - 1) * cellSize + offset + toOffset.dy;
    const color =
      c.type === "audio" ? "url(#audioGradient)" : "url(#videoGradient)";
    // More pronounced wave for Caustic 3 style
    const wave = Math.sin(Date.now() / 200 + i * 2) * 24;
    const midX = (fromX + toX) / 2 + wave;
    const midY = (fromY + toY) / 2 - wave;
    return (
      <g key={i}>
        <path
          d={`M${fromX},${fromY} Q${midX},${midY} ${toX},${toY}`}
          stroke={color}
          strokeWidth={10}
          fill="none"
          opacity={0.98}
          style={{
            filter:
              cableToRemove === i
                ? "drop-shadow(0 0 16px #f87171)"
                : "drop-shadow(0 0 8px #0004)",
            cursor: "pointer",
          }}
          className="cable-animate"
          onClick={() => setCableToRemove(i)}
        />
        <path
          d={`M${fromX},${fromY} Q${midX},${midY} ${toX},${toY}`}
          stroke="#fff"
          strokeWidth={4}
          fill="none"
          opacity={0.7}
          className="cable-pulse"
          style={{ pointerEvents: "none" }}
        />
      </g>
    );
  });

  // Remove cable confirmation
  const handleRemoveCable = () => {
    if (cableToRemove !== null) {
      setCables((c) => c.filter((_, idx) => idx !== cableToRemove));
      setCableToRemove(null);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#440505] p-4 flex flex-col items-center text-[#070400] font-extra-light">
      <h1 className="mb-4 text-3xl font-bold text-[#e3ebf5] font-roboto">
        Modular Patchbay
      </h1>
      <div className="mb-2 flex items-center gap-2">
        <label className="text-sm font-medium text-[#e8effb]">
          Color-blind Mode
        </label>
        <input
          type="checkbox"
          checked={colorBlindMode}
          onChange={() => setColorBlindMode((v) => !v)}
          className="accent-blue-600"
        />
      </div>
      <button
        className="mb-4 rounded-lg bg-blue-100 px-4 py-2 text-blue-700 font-medium border border-blue-300 hover:bg-blue-200"
        onClick={() => setShowHelp(showHelp === "howto" ? null : "howto")}
      >
        How to Use
      </button>
      {showHelp === "howto" && (
        <div className="mb-4 w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl border border-blue-200 text-gray-800 text-base font-roboto z-20 relative">
          <h2 className="text-xl font-bold mb-2">
            How to Use the Modular Patchbay
          </h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Drag modules around the grid to arrange your setup.</li>
            <li>
              Tap any input or output jack (colored circles) on a module to
              start a patch cable. The jack will highlight.
            </li>
            <li>
              Tap a matching jack on another module to finish the cable. Audio
              and video cables are color-coded and animated.
            </li>
            <li>To remove a cable, tap the cable and confirm removal below.</li>
            <li>
              Use the <b>Front/Rear View</b> buttons to toggle between different
              module layouts.
            </li>
            <li>
              Tap the <b>?</b> on any module for a quick description.
            </li>
            <li>
              Adapter modules (e.g., HDMI Adapter, Audio to Video Adapter) let
              you bridge different signal types.
            </li>
          </ol>
          <div className="mt-4 text-sm text-gray-600">
            Tip: You can patch as many cables as you want. To remove a cable,
            tap it and confirm below.
          </div>
          <button
            className="mt-4 rounded bg-blue-500 text-white px-4 py-2 hover:bg-blue-600"
            onClick={() => setShowHelp(null)}
          >
            Close
          </button>
        </div>
      )}
      {cableToRemove !== null && (
        <div className="mb-4 w-full max-w-md rounded-xl bg-red-50 p-4 shadow border border-red-200 text-red-700 text-base font-roboto z-30 relative flex flex-col items-center">
          <div className="mb-2">Remove this cable?</div>
          <button
            className="rounded bg-red-500 text-white px-4 py-2 hover:bg-red-600"
            onClick={handleRemoveCable}
          >
            Remove Cable
          </button>
          <button
            className="mt-2 rounded bg-gray-200 text-gray-700 px-4 py-2 hover:bg-gray-300"
            onClick={() => setCableToRemove(null)}
          >
            Cancel
          </button>
        </div>
      )}
      <div className="mb-4 flex gap-2">
        <button
          className={`rounded-lg px-4 py-2 font-medium ${
            view === "front"
              ? "bg-blue-500 text-white"
              : "bg-white text-blue-500 border border-blue-500"
          }`}
          onClick={() => setView("front")}
        >
          Front View
        </button>
        <button
          className={`rounded-lg px-4 py-2 font-medium ${
            view === "rear"
              ? "bg-blue-500 text-white"
              : "bg-white text-blue-500 border border-blue-500"
          }`}
          onClick={() => setView("rear")}
        >
          Rear View
        </button>
      </div>
      <div className="relative">
        <div className="flex flex-col gap-2 relative z-10">{grid}</div>
        <svg
          width={gridSize * 112}
          height={gridSize * 112}
          className="absolute left-0 top-0 z-30 pointer-events-none"
        >
          <defs>
            <linearGradient id="audioGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
            <linearGradient id="videoGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#1e40af" />
            </linearGradient>
          </defs>
          {cableLines}
        </svg>
        {cables.length === 0 && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 rounded-xl px-6 py-4 shadow text-blue-700 font-bold text-lg border border-blue-200 z-20">
            Tap two jacks to patch a cable.
          </div>
        )}
      </div>
      <style jsx global>{`
        .cable-animate {
          animation: cableWave 1.2s infinite linear;
        }
        @keyframes cableWave {
          0% { filter: drop-shadow(0 0 8px #0004); }
          50% { filter: drop-shadow(0 0 16px #22c55e44); }
          100% { filter: drop-shadow(0 0 8px #0004); }
        }
        .jack-patch {
          box-shadow: 0 0 0 4px #2563eb88;
          border-color: #2563eb !important;
        }
        .cable-pulse {
          stroke-dasharray: 32 64;
          stroke-dashoffset: 0;
          animation: cablePulse 1.2s linear infinite;
        }
        @keyframes cablePulse {
          0% { stroke-dashoffset: 96; }
          100% { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}

export default MainComponent;