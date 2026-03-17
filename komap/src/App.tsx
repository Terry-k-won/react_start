import { useEffect, useMemo, useState } from "react";
import FilterPanel from "./components/FilterPanel";
import KoreaMap from "./components/KoreaMap";
import HospitalList from "./components/HospitalList";
import { parseHospitalCsv, filterHospitals, type Hospital } from "./utils/parseHospitalCsv";

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

  // 시/도 + 요양종별 이중 필터링 (메모이제이션)
  const filtered = useMemo(
    () => filterHospitals(hospitals, selectedSido, selectedType),
    [hospitals, selectedSido, selectedType]
  );

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-100 to-blue-50 overflow-hidden flex">
      {/* 좌측 사이드바 */}
      <HospitalList
        hospitals={filtered}
        selectedSido={selectedSido}
        selectedType={selectedType}
        isLoading={loading}
      />

      {/* 지도 영역 (사이드바 너비만큼 오른쪽으로 밀림) */}
      <div className="flex-1 relative ml-80">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              {/* SVG 스피너 */}
              <svg
                className="w-12 h-12 text-blue-500 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-20"
                  cx="12" cy="12" r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="opacity-90"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              <p className="text-sm text-blue-600 font-semibold tracking-wide">
                지도 데이터 불러오는 중...
              </p>
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
              {filtered.length.toLocaleString()}개 기관
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
