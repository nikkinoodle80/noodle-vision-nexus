export type Plan = "core" | "proactive" | "max";
export interface UserState {
  userId: string;
  plan: Plan;
  roomId: string;                 // current room
  roomSettings: Record<string, any>; // per-room overrides
}

const KEY = "nv_session_v1";

export const loadSession = (): UserState => {
  const raw = localStorage.getItem(KEY);
  if (raw) return JSON.parse(raw);
  return { userId: crypto.randomUUID(), plan: "proactive", roomId: "entry", roomSettings: {} };
};

export const saveSession = (s: UserState) => localStorage.setItem(KEY, JSON.stringify(s));

export const hasFeature = (plan: Plan, feature: string, model: any) =>
  (model.plans[plan]?.features || []).includes(feature);