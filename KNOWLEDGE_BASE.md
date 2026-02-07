# KNOWLEDGE_BASE.md - Noodle-VISION Architectural Decisions

**Last Updated:** 2026-02-07  
**Purpose:** Preserve critical architectural knowledge independent of Claude Pro subscription  
**Source:** Claude.ai project conversations (Feb 2026)

---

## 🧠 Core Architectural Principles

### **1. Neurodivergent-First Development**
**Problem:** Traditional coding requires manual file editing, which is difficult with dyslexia/ADHD.

**Solution:**
- Automation-heavy workflows (Zapier, GitHub Actions, MCP)
- AI-assisted development (Claude, Bolt.new, Create.xyz)
- Zero manual path management - tooling handles all file operations
- Direct, actionable solutions over theoretical explanations

**Implementation:**
```bash
# MCP server handles all file operations
mcp-server-filesystem --allowed-dir C:\NoodleVISION_ROOT

# Automation pipeline
Notion (task tracking) → Zapier → GitHub → Vercel (auto-deploy)
```

---

## 🔌 The "Ghost-to-Native" Paradigm

### **Concept Origin**
Noodle spent years collecting audio/video equipment, discovering connection solutions by accident. Wanted to systematize this knowledge so musicians could test configurations virtually before purchasing adapters.

### **Ghost Mode (Free)**
- Unlimited equipment emulation in VR/AR
- Test any cable configuration
- See which adapters are needed
- No purchases required

### **Native Mode (Paid)**
- User decides to purchase physical adapter
- 1.30x multiplier applies (30% profit)
- Noodle-VISION sources wholesale, ships to user
- Transparent pricing shown upfront

### **Why This Works**
Musicians avoid $500+ in trial-and-error adapter purchases. They only buy what they've already proven works in Ghost Mode.

---

## 🎛️ Modular Synthesizer Logic Applied to A/V Equipment

### **The Core Insight**
Audio equipment routing follows the same logic as modular synth patch cables:
1. Signal flows from Output → Input
2. Impedance must match (or adapter required)
3. Voltage levels must align (Line/Mic/Instrument)
4. Latency stacks with each connection

### **Scientific Coordinate Systems**

#### **Denon System (Professional Audio)**
```
Inspired by: Denon AVR-X6700H receiver
X-Axis: Signal flow direction
Y-Axis: Voltage level (+4dBu, -10dBV, etc.)
Z-Axis: Impedance (600Ω, 10kΩ, etc.)

Real-world application:
XLR Output (Mixer) → [0.0, +4dBu, 600Ω]
RCA Input (Receiver) → [0.0, -10dBV, 10kΩ]
Result: MISMATCH - Requires -14dB pad adapter
```

#### **Sony System (Video/Hybrid)**
```
Inspired by: Sony A7S III camera
X-Axis: Frequency response coverage
Y-Axis: Signal-to-noise ratio (SNR)
Z-Axis: Latency compensation (ms)

Real-world application:
HDMI Output (Camera) → [20Hz-20kHz, 90dB, 2ms]
HDMI Input (Monitor) → [Full Spectrum, Digital, <1ms]
Result: OPTIMAL - Direct connection
```

---

## 🚨 Pittsburgh Cell 120 (Strobe-Guard)

### **Regulatory Context**
Photosensitive epilepsy triggers:
- Flashing 3+ times per second
- Contrasting colors (red/blue strobes)
- Large screen coverage (>25% viewport)

### **Technical Implementation**
```javascript
// Real-time pixel analysis
function analyzeFrame(canvas) {
  const pixels = canvas.getImageData(0, 0, width, height);
  const flashRate = calculateFlashRate(pixels);
  const coverage = calculateFlashCoverage(pixels);
  
  if (flashRate > 3 && coverage > 0.25) {
    triggerPanicProtocol(); // Instant blackout
  }
}
```

### **Why "Pittsburgh Cell 120"**
Named after the specific jail cell in Pittsburgh where Noodle witnessed strobe-induced seizure. "120" refers to 120fps analysis rate for sub-frame detection.

### **Panic Button Protocol**
1. User presses panic button (or auto-detected)
2. Screen goes black immediately (<16ms)
3. Biometric monitoring pauses
4. Calm audio plays
5. User regains control at their pace

---

## 💰 SmartCoin Economics

### **Problem with Traditional Platforms**
Users don't know markup percentages. Platforms hide profit in "convenience fees."

### **Noodle-VISION Solution**
```javascript
// Every transaction shows exact breakdown
{
  wholesaleCost: 100.00,
  profitMultiplier: 1.30,
  finalPrice: 130.00,
  noodleVisionProfit: 30.00,
  breakdown: "You're paying $30 for our sourcing service"
}
```

### **SmartCoin Bulk Discounts**
- 100 SmartCoins = $100 (1:1 ratio)
- 500 SmartCoins = $450 (10% discount)
- 1000 SmartCoins = $850 (15% discount)

