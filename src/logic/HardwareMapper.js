export const hardwareDNA = {
  alignment: "Pittsburgh Cell 120",
  strobeGuard: "ON",
  markup: 1.30
};

export const mapHardwareToLogic = (ports) => {
  return ports.map(p => ({
    ...p,
    status: "Active",
    visualizer: "adapter-visualizer.jsx",
    markupPrice: (p.basePrice || 0) * hardwareDNA.markup
  }));
};
