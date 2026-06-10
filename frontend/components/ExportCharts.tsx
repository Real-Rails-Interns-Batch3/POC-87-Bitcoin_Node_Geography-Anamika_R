"use client"

import React, { useState } from "react"
import { Download, ChevronDown } from "lucide-react"
import { Tooltip } from "./Tooltip"

interface ExportOption {
  label: string
  endpoint: string
  format: string
  tooltip: string
}

export const ExportCharts: React.FC = () => {
  const [loading, setLoading] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)

  const exportOptions: ExportOption[] = [
    {
      label: "All Nodes (CSV)",
      endpoint: "/api/nodes/download",
      format: "csv",
      tooltip: "Export all active Bitcoin nodes with geographic and ASN data"
    },
    {
      label: "Countries Analytics (CSV)",
      endpoint: "/api/export/countries-csv",
      format: "csv",
      tooltip: "Export aggregated data by country"
    },
    {
      label: "ASN Analytics (CSV)",
      endpoint: "/api/export/asns-csv",
      format: "csv",
      tooltip: "Export aggregated data by Autonomous System Network"
    },
    {
      label: "Complete Dataset (JSON)",
      endpoint: "/api/export/json",
      format: "json",
      tooltip: "Export complete network snapshot as JSON"
    },
    {
      label: "Analytics Summary (JSON)",
      endpoint: "/api/export/analytics-json",
      format: "json",
      tooltip: "Export analytics, countries, ASNs, and historical data as JSON"
    }
  ]

  const handleExport = async (option: ExportOption) => {
    setLoading(option.endpoint)
    try {
      const response = await fetch(`http://localhost:8080${option.endpoint}`)
      if (!response.ok) throw new Error("Export failed")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url

      // Determine filename
      const timestamp = new Date().toISOString().split("T")[0]
      const extension = option.format
      const filename = `bitcoin_nodes_${option.label.toLowerCase().replace(/\s+/g, "_")}_${timestamp}.${extension}`
      link.download = filename

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      // Show success notification
      const event = new CustomEvent("notification", {
        detail: {
          message: `✓ ${option.label} exported successfully`,
          type: "success",
          duration: 3000
        }
      })
      window.dispatchEvent(event)
    } catch (error) {
      console.error("Export error:", error)
      const event = new CustomEvent("notification", {
        detail: {
          message: `✗ Failed to export ${option.label}`,
          type: "error",
          duration: 3000
        }
      })
      window.dispatchEvent(event)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-cyan-400/20 rounded-lg p-4">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
          <Download size={18} />
          <span>Export Data</span>
          <Tooltip content="Download network data and charts in various formats">
            <span className="text-gray-600 hover:text-cyan-400">i</span>
          </Tooltip>
        </h3>
        <ChevronDown
          size={20}
          className={`text-cyan-400 transform transition ${expanded ? "rotate-180" : ""}`}
        />
      </div>

      {expanded && (
        <div className="mt-4 space-y-2">
          {exportOptions.map((option) => (
            <Tooltip key={option.endpoint} content={option.tooltip} position="left">
              <button
                onClick={() => handleExport(option)}
                disabled={loading !== null}
                className="w-full flex items-center justify-between px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-700 disabled:cursor-not-allowed border border-cyan-400/20 hover:border-cyan-400/50 rounded text-left text-white text-sm transition"
              >
                <span>{option.label}</span>
                <Download
                  size={16}
                  className={`text-cyan-400 ${
                    loading === option.endpoint ? "animate-spin" : ""
                  }`}
                />
              </button>
            </Tooltip>
          ))}
        </div>
      )}
    </div>
  )
}

export const QuickExportButton: React.FC<{ endpoint: string; filename: string }> = ({
  endpoint,
  filename
}) => {
  const [loading, setLoading] = useState(false)

  const handleQuickExport = async () => {
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:8080${endpoint}`)
      if (!response.ok) throw new Error("Export failed")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Export error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleQuickExport}
      disabled={loading}
      className="flex items-center gap-2 px-3 py-1 bg-cyan-600/20 hover:bg-cyan-600/40 disabled:opacity-50 border border-cyan-400/30 rounded text-cyan-400 text-sm transition"
    >
      <Download size={14} className={loading ? "animate-spin" : ""} />
      Export
    </button>
  )
}
