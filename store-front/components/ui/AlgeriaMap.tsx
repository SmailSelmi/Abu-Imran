"use client";
import React, { useEffect, useRef, useState } from "react";

interface AlgeriaMapProps {
  onWilayaSelect?: (wilaya: WilayaInfo) => void;
  highlightedWilayas?: string[]; // IDs of wilayas to highlight
  className?: string;
}

export interface WilayaInfo {
  id: string;
  name: string;
  nameLatin: string;
  nameAr: string;
}

export default function AlgeriaMap({
  onWilayaSelect,
  highlightedWilayas = [],
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
            paths.forEach((path) => {
              const id = path.id;

              // Initial styling
              path.style.transition = "fill 0.3s ease, stroke 0.3s ease";
              path.style.cursor = "pointer";
              path.style.stroke = "#d1d5db"; // gray-300
              path.style.strokeWidth = "1px";

              const updateStyle = () => {
                if (highlightedWilayas.includes(id)) {
                  path.style.fill = "#3b82f6"; // Blue-500
                } else {
                  path.style.fill = "#f4f4f5"; // Gray-100
                }
              };

              updateStyle();

              path.addEventListener("mouseenter", () => {
                path.style.fill = "#60a5fa"; // Blue-400
                setHoveredWilaya({
                  id: path.id,
                  name: path.getAttribute("data-name") || "",
                  nameLatin: path.getAttribute("data-name-latin") || "",
                  nameAr: path.getAttribute("data-name-ar") || "",
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
                  });
                }
              });
            });
          }
        }
      });
  }, [highlightedWilayas, onWilayaSelect]);

  return (
    <div className={`relative ${className}`}>
      <div ref={containerRef} className="w-full h-full" />

      {hoveredWilaya && (
        <div
          className="fixed z-50 pointer-events-none bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg shadow-xl border border-white/20 text-sm flex flex-col gap-0.5"
          style={{
            left: mousePos.x + 15,
            top: mousePos.y + 15,
          }}
        >
          <span className="font-bold text-blue-400">
            {hoveredWilaya.nameAr}
          </span>
          <span className="text-xs opacity-80">{hoveredWilaya.nameLatin}</span>
          <span className="text-[10px] opacity-60">
            Wilaya #{hoveredWilaya.id}
          </span>
        </div>
      )}
    </div>
  );
}
