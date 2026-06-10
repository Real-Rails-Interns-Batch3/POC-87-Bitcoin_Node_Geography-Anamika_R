"""
Reusable Data Adapters for Bitcoin Node Geography
Handles transformation and aggregation of node data for various outputs
"""

import json
import csv
import io
from datetime import datetime
from typing import List, Dict, Any, Optional
import pandas as pd


class BaseDataAdapter:
    """Base adapter for data transformation"""
    
    def __init__(self, data: Dict[str, Any]):
        self.data = data
        self.timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC")
    
    def get_summary(self) -> Dict[str, Any]:
        return self.data.get("summary", {})
    
    def get_nodes(self) -> List[Dict[str, Any]]:
        return self.data.get("nodes", [])
    
    def get_countries(self) -> List[Dict[str, Any]]:
        return self.data.get("countries", [])
    
    def get_asns(self) -> List[Dict[str, Any]]:
        return self.data.get("asns", [])
    
    def get_history(self) -> List[Dict[str, Any]]:
        return self.data.get("history", [])


class CSVExportAdapter(BaseDataAdapter):
    """Adapter for exporting data to CSV format"""
    
    def export_nodes_csv(self) -> str:
        """Export nodes data as CSV"""
        nodes = self.get_nodes()
        if not nodes:
            return ""
        
        output = io.StringIO()
        fieldnames = list(nodes[0].keys())
        writer = csv.DictWriter(output, fieldnames=fieldnames)
        
        writer.writeheader()
        for node in nodes:
            writer.writerow(node)
        
        return output.getvalue()
    
    def export_countries_csv(self) -> str:
        """Export countries aggregation as CSV"""
        countries = self.get_countries()
        output = io.StringIO()
        
        if not countries:
            return ""
        
        fieldnames = list(countries[0].keys())
        writer = csv.DictWriter(output, fieldnames=fieldnames)
        
        writer.writeheader()
        for country in countries:
            writer.writerow(country)
        
        return output.getvalue()
    
    def export_asns_csv(self) -> str:
        """Export ASN aggregation as CSV"""
        asns = self.get_asns()
        output = io.StringIO()
        
        if not asns:
            return ""
        
        fieldnames = list(asns[0].keys())
        writer = csv.DictWriter(output, fieldnames=fieldnames)
        
        writer.writeheader()
        for asn in asns:
            writer.writerow(asn)
        
        return output.getvalue()


class JSONExportAdapter(BaseDataAdapter):
    """Adapter for exporting data to JSON format"""
    
    def export_full_json(self) -> str:
        """Export complete dataset as JSON"""
        return json.dumps(self.data, indent=2)
    
    def export_summary_json(self) -> str:
        """Export only summary as JSON"""
        return json.dumps(self.get_summary(), indent=2)
    
    def export_analytics_json(self) -> str:
        """Export analytics data (countries, ASNs, history)"""
        analytics = {
            "timestamp": self.timestamp,
            "countries": self.get_countries(),
            "asns": self.get_asns(),
            "history": self.get_history()
        }
        return json.dumps(analytics, indent=2)


class SnapshotComparator(BaseDataAdapter):
    """Adapter for comparing two snapshots"""
    
    def __init__(self, data1: Dict[str, Any], data2: Dict[str, Any]):
        self.data1 = data1
        self.data2 = data2
        super().__init__(data1)
    
    def compare_summaries(self) -> Dict[str, Any]:
        """Compare summary metrics between two snapshots"""
        summary1 = self.data1.get("summary", {})
        summary2 = self.data2.get("summary", {})
        
        comparison = {
            "timestamp1": summary1.get("last_updated", "Unknown"),
            "timestamp2": summary2.get("last_updated", "Unknown"),
            "total_nodes_1": summary1.get("total_nodes", 0),
            "total_nodes_2": summary2.get("total_nodes", 0),
            "nodes_change": summary2.get("total_nodes", 0) - summary1.get("total_nodes", 0),
            "nodes_change_percent": self._calculate_change_percent(
                summary1.get("total_nodes", 0),
                summary2.get("total_nodes", 0)
            ),
            "block_height_1": summary1.get("block_height", 0),
            "block_height_2": summary2.get("block_height", 0),
            "top_country_1": summary1.get("top_country", "Unknown"),
            "top_country_2": summary2.get("top_country", "Unknown"),
            "top_country_change": summary1.get("top_country") != summary2.get("top_country"),
            "top_asn_1": summary1.get("top_asn", "Unknown"),
            "top_asn_2": summary2.get("top_asn", "Unknown"),
            "top_asn_change": summary1.get("top_asn") != summary2.get("top_asn")
        }
        return comparison
    
    def compare_countries(self) -> Dict[str, Any]:
        """Compare country distributions"""
        countries1 = {c["code"]: c for c in self.data1.get("countries", [])}
        countries2 = {c["code"]: c for c in self.data2.get("countries", [])}
        
        all_codes = set(countries1.keys()) | set(countries2.keys())
        
        country_diffs = {}
        for code in sorted(all_codes):
            c1 = countries1.get(code, {})
            c2 = countries2.get(code, {})
            
            nodes1 = c1.get("nodes", 0)
            nodes2 = c2.get("nodes", 0)
            
            country_diffs[code] = {
                "country": c2.get("country", c1.get("country", "Unknown")),
                "nodes_before": nodes1,
                "nodes_after": nodes2,
                "nodes_diff": nodes2 - nodes1,
                "percentage_before": c1.get("percentage", 0),
                "percentage_after": c2.get("percentage", 0),
                "percentage_diff": c2.get("percentage", 0) - c1.get("percentage", 0)
            }
        
        return {
            "countries": country_diffs,
            "total_countries_1": len(countries1),
            "total_countries_2": len(countries2)
        }
    
    def compare_asns(self) -> Dict[str, Any]:
        """Compare ASN distributions"""
        asns1 = {a["asn"]: a for a in self.data1.get("asns", [])}
        asns2 = {a["asn"]: a for a in self.data2.get("asns", [])}
        
        all_asns = set(asns1.keys()) | set(asns2.keys())
        
        asn_diffs = {}
        for asn in sorted(all_asns):
            a1 = asns1.get(asn, {})
            a2 = asns2.get(asn, {})
            
            nodes1 = a1.get("nodes", 0)
            nodes2 = a2.get("nodes", 0)
            
            asn_diffs[asn] = {
                "org": a2.get("org", a1.get("org", "Unknown")),
                "nodes_before": nodes1,
                "nodes_after": nodes2,
                "nodes_diff": nodes2 - nodes1,
                "percentage_before": a1.get("percentage", 0),
                "percentage_after": a2.get("percentage", 0),
                "percentage_diff": a2.get("percentage", 0) - a1.get("percentage", 0)
            }
        
        return {
            "asns": asn_diffs,
            "total_asns_1": len(asns1),
            "total_asns_2": len(asns2)
        }
    
    def get_full_comparison(self) -> Dict[str, Any]:
        """Get complete comparison report"""
        return {
            "summary_comparison": self.compare_summaries(),
            "country_comparison": self.compare_countries(),
            "asn_comparison": self.compare_asns(),
            "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC")
        }
    
    @staticmethod
    def _calculate_change_percent(before: float, after: float) -> float:
        """Calculate percentage change"""
        if before == 0:
            return 0.0
        return round((after - before) / before * 100, 2)


