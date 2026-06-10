# New Features - Release v2.0.0

This document outlines the new features added to the Bitcoin Node Geography Dashboard in v2.0.0.

## 🆕 Features Implemented

### 1. **Snapshot Comparison** 📊
Compare Bitcoin network statistics between two different time points to identify changes and trends.

**Features:**
- Select two snapshots from history
- Compare total nodes, block height, and top countries/ASNs
- View percentage changes with trend indicators
- Automatic alerts for top country/ASN changes
- Visual comparison of network metrics

**API Endpoints:**
- `GET /api/snapshots/history` - Get list of available snapshots
- `GET /api/snapshots/latest` - Get the latest snapshot
- `GET /api/snapshots/compare?snapshot1_id=X&snapshot2_id=Y` - Compare two snapshots

**UI Component:** `SnapshotComparison.tsx`

---

### 2. **Export Charts & Data** 📥
Export network data and analytics in multiple formats for analysis, reporting, and GIS integration.

**Export Formats:**
- **CSV Formats:**
  - All nodes with geographic and ASN data
  - Countries aggregation
  - ASN hosting provider aggregation
  
- **JSON Formats:**
  - Complete dataset
  - Analytics summary (countries, ASNs, historical data)

**API Endpoints:**
- `GET /api/nodes/download` - Export all nodes as CSV
- `GET /api/export/json` - Export complete dataset as JSON
- `GET /api/export/analytics-json` - Export analytics as JSON
- `GET /api/export/countries-csv` - Export countries as CSV
- `GET /api/export/asns-csv` - Export ASNs as CSV

**UI Component:** `ExportCharts.tsx` with `QuickExportButton.tsx`

---

### 3. **Reusable Data Adapters** 🔧
Modular data transformation layer for flexible data handling and format conversion.

**Adapter Classes** (in `data_adapters.py`):

1. **BaseDataAdapter** - Base class for all adapters
   - Common data access methods
   - Summary, nodes, countries, ASNs, history retrieval

2. **CSVExportAdapter** - CSV export functionality
   - `export_nodes_csv()` - Export individual nodes
   - `export_countries_csv()` - Export country aggregations
   - `export_asns_csv()` - Export ASN aggregations

3. **JSONExportAdapter** - JSON export functionality
   - `export_full_json()` - Complete dataset
   - `export_summary_json()` - Summary metrics only
   - `export_analytics_json()` - Analytics data

4. **SnapshotComparator** - Snapshot comparison
   - `compare_summaries()` - Compare summary metrics
   - `compare_countries()` - Compare country distributions
   - `compare_asns()` - Compare ASN distributions
   - `get_full_comparison()` - Complete comparison report

5. **ChartDataAdapter** - Chart data preparation
   - `get_country_chart_data()` - Data for country pie charts
   - `get_asn_chart_data()` - Data for ASN bar charts
   - `get_history_chart_data()` - Data for trend lines

6. **TooltipAdapter** - Tooltip content generation
   - `get_node_tooltip()` - Node marker tooltips
   - `get_country_tooltip()` - Country aggregate tooltips
   - `get_asn_tooltip()` - ASN aggregate tooltips
   - `get_summary_tooltip()` - Summary statistics tooltips

---

### 4. **Interactive Tooltips** 💬
Context-sensitive tooltips throughout the dashboard providing detailed information about metrics, charts, and data points.

**Tooltip Components:**
- `Tooltip.tsx` - Main tooltip component
- `TooltipTrigger.tsx` - Icon-based tooltip trigger
- `StatTooltip.tsx` - Statistic card with tooltip
- `ChartTooltip.tsx` - Chart-specific tooltips

**Locations:**
- KPI cards (Total Nodes, Block Height)
- Chart headers and legends
- Filter controls
- Snapshot comparison section
- Export options

**Features:**
- Hover-based display
- Configurable positioning (top, right, bottom, left)
- Smooth fade-in animation
- Mobile-friendly

---

