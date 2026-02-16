# CLAUDE.md - Noodle-VISION Nexus Architecture

**Last Updated:** 2026-02-06  
**Project:** Noodle-VISION Nexus - VR/AR Accessibility Platform  
**Owner:** Noodle (Noodle-VISION, Texas)

---

## 🛠️ Tech Stack

### Core Technologies
- **Frontend Framework:** React 18+ with TypeScript
- **Build Tool:** Vite
- **XR Engine:** React-XR (Three.js integration)
- **Deployment:** Vercel (primary), Netlify (backup)

### Backend Services
- **Database (Primary):** Supabase (PostgreSQL with real-time subscriptions)
- **Database (Secondary):** Neon (serverless Postgres for analytics)
- **AI Platform:** Anything.com (LLM integration for accessibility features)
- **Storage:** Supabase Storage (equipment profiles, user assets)

### Infrastructure
- **API Gateway:** Vercel Edge Functions
- **WebSockets:** Supabase Realtime + custom websocket-server.js
- **MCP Integration:** Model Context Protocol for file system operations
- **Service Worker:** offline.html + service-worker.js for PWA functionality

---

## 🔌 Hardware Logic: Scientific Port Emulation

### Core Principle
**Modular Synthesizer Patch Cable Logic Applied to Audio/Video Equipment**

Noodle-VISION simulates physical equipment connections in VR/AR space before live deployment. Users test unlimited "Ghost-to-Native" equipment configurations without purchasing physical adapters.

### Port Emulation Rules

#### **Denon Coordinate System**
```
X-Axis: Signal Flow (Input → Output)
Y-Axis: Voltage Level (Line Level, Mic Level, Instrument Level)
Z-Axis: Impedance Matching (Low-Z, Hi-Z)

Reference Coordinates (Denon AVR-X6700H):
- XLR Balanced Input: [0.0, +4dBu, 600Ω]
- RCA Line Input: [0.0, -10dBV, 10kΩ]
- HDMI ARC Output: [1.0, Digital, 75Ω]
```

#### **Sony Coordinate System**
```
X-Axis: Frequency Response (20Hz - 20kHz coverage)
Y-Axis: Signal Integrity (SNR measurement)
Z-Axis: Latency Compensation (ms)

Reference Coordinates (Sony A7S III):
- HDMI Clean Output: [20Hz-20kHz, 90dB SNR, 2ms]
- 3.5mm Audio Input: [20Hz-18kHz, 75dB SNR, 5ms]
- USB-C Data: [Full Spectrum, Digital, <1ms]
```

#### **Impedance Matching Algorithm**
```javascript
function calculateImpedance(sourceZ, loadZ) {
  const ratio = loadZ / sourceZ;
  if (ratio >= 10) return "OPTIMAL"; // 10:1 rule
  if (ratio >= 4) return "ACCEPTABLE"; // 4:1 minimum
  return "MISMATCH_WARNING"; // Requires adapter
}
```

#### **RT60 Acoustics Analysis**
- Room mode calculation for speaker placement
- Reverberation time optimization
- Bass trap positioning recommendations

---

## 💰 Profit Guard: SmartCoin Billing Logic

### **1.30x Multiplier System**

#### Base Formula
```
Final Cost = (Base Equipment Cost × 1.30) + Platform Fee
```

#### Rules
1. **Ghost Mode (Free Tier):** Unlimited equipment emulation, 0% commission
2. **Native Purchase:** User buys physical adapter through platform
   - Noodle-VISION earns **30% markup** on wholesale cost
   - Example: $100 adapter → User pays $130 → Noodle-VISION nets $30
3. **SmartCoin Credits:** Users pre-purchase credits at discount
   - 100 SmartCoins = $100 (1:1 base rate)
   - 1000 SmartCoins = $900 (10% bulk discount)

#### Blacklisted from Billing
- **Epileptic-Safe Features:** Always free, never monetized
- **Panic Button Functionality:** Always free
- **Pittsburgh Cell 120 Compliance:** Always free
- **Accessibility Tools:** Always free

