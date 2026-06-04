"use client"

import { useState, useEffect, useMemo } from "react"
import Sidebar from "@/components/Sidebar"
import MapSection from "@/components/MapSection"

interface Node {
  id: number
  lat: number
  lng: number
  country: string
  code: string
  asn: string
  org: string
  user_agent: string
  height: number
  status: string
}

interface Summary {
  total_nodes: number
  change_24h: string
  top_country: string
  top_country_percentage: number
  top_asn: string
  top_asn_percentage: number
  block_height: number
  last_updated: string
}

interface Country {
  country: string
  code: string
  nodes: number
  percentage: number
  lat: number
  lng: number
}

interface ASN {
  asn: string
  org: string
  nodes: number
  percentage: number
}

interface UserAgent {
  user_agent: string
  count: number
  percentage: number
}

interface HistoryItem {
  date: string
  count: number
}

export default function Home() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [countries, setCountries] = useState<Country[]>([])
  const [asns, setAsns] = useState<ASN[]>([])
  const [userAgents, setUserAgents] = useState<UserAgent[]>([])
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [nodes, setNodes] = useState<Node[]>([])
  
  // Filtering state
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedAsn, setSelectedAsn] = useState("")
  const [selectedUa, setSelectedUa] = useState("")
  
  // Handshake stage selection state
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  
  // Map viewport state
  const [mapViewport, setMapViewport] = useState<{ center: [number, number]; zoom: number }>({
    center: [20, 0],
    zoom: 2
  })
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Local fallback if API is not available (2-Hour Rule Guardrail)
  const loadFallbackLocalData = () => {
    console.warn("Loading frontend fallback mock dataset...")
    const fallbackSummary: Summary = {
      total_nodes: 13910,
      change_24h: "+1.9%",
      top_country: "United States",
      top_country_percentage: 34.65,
      top_asn: "Hetzner Online GmbH",
      top_asn_percentage: 10.21,
      block_height: 845920,
      last_updated: new Date().toISOString().replace('T', ' ').substring(0, 19) + " UTC"
    }

    const fallbackCountries: Country[] = [
      { country: "United States", code: "US", nodes: 4820, percentage: 34.65, lat: 37.0902, lng: -95.7129 },
      { country: "Germany", code: "DE", nodes: 2150, percentage: 15.46, lat: 51.1657, lng: 10.4515 },
      { country: "France", code: "FR", nodes: 980, percentage: 7.05, lat: 46.2276, lng: 2.2137 },
      { country: "Netherlands", code: "NL", nodes: 850, percentage: 6.11, lat: 52.1326, lng: 5.2913 },
      { country: "Canada", code: "CA", nodes: 720, percentage: 5.18, lat: 56.1304, lng: -106.3468 }
    ]

    const fallbackAsns: ASN[] = [
      { asn: "AS24940", org: "Hetzner Online GmbH", nodes: 1420, percentage: 10.21 },
      { asn: "AS16509", org: "Amazon.com, Inc.", nodes: 1250, percentage: 8.99 },
      { asn: "AS14061", org: "DigitalOcean, LLC", nodes: 980, percentage: 7.05 }
    ]

    const fallbackUas: UserAgent[] = [
      { user_agent: "/Satoshi:27.0.0/", count: 180, percentage: 54.8 },
      { user_agent: "/Satoshi:26.0.0/", count: 65, percentage: 19.8 },
      { user_agent: "/Satoshi:25.0.0/", count: 32, percentage: 9.7 }
    ]

    const fallbackHistory: HistoryItem[] = [
      { date: "2026-05-25", count: 13700 },
      { date: "2026-05-28", count: 13780 },
      { date: "2026-06-01", count: 13850 },
      { date: "2026-06-04", count: 13910 }
    ]

    const fallbackNodes: Node[] = [
      { id: 1, lat: 40.7128, lng: -74.0060, country: "United States", code: "US", asn: "AS14061", org: "DigitalOcean, LLC", user_agent: "/Satoshi:27.0.0/", height: 845920, status: "active" },
      { id: 2, lat: 37.7749, lng: -122.4194, country: "United States", code: "US", asn: "AS16509", org: "Amazon.com, Inc.", user_agent: "/Satoshi:26.0.0/", height: 845920, status: "active" },
      { id: 3, lat: 52.5200, lng: 13.4050, country: "Germany", code: "DE", asn: "AS24940", org: "Hetzner Online GmbH", user_agent: "/Satoshi:27.0.0/", height: 845919, status: "active" },
      { id: 4, lat: 48.8566, lng: 2.3522, country: "France", code: "FR", asn: "AS16276", org: "OVH SAS", user_agent: "/Satoshi:27.0.0/", height: 845920, status: "active" },
      { id: 5, lat: 52.3676, lng: 4.9041, country: "Netherlands", code: "NL", asn: "AS60003", org: "Leaseweb Global B.V.", user_agent: "/Satoshi:25.0.0/", height: 845918, status: "active" }
    ]

    setSummary(fallbackSummary)
    setCountries(fallbackCountries)
    setAsns(fallbackAsns)
    setUserAgents(fallbackUas)
    setHistory(fallbackHistory)
    setNodes(fallbackNodes)
    setLoading(false)
  }

  // Fetch telemetry datasets
  useEffect(() => {
    const fetchData = async () => {
      try {
        const backendUrl = "http://localhost:8080"
        
        // Fetch Summary
        const summaryRes = await fetch(`${backendUrl}/api/nodes/summary`)
        if (!summaryRes.ok) throw new Error("Failed to fetch summary")
        const summaryData = await summaryRes.json()
        setSummary(summaryData)

        // Fetch Stats (Charts, Leaderboards, History)
        const statsRes = await fetch(`${backendUrl}/api/nodes/stats`)
        if (!statsRes.ok) throw new Error("Failed to fetch stats")
        const statsData = await statsRes.json()
        setCountries(statsData.countries)
        setAsns(statsData.asns)
        setUserAgents(statsData.user_agents)
        setHistory(statsData.history)

        // Fetch Map Points
        const mapRes = await fetch(`${backendUrl}/api/nodes/map`)
        if (!mapRes.ok) throw new Error("Failed to fetch map points")
        const mapData = await mapRes.json()
        setNodes(mapData)
        
        setLoading(false)
      } catch (err: any) {
        console.error("API Fetch Error, activating fallback:", err)
        setError(err.message)
        loadFallbackLocalData()
      }
    }

    fetchData()
  }, [])

  // Filter handlers with map fly-to viewport handshake
  const handleCountryChange = (countryName: string) => {
    setSelectedCountry(countryName)
    setSelectedNode(null) // clear selected node details when filter changes
    
    if (countryName) {
      const match = countries.find(c => c.country.toLowerCase() === countryName.toLowerCase())
      if (match) {
        // Move viewport to this country
        setMapViewport({
          center: [match.lat, match.lng],
          zoom: 4
        })
      }
    } else {
      // Reset viewport if country cleared
      setMapViewport({
        center: [20, 0],
        zoom: 2
      })
    }
  }

  const handleAsnChange = (asnCode: string) => {
    setSelectedAsn(asnCode)
    setSelectedNode(null)
  }

  const handleUaChange = (uaString: string) => {
    setSelectedUa(uaString)
    setSelectedNode(null)
  }

  const handleClearFilters = () => {
    setSelectedCountry("")
    setSelectedAsn("")
    setSelectedUa("")
    setSelectedNode(null)
    setMapViewport({
      center: [20, 0],
      zoom: 2
    })
  }

  // Stage Handshake: click on a node on the map updates the viewport and sets active selection in Sidebar
  const handleSelectNode = (node: Node | null) => {
    setSelectedNode(node)
    if (node) {
      // Pan to the selected node slightly zoomed in
      setMapViewport({
        center: [node.lat, node.lng],
        zoom: 5
      })
    }
  }

  // Memoize filtered nodes to prevent unnecessary recalculations
  const filteredNodes = useMemo(() => {
    return nodes.filter(node => {
      const matchCountry = !selectedCountry || node.country.toLowerCase() === selectedCountry.toLowerCase()
      const matchAsn = !selectedAsn || node.asn.toLowerCase() === selectedAsn.toLowerCase()
      const matchUa = !selectedUa || node.user_agent.toLowerCase() === selectedUa.toLowerCase()
      return matchCountry && matchAsn && matchUa
    })
  }, [nodes, selectedCountry, selectedAsn, selectedUa])

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#030712] flex flex-col items-center justify-center font-mono text-sm text-[#38BDF8] gap-4">
        <div className="w-12 h-12 border-t-2 border-r-2 border-[#38BDF8] rounded-full animate-spin"></div>
        <div className="flex flex-col items-center gap-1">
          <div className="tracking-widest">CONNECTING TO REAL RAILS NODE NETWORK...</div>
          <div className="text-[10px] text-slate-500">Retrieving geographical node telemetry snapshots</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#030712] overflow-hidden select-none">
      
      {/* Main Stage (70%): High-Performance Interactive Map */}
      <div className="w-[70%] h-full relative border-r border-[#1F2937]">
        <MapSection
          nodes={filteredNodes}
          selectedNode={selectedNode}
          onSelectNode={handleSelectNode}
          mapViewport={mapViewport}
        />
      </div>

      {/* Intelligence Sidebar (30%): Interactive metrics and controls */}
      <div className="w-[30%] h-full bg-[#0B1117] relative z-10">
        <Sidebar
          summary={summary}
          countries={countries}
          asns={asns}
          userAgents={userAgents}
          history={history}
          selectedCountry={selectedCountry}
          selectedAsn={selectedAsn}
          selectedUa={selectedUa}
          onCountryChange={handleCountryChange}
          onAsnChange={handleAsnChange}
          onUaChange={handleUaChange}
          onClearFilters={handleClearFilters}
          selectedNode={selectedNode}
          onClearSelectedNode={() => setSelectedNode(null)}
        />
      </div>

    </div>
  )
}