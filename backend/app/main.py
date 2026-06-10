import io
import csv
import json
import os
from datetime import datetime, timedelta
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse, FileResponse
from .nodes_service import get_nodes_data
from .data_adapters import (
    CSVExportAdapter, JSONExportAdapter, SnapshotComparator, 
    ChartDataAdapter, TooltipAdapter
)

app = FastAPI(title="Bitcoin Node Geography API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory snapshot storage for comparison (can be replaced with persistent DB)
snapshots_storage = {}
SNAPSHOTS_FILE = os.path.join(os.path.dirname(__file__), "..", "snapshots_history.json")

def load_snapshots_history():
    """Load snapshot history from disk"""
    global snapshots_storage
    if os.path.exists(SNAPSHOTS_FILE):
        try:
            with open(SNAPSHOTS_FILE, "r") as f:
                snapshots_storage = json.load(f)
        except Exception as e:
            print(f"Error loading snapshots history: {e}")
    return snapshots_storage

def save_snapshots_history():
    """Save snapshot history to disk"""
    try:
        with open(SNAPSHOTS_FILE, "w") as f:
            json.dump(snapshots_storage, f, indent=2)
    except Exception as e:
        print(f"Error saving snapshots history: {e}")

def store_snapshot(snapshot_id: str, data: dict):
    """Store a snapshot with timestamp"""
    snapshots_storage[snapshot_id] = {
        "timestamp": datetime.now().isoformat(),
        "data": data
    }
    # Keep only last 10 snapshots to manage memory
    if len(snapshots_storage) > 10:
        oldest = min(snapshots_storage.items(), 
                    key=lambda x: x[1]["timestamp"])
        del snapshots_storage[oldest[0]]
    save_snapshots_history()

@app.on_event("startup")
def startup_event():
    """Load snapshots on startup"""
    load_snapshots_history()

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Bitcoin Node Geography API",
        "version": "2.0.0",
        "description": "Real-time global Bitcoin node distribution telemetry with snapshot comparison and export capabilities."
    }

@app.get("/api/nodes/summary")
def get_summary():
    """Returns overview KPIs for the Bitcoin node network."""
    data = get_nodes_data()
    
    # Auto-store snapshot
    store_snapshot(datetime.now().strftime("%Y%m%d_%H%M%S"), data)
    
    return data["summary"]

@app.get("/api/nodes/map")
def get_map_nodes(
    country: str = Query(None, description="Filter by Country Name"),
    asn: str = Query(None, description="Filter by ASN")
):
    """
    Returns active node coordinate samples for Leaflet visualization.
    Supports optional server-side filtering.
    """
    data = get_nodes_data()
    nodes = data["nodes"]
    
    # Filter if parameters are provided
    if country:
        nodes = [n for n in nodes if n["country"].lower() == country.lower()]
    if asn:
        nodes = [n for n in nodes if n["asn"].lower() == asn.lower()]
        
    return nodes

@app.get("/api/nodes/stats")
def get_stats():
    """Returns aggregation metrics for leaderboard charts and historical trends."""
    data = get_nodes_data()
    return {
        "countries": data["countries"],
        "asns": data["asns"],
        "user_agents": data["user_agents"],
        "history": data["history"]
    }

@app.get("/api/nodes/download")
def download_nodes_csv():
    """
    Generates and returns a downloadable CSV payload of the active Bitcoin nodes distribution.
    Format is compliant with standard GIS import systems.
    """
    data = get_nodes_data()
    
    # Use adapter for export
    adapter = CSVExportAdapter(data)
    csv_content = adapter.export_nodes_csv()
    
    # Create Streaming Response
    response = StreamingResponse(
        iter([csv_content]), 
        media_type="text/csv"
    )
    response.headers["Content-Disposition"] = "attachment; filename=bitcoin_nodes_geography.csv"
    return response

# NEW: Export Endpoints

@app.get("/api/export/json")
def export_to_json():
    """Export complete dataset as JSON"""
    data = get_nodes_data()
    adapter = JSONExportAdapter(data)
    content = adapter.export_full_json()
    
    response = StreamingResponse(
        iter([content]), 
        media_type="application/json"
    )
    response.headers["Content-Disposition"] = "attachment; filename=bitcoin_nodes_complete.json"
    return response