Users pre-purchase credits, use them for equipment orders. No hidden fees, no surprise charges.

---

## 🛡️ Contamination Crisis (MS Edge Copilot)

### **What Happened**
Microsoft Edge Copilot replaced Noodle's modular synth cable logic with generic Unity documentation about VR controller input. Happened across **20+ rebuild cycles** before isolation.

### **How It Was Identified**
```diff
- // Original: Impedance matching algorithm
- function calculateImpedance(sourceZ, loadZ) { ... }

+ // MS Edge Copilot injection
+ function OnControllerInput(controller) {
+   // Unity VR documentation copy-paste
+ }
```

### **Prevention Strategy**
1. ✅ Blacklist MS Edge Copilot from accessing project files
2. ✅ Git commit before any AI tool interaction
3. ✅ Code review every AI suggestion before merge
4. ✅ Maintain clean "golden master" repo as rollback point

### **Lesson Learned**
AI contamination is real. Not paranoia. Happened multiple times before root cause identified.

---

## 🗂️ File System Organization

### **The Great Sync Loop Disaster**
Multiple cloud sync services (Google Drive, OneDrive, Dropbox) created recursive loops:
- 250GB+ of duplicated files
- 8+ GitHub repos with identical code
- File paths corrupted with nested duplicates

### **Solution Architecture**
```
C:\NoodleVISION_ROOT\          ← Single source of truth
  ├── noodle-vision-nexus\     ← Production repo
  ├── archive\                  ← Old builds (read-only)
  └── quarantine\               ← Contaminated code isolation

C:\Users\nicol\RepoQuarantine\ ← MS Edge Copilot contaminated files
```

### **Active Repos (GitHub)**
1. **noodle-vision-nexus** - Production (Vercel deployed)
2. **noodle-vision-docs** - Documentation only
3. **noodle-vision-analytics** - Stripe/Neon integration
4. **[5 archived repos]** - Contaminated builds (not deleted for forensic analysis)

---

## 🔧 MCP (Model Context Protocol) Integration

### **Why MCP Matters**
Traditional AI tools can't access local files. MCP gives Claude Desktop direct filesystem access.

### **Current MCP Servers**
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", 
               "C:\\NoodleVISION_ROOT",
               "C:\\Users\\nicol\\Documents",
               "C:\\Users\\nicol\\Downloads"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "..." }
    }
  }
}
```

### **Workflow**
1. User asks Claude to fix deployment issue
2. Claude uses MCP to read Vercel logs
3. Claude uses MCP to edit local files
4. Claude uses MCP to commit/push to GitHub
5. Vercel auto-deploys from GitHub

**No manual file editing required.**

---

## 📊 Database Architecture

### **Supabase (Primary)**
```sql
-- Equipment inventory
CREATE TABLE equipment (
  id UUID PRIMARY KEY,
  name TEXT,
  manufacturer TEXT,
  port_type TEXT, -- XLR, RCA, HDMI, etc.
  impedance INTEGER, -- Ohms
  voltage_level TEXT, -- +4dBu, -10dBV, etc.
  coordinates JSONB -- {x, y, z} per Denon/Sony system
);

-- User cable tests (Ghost Mode)
CREATE TABLE ghost_tests (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  equipment_a UUID REFERENCES equipment(id),
  equipment_b UUID REFERENCES equipment(id),
  adapter_required TEXT, -- NULL if direct connection works
  test_timestamp TIMESTAMPTZ
);

-- Real-time subscriptions
CREATE SUBSCRIPTION ghost_test_stream
ON ghost_tests
FOR INSERT;
```

### **Neon (Analytics)**
```sql
-- Revenue tracking
CREATE TABLE smartcoin_transactions (
  id UUID PRIMARY KEY,
  user_id UUID,
  coins_purchased INTEGER,
  usd_paid NUMERIC(10,2),
  discount_percent INTEGER,
  transaction_date TIMESTAMPTZ
);

-- Equipment purchase conversions (Ghost → Native)
CREATE TABLE native_purchases (
  id UUID PRIMARY KEY,
  user_id UUID,
  equipment_id UUID,
  wholesale_cost NUMERIC(10,2),
  profit_multiplier NUMERIC(3,2), -- 1.30
  final_price NUMERIC(10,2),
  noodle_profit NUMERIC(10,2),
  purchase_date TIMESTAMPTZ
);
```

---

## 🚀 Deployment Pipeline

### **Current Production**
```
GitHub (main branch)
  ↓
Vercel Auto-Deploy
  ↓
noodle-vision-nexus.vercel.app
  ↓