class ChartDataAdapter(BaseDataAdapter):
    """Adapter for preparing data for chart visualization"""
    
    def get_country_chart_data(self) -> Dict[str, Any]:
        """Prepare country data for ECharts"""
        countries = self.get_countries()
        
        names = [c["country"] for c in countries[:10]]
        values = [c["nodes"] for c in countries[:10]]
        
        return {
            "type": "pie",
            "names": names,
            "values": values,
            "tooltip_template": "{name}: {value} nodes ({percentage}%)"
        }
    
    def get_asn_chart_data(self) -> Dict[str, Any]:
        """Prepare ASN data for ECharts"""
        asns = self.get_asns()
        
        names = [a["org"] for a in asns[:10]]
        values = [a["nodes"] for a in asns[:10]]
        
        return {
            "type": "bar",
            "names": names,
            "values": values,
            "tooltip_template": "{name}: {value} nodes ({percentage}%)"
        }
    
    def get_history_chart_data(self) -> Dict[str, Any]:
        """Prepare history data for ECharts line chart"""
        history = self.get_history()
        
        dates = [h["date"] for h in history]
        counts = [h["count"] for h in history]
        
        return {
            "type": "line",
            "dates": dates,
            "counts": counts,
            "tooltip_template": "{date}: {count} nodes"
        }


class TooltipAdapter(BaseDataAdapter):
    """Adapter for generating tooltip content"""
    
    def get_node_tooltip(self, node: Dict[str, Any]) -> Dict[str, str]:
        """Generate tooltip for a node marker"""
        return {
            "title": f"Node {node.get('id', 'N/A')}",
            "country": node.get("country", "Unknown"),
            "asn": f"{node.get('asn', 'Unknown')} - {node.get('org', 'Unknown')}",
            "user_agent": node.get("user_agent", "Unknown"),
            "height": str(node.get("height", "Unknown")),
            "status": node.get("status", "Unknown").upper()
        }
    
    def get_country_tooltip(self, country: Dict[str, Any]) -> Dict[str, str]:
        """Generate tooltip for country aggregate"""
        return {
            "country": country.get("country", "Unknown"),
            "code": country.get("code", "XX"),
            "nodes": str(country.get("nodes", 0)),
            "percentage": f"{country.get('percentage', 0)}%",
            "position": f"{country.get('lat', 0):.4f}, {country.get('lng', 0):.4f}"
        }
    
    def get_asn_tooltip(self, asn: Dict[str, Any]) -> Dict[str, str]:
        """Generate tooltip for ASN aggregate"""
        return {
            "org": asn.get("org", "Unknown"),
            "asn": asn.get("asn", "Unknown"),
            "nodes": str(asn.get("nodes", 0)),
            "percentage": f"{asn.get('percentage', 0)}%"
        }
    
    def get_summary_tooltip(self) -> Dict[str, str]:
        """Generate tooltip for summary statistics"""
        summary = self.get_summary()
        return {
            "total_nodes": str(summary.get("total_nodes", 0)),
            "change_24h": summary.get("change_24h", "N/A"),
            "block_height": str(summary.get("block_height", 0)),
            "last_updated": summary.get("last_updated", "Unknown")
        }
