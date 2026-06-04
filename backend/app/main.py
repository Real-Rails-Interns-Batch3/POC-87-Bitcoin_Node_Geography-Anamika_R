import io
import csv
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from app.nodes_service import get_nodes_data

app = FastAPI(title="Bitcoin Node Geography API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Bitcoin Node Geography API",
        "description": "Real-time global Bitcoin node distribution telemetry."
    }

@app.get("/api/nodes/summary")
def get_summary():
    """Returns overview KPIs for the Bitcoin node network."""
    data = get_nodes_data()
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
    nodes = data["nodes"]
    
    # Create an in-memory string buffer for CSV generation
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Write header
    writer.writerow(["Node ID", "Latitude", "Longitude", "Country", "Country Code", "ASN", "Organization", "User Agent", "Block Height", "Status"])
    
    # Write data rows
    for node in nodes:
        writer.writerow([
            node.get("id"),
            node.get("lat"),
            node.get("lng"),
            node.get("country"),
            node.get("code"),
            node.get("asn"),
            node.get("org"),
            node.get("user_agent"),
            node.get("height"),
            node.get("status")
        ])
        
    # Reset stream pointer
    output.seek(0)
    
    # Create Streaming Response
    response = StreamingResponse(
        iter([output.getvalue()]), 
        media_type="text/csv"
    )
    response.headers["Content-Disposition"] = "attachment; filename=bitcoin_nodes_geography.csv"
    return response

# Backwards compatibility endpoint for the original stub
@app.get("/nodes")
def old_nodes():
    return get_nodes_data()["nodes"]