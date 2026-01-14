# 🚀 NOODLE-VISION DEPLOYMENT GUIDE

## ⚡ INSTANT SETUP (5 MINUTES)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Development Server
```bash
# Terminal 1: Start the React app
npm run dev

# Terminal 2: Start the WebSocket server (for MCP Console)
npm run ws-server
```

### Step 3: Open Browser
```
http://localhost:3000
```

**DONE!** You should see:
- ✅ System Metrics Dashboard (live updates every 5 seconds)
- ✅ MCP Console (receiving WebSocket messages every 2 seconds)
- ✅ Error Boundaries protecting everything

---

## 📦 PRODUCTION BUILD

### Build for Production
```bash
npm run build
```

Output: `dist/` folder ready to deploy

### Preview Production Build
```bash
npm run preview
```

---

## 🌐 DEPLOYMENT TARGETS

### Netlify (RECOMMENDED FOR NOODLE)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod

# Or drag-and-drop the 'dist' folder to netlify.com
```

### Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Static Hosting (Any)
Just upload the `dist/` folder to:
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting
- Cloudflare Pages
- Your own server

---

## 🔌 WEBSOCKET CONFIGURATION

### Development (Default)
```
ws://localhost:8080/mcp
```

### Production
Replace in `App.tsx`:
```tsx
<MCPConsoleView 
  wsUrl="wss://your-domain.com/mcp"  // Use wss:// for HTTPS
  maxMessages={100}
  autoScroll={true}
/>
```

### Backend Setup Options

#### Option 1: Node.js Server
```bash
# Use the included websocket-server.js
node websocket-server.js
```

#### Option 2: Deploy WebSocket Server Separately
- **Fly.io**: Supports WebSocket, free tier
- **Railway**: WebSocket support, easy deploy
- **Render**: WebSocket support, free tier
- **Heroku**: WebSocket support (paid)

#### Option 3: Serverless WebSocket
- **AWS API Gateway** + Lambda
- **Azure SignalR Service**
- **Pusher** (managed WebSocket)
- **Ably** (managed WebSocket)

---

## 🛠️ CUSTOMIZATION FOR DEPLOYMENT

### 1. Disable WebSocket (If Not Needed)
In `App.tsx`, remove or comment out:
```tsx
// <section className="console-section">
//   <h2 className="section-title">MCP Console</h2>
//   <MCPConsoleView 
//     wsUrl="ws://localhost:8080/mcp" 
//     maxMessages={100}
//     autoScroll={true}
//   />
// </section>
```

### 2. Change Metrics Refresh Rate
```tsx
<Dashboard refreshInterval={10000} /> // 10 seconds instead of 5
```

### 3. Add Your Branding
Edit colors in each component's `<style>` block:
```css
/* Primary gradient */
background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
```

---

## 📊 MONITORING IN PRODUCTION

### Error Tracking (Recommended)
Install Sentry:
```bash
npm install @sentry/react
```

Update `ErrorBoundary.tsx`:
```tsx
import * as Sentry from '@sentry/react';

componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
  Sentry.captureException(error, { contexts: { react: errorInfo } });
  // ... rest of error handling
}
```

### Analytics (Optional)
- **Google Analytics**: Track page views
- **Mixpanel**: Track user interactions
- **PostHog**: Self-hosted analytics

---

## 🔒 SECURITY CHECKLIST

- [ ] Use `wss://` (not `ws://`) in production
- [ ] Enable CORS on WebSocket server
- [ ] Add authentication to WebSocket connection
- [ ] Rate-limit system metrics endpoint
- [ ] Use environment variables for sensitive data
- [ ] Enable HTTPS on your domain
- [ ] Add CSP headers
- [ ] Implement API key rotation

---

## 🐛 TROUBLESHOOTING

### Problem: "WebSocket connection failed"
**Solution**: Make sure WebSocket server is running:
```bash
npm run ws-server
```

### Problem: "System metrics not updating"
**Solution**: The metrics tool requires Node.js APIs. It won't work in browser-only builds. Deploy with a backend.

### Problem: "Build fails with TypeScript errors"
**Solution**: Check your tsconfig.json and ensure all types are correct:
```bash
npm run build -- --mode development
```

### Problem: "Port 3000 already in use"
**Solution**: Change port in `vite.config.ts`:
```ts
server: {
  port: 3001, // or any other port
}
```

---

## 🎯 NETLIFY DEPLOYMENT CHECKLIST

1. Build command: `npm run build`
2. Publish directory: `dist`
3. Node version: 18 or higher
4. Environment variables (if needed):
   - `VITE_WS_URL=wss://your-websocket-server.com`

---

## ⚡ QUICK COMMANDS REFERENCE

```bash
# Development
npm run dev              # Start dev server
npm run ws-server        # Start WebSocket server

# Production
npm run build            # Build for production
npm run preview          # Preview production build

# Deployment
netlify deploy --prod    # Deploy to Netlify
vercel --prod            # Deploy to Vercel
```

---

## 🎉 YOU'RE LIVE!

Once deployed, your Noodle-Vision Control Center will be accessible at your domain with:
- ✅ Real-time system monitoring
- ✅ Live MCP console (if WebSocket connected)
- ✅ Bulletproof error handling
- ✅ First-class UI/UX

**Ship it!** 🚀
