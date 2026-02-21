"use client";
import React, { useEffect, useRef, useState } from "react";

interface AlgeriaMapProps {
  onWilayaSelect?: (wilaya: WilayaInfo) => void;
  data?: Record<string, number>; // Map of wilaya ID to value (e.g. order count)
  dataLabel?: string;
  className?: string;
}

export interface WilayaInfo {
  id: string;
  name: string;
  nameLatin: string;
  nameAr: string;
  value?: number;
}

export default function AlgeriaMap({
  onWilayaSelect,
  data = {},
  dataLabel = "Orders",
  className = "",
}: AlgeriaMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredWilaya, setHoveredWilaya] = useState<WilayaInfo | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetch("/images/algeria-69.svg")
      .then((res) => res.text())
      .then((svgText) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = svgText;
          const svg = containerRef.current.querySelector("svg");
          if (svg) {
            svg.setAttribute("width", "100%");
            svg.setAttribute("height", "100%");
            svg.classList.add("w-full", "h-full");

            const paths = svg.querySelectorAll("path");

            // Find max value for heatmap scaling
            const values = Object.values(data);
            const maxValue = values.length > 0 ? Math.max(...values, 1) : 1;

            paths.forEach((path) => {
              const id = path.id;
              const value = data[id] || 0;

              // Initial styling
              path.style.transition = "fill 0.3s ease, stroke 0.3s ease";
              path.style.cursor = "pointer";
              path.style.stroke = "#d1d5db"; // gray-300
              path.style.strokeWidth = "1px";

              const updateStyle = () => {
                if (value > 0) {
                  // Heatmap scaling (Emerald/Green scale)
                  // HSL: Emerald-500 is 161, 64%, 44%
                  const intensity = Math.min(value / maxValue, 1);
                  // From light green to deep emerald
                  const lightness = 95 - intensity * 50;
                  path.style.fill = `hsl(161, 70%, ${lightness}%)`;
                  path.style.stroke = "hsl(161, 80%, 20%)";
                  path.style.strokeWidth = "1.5px";
                } else {
                  path.style.fill = "#f4f4f5"; // zinc-100
                  path.style.stroke = "#d4d4d8"; // zinc-300
                }
              };

              updateStyle();

              path.addEventListener("mouseenter", () => {
                path.style.fill = "#fbbf24"; // amber-400 on hover
                setHoveredWilaya({
                  id: path.id,
                  name: path.getAttribute("data-name") || "",
                  nameLatin: path.getAttribute("data-name-latin") || "",
                  nameAr: path.getAttribute("data-name-ar") || "",
                  value: data[path.id] || 0,
                });
              });

              path.addEventListener("mouseleave", () => {
                updateStyle();
                setHoveredWilaya(null);
              });

              path.addEventListener("mousemove", (e: MouseEvent) => {
                setMousePos({ x: e.clientX, y: e.clientY });
              });

              path.addEventListener("click", () => {
                if (onWilayaSelect) {
                  onWilayaSelect({
                    id: path.id,
                    name: path.getAttribute("data-name") || "",
                    nameLatin: path.getAttribute("data-name-latin") || "",
                    nameAr: path.getAttribute("data-name-ar") || "",
                    value: data[path.id] || 0,
                  });
                }
              });
            });
          }
        }
      });
  }, [data]);

  return (
    <div className={`relative ${className}`}>
      <div ref={containerRef} className="w-full h-full" />

      {hoveredWilaya && (
        <div
          className="fixed z-50 pointer-events-none bg-black/90 backdrop-blur-md text-white px-4 py-3 rounded-xl shadow-2xl border border-white/20 text-sm flex flex-col gap-1 min-w-[140px]"
          style={{
            left: mousePos.x + 20,
            top: mousePos.y + 20,
          }}
        >
          <div className="flex items-center justify-between gap-4">
            <span className="font-black text-emerald-400 text-lg">
              {hoveredWilaya.nameAr}
            </span>
            <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest text-right">
              #{hoveredWilaya.id}
            </span>
          </div>
          <span className="text-xs font-bold opacity-80 uppercase tracking-tight">
            {hoveredWilaya.nameLatin}
          </span>
          <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between">
            <span className="text-[10px] uppercase font-black opacity-50 tracking-widest">
              {dataLabel}
            </span>
            <span className="text-xl font-black text-emerald-400">
              {hoveredWilaya.value?.toLocaleString() || 0}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
