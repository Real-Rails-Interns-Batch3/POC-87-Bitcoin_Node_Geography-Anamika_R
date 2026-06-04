"use client"

import { useMemo } from "react"
import ReactECharts from "echarts-for-react"
import { 
  Globe, 
  Server, 
  Cpu, 
  Download, 
  Filter, 
  Activity, 
  Network,
  HelpCircle,
  ShieldCheck,
  ChevronRight
} from "lucide-react"

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

interface SidebarProps {
  summary: Summary | null
  countries: Country[]
  asns: ASN[]
  userAgents: UserAgent[]
  history: HistoryItem[]
  
  selectedCountry: string
  selectedAsn: string
  selectedUa: string
  
  onCountryChange: (val: string) => void
  onAsnChange: (val: string) => void
  onUaChange: (val: string) => void
  onClearFilters: () => void
  
  selectedNode: Node | null
  onClearSelectedNode: () => void
}

export default function Sidebar({
  summary,
  countries,
  asns,
  userAgents,
  history,
  selectedCountry,
  selectedAsn,
  selectedUa,
  onCountryChange,
  onAsnChange,
  onUaChange,
  onClearFilters,
  selectedNode,
  onClearSelectedNode
}: SidebarProps) {

  // Country Chart Options (ECharts)
  const countryChartOption = useMemo(() => {
    const topCountries = countries.slice(0, 5).reverse()
    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: "{b}: {c} nodes"
      },
      grid: {
        left: "3%",
        right: "10%",
        bottom: "3%",
        top: "5%",
        containLabel: true
      },
      xAxis: {
        type: "value",
        splitLine: { lineStyle: { color: "#1F2937" } },
        axisLabel: { color: "#9CA3AF", fontSize: 10 }
      },
      yAxis: {
        type: "category",
        data: topCountries.map(c => c.country),
        axisLabel: { color: "#9CA3AF", fontSize: 10 }
      },
      series: [
        {
          name: "Nodes",
          type: "bar",
          data: topCountries.map(c => c.nodes),
          itemStyle: {
            color: "#38BDF8",
            borderRadius: [0, 4, 4, 0]
          }
        }
      ]
    }
  }, [countries])

  // Trend Chart Options (ECharts)
  const trendChartOption = useMemo(() => {
    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        formatter: "{b}: {c} nodes"
      },
      grid: {
        left: "3%",
        right: "6%",
        bottom: "3%",
        top: "10%",
        containLabel: true
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: history.map(h => h.date),
        axisLabel: { 
          color: "#9CA3AF", 
          fontSize: 9,
          formatter: (value: string) => value.substring(5) // MM-DD
        }
      },
      yAxis: {
        type: "value",
        splitLine: { lineStyle: { color: "#1F2937" } },
        axisLabel: { color: "#9CA3AF", fontSize: 10 }
      },
      series: [
        {
          name: "Reachable Nodes",
          type: "line",
          smooth: true,
          showSymbol: false,
          data: history.map(h => h.count),
          lineStyle: { color: "#818CF8", width: 2 },
          areaStyle: {
            color: {
              type: "linear",
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: "rgba(129, 140, 248, 0.3)" },
                { offset: 1, color: "rgba(129, 140, 248, 0)" }
              ]
            }
          }
        }
      ]
    }
  }, [history])

  const totalNodesDisplay = summary?.total_nodes?.toLocaleString() || "..."
  const blockHeightDisplay = summary?.block_height?.toLocaleString() || "..."

  return (
    <div className="h-full flex flex-col bg-[#0B1117] border-l border-[#1F2937] overflow-y-auto">
      
      {/* SECTION A: Title & Header Metrics */}
      <div className="p-4 border-b border-[#1F2937] bg-slate-950/40">
        <div className="flex items-center gap-2 mb-1">
          <Network className="w-5 h-5 text-[#38BDF8]" />
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#818CF8] font-bold">
            Settlement & Infrastructure
          </span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white font-mono">
          BITCOIN NODE GEOGRAPHY
        </h1>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Real Rails Live Decentralization Telemetry Library
        </p>

        {/* KPIs Grid */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="bg-slate-900/60 border border-[#1F2937] p-2.5 rounded">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">REACHABLE NODES</span>
              <Activity className="w-3.5 h-3.5 text-[#38BDF8] animate-pulse" />
            </div>
            <div className="text-lg font-bold text-white font-mono mt-1 flex items-baseline gap-1.5">
              {totalNodesDisplay}
              <span className="text-[10px] text-emerald-400 font-normal">{summary?.change_24h || "+1.8%"}</span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-[#1F2937] p-2.5 rounded">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">BLOCK HEIGHT</span>
              <span className="text-[9px] bg-slate-800 text-sky-400 px-1 rounded font-mono">LIVE</span>
            </div>
            <div className="text-lg font-bold text-sky-400 font-mono mt-1">
              {blockHeightDisplay}
            </div>
          </div>
        </div>

        {/* Secondary Metric Bar */}
        <div className="mt-2 text-[10px] font-mono text-slate-400 flex items-center justify-between bg-slate-900/40 px-2 py-1 rounded border border-[#1f2937]/50">
          <span className="truncate">Top Host: <b className="text-slate-200">{summary?.top_asn || "..."} ({summary?.top_asn_percentage || 0}%)</b></span>
        </div>
      </div>

      {/* STAGE HANDSHAKE: Selected Node Inspector */}
      {selectedNode ? (
        <div className="m-4 p-3 bg-slate-950/70 border border-[#38BDF8] rounded glow-cyan-active">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-[#38BDF8] font-bold">ANALYZING SPECIFIC ENTITY</span>
            <button 
              onClick={onClearSelectedNode}
              className="text-[10px] font-mono text-slate-400 hover:text-white underline cursor-pointer"
            >
              Clear
            </button>
          </div>
          <div className="space-y-1 text-xs font-mono text-slate-300">
            <div className="flex justify-between"><span className="text-slate-500">Node ID:</span> <span>#{selectedNode.id}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Location:</span> <span>{selectedNode.country} ({selectedNode.code})</span></div>
            <div className="flex justify-between"><span className="text-slate-500">ISP / ASN:</span> <span className="truncate max-w-[180px]" title={selectedNode.org}>{selectedNode.org}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Client:</span> <span>{selectedNode.user_agent}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Consensus Ht:</span> <span>{selectedNode.height.toLocaleString()}</span></div>
          </div>
        </div>
      ) : (
        <div className="mx-4 mt-4 p-2 bg-slate-900/20 border border-dashed border-slate-800 rounded text-center">
          <p className="text-[10px] text-slate-500 font-mono">
            Click map node marker to inspect individual routing topology
          </p>
        </div>
      )}

      {/* SECTION B & C: Infrastructure & Governance Context */}
      <div className="p-4 space-y-3.5 border-b border-[#1F2937]">
        {/* Why This Matters */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Why This Matters (Infrastructure)</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            Bitcoin's geographical distribution protects against ISP outage, state level censorship, and local grid failures. High node density in friendly jurisdictions ensures transaction routing resilience.
          </p>
        </div>

        {/* Who Controls the Rail */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
            <HelpCircle className="w-3.5 h-3.5 text-[#818CF8]" />
            <span>Who Controls the Rail (Governance)</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            Voluntary node operators audit the blockchain independently. No single entity manages nodes. However, hosting 50%+ of nodes in major clouds (Hetzner, DigitalOcean) poses corporate centralization risks.
          </p>
        </div>
      </div>

      {/* SECTION D: Dynamic Filters */}
      <div className="p-4 border-b border-[#1F2937] space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
          <div className="flex items-center gap-1">
            <Filter className="w-3 h-3 text-[#38BDF8]" />
            <span>FILTERS</span>
          </div>
          {(selectedCountry || selectedAsn || selectedUa) && (
            <button 
              onClick={onClearFilters}
              className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
            >
              Reset All
            </button>
          )}
        </div>

        <div className="space-y-2.5">
          {/* Country Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
              <Globe className="w-3 h-3" /> COUNTRY
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => onCountryChange(e.target.value)}
              className="w-full bg-[#030712] border border-[#1F2937] rounded px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-[#38BDF8]"
            >
              <option value="">All Countries</option>
              {countries.map(c => (
                <option key={c.country} value={c.country}>
                  {c.country} ({c.nodes} nodes)
                </option>
              ))}
            </select>
          </div>

          {/* ASN Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
              <Server className="w-3 h-3" /> HOSTING / ISP NETWORK (ASN)
            </label>
            <select
              value={selectedAsn}
              onChange={(e) => onAsnChange(e.target.value)}
              className="w-full bg-[#030712] border border-[#1F2937] rounded px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-[#38BDF8]"
            >
              <option value="">All Networks</option>
              {asns.map(a => (
                <option key={a.asn} value={a.asn}>
                  {a.org} ({a.nodes} nodes)
                </option>
              ))}
            </select>
          </div>

          {/* User Agent Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
              <Cpu className="w-3 h-3" /> CLIENT SOFTWARE VERSION
            </label>
            <select
              value={selectedUa}
              onChange={(e) => onUaChange(e.target.value)}
              className="w-full bg-[#030712] border border-[#1F2937] rounded px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-[#38BDF8]"
            >
              <option value="">All Software Client Versions</option>
              {userAgents.map(u => (
                <option key={u.user_agent} value={u.user_agent}>
                  {u.user_agent.replace(/\//g, '')} ({u.count} samples)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* DATA VISUALIZATION: ECharts Leaders */}
      <div className="p-4 border-b border-[#1F2937] space-y-4">
        <div>
          <span className="text-[10px] font-mono text-slate-400 block mb-1">CONCENTRATION METRICS</span>
          <span className="text-xs font-bold text-slate-300">Top Countries by Node Share</span>
          <div className="h-44 mt-1 bg-slate-900/20 border border-[#1F2937] rounded p-1">
            {countries.length > 0 ? (
              <ReactECharts option={countryChartOption} style={{ height: "100%", width: "100%" }} />
            ) : (
              <div className="h-full flex items-center justify-center font-mono text-xs text-slate-600">No chart data</div>
            )}
          </div>
        </div>

        <div>
          <span className="text-xs font-bold text-slate-300">Historical Trend (30 Days)</span>
          <div className="h-36 mt-2 bg-slate-900/20 border border-[#1F2937] rounded p-1">
            {history.length > 0 ? (
              <ReactECharts option={trendChartOption} style={{ height: "100%", width: "100%" }} />
            ) : (
              <div className="h-full flex items-center justify-center font-mono text-xs text-slate-600">No history data</div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION E: Download Sample Data button */}
      <div className="p-4 mt-auto">
        <a 
          href="http://localhost:8080/api/nodes/download"
          download="bitcoin-node-geography.csv"
          className="w-full bg-[#0B1117] hover:bg-[#1F2937] text-[#38BDF8] border border-[#38BDF8]/40 hover:border-[#38BDF8] py-2 px-4 rounded text-xs font-mono font-bold flex items-center justify-center gap-2 transition duration-200 cursor-pointer shadow-[0_0_4px_rgba(56,189,248,0.15)] active:shadow-[0_0_8px_rgba(56,189,248,0.3)]"
        >
          <Download className="w-4 h-4" />
          DOWNLOAD RAW DATASETS (CSV)
        </a>
        <div className="text-[9px] font-mono text-slate-500 text-center mt-2">
          Telemetric dataset updated: {summary?.last_updated || "Live"}
        </div>
      </div>

    </div>
  )
}