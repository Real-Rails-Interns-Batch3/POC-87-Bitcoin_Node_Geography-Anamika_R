"use client"

import React from "react"
import { Info } from "lucide-react"

interface TooltipProps {
  content: string | React.ReactNode
  children: React.ReactNode
  position?: "top" | "right" | "bottom" | "left"
  delay?: number
  className?: string
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = "top",
  delay = 200,
  className = ""
}) => {
  const [isVisible, setIsVisible] = React.useState(false)
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
    }, delay)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsVisible(false)
  }

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const positionClasses = {
    top: "bottom-full mb-2",
    right: "left-full ml-2",
    bottom: "top-full mt-2",
    left: "right-full mr-2"
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          className={`
            absolute ${positionClasses[position]} 
            z-50 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg
            border border-cyan-400/30 shadow-lg
            whitespace-nowrap pointer-events-none
            animate-fade-in ${className}
          `}
        >
          {content}
          <div
            className={`
              absolute w-2 h-2 bg-gray-900 border-cyan-400/30
              ${
                position === "top"
                  ? "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-r border-b"
                  : position === "bottom"
                  ? "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 border-l border-t"
                  : position === "left"
                  ? "right-0 top-1/2 -translate-y-1/2 translate-x-1/2 border-t border-l"
                  : "left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 border-r border-t"
              }
            `}
          />
        </div>
      )}
    </div>
  )
}

export const TooltipTrigger: React.FC<{ tooltipContent: string }> = ({
  tooltipContent
}) => (
  <Tooltip content={tooltipContent}>
    <Info size={16} className="inline-block text-cyan-400 hover:text-cyan-300 cursor-help" />
  </Tooltip>
)

export const StatTooltip: React.FC<{ label: string; value: string | number; tooltip: string }> = ({
  label,
  value,
  tooltip
}) => (
  <div className="flex items-center gap-2">
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-lg font-semibold text-cyan-400">{value}</p>
    </div>
    <Tooltip content={tooltip} position="right">
      <Info size={16} className="text-gray-600 hover:text-cyan-400 cursor-help" />
    </Tooltip>
  </div>
)

export const ChartTooltip: React.FC<{
  title: string
  data: Record<string, string | number>
  visible: boolean
}> = ({ title, data, visible }) => {
  if (!visible) return null

  return (
    <div className="bg-gray-900 border border-cyan-400/50 rounded-lg p-3 text-white text-xs shadow-lg">
      <h4 className="font-semibold text-cyan-400 mb-2">{title}</h4>
      <div className="space-y-1">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex justify-between gap-4">
            <span className="text-gray-400">{key}:</span>
            <span className="text-white font-medium">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