#### Transparency Requirement
```javascript
// Every transaction shows:
{
  basePrice: 100.00,
  profitMultiplier: 1.30,
  finalPrice: 130.00,
  noodleVisionFee: 30.00,
  breakdownVisible: true // User sees exact markup
}
```

---

## 📦 Build Manifest (Builds 1-14)

| Build | Status | Platform | Features | Notes |
|-------|--------|----------|----------|-------|
| **1** | ✅ ARCHIVED | Create.xyz | Initial prototype | Basic spatial nav |
| **2** | ✅ ARCHIVED | Create.xyz | Added equipment DB | Sony/Denon initial coords |
| **3** | ❌ CONTAMINATED | Create.xyz | RT60 acoustics | MS Edge Copilot injection |
| **4** | ✅ ARCHIVED | Create.xyz | Impedance matching | Working algorithm |
| **5** | ❌ CONTAMINATED | Create.xyz | XR integration | MS Edge Copilot injection |
| **6** | ✅ ARCHIVED | Create.xyz | Ghost-to-Native system | Core monetization logic |
| **7** | ❌ CONTAMINATED | Create.xyz | SmartCoin beta | MS Edge Copilot injection |
| **8** | ✅ ARCHIVED | Netlify | Migration from Create.xyz | Clean rebuild |
| **9** | ✅ ARCHIVED | Vercel | Primary deployment | Added Supabase |
| **10** | ✅ ARCHIVED | Vercel | Real-time subscriptions | WebSocket integration |
| **11** | ❌ CONTAMINATED | Vercel | Emotional overlay system | MS Edge Copilot injection |
| **12** | ✅ ARCHIVED | Vercel | Pittsburgh Cell 120 | Strobe-Guard alpha |
| **13** | ✅ ACTIVE | Vercel | Epileptic-safe dashboard | Current production |
| **14** | 🚧 IN PROGRESS | Vercel | Neon analytics + Anything.com | Next deployment |

### Contamination Source
**Microsoft Edge Copilot** (NOT GitHub Copilot) injected Unity documentation into modular synthesizer cable logic code, causing 20+ rebuild cycles.

---

## 🔒 Security & Blacklisted Content

### **CRITICAL: DO NOT READ OR REFERENCE**

#### Blacklisted Files
```
.env
.env.local
.env.production
supabase/.env
neon/.env
```

**Why:** Contains API keys, database credentials, OAuth secrets. Any attempt to read these files must be rejected immediately.

#### Blacklisted Logic
```
Bolt_Healthcare/*
BoltHealthcare.tsx
BoltHealthcareIntegration.js
```

**Why:** Proprietary medical device integration code for FDA-regulated biometric monitoring. Reading this code violates healthcare compliance (HIPAA, medical device regulations).

#### Allowed Exceptions
- Reading `.env.example` files (template only, no real credentials)
- Discussing Bolt_Healthcare architecture at high level without code inspection
- Creating new `.env` templates with placeholder values

### Security Protocol
```javascript
if (fileRequest.includes('.env') && !fileRequest.includes('.example')) {
  return "BLOCKED: Credentials file. Use .env.example instead.";
}

if (fileRequest.includes('Bolt_Healthcare')) {
  return "BLOCKED: Medical compliance restricted code.";
}
```

---

## 🎯 Development Philosophy

1. **Accessibility First:** Epileptic-safe features are never monetized
2. **Neurodivergent-Optimized:** Automation-heavy, minimal manual editing
3. **Rural-Ready:** Works offline, low-bandwidth tolerant
4. **First-Class Only:** Cutting-edge, never-seen-before tooling
5. **Transparent Profit:** 1.30x markup shown to users, no hidden fees

---

## 📚 Additional Documentation

- **README.md** - Quick start guide
- **DEPLOYMENT.md** - Vercel/Netlify deployment steps
- **CROSS-DEVICE.md** - Multi-platform architecture
- **UPDATE-SUMMARY.md** - Recent changes log

---

**For Claude Desktop MCP Servers:**  
This file is the canonical source of truth for Noodle-VISION architecture. Reference this before making architectural decisions or suggesting changes to core systems.
