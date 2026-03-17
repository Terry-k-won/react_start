import { useState } from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore – react-simple-maps has no bundled types
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const GEO_URL = "/korea-provinces.json";

// 메디컬 블루 단일 팔레트 — 신뢰감 있는 파란 계열
const BASE    = "#DBEAFE"; // blue-100
const HOVER   = "#93C5FD"; // blue-300
const SELECTED = "#1D4ED8"; // blue-700
const STROKE  = "#FFFFFF";

interface Props {
  selectedSido: string | null;
  onSelectSido: (sido: string | null) => void;
}

export default function KoreaMap({ selectedSido, onSelectSido }: Props) {
  const [hoveredSido, setHoveredSido] = useState<string | null>(null);

  const getColor = (name: string) => {
    if (selectedSido === name) return SELECTED;
    if (hoveredSido === name) return HOVER;
    return BASE;
  };

  const getStrokeWidth = (name: string) =>
    selectedSido === name ? 2 : hoveredSido === name ? 1.8 : 1.2;

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: [127.5, 36.0], scale: 5000 }}
        width={600}
        height={700}
        style={{ width: "100%", height: "100%", maxWidth: 600, maxHeight: 700 }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const name: string = geo.properties.name ?? "";

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => onSelectSido(selectedSido === name ? null : name)}
                  onMouseEnter={() => setHoveredSido(name)}
                  onMouseLeave={() => setHoveredSido(null)}
                  style={{
                    default: {
                      fill: getColor(name),
                      stroke: STROKE,
                      strokeWidth: getStrokeWidth(name),
                      outline: "none",
                      transition: "fill 0.25s ease, stroke-width 0.2s ease, filter 0.25s ease",
                      cursor: "pointer",
                      filter: selectedSido === name
                        ? "drop-shadow(0 4px 8px rgba(29,78,216,0.45))"
                        : "none",
                    },
                    hover: {
                      fill: HOVER,
                      stroke: STROKE,
                      strokeWidth: 1.8,
                      outline: "none",
                      cursor: "pointer",
                      filter: "drop-shadow(0 2px 4px rgba(147,197,253,0.5))",
                    },
                    pressed: {
                      fill: SELECTED,
                      stroke: STROKE,
                      strokeWidth: 2,
                      outline: "none",
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {/* 호버 툴팁 */}
      {hoveredSido && (
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{ transition: "opacity 0.2s ease" }}
        >
          <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md text-gray-800 text-sm font-semibold px-4 py-2 rounded-full shadow-lg border border-blue-100">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ background: hoveredSido === selectedSido ? SELECTED : HOVER }}
            />
            {hoveredSido}
            {hoveredSido === selectedSido && (
              <span className="text-blue-600 text-xs font-normal">선택됨</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
