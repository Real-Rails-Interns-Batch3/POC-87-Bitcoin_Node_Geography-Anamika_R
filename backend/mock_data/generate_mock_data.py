import json
import random
from datetime import datetime, timedelta

# Top Countries for Bitcoin Nodes
countries_data = [
    {"country": "United States", "code": "US", "lat": 37.0902, "lng": -95.7129, "base_nodes": 4820, "asns": [
        {"asn": "AS16509", "org": "Amazon.com, Inc.", "nodes": 1250},
        {"asn": "AS14061", "org": "DigitalOcean, LLC", "nodes": 980},
        {"asn": "AS7922", "org": "Comcast Cable Communications, LLC", "nodes": 850},
        {"asn": "AS7018", "org": "AT&T Services, Inc.", "nodes": 640},
        {"asn": "AS20473", "org": "The Constant Company, LLC (Vultr)", "nodes": 600},
        {"asn": "AS15169", "org": "Google LLC", "nodes": 500}
    ]},
    {"country": "Germany", "code": "DE", "lat": 51.1657, "lng": 10.4515, "base_nodes": 2150, "asns": [
        {"asn": "AS24940", "org": "Hetzner Online GmbH", "nodes": 1420},
        {"asn": "AS3209", "org": "Vodafone GmbH", "nodes": 350},
        {"asn": "AS3320", "org": "Deutsche Telekom AG", "nodes": 280},
        {"asn": "AS42730", "org": "EVANZO e-commerce GmbH", "nodes": 100}
    ]},
    {"country": "France", "code": "FR", "lat": 46.2276, "lng": 2.2137, "base_nodes": 980, "asns": [
        {"asn": "AS16276", "org": "OVH SAS", "nodes": 680},
        {"asn": "AS21502", "org": "Iliad S.A.", "nodes": 180},
        {"asn": "AS3215", "org": "Orange S.A.", "nodes": 120}
    ]},
    {"country": "Netherlands", "code": "NL", "lat": 52.1326, "lng": 5.2913, "base_nodes": 850, "asns": [
        {"asn": "AS60003", "org": "Leaseweb Global B.V.", "nodes": 450},
        {"asn": "AS12859", "org": "BIT B.V.", "nodes": 250},
        {"asn": "AS1136", "org": "KPN B.V.", "nodes": 150}
    ]},
    {"country": "Canada", "code": "CA", "lat": 56.1304, "lng": -106.3468, "base_nodes": 720, "asns": [
        {"asn": "AS852", "org": "TELUS Communications Inc.", "nodes": 280},
        {"asn": "AS577", "org": "BACOM (Rogers)", "nodes": 240},
        {"asn": "AS16276", "org": "OVH SAS (CA)", "nodes": 200}
    ]},
    {"country": "United Kingdom", "code": "GB", "lat": 55.3781, "lng": -3.4360, "base_nodes": 680, "asns": [
        {"asn": "AS5607", "org": "Sky UK Limited", "nodes": 250},
        {"asn": "AS2856", "org": "British Telecommunications PLC", "nodes": 230},
        {"asn": "AS12576", "org": "EE Limited", "nodes": 200}
    ]},
    {"country": "Singapore", "code": "SG", "lat": 1.3521, "lng": 103.8198, "base_nodes": 590, "asns": [
        {"asn": "AS14061", "org": "DigitalOcean, LLC", "nodes": 220},
        {"asn": "AS16509", "org": "Amazon.com, Inc.", "nodes": 190},
        {"asn": "AS55836", "org": "Reliance Jio Infocomm Ltd (SG)", "nodes": 180}
    ]},
    {"country": "Japan", "code": "JP", "lat": 36.2048, "lng": 138.2529, "base_nodes": 510, "asns": [
        {"asn": "AS2516", "org": "KDDI Corporation", "nodes": 210},
        {"asn": "AS17676", "org": "SoftBank Corp.", "nodes": 180},
        {"asn": "AS2914", "org": "NTT Communications", "nodes": 120}
    ]},
    {"country": "Finland", "code": "FI", "lat": 61.9241, "lng": 25.7482, "base_nodes": 450, "asns": [
        {"asn": "AS24940", "org": "Hetzner Online GmbH (FI)", "nodes": 350},
        {"asn": "AS1759", "org": "Telia Finland Oyj", "nodes": 100}
    ]},
    {"country": "Australia", "code": "AU", "lat": -25.2744, "lng": 133.7751, "base_nodes": 390, "asns": [
        {"asn": "AS13335", "org": "Cloudflare Inc (AU)", "nodes": 150},
        {"asn": "AS1221", "org": "Telstra Corporation", "nodes": 140},
        {"asn": "AS4804", "org": "Optus Networks Pty Ltd", "nodes": 100}
    ]}
]

# Generate user agents
user_agents = [
    "/Satoshi:27.0.0/",
    "/Satoshi:26.0.0/",
    "/Satoshi:25.0.0/",
    "/Satoshi:24.0.1/",
    "/Satoshi:23.0.0/",
    "/Satoshi:0.21.1/",
    "/Satoshi:27.1.0/"
]
ua_weights = [55, 20, 10, 8, 4, 2, 1]

