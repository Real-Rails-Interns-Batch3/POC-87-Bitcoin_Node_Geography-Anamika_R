"use client"

import dynamic from "next/dynamic"

const RealMap = dynamic(
  () => import("./RealMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-[#030712] flex items-center justify-center font-mono text-sm text-[#38BDF8]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-t-2 border-r-2 border-[#38BDF8] rounded-full animate-spin"></div>
          <div>INITIALIZING INTEL MAP CONTROLLER...</div>
        </div>
      </div>
    )
  }
)

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

interface MapSectionProps {
  nodes: Node[]
  selectedNode: Node | null
  onSelectNode: (node: Node | null) => void
  mapViewport: {
    center: [number, number]
    zoom: number
  }
}

export default function MapSection({ nodes, selectedNode, onSelectNode, mapViewport }: MapSectionProps) {
  return (
    <div className="h-screen w-full">
      <RealMap
        nodes={nodes}
        selectedNode={selectedNode}
        onSelectNode={onSelectNode}
        mapViewport={mapViewport}
      />
    </div>
  )
}