Custom domain: noodle-vision.com (planned)
```

### **Build Process**
```bash
# Triggered on git push
npm run build           # Vite production build
npm run test            # Strobe-Guard safety tests
vercel --prod           # Deploy to production
```

### **Backup Deployment (Netlify)**
If Vercel goes down, Netlify mirror deploys from same GitHub repo.

---

## 🎯 Revenue Model (Long-term)

### **Phase 1: Ghost Mode (Current)**
- Free unlimited equipment testing
- Build user base
- Collect equipment compatibility data

### **Phase 2: Native Purchases (Q2 2026)**
- 1.30x multiplier on adapter sales
- Partner with wholesalers (Sweetwater, B&H Photo)
- Transparent pricing

### **Phase 3: Pro Features (Q3 2026)**
- Advanced acoustics analysis (RT60, room modes)
- Custom equipment profiles (upload your own gear)
- Priority support

### **Phase 4: B2B (Q4 2026)**
- Recording studio setup consultation
- Venue acoustics analysis
- Live event equipment planning

### **Never Monetized**
- Epileptic-safe features
- Panic button
- Accessibility tools
- Pittsburgh Cell 120 compliance

---

## 🧬 Emotional Overlay System (Experimental)

### **Concept**
Users can assign emotional metadata to equipment:
- "This mixer reminds me of my first gig"
- "This cable saved my wedding video"
- "Avoid this adapter - caused feedback disaster"

### **Implementation**
```javascript
// Emotional tagging
{
  equipmentId: "denon-avr-x6700h",
  emotionalTag: {
    sentiment: "positive",
    memory: "First studio session with this receiver",
    importance: 8, // 1-10 scale
    timestamp: "2023-05-12"
  }
}
```

### **Why This Matters**
Musicians have deep emotional connections to equipment. Noodle-VISION respects this by allowing sentiment tracking alongside technical specs.

---

## 📱 Cross-Device Architecture

### **Desktop (Windows)**
- Full VR/AR experience (Quest 3, SteamVR)
- Equipment database editing
- Acoustics analysis tools

### **Mobile (iOS/Android)**
- Quick equipment lookup
- Ghost Mode cable testing (2D interface)
- Panic button (always accessible)

### **Web (Progressive Web App)**
- Works offline (service worker)
- Responsive design (mobile/tablet/desktop)
- Syncs across devices via Supabase

---

## 🔮 Future Innovations

### **Anything.com Integration**
LLM-powered equipment recommendations:
- "I have a Shure SM7B, Focusrite Scarlett, and MacBook Pro - what cables do I need?"
- AI scans equipment database, suggests optimal routing

### **AR Equipment Scanning**
Use phone camera to:
1. Scan equipment ports
2. AI identifies connector types
3. Suggests compatible cables
4. Shows virtual cable routing in AR

### **Community Marketplace**
Users share:
- Custom equipment profiles
- Tested cable configurations
- Studio setup blueprints
- Acoustics measurements

---

## 📖 Terminology Dictionary

| Term | Definition |
|------|------------|
| **Ghost Mode** | Virtual equipment testing (free, unlimited) |
| **Native Mode** | Physical equipment purchase (1.30x markup) |
| **SmartCoin** | Platform currency for equipment purchases |
| **Pittsburgh Cell 120** | Epileptic seizure prevention system |
| **Strobe-Guard** | Real-time flash detection (120fps analysis) |
| **Denon Coordinates** | Scientific audio port emulation system |
| **Sony Coordinates** | Scientific video port emulation system |
| **RT60** | Reverberation time (acoustics measurement) |
| **Impedance Matching** | Ensuring electrical compatibility between devices |
| **MS Edge Copilot Contamination** | AI code injection incident (2024-2026) |

---

## 🛠️ Emergency Protocols

### **If Deployment Fails**
1. Check Vercel logs: `vercel logs --prod`
2. Rollback to last working commit: `git revert HEAD`
3. Deploy to Netlify backup: `netlify deploy --prod`

### **If Database Connection Lost**
1. Switch to Neon backup: Update `NEXT_PUBLIC_SUPABASE_URL`
2. Verify credentials in `.env.production`
3. Check Supabase dashboard for outages

### **If AI Contamination Suspected**
1. `git diff` - Check for unexpected code changes
2. Compare against golden master repo
3. Isolate contaminated files in `C:\Users\nicol\RepoQuarantine`
4. Rebuild from clean backup

---

## 📚 Required Reading for Future Developers

1. **CLAUDE.md** - Tech stack & architecture
2. **README.md** - Quick start guide
3. **DEPLOYMENT.md** - How to deploy
4. **This file (KNOWLEDGE_BASE.md)** - Why things are the way they are

---

**Philosophy:**
Noodle-VISION exists to democratize professional audio/video equipment routing knowledge. Every feature prioritizes accessibility, transparency, and user empowerment over profit maximization.

**If you're reading this file, you're now responsible for protecting these principles.**

---

*End of Knowledge Base*  
*Preserved: 2026-02-07*  
*Source: Claude.ai (Anthropic) project conversations*
