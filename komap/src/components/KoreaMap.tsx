import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";

const GEO_URL = "/korea-provinces.json";

// GeoJSON의 name 속성 → 시/도 full name 매핑
const SIDO_COLORS: Record<string, { base: string; hover: string; selected: string }> = {
  서울특별시:   { base: "#BFDBFE", hover: "#93C5FD", selected: "#3B82F6" },
  부산광역시:   { base: "#BBF7D0", hover: "#86EFAC", selected: "#22C55E" },
  대구광역시:   { base: "#FDE68A", hover: "#FCD34D", selected: "#F59E0B" },
  인천광역시:   { base: "#DDD6FE", hover: "#C4B5FD", selected: "#8B5CF6" },
  광주광역시:   { base: "#FBCFE8", hover: "#F9A8D4", selected: "#EC4899" },
  대전광역시:   { base: "#FED7AA", hover: "#FDBA74", selected: "#F97316" },
  울산광역시:   { base: "#CCFBF1", hover: "#99F6E4", selected: "#14B8A6" },
  세종특별자치시: { base: "#E0E7FF", hover: "#C7D2FE", selected: "#6366F1" },
  경기도:       { base: "#D1FAE5", hover: "#A7F3D0", selected: "#10B981" },
  강원특별자치도: { base: "#CFFAFE", hover: "#A5F3FC", selected: "#06B6D4" },
  충청북도:     { base: "#FEF9C3", hover: "#FEF08A", selected: "#EAB308" },
  충청남도:     { base: "#FFEDD5", hover: "#FED7AA", selected: "#FB923C" },
  전라북도:     { base: "#F3E8FF", hover: "#E9D5FF", selected: "#A855F7" },
  전라남도:     { base: "#FCE7F3", hover: "#FBCFE8", selected: "#F472B6" },
  경상북도:     { base: "#D1FAE5", hover: "#6EE7B7", selected: "#059669" },
  경상남도:     { base: "#FEF3C7", hover: "#FDE68A", selected: "#D97706" },
  제주특별자치도: { base: "#DBEAFE", hover: "#BFDBFE", selected: "#2563EB" },
};

const DEFAULT_COLORS = { base: "#E5E7EB", hover: "#D1D5DB", selected: "#6B7280" };

interface Props {
  selectedSido: string | null;
  onSelectSido: (sido: string | null) => void;
}

export default function KoreaMap({ selectedSido, onSelectSido }: Props) {
  const [hoveredSido, setHoveredSido] = useState<string | null>(null);

  const getColor = (name: string) => {
    const colors = SIDO_COLORS[name] ?? DEFAULT_COLORS;
    if (selectedSido === name) return colors.selected;
    if (hoveredSido === name) return colors.hover;
    return colors.base;
  };

  const handleClick = (name: string) => {
    onSelectSido(selectedSido === name ? null : name);
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          center: [127.5, 36.0],
          scale: 5000,
        }}
        width={600}
        height={700}
        style={{ width: "100%", height: "100%", maxWidth: 600, maxHeight: 700 }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const name: string = geo.properties.name ?? "";
              const isSelected = selectedSido === name;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => handleClick(name)}
                  onMouseEnter={() => setHoveredSido(name)}
                  onMouseLeave={() => setHoveredSido(null)}
                  style={{
                    default: {
                      fill: getColor(name),
                      stroke: "#FFFFFF",
                      strokeWidth: 1.2,
                      outline: "none",
                      transition: "fill 0.15s ease",
                      cursor: "pointer",
                    },
                    hover: {
                      fill: (SIDO_COLORS[name] ?? DEFAULT_COLORS).hover,
                      stroke: "#FFFFFF",
                      strokeWidth: 1.5,
                      outline: "none",
                      cursor: "pointer",
                    },
                    pressed: {
                      fill: (SIDO_COLORS[name] ?? DEFAULT_COLORS).selected,
                      stroke: "#FFFFFF",
                      strokeWidth: 1.5,
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
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm text-gray-800 text-sm font-medium px-4 py-2 rounded-full shadow-lg pointer-events-none border border-gray-200">
          {hoveredSido}
          {hoveredSido === selectedSido && (
            <span className="ml-2 text-blue-500 text-xs">✓ 선택됨</span>
          )}
        </div>
      )}
    </div>
  );
}
