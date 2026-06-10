"use client"

import React, { useState, useEffect } from "react"
import { ChevronDown, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Tooltip } from "./Tooltip"

interface ComparisonData {
  timestamp1: string
  timestamp2: string
  total_nodes_1: number
  total_nodes_2: number
  nodes_change: number
  nodes_change_percent: number
  block_height_1: number
  block_height_2: number
  top_country_1: string
  top_country_2: string
  top_country_change: boolean
  top_asn_1: string
  top_asn_2: string
  top_asn_change: boolean
}

interface SnapshotItem {
  id: string
  timestamp: string
  total_nodes: number
  top_country: string
}

export const SnapshotComparison: React.FC = () => {
  const [snapshots, setSnapshots] = useState<SnapshotItem[]>([])
  const [selectedSnapshot1, setSelectedSnapshot1] = useState<string | null>(null)
  const [selectedSnapshot2, setSelectedSnapshot2] = useState<string>("latest")
  const [comparison, setComparison] = useState<ComparisonData | null>(null)
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    fetchSnapshots()
  }, [])

  const fetchSnapshots = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/snapshots/history")
      if (response.ok) {
        const data = await response.json()
        setSnapshots(data.snapshots)
        if (data.snapshots.length > 0) {
          setSelectedSnapshot1(data.snapshots[0].id)
        }
      }
    } catch (error) {
      console.error("Error fetching snapshots:", error)
    }
  }

  const handleCompare = async () => {
    if (!selectedSnapshot1) return

    setLoading(true)
    try {
      const response = await fetch(
        `http://localhost:8080/api/snapshots/compare?snapshot1_id=${selectedSnapshot1}&snapshot2_id=${selectedSnapshot2}`
      )
      if (response.ok) {
        const data = await response.json()
        setComparison(data.comparison.summary_comparison)
      }
    } catch (error) {
      console.error("Error comparing snapshots:", error)
    } finally {
      setLoading(false)
    }
  }

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp size={16} className="text-green-500" />
    if (change < 0) return <TrendingDown size={16} className="text-red-500" />
    return <Minus size={16} className="text-gray-500" />
  }

  const getTrendColor = (change: number) => {
    if (change > 0) return "text-green-500"
    if (change < 0) return "text-red-500"
    return "text-gray-400"
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-cyan-400/20 rounded-lg p-4">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
          <span>📊 Snapshot Comparison</span>
          <Tooltip content="Compare network statistics between two different time points">
            <span className="text-gray-600 hover:text-cyan-400">i</span>
          </Tooltip>
        </h3>
        <ChevronDown
          size={20}
          className={`text-cyan-400 transform transition ${expanded ? "rotate-180" : ""}`}
        />
      </div>

      {expanded && (
        <div className="mt-4 space-y-4">
          {/* Snapshot Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">First Snapshot</label>
              <select
                value={selectedSnapshot1 || ""}
                onChange={(e) => setSelectedSnapshot1(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-cyan-400/30 rounded text-white text-sm hover:border-cyan-400 focus:border-cyan-400 focus:outline-none"
              >
                <option value="">Select a snapshot...</option>
                {snapshots.map((snap) => (
                  <option key={snap.id} value={snap.id}>
                    {new Date(snap.timestamp).toLocaleString()} ({snap.total_nodes} nodes)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Second Snapshot</label>
              <select
                value={selectedSnapshot2}
                onChange={(e) => setSelectedSnapshot2(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-cyan-400/30 rounded text-white text-sm hover:border-cyan-400 focus:border-cyan-400 focus:outline-none"
              >
                <option value="latest">Latest (Live)</option>
                {snapshots.map((snap) => (
                  <option key={snap.id} value={snap.id}>
                    {new Date(snap.timestamp).toLocaleString()} ({snap.total_nodes} nodes)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleCompare}
            disabled={!selectedSnapshot1 || loading}
            className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded font-medium transition"
          >
            {loading ? "Comparing..." : "Compare Snapshots"}
          </button>

          {/* Comparison Results */}
          {comparison && (
            <div className="mt-4 p-4 bg-gray-800/50 rounded border border-cyan-400/10 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400">Total Nodes (Before)</p>
                  <p className="text-lg font-semibold text-white">{comparison.total_nodes_1}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Total Nodes (After)</p>
                  <p className="text-lg font-semibold text-white">{comparison.total_nodes_2}</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded">
                <div>
                  <p className="text-xs text-gray-400">Change in Nodes</p>
                  <p className="text-sm text-white">
                    {comparison.nodes_change > 0 ? "+" : ""}{comparison.nodes_change}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${getTrendColor(comparison.nodes_change)}`}>
                    {comparison.nodes_change_percent > 0 ? "+" : ""}
                    {comparison.nodes_change_percent}%
                  </span>
                  {getTrendIcon(comparison.nodes_change)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-cyan-400/10">
                <div>
                  <p className="text-xs text-gray-400">Block Height (Before)</p>
                  <p className="text-sm text-white">{comparison.block_height_1}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Block Height (After)</p>
                  <p className="text-sm text-white">{comparison.block_height_2}</p>
                </div>
              </div>

              {comparison.top_country_change && (
                <div className="mt-3 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded text-yellow-400 text-sm">
                  ⚠️ Top country changed: {comparison.top_country_1} → {comparison.top_country_2}
                </div>
              )}

              {comparison.top_asn_change && (
                <div className="mt-3 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded text-yellow-400 text-sm">
                  ⚠️ Top ASN changed: {comparison.top_asn_1} → {comparison.top_asn_2}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
