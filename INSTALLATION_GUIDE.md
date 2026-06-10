# Installation & Deployment Guide - v2.0.0

Complete step-by-step guide for installing, configuring, and deploying the Bitcoin Node Geography Dashboard with all new features.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [Running the Application](#running-the-application)
5. [Testing New Features](#testing-new-features)
6. [Troubleshooting](#troubleshooting)
7. [Production Deployment](#production-deployment)

---

## Prerequisites

### System Requirements
- **OS**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 18.04+)
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: 500MB free

### Software Requirements
- **Python**: 3.10 or higher
- **Node.js**: 18.0 or higher
- **npm**: 8.0 or higher (comes with Node.js)
- **Git**: 2.20 or higher (optional, for version control)

### Installation Verification

**Check Python:**
```bash
python --version
# Expected: Python 3.10.x or higher
```

**Check Node.js:**
```bash
node --version
npm --version
# Expected: v18.x or higher, npm 8.x or higher
```

---

## Backend Setup

### Step 1: Navigate to Backend Directory

**Windows (PowerShell):**
```powershell
cd "C:\Users\DELL\bitcoin-node-geography\POC-87-Bitcoin_Node_Geography-Anamika_R\backend"
```

**macOS/Linux:**
```bash
cd ~/bitcoin-node-geography/POC-87-Bitcoin_Node_Geography-Anamika_R/backend
```

### Step 2: Create and Activate Virtual Environment

**Windows (PowerShell):**
```powershell
# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Note: If you get an execution policy error, run:
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**macOS/Linux:**
```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

**Expected Output:**
```
Successfully installed [package names]...
```

### Step 4: Verify Installation

```bash
pip list
```

You should see:
- fastapi >= 0.136.3
- pandas >= 3.0.3
- uvicorn >= 0.48.0
- pydantic >= 2.13.4

### Step 5: Verify API Data Files

Ensure the mock data file exists:
```bash
# Windows
if exist mock_data\nodes.json echo "✓ Mock data found" else echo "✗ Mock data missing"

# macOS/Linux
ls -la mock_data/nodes.json
```

---

## Frontend Setup

### Step 1: Navigate to Frontend Directory

**Windows (PowerShell):**
```powershell
cd "C:\Users\DELL\bitcoin-node-geography\POC-87-Bitcoin_Node_Geography-Anamika_R\frontend"
```

**macOS/Linux:**
```bash
cd ~/bitcoin-node-geography/POC-87-Bitcoin_Node_Geography-Anamika_R/frontend
```

### Step 2: Install Node Dependencies

```bash
npm install
```

**Expected Output:**
```
added XXX packages
```

### Step 3: Verify Installation

```bash
npm list --depth=0
```

You should see:
- next >= 16.2.7
- react >= 19.2.4
- react-dom >= 19.2.4
- echarts >= 6.1.0
- leaflet >= 1.9.4

---

## Running the Application

### Method 1: Using Two Terminals (Recommended)

**Terminal 1 - Backend:**

```powershell
# Navigate to backend
cd backend

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Start backend server
python -m uvicorn app.main:app --port 8080 --reload
```

**Expected Output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8080
INFO:     Application startup complete
```

**Terminal 2 - Frontend:**

```powershell
# Open a new terminal in the root directory
cd frontend

# Start frontend development server
npm run dev
```

**Expected Output:**
```
▲ Next.js 16.2.7
  - Local:        http://localhost:3000
  - Environments: .env.local, .env
```

### Method 2: Using One Terminal Sequentially

```bash
# Terminal 1 - Start Backend
cd backend
.\venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --port 8080 --reload

# Wait for: "Application startup complete"
# Then in Terminal 2:
cd frontend
npm run dev
```

### Accessing the Application

Open your browser and navigate to:
```
http://localhost:3000
```

**Expected to see:**
- Bitcoin Node Geography Dashboard
- World map with node distribution
- Sidebar with statistics and filters
- New snapshot comparison section
- Export charts section
- Interactive tooltips

---

## Testing New Features

### 1. Testing Snapshot Comparison

1. **Open the Dashboard**
   - Navigate to `http://localhost:3000`
   
2. **Locate Snapshot Comparison Section**
   - Look for "📊 Snapshot Comparison" in the sidebar
   - Click to expand
   
3. **Load Snapshots**
   - The system automatically captures snapshots
   - After a few API calls, snapshots will appear in the dropdowns
   
4. **Compare Snapshots**
   - Select two different timestamps
   - Click "Compare Snapshots"
   - View the comparison results showing:
     - Node count changes
     - Percentage changes with trends
     - Block height comparisons
     - Alerts for top country/ASN changes

### 2. Testing Export Functionality

1. **Locate Export Data Section**
   - Look for "Export Data" in the sidebar
   - Click to expand
   
2. **Export Options to Test:**
   - **All Nodes (CSV)** - Download all nodes with full details
   - **Countries Analytics (CSV)** - Country-level aggregation
   - **ASN Analytics (CSV)** - Hosting provider aggregation
   - **Complete Dataset (JSON)** - Full data export
   - **Analytics Summary (JSON)** - Analytics data only

3. **Verify Downloads:**
   - Check that files download successfully
   - Verify file format (CSV or JSON)
   - Open files to verify data integrity
   - Expected file size: 100KB - 5MB depending on format

### 3. Testing Tooltips

1. **Hover Over KPI Cards:**
   - In the header, hover over "REACHABLE NODES"
   - Expect tooltip: "Total number of reachable Bitcoin nodes..."
   - Hover over "BLOCK HEIGHT"
   - Expect tooltip: "Latest Bitcoin blockchain block height..."

2. **Hover Over Filter Labels:**
   - Hover over filter names
   - Expect descriptive tooltips

3. **Check Snapshot Comparison Tooltips:**
   - Expand Snapshot Comparison
   - Hover over the "i" icon
   - Expect: "Compare network statistics between two different time points"

### 4. Testing API Endpoints

**Using curl or Postman:**

```bash
# Get latest summary (triggers snapshot capture)
curl http://localhost:8080/api/nodes/summary

# Get snapshot history
curl http://localhost:8080/api/snapshots/history

# Get snapshots and store IDs
# Then compare two snapshots
curl "http://localhost:8080/api/snapshots/compare?snapshot1_id=SNAPSHOT_ID_1&snapshot2_id=latest"

# Export data
curl http://localhost:8080/api/export/countries-csv > countries.csv
curl http://localhost:8080/api/export/json > data.json
```

### 5. Testing Bitnodes API Integration

1. **Check Backend Logs:**
   - Look for log messages like:
     - "Successfully fetched Bitnodes snapshot with XXX nodes"
     - "Using cached node data"
     - "Bitnodes API... using local mock data"

2. **Test Caching:**
   - Make multiple requests within 5 minutes
   - Should see "Using cached node data" in logs

3. **Test Fallback:**
   - Stop internet connection or block API (optional)
   - Dashboard should still work with mock data

---

## Troubleshooting

### Backend Issues

**Issue: "Port 8080 already in use"**
```bash
# Use a different port
python -m uvicorn app.main:app --port 8081 --reload

# Then update frontend API calls to use 8081
```

**Issue: "Module not found: fastapi"**
```bash
# Ensure virtual environment is activated
.\venv\Scripts\Activate.ps1

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

**Issue: "Bitnodes API always fails"**
```bash
# Check internet connection
# Check if API is accessible: https://bitnodes.io/api/v1/snapshots/latest/
# Backend should automatically use mock data as fallback
```

### Frontend Issues

**Issue: "npm command not found"**
```bash
# Check Node.js installation
node --version

# If not found, reinstall from nodejs.org
```

**Issue: "Cannot find module '@next/env'"**
```bash
# Reinstall dependencies
rm -r node_modules package-lock.json
npm install
```

**Issue: "API connection refused"**
```bash
# Verify backend is running on http://localhost:8080
# Check frontend API URL in components: "http://localhost:8080"
# If using different port, update all API calls
```

**Issue: "Tooltips not appearing"**
```bash
# Clear browser cache (Ctrl+Shift+Delete)
# Restart frontend dev server
# Check browser console for errors
```

### Common Solutions

1. **Clear Cache:**
   ```bash
   # Frontend
   rm -r .next node_modules/.cache

   # Browser (Chrome): Ctrl+Shift+Delete
   # Browser (Firefox): Ctrl+Shift+Delete
   ```

2. **Restart Services:**
   ```bash
   # Stop backend (Ctrl+C)
   # Stop frontend (Ctrl+C)
   # Restart both
   ```

3. **Check Logs:**
   - Backend: Terminal output shows all API calls and errors
   - Frontend: Browser DevTools (F12) → Console tab

4. **Verify Connectivity:**
   ```bash
   # Test backend health
   curl http://localhost:8080/

   # Expected: {"status":"online",...}
   ```

---

## Production Deployment

### Backend Deployment

#### Option 1: Docker

Create `Dockerfile`:
```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install -r requirements.txt

COPY backend/app ./app
COPY backend/mock_data ./mock_data

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
```

Build and run:
```bash
docker build -t bitcoin-node-api .
docker run -p 8080:8080 bitcoin-node-api
```

#### Option 2: Gunicorn (Linux/macOS)

```bash
pip install gunicorn

gunicorn app.main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8080
```

### Frontend Deployment

#### Build for Production

```bash
npm run build
npm run start
```

#### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from frontend directory
cd frontend
vercel
```

#### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=.next
```

### Environment Variables

Create `.env.local` in frontend:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Create `.env` in backend:
```env
BITNODES_API_URL=https://bitnodes.io/api/v1/snapshots/latest/
CACHE_TTL_SECONDS=300
```

---

## Performance Optimization

### Backend
- ✓ Caching enabled (5-minute TTL)
- ✓ Connection timeout: 10 seconds
- ✓ Mock data fallback for resilience
- Consider: Database for persistent snapshot storage

### Frontend
- ✓ Next.js production build
- ✓ Component lazy loading
- ✓ CSS optimization
- Consider: Image optimization, CDN usage

---

## Monitoring

### Backend Monitoring

```bash
# Check request logs
# Watch for: API errors, cache hits, fallback events

# Typical healthy log:
# INFO: GET /api/nodes/summary
# INFO: Using cached node data
# INFO: Successfully fetched Bitnodes snapshot with 14500 nodes
```

### Frontend Monitoring

- Browser DevTools → Network tab
- Check for failed requests (red responses)
- Monitor console for errors
- Check for slow API responses (>5s)

---

## Support & Troubleshooting

For issues:
1. Check logs first (Backend terminal output, Browser console)
2. Verify all prerequisites are installed
3. Check API connectivity
4. Clear cache and restart
5. Review this guide for specific errors

---

## Version Information

- **Dashboard Version**: 2.0.0
- **Python**: 3.10+
- **Node.js**: 18+
- **Last Updated**: 2026-06-10

---

**Status**: ✅ Production Ready

Enjoy your Bitcoin Node Geography Dashboard! 🚀
