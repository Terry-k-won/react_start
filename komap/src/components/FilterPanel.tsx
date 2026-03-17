import { useState } from "react";

const REGIONS: { label: string; value: string | null }[] = [
  { label: "전체", value: null },
  { label: "서울", value: "서울특별시" },
  { label: "부산", value: "부산광역시" },
  { label: "대구", value: "대구광역시" },
  { label: "인천", value: "인천광역시" },
  { label: "광주", value: "광주광역시" },
  { label: "대전", value: "대전광역시" },
  { label: "울산", value: "울산광역시" },
  { label: "세종", value: "세종특별자치시" },
  { label: "경기", value: "경기도" },
  { label: "강원", value: "강원특별자치도" },
  { label: "충북", value: "충청북도" },
  { label: "충남", value: "충청남도" },
  { label: "전북", value: "전라북도" },
  { label: "전남", value: "전라남도" },
  { label: "경북", value: "경상북도" },
  { label: "경남", value: "경상남도" },
  { label: "제주", value: "제주특별자치도" },
];

const MEDICAL_TYPES = [
  { id: "all", label: "전체" },
  { id: "clinic", label: "의원" },
  { id: "hospital", label: "병원" },
  { id: "general", label: "종합병원" },
  { id: "korean", label: "한의원" },
  { id: "dental", label: "치과의원" },
  { id: "pharmacy", label: "약국" },
];

interface Props {
  selectedSido: string | null;
  onSelectSido: (sido: string | null) => void;
  selectedType: string;
  onSelectType: (type: string) => void;
}

export default function FilterPanel({ selectedSido, onSelectSido, selectedType, onSelectType }: Props) {
  const [isOpen, setIsOpen] = useState(true);

  const regionLabel = REGIONS.find((r) => r.value === selectedSido)?.label ?? "전체";
  const typeLabel = MEDICAL_TYPES.find((t) => t.id === selectedType)?.label ?? "전체";

  return (
    <div className="fixed top-5 right-5 z-50 w-72">
      {/* 헤더 */}
      <div
        className="flex items-center justify-between bg-white rounded-2xl shadow-lg px-4 py-3 cursor-pointer border border-gray-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <span className="text-blue-500 text-xl">🏥</span>
          <span className="font-semibold text-gray-800 text-sm">코멥 필터</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {regionLabel} · {typeLabel}
          </span>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* 드롭다운 패널 */}
      {isOpen && (
        <div className="mt-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* 지역 선택 */}
          <div className="px-4 pt-4 pb-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              지역
            </p>
            <div className="grid grid-cols-3 gap-1">
              {REGIONS.map((region) => (
                <button
                  key={region.label}
                  onClick={() => onSelectSido(region.value)}
                  className={`text-xs py-1.5 px-2 rounded-lg font-medium transition-all duration-150 ${
                    selectedSido === region.value
                      ? "bg-blue-500 text-white shadow-sm"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {region.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-gray-100 mx-4" />

          {/* 요양종별 선택 */}
          <div className="px-4 pt-3 pb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              요양종별
            </p>
            <div className="flex flex-col gap-1">
              {MEDICAL_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => onSelectType(type.id)}
                  className={`text-left text-sm py-2 px-3 rounded-xl font-medium transition-all duration-150 ${
                    selectedType === type.id
                      ? "bg-blue-50 text-blue-600 border border-blue-200"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* 검색 버튼 */}
          <div className="px-4 pb-4">
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors duration-150 shadow-sm">
              검색하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
