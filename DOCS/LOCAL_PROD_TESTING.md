# 🧪 Local Production Testing Guide (Windows)

## Why Test Production Build Locally?

Testing the production build locally ensures:
- ✅ All optimizations (minification, tree shaking, code splitting) are applied
- ✅ Static assets are served correctly
- ✅ Service Worker caches properly
- ✅ Performance metrics match what users will see in production
- ✅ No surprises when deploying

## 📋 Prerequisites

- Node.js installed
- Project already built (`npm run build` completed)
- Terminal (PowerShell, CMD, or Git Bash)

## 🚀 Quick Start

### Method 1: Using `serve` (Recommended)

```powershell
# 1. Navigate to project root
cd "C:\path\to\your\Website"

# 2. Install serve globally (only needed once)
npm install -g serve

# 3. Serve the build folder on port 5000
serve -s frontend/build -l 5000
```

**Expected output:**
```
   ┌────────────────────────────────────────┐
   │                                        │
   │   Serving!                             │
   │                                        │
   │   - Local:    http://localhost:5000    │
   │   - Network:  http://192.168.x.x:5000  │
   │                                        │
   │   Copied local address to clipboard!   │
   │                                        │
   └────────────────────────────────────────┘
```

### Method 2: Using `http-server`

```powershell
# 1. Install http-server globally (only needed once)
npm install -g http-server

# 2. Navigate to build folder
cd "C:\path\to\your\Website\frontend\build"

# 3. Start server on port 5000
http-server -p 5000 -c-1
```

**Flags explained:**
- `-p 5000`: Use port 5000
- `-c-1`: Disable caching (useful for testing)

### Method 3: Using `npx` (No installation required)

```powershell
# Navigate to project root
cd "C:\path\to\your\Website"

# Serve using npx (downloads serve temporarily)
npx serve -s frontend/build -l 5000
```

## 🧪 Testing Workflow

### 1. Build Production Bundle

```powershell
cd "C:\path\to\your\Website\frontend"
npm run build
```

**Success indicators:**
- ✅ "Compiled successfully"
- ✅ File sizes listed (e.g., "56.54 kB vendor.react.js")
- ✅ "The build folder is ready to be deployed"

### 2. Serve Locally

```powershell
# From project root
serve -s frontend/build -l 5000
```

### 3. Test in Browser

**Open Chrome Incognito:**
```
http://localhost:5000
```

**Why Incognito?**
- No browser extensions interfering
- Fresh Service Worker registration
- No cached data from previous visits

### 4. Run Lighthouse Audit

**In Chrome DevTools:**
1. Press `F12` to open DevTools
2. Go to **Lighthouse** tab
3. Configuration:
   - ✅ Mode: **Navigation (Default)**
   - ✅ Device: **Mobile**
   - ✅ Categories: **Performance** (minimum)
4. Click **Analyze page load**

**First-Visit Test (Cold Cache):**
- Clear Application → Storage → "Clear site data"
- Run Lighthouse
- Save JSON: `localhost_5000_first_visit.json`

**Repeat-Visit Test (Warm Cache):**
- Reload page once
- Run Lighthouse again
- Save JSON: `localhost_5000_repeat_visit.json`

### 5. Save Results

**Export Lighthouse JSON:**
1. After audit completes, click ⚙️ (Settings gear)
2. Click 💾 "Save as JSON"
3. Save to `tests/` folder with descriptive name:
   - `localhost_5000-YYYYMMDDTHHMMSS.json`
   - Example: `localhost_5000-20251021T135000.json`

## 🔍 What to Look For

### Performance Metrics

| Metric | Target | Critical |
|--------|--------|----------|
| **FCP** | < 1.8s | < 1.0s is ideal |
| **LCP** | < 2.5s | **< 1.0s is our goal** 🎯 |
| **Speed Index** | < 3.4s | < 2.0s is excellent |
| **TBT** | < 200ms | < 300ms acceptable |
| **CLS** | < 0.1 | 0 is perfect |

### Key Indicators of Success

✅ **Static LCP Image Working:**
- LCP time < 1.5s (vs 5.5s before)
- No "flash" when page loads
- Image appears immediately

✅ **Service Worker Active:**
- DevTools → Application → Service Workers shows "activated"
- Network tab shows resources served from "(ServiceWorker)"

✅ **Bundle Optimizations:**
- JS bundles < 60KB (gzipped)
- CSS < 20KB (gzipped)
- Total page weight < 300KB (excluding images)

## 🔄 Making Changes and Re-testing

### Standard Workflow

```powershell
# 1. Make code changes in src/
# 2. Rebuild
cd frontend
npm run build

# 3. Stop previous server (Ctrl+C)
# 4. Restart server
serve -s build -l 5000

# 5. Test in browser (hard refresh: Ctrl+Shift+R)
```

