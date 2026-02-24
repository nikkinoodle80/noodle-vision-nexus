// NOODLE-VISION NEXUS: ADAPTER CHAIN PHYSICS v1.0
// Logic: USB-C -> HDMI -> DP-XR (Signal Empathy & Impedance)
export const calculateImpedance = (r, xl, xc) => {
    return Math.sqrt(Math.pow(r, 2) + Math.pow((xl - xc), 2));
};
