# Real Rails: Bitcoin Node Geography Dashboard

An interactive, high-fidelity real-time intelligence dashboard to visualize the global distribution of Bitcoin nodes, assess infrastructure resilience, and analyze cloud hosting provider concentration. 

Built as part of the **Real Rails Intelligence Library** (PoC ID #87: Settlement & Infrastructure).

**🎉 Version 2.0.0 Now Available** - With Snapshot Comparison, Data Exports, Reusable Adapters, Tooltips, and Enhanced Bitnodes API Integration!

---

## ✨ What's New in v2.0.0

### New Features
✅ **📊 Snapshot Comparison** - Compare network statistics between two time points  
✅ **📥 Export Charts & Data** - Export to CSV/JSON formats  
✅ **🔧 Reusable Data Adapters** - Modular data transformation layer  
✅ **💬 Interactive Tooltips** - Context-sensitive help throughout the UI  
✅ **🌐 Enhanced Bitnodes API** - Better caching, resilience, and error handling  

[View Complete Changelog](./FEATURES_v2.md)

---

## 🏗️ System Architecture

The project consists of a decoupled Python FastAPI backend and a Next.js (React/TypeScript) frontend:

```mermaid
graph TD
    Client[Next.js Client] -->|HTTP Requests| API[FastAPI Server v2.0]
    API -->|1. Try Live Snapshot| Bitnodes[Bitnodes API]
    API -.->|2. Fallback on Error/Timeout| LocalMock[Local Mock Data nodes.json]
    API -->|3. Snapshots Comparison| SnapDB[(Snapshots History)]
    Client -->|Renders Map| Leaflet[Leaflet + CartoDB Dark Matter]
    Client -->|Renders Analytics| ECharts[ECharts Widgets]
    Client -->|Tooltips & Exports| DataAdapters[Data Adapters]
```

### Key Technical Choices
*   **Visual Identity**: Built around the `#030712` Obsidian Black visual system with Sleek Glassmorphism and Electric Cyan / Indigo active accents.
*   **Aesthetics**: 70/30 layout split (70% Map stage / 30% Intelligence Sidebar).
*   **Data Orchestration**: Python FastAPI backend parsing the latest Bitnodes network snapshots, cleaning and aggregating metrics via Pandas.
*   **Visualizations**: Custom React-Leaflet configuration using dark CartoDB tile layers and custom glowing SVG marker animations. Dynamic leaderboards and trend lines implemented using ECharts.
*   **Resilience (2-Hour Rule)**: Includes an automatic fallback to high-fidelity local `nodes.json` mock data if the public Bitnodes API is down, rate-limited, or unreachable.
*   **Data Adapters**: Modular adapter pattern for flexible data transformation and export.
*   **Snapshot Management**: Automatic capturing and comparison of network snapshots over time.

---

## 🚀 Getting Started

### Prerequisites
*   Python 3.10+
*   Node.js 18+ (npm)

### Quick Start (Windows Users)
```bash
# Simply run the quick start script
START.bat

# This will automatically:
# - Check for Python and Node.js
# - Start the backend server on port 8080
# - Start the frontend server on port 3000
# - Open the dashboard in your browser
```

### Manual Setup & Run (Step-by-Step)

#### 1. Backend Server Setup
Open a terminal, navigate to the `backend` directory, activate the virtual environment, and start the FastAPI server:
```bash
# Navigate to backend
cd backend

# Activate Virtual Environment (Windows PowerShell)
.\venv\Scripts\activate

# Or on macOS/Linux:
# source venv/bin/activate


# Install dependencies
pip install -r requirements.txt

# Start development server on port 8080 (to avoid WSL relays)
python -m uvicorn app.main:app --port 8080 --reload
```
The backend API documentation will be available at [http://localhost:8080/docs](http://localhost:8080/docs).

#### 2. Frontend Dashboard Setup
Open a second terminal, navigate to the `frontend` directory, install dependencies, and start the Next.js development server:
```bash
# Navigate to frontend
cd frontend

# Install package dependencies
npm install

# Start Next.js dev server
npm run dev
```
Open your browser and navigate to **[http://localhost:3000](http://localhost:3000)** to view the dashboard.

---

## 🔌 API Endpoints Reference

The FastAPI backend exposes the following REST endpoints:

### Core Data Endpoints (v1)
*   `GET /`: Base health status.
*   `GET /api/nodes/summary`: Returns core network KPIs (total reachable nodes, 24h count change, average consensus block height, top country, and ASN percentages).
*   `GET /api/nodes/map`: Returns coordinate coordinates and metadata (e.g. User Agent, ASN, block height) for active nodes. Supports optional filter parameters `?country=...` and `?asn=...`.
*   `GET /api/nodes/stats`: Returns aggregated data for ECharts graphics (top country shares, top ASN hosting providers, client versions, and 30-day historical trend).
*   `GET /api/nodes/download`: Stream-generates a downloadable CSV containing the entire active node list, formatted for direct GIS ingestion.

### New in v2.0.0: Snapshot Management
*   `GET /api/snapshots/history`: Get list of available snapshots with metadata.
*   `GET /api/snapshots/latest`: Get the latest snapshot with full data.
*   `GET /api/snapshots/compare?snapshot1_id=X&snapshot2_id=Y`: Compare two snapshots, returns differences and trends.

### New in v2.0.0: Export Functionality
*   `GET /api/export/json`: Export complete dataset as JSON.
*   `GET /api/export/analytics-json`: Export analytics summary as JSON.
*   `GET /api/export/countries-csv`: Export countries aggregation as CSV.
*   `GET /api/export/asns-csv`: Export ASN aggregation as CSV.

### New in v2.0.0: Tooltip Data
*   `GET /api/tooltips/summary`: Get summary tooltip data.
*   `GET /api/tooltips/chart-data`: Get chart data with tooltip configurations.

**Interactive API Documentation**: Visit [http://localhost:8080/docs](http://localhost:8080/docs) for Swagger UI with test capabilities.

---

## 📚 Documentation

*   [Installation Guide](./INSTALLATION_GUIDE.md) - Complete setup instructions
*   [Features v2.0.0](./FEATURES_v2.md) - Detailed feature documentation
*   [API Endpoint Examples](#api-endpoints-reference) - REST API reference

---

## 🖥️ VS Code Git & GitHub Publishing Guide

To push this project to a new repository on your GitHub account from VS Code:

1. Open a new terminal in the **root folder** of the project (`bitcoin-node-dashboard`).
2. Run the following Git commands:

```bash
# Initialize local git repository
git init

# Add all project files
git add .

# Create the initial commit
git commit -m "feat: implement high-fidelity bitcoin node geography dashboard"

# Rename default branch to main
git branch -M main

# Link to your personal GitHub repository (replace with your actual GitHub repository URL)
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/bitcoin-node-geography.git

# Push the code to GitHub
git push -u origin main
```
*(If you are not logged in to GitHub on VS Code, it will automatically open a browser window to securely authorize your git client.)*