### Service Worker Caveats

**If testing Service Worker changes:**
```powershell
# In Chrome DevTools:
# 1. Application → Service Workers
# 2. Check "Update on reload"
# 3. Click "Unregister" on old SW
# 4. Hard refresh (Ctrl+Shift+R)
```

## 🐛 Troubleshooting

### Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**

1. **Kill process on port 5000:**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID with actual number)
taskkill /PID <PID> /F
```

2. **Use different port:**
```powershell
serve -s frontend/build -l 5001
```

### Static Files Not Loading

**Symptoms:**
- 404 errors for images/CSS/JS
- White screen
- Console errors

**Check:**
1. `homepage` in `package.json` should be `"/"`
2. Assets exist in `build/static/` and `build/images/`
3. No typos in file paths

**Fix:**
```powershell
# Rebuild from scratch
cd frontend
rm -rf build
npm run build
```

### Service Worker Not Updating

**Symptoms:**
- Old code still running
- Changes not visible

**Solutions:**
1. DevTools → Application → Clear Storage → "Clear site data"
2. DevTools → Application → Service Workers → "Unregister"
3. Hard refresh: `Ctrl+Shift+R`
4. Use Incognito mode for fresh test

### CSS/Images Look Different

**Cause:** Production uses optimized/minified assets

**Check:**
1. Critical CSS in `index.html` matches design
2. Image paths use `%PUBLIC_URL%` correctly
3. Tailwind classes not purged incorrectly

## 📊 Comparing Dev vs Prod

### Expected Differences

| Aspect | Dev (3000) | Prod (5000) |
|--------|-----------|-------------|
| **Bundle Size** | ~2-3MB | ~150-200KB |
| **Load Time** | 3-5s | < 1.5s |
| **LCP** | 5-6s | **< 1.0s** 🎯 |
| **Source Maps** | ✅ Yes | ❌ No |
| **Minification** | ❌ No | ✅ Yes |
| **Service Worker** | ❌ No | ✅ Yes |

### Why Production is Much Faster

1. **Minification:** Code stripped of whitespace/comments (-60%)
2. **Tree Shaking:** Unused code removed (-30%)
3. **Code Splitting:** Load only what's needed (-40% initial)
4. **Compression:** Gzip/Brotli compression (-70%)
5. **Static Optimization:** LCP image in HTML (instant paint)

## 🎯 Testing Checklist

Before deploying to production:

- [ ] **Build succeeds** without errors/warnings
- [ ] **Serve locally** on port 5000
- [ ] **Visual check**: Site looks correct (no missing images/styles)
- [ ] **Lighthouse Performance** > 90/100
- [ ] **LCP** < 1.5s (ideally < 1.0s)
- [ ] **Service Worker** registers successfully
- [ ] **Mobile responsive** (DevTools → Device Mode)
- [ ] **All links work** (navigation, buy button, etc.)
- [ ] **AI Assistant** responds quickly (< 2s)
- [ ] **No console errors** (check DevTools Console)
- [ ] **Images load** with correct format (WebP/AVIF)

## 🚀 Next Steps After Local Testing

Once localhost:5000 passes all checks:

1. **Deploy to staging** (if available)
2. **Test on real mobile device** (not just DevTools)
3. **Monitor real-user metrics** (Core Web Vitals)
4. **A/B test** (if high traffic)

## 💡 Pro Tips

### Faster Testing Loop

```powershell
# Create a script: test-prod.bat
cd "C:\path\to\your\Website\frontend"
npm run build && cd .. && serve -s frontend/build -l 5000
```

Then just run:
```powershell
.\test-prod.bat
```

### Automated Lighthouse

```powershell
# Install lighthouse CLI
npm install -g lighthouse

# Run automated test
lighthouse http://localhost:5000 --output json --output-path tests/auto-report.json --chrome-flags="--headless"
```

### Compare Multiple Reports

```javascript
// compare-reports.js
const fs = require('fs');

const report1 = JSON.parse(fs.readFileSync('tests/before.json'));
const report2 = JSON.parse(fs.readFileSync('tests/after.json'));

const metrics = ['first-contentful-paint', 'largest-contentful-paint', 'speed-index', 'total-blocking-time', 'cumulative-layout-shift'];

metrics.forEach(metric => {
  const before = report1.audits[metric].numericValue;
  const after = report2.audits[metric].numericValue;
  const diff = ((after - before) / before * 100).toFixed(1);
  console.log(`${metric}: ${before.toFixed(0)}ms → ${after.toFixed(0)}ms (${diff}%)`);
});
```

---

**Happy Testing! 🧪🚀**

Need help? Check the main README or create an issue.