@app.get("/api/export/analytics-json")
def export_analytics_to_json():
    """Export analytics data (countries, ASNs, history) as JSON"""
    data = get_nodes_data()
    adapter = JSONExportAdapter(data)
    content = adapter.export_analytics_json()
    
    response = StreamingResponse(
        iter([content]), 
        media_type="application/json"
    )
    response.headers["Content-Disposition"] = "attachment; filename=bitcoin_nodes_analytics.json"
    return response

@app.get("/api/export/countries-csv")
def export_countries_to_csv():
    """Export countries aggregation as CSV"""
    data = get_nodes_data()
    adapter = CSVExportAdapter(data)
    content = adapter.export_countries_csv()
    
    response = StreamingResponse(
        iter([content]), 
        media_type="text/csv"
    )
    response.headers["Content-Disposition"] = "attachment; filename=bitcoin_nodes_by_country.csv"
    return response

@app.get("/api/export/asns-csv")
def export_asns_to_csv():
    """Export ASN aggregation as CSV"""
    data = get_nodes_data()
    adapter = CSVExportAdapter(data)
    content = adapter.export_asns_csv()
    
    response = StreamingResponse(
        iter([content]), 
        media_type="text/csv"
    )
    response.headers["Content-Disposition"] = "attachment; filename=bitcoin_nodes_by_asn.csv"
    return response

# NEW: Snapshot Management Endpoints

@app.get("/api/snapshots/history")
def get_snapshots_history():
    """Get list of available snapshots"""
    snapshot_list = [
        {
            "id": snap_id,
            "timestamp": snap_data["timestamp"],
            "total_nodes": snap_data["data"].get("summary", {}).get("total_nodes", 0),
            "top_country": snap_data["data"].get("summary", {}).get("top_country", "Unknown")
        }
        for snap_id, snap_data in sorted(snapshots_storage.items(), 
                                        key=lambda x: x[1]["timestamp"], reverse=True)
    ]
    return {
        "count": len(snapshot_list),
        "snapshots": snapshot_list
    }

@app.get("/api/snapshots/latest")
def get_latest_snapshot():
    """Get the latest snapshot data"""
    data = get_nodes_data()
    store_snapshot(datetime.now().strftime("%Y%m%d_%H%M%S"), data)
    return {
        "timestamp": datetime.now().isoformat(),
        "data": data
    }

@app.get("/api/snapshots/compare")
def compare_snapshots(
    snapshot1_id: str = Query(..., description="First snapshot ID or 'latest'"),
    snapshot2_id: str = Query(..., description="Second snapshot ID or 'latest'")
):
    """Compare two snapshots"""
    # Get first snapshot
    if snapshot1_id == "latest":
        data1 = get_nodes_data()
    elif snapshot1_id in snapshots_storage:
        data1 = snapshots_storage[snapshot1_id]["data"]
    else:
        return {"error": f"Snapshot {snapshot1_id} not found"}
    
    # Get second snapshot
    if snapshot2_id == "latest":
        data2 = get_nodes_data()
    elif snapshot2_id in snapshots_storage:
        data2 = snapshots_storage[snapshot2_id]["data"]
    else:
        return {"error": f"Snapshot {snapshot2_id} not found"}
    
    # Perform comparison
    comparator = SnapshotComparator(data1, data2)
    comparison_result = comparator.get_full_comparison()
    
    return {
        "snapshot1": snapshot1_id,
        "snapshot2": snapshot2_id,
        "comparison": comparison_result
    }

# NEW: Tooltip Data Endpoints

@app.get("/api/tooltips/summary")
def get_summary_tooltip():
    """Get tooltip data for summary statistics"""
    data = get_nodes_data()
    adapter = TooltipAdapter(data)
    return adapter.get_summary_tooltip()

@app.get("/api/tooltips/chart-data")
def get_chart_data_with_tooltips():
    """Get chart data with tooltip configurations"""
    data = get_nodes_data()
    adapter = ChartDataAdapter(data)
    
    return {
        "countries": adapter.get_country_chart_data(),
        "asns": adapter.get_asn_chart_data(),
        "history": adapter.get_history_chart_data()
    }

# Backwards compatibility endpoint for the original stub
@app.get("/nodes")
def old_nodes():
    return get_nodes_data()["nodes"]