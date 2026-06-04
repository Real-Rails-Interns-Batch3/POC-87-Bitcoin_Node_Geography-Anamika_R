"use client"

import { useEffect } from "react"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from "react-leaflet"

// Fixed icon resolving issues in Next.js by defining custom glowing divIcons
const createNodeIcon = (isActive: boolean) => {
  return L.divIcon({
    className: "custom-node-icon",
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-3 h-3 bg-[#38BDF8] rounded-full opacity-75 animate-ping"></div>
        <div class="relative w-2.5 h-2.5 ${isActive ? 'bg-[#38BDF8] shadow-[0_0_10px_#38BDF8]' : 'bg-[#818CF8] shadow-[0_0_8px_#818CF8]'} border border-[#030712] rounded-full"></div>
      </div>
    `,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    popupAnchor: [0, -6]
  })
}

// Sub-component to programmatically pan/zoom the map view
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()
  
  useEffect(() => {
    if (center && center[0] !== 20 && center[1] !== 0) {
      map.setView(center, zoom, {
        animate: true,
        duration: 1.5
      })
    }
  }, [center, zoom, map])
  
  return null
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

interface RealMapProps {
  nodes: Node[]
  selectedNode: Node | null
  onSelectNode: (node: Node | null) => void
  mapViewport: {
    center: [number, number]
    zoom: number
  }
}

export default function RealMap({ nodes, selectedNode, onSelectNode, mapViewport }: RealMapProps) {
  return (
    <div className="w-full h-full relative" id="map-stage">
      {/* HUD overlay for map */}
      <div className="absolute top-4 left-14 z-[1000] bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded backdrop-blur text-xs flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#38BDF8] shadow-[0_0_5px_#38BDF8] animate-pulse"></span>
          <span className="text-slate-300 font-mono">Active Nodes ({nodes.length} samples mapped)</span>
        </div>
        <span className="text-slate-600">|</span>
        <span className="text-slate-400 font-mono">Projection: EPSG:3857 (WGS84)</span>
      </div>

      <MapContainer
        center={mapViewport.center}
        zoom={mapViewport.zoom}
        zoomControl={true}
        style={{
          height: "100%",
          width: "100%",
          background: "#030712"
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          maxZoom={20}
        />
        
        <MapController center={mapViewport.center} zoom={mapViewport.zoom} />
        
        {nodes.map((node) => {
          const isSelected = selectedNode?.id === node.id
          return (
            <Marker
              key={node.id}
              position={[node.lat, node.lng]}
              icon={createNodeIcon(isSelected)}
              eventHandlers={{
                click: () => {
                  onSelectNode(node)
                }
              }}
            >
              <Popup>
                <div className="text-xs p-1 font-mono leading-relaxed min-w-[200px]">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1 mb-1.5">
                    <span className="font-bold text-[#38BDF8]">NODE ID: #{node.id}</span>
                    <span className="bg-slate-800 px-1 rounded text-[10px] text-slate-400">{node.code}</span>
                  </div>
                  <div className="space-y-1">
                    <p><span className="text-slate-500">ASN:</span> <span className="text-slate-300">{node.asn}</span></p>
                    <p className="truncate"><span className="text-slate-500">Org:</span> <span className="text-slate-300" title={node.org}>{node.org}</span></p>
                    <p><span className="text-slate-500">Client:</span> <span className="text-slate-300">{node.user_agent}</span></p>
                    <p><span className="text-slate-500">Height:</span> <span className="text-slate-300 text-sky-400">{node.height.toLocaleString()}</span></p>
                    <p><span className="text-slate-500">Coords:</span> <span className="text-slate-400">{node.lat.toFixed(3)}, {node.lng.toFixed(3)}</span></p>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}