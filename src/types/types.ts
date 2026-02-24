export type Entitlement = 'freemium' | 'pro' | 'arena';
export interface Gear { id: string; tier: Entitlement; price: number; }
