import { useEffect, useState } from "react";
import FilterPanel from "./components/FilterPanel";
import KoreaMap from "./components/KoreaMap";
import { parseHospitalCsv, type Hospital } from "./utils/parseHospitalCsv";

function App() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSido, setSelectedSido] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState("all");

  useEffect(() => {
    parseHospitalCsv()
      .then((data) => {
        setHospitals(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("[코멥] 데이터 로드 실패:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-100 to-blue-50 overflow-hidden">
      {/* 지도 영역 */}
      <div className="w-full h-full relative">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-3 animate-pulse">🏥</div>
              <p className="text-sm text-blue-500 font-medium">데이터 로딩 중...</p>
            </div>
          </div>
        ) : (
          <KoreaMap
            selectedSido={selectedSido}
            onSelectSido={setSelectedSido}
          />
        )}

        {/* 선택된 시/도 배너 */}
        {selectedSido && (
          <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg px-5 py-2.5 flex items-center gap-3 border border-blue-100">
            <span className="text-blue-600 font-semibold text-sm">{selectedSido}</span>
            <span className="text-gray-400 text-xs">
              {hospitals.filter((h) => h.sido === selectedSido).length.toLocaleString()}개 기관
            </span>
            <button
              onClick={() => setSelectedSido(null)}
              className="text-gray-300 hover:text-gray-500 transition-colors text-sm"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* 플로팅 필터 UI */}
      <FilterPanel
        selectedSido={selectedSido}
        onSelectSido={setSelectedSido}
        selectedType={selectedType}
        onSelectType={setSelectedType}
      />
    </div>
  );
}

export default App;