# Historical trends for 30 days
start_date = datetime.now() - timedelta(days=30)
history = []
base_count = 14320
for i in range(31):
    day = start_date + timedelta(days=i)
    noise = random.randint(-150, 200)
    count = base_count + (i * 45) + noise
    history.append({
        "date": day.strftime("%Y-%m-%d"),
        "count": count
    })

# Compute aggregates
total_nodes = sum(c["base_nodes"] for c in countries_data)
# Add some extra miscellaneous nodes from other countries
total_nodes += 2150 
change_24h = "+1.8%"

country_list = []
asn_map = {}
nodes_sample = []

node_id = 1
for c in countries_data:
    country_list.append({
        "country": c["country"],
        "code": c["code"],
        "nodes": c["base_nodes"],
        "percentage": round((c["base_nodes"] / total_nodes) * 100, 2),
        "lat": c["lat"],
        "lng": c["lng"]
    })
    
    # Generate ASNs
    for a in c["asns"]:
        if a["asn"] not in asn_map:
            asn_map[a["asn"]] = {"asn": a["asn"], "org": a["org"], "nodes": 0}
        asn_map[a["asn"]]["nodes"] += a["nodes"]

        # Generate individual node samples for map
        num_samples = max(2, int(a["nodes"] / 40)) # downsample for visual representation
        for _ in range(num_samples):
            # add small offset to coordinate to spread them on map
            offset_lat = random.uniform(-1.5, 1.5)
            offset_lng = random.uniform(-1.5, 1.5)
            nodes_sample.append({
                "id": node_id,
                "lat": round(c["lat"] + offset_lat, 4),
                "lng": round(c["lng"] + offset_lng, 4),
                "country": c["country"],
                "code": c["code"],
                "asn": a["asn"],
                "org": a["org"],
                "user_agent": random.choices(user_agents, weights=ua_weights)[0],
                "height": random.randint(840000, 846000),
                "status": "active"
            })
            node_id += 1

# Add some other random countries nodes
other_countries = [
    ("Brazil", "BR", -14.235, -51.9253),
    ("India", "IN", 20.5937, 78.9629),
    ("China", "CN", 35.8617, 104.1954),
    ("South Africa", "ZA", -30.5595, 22.9375),
    ("Russia", "RU", 61.524, 105.3188),
    ("Switzerland", "CH", 46.8182, 8.2275),
    ("Sweden", "SE", 60.1282, 18.6435)
]
for country, code, lat, lng in other_countries:
    nodes_count = random.randint(150, 350)
    country_list.append({
        "country": country,
        "code": code,
        "nodes": nodes_count,
        "percentage": round((nodes_count / total_nodes) * 100, 2),
        "lat": lat,
        "lng": lng
    })
    
    # Generate standard sample nodes
    for _ in range(random.randint(3, 7)):
        offset_lat = random.uniform(-2, 2)
        offset_lng = random.uniform(-2, 2)
        nodes_sample.append({
            "id": node_id,
            "lat": round(lat + offset_lat, 4),
            "lng": round(lng + offset_lng, 4),
            "country": country,
            "code": code,
            "asn": "AS_VARIOUS",
            "org": "Local Telecom / ISP",
            "user_agent": random.choices(user_agents, weights=ua_weights)[0],
            "height": random.randint(840000, 846000),
            "status": "active"
        })
        node_id += 1

# Format ASNs leaderboard
asn_list = []
for k, v in asn_map.items():
    v["percentage"] = round((v["nodes"] / total_nodes) * 100, 2)
    asn_list.append(v)
asn_list.sort(key=lambda x: x["nodes"], reverse=True)

# Format User Agents distribution
ua_dict = {}
for n in nodes_sample:
    ua_dict[n["user_agent"]] = ua_dict.get(n["user_agent"], 0) + 1
ua_list = []
for k, v in ua_dict.items():
    ua_list.append({
        "user_agent": k,
        "count": v,
        "percentage": round((v / len(nodes_sample)) * 100, 2)
    })
ua_list.sort(key=lambda x: x["count"], reverse=True)

# Final high-fidelity dataset
high_fidelity_data = {
    "summary": {
        "total_nodes": total_nodes,
        "change_24h": change_24h,
        "top_country": country_list[0]["country"],
        "top_country_percentage": country_list[0]["percentage"],
        "top_asn": asn_list[0]["org"],
        "top_asn_percentage": asn_list[0]["percentage"],
        "block_height": 845920,
        "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC")
    },
    "countries": sorted(country_list, key=lambda x: x["nodes"], reverse=True),
    "asns": asn_list[:15],
    "user_agents": ua_list,
    "nodes": nodes_sample,
    "history": history
}

with open("nodes.json", "w") as f:
    json.dump(high_fidelity_data, f, indent=2)

print(f"Generated {len(nodes_sample)} sample nodes across {len(country_list)} countries successfully.")