### 5. **Enhanced Bitnodes API Integration** 🌐

**Improvements:**
- **Caching**: 5-minute TTL cache to reduce API calls and improve performance
- **Better Error Handling**: Specific exception handling for HTTP errors and connection issues
- **Connection Resilience**: Automatic fallback to mock data on any failure
- **Detailed Logging**: Enhanced logging for debugging API issues
- **Timeout Management**: 10-second timeout to prevent hanging

**Features:**
- Automatic fallback to mock data on failures
- Cache management to reduce API load
- 2-Hour Rule Guardrail: Always has data available
- Detailed error messages for troubleshooting

---

## 📁 File Structure

### Backend Changes
```
backend/
├── app/
│   ├── main.py (Enhanced with new endpoints)
│   ├── nodes_service.py (Improved API integration)
│   └── data_adapters.py (NEW - Reusable adapters)
├── mock_data/
│   └── nodes.json
├── snapshots_history.json (Generated at runtime)
└── requirements.txt (unchanged)
```

### Frontend Changes
```
frontend/
├── components/
│   ├── Sidebar.tsx (Updated with new components)
│   ├── Tooltip.tsx (NEW - Tooltip components)
│   ├── SnapshotComparison.tsx (NEW - Comparison UI)
│   ├── ExportCharts.tsx (NEW - Export UI)
│   ├── MapSection.tsx
│   └── RealMap.tsx
└── app/
    └── page.tsx
```

---

## 🚀 Usage Guide

### Backend Startup
```bash
cd backend
python -m uvicorn app.main:app --port 8080 --reload
```

### Frontend Startup
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 📊 New API Endpoints Reference

### Snapshot Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/snapshots/history` | GET | Get list of available snapshots |
| `/api/snapshots/latest` | GET | Get latest snapshot data |
| `/api/snapshots/compare` | GET | Compare two snapshots |

### Export Functionality
| Endpoint | Method | Format | Description |
|----------|--------|--------|-------------|
| `/api/nodes/download` | GET | CSV | All nodes with full data |
| `/api/export/json` | GET | JSON | Complete dataset |
| `/api/export/analytics-json` | GET | JSON | Analytics summary |
| `/api/export/countries-csv` | GET | CSV | Countries aggregation |
| `/api/export/asns-csv` | GET | CSV | ASN aggregation |

### Tooltip Data
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/tooltips/summary` | GET | Summary tooltip data |
| `/api/tooltips/chart-data` | GET | Chart data with tooltip configurations |

---

## 🎯 Key Benefits

✅ **Better Data Insights** - Compare snapshots to identify trends and changes
✅ **Flexible Exports** - Multiple formats for different use cases (CSV, JSON)
✅ **Enhanced UX** - Tooltips provide context without cluttering UI
✅ **Code Maintainability** - Reusable adapters for consistent data handling
✅ **API Resilience** - Improved error handling and fallbacks
✅ **Performance** - Caching reduces API calls and improves response times

---

## 🔄 Compatibility

- **Backend**: Python 3.10+, FastAPI 0.136.3
- **Frontend**: Node.js 18+, Next.js 16.2.7, React 19.2.4
- **Dependencies**: All existing dependencies maintained, no breaking changes

---

## 📝 Testing Checklist

- [x] Snapshot comparison functionality works
- [x] All export formats generate valid files
- [x] Tooltips display on hover
- [x] Bitnodes API integration with caching
- [x] Fallback to mock data works
- [x] Data adapters correctly transform data
- [x] No TypeScript errors
- [x] Responsive design maintained

---

## 🐛 Known Issues

None currently identified. Please report issues to the development team.

---

## 📞 Support

For questions or issues:
1. Check the error console (browser DevTools for frontend, terminal for backend)
2. Review API responses in Network tab (browser DevTools)
3. Check backend logs for API errors
4. Verify Bitnodes API availability

---

**Version**: 2.0.0
**Release Date**: 2026-06-10
**Status**: Production Ready ✅
