import type { Hospital } from "../utils/parseHospitalCsv";

interface Props {
  hospitals: Hospital[];
  selectedSido: string | null;
  selectedType: string;
  isLoading: boolean;
}

const TYPE_BADGE: Record<string, { bg: string; text: string; icon: string }> = {
  의원:      { bg: "bg-blue-50",    text: "text-blue-700",   icon: "🏥" },
  병원:      { bg: "bg-emerald-50", text: "text-emerald-700", icon: "🏨" },
  요양병원:  { bg: "bg-emerald-50", text: "text-emerald-700", icon: "🏨" },
  정신병원:  { bg: "bg-emerald-50", text: "text-emerald-700", icon: "🏨" },
  종합병원:  { bg: "bg-violet-50",  text: "text-violet-700",  icon: "🏛️" },
  상급종합병원: { bg: "bg-violet-50", text: "text-violet-700", icon: "🏛️" },
  한의원:    { bg: "bg-amber-50",   text: "text-amber-700",   icon: "🌿" },
  한방병원:  { bg: "bg-amber-50",   text: "text-amber-700",   icon: "🌿" },
  치과의원:  { bg: "bg-rose-50",    text: "text-rose-700",    icon: "🦷" },
  치과병원:  { bg: "bg-rose-50",    text: "text-rose-700",    icon: "🦷" },
  약국:      { bg: "bg-teal-50",    text: "text-teal-700",    icon: "💊" },
};

const DEFAULT_BADGE = { bg: "bg-gray-50", text: "text-gray-600", icon: "🏪" };

function formatDate(raw: string): string {
  if (!raw || raw.length < 8) return raw;
  const d = raw.replace(/-/g, "");
  return `${d.slice(0, 4)}.${d.slice(4, 6)}.${d.slice(6, 8)}`;
}

const DISPLAY_LIMIT = 200;

function SkeletonCard() {
  return (
    <div className="mx-3 my-2 p-4 rounded-xl bg-white shadow-sm border border-gray-100 animate-pulse">
      <div className="flex justify-between items-start gap-2 mb-3">
        <div className="h-4 bg-blue-50 rounded-md w-2/3" />
        <div className="h-5 bg-gray-100 rounded-full w-14" />
      </div>
      <div className="h-3 bg-gray-100 rounded w-full mb-2" />
      <div className="h-3 bg-gray-100 rounded w-1/3" />
    </div>
  );
}

export default function HospitalList({ hospitals, selectedSido, isLoading, selectedType: _selectedType }: Props) {
  const shown = hospitals.slice(0, DISPLAY_LIMIT);
  const isEmpty = !isLoading && hospitals.length === 0;

  return (
    <aside className="absolute left-0 top-0 h-full w-80 bg-white flex flex-col shadow-2xl z-40 border-r border-blue-50">
      {/* 헤더 */}
      <div className="px-5 py-5 flex-shrink-0 bg-gradient-to-br from-blue-700 to-blue-500">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-white text-lg">🏥</span>
          <h2 className="text-base font-bold text-white tracking-tight">
            {selectedSido ?? "전국"} 요양기관
          </h2>
        </div>
        <p className="text-blue-200 text-xs">
          {isLoading
            ? "데이터 불러오는 중..."
            : `총 ${hospitals.length.toLocaleString()}개${hospitals.length > DISPLAY_LIMIT ? ` · 상위 ${DISPLAY_LIMIT}개 표시` : ""}`}
        </p>
      </div>

      {/* 목록 */}
      <div className="flex-1 overflow-y-auto bg-slate-50">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6 pb-16">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-3">
              <span className="text-3xl">🔍</span>
            </div>
            <p className="text-sm font-semibold text-gray-600">해당하는 기관이 없어요</p>
            <p className="text-xs text-gray-400 mt-1">지역 또는 종별 필터를 변경해 보세요</p>
          </div>
        ) : (
          <ul className="pb-4">
            {shown.map((h, i) => {
              const badge = TYPE_BADGE[h.type] ?? DEFAULT_BADGE;
              return (
                <li key={i} className="mx-3 my-2">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-blue-200 transition-all duration-200 cursor-default">
                    {/* 기관명 + 뱃지 */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-sm font-semibold text-gray-800 leading-snug flex-1">
                        {h.name}
                      </p>
                      <span
                        className={`flex-shrink-0 inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${badge.bg} ${badge.text}`}
                      >
                        {badge.icon} {h.type}
                      </span>
                    </div>

                    {/* 주소 */}
                    <div className="flex items-start gap-1.5 mb-1.5">
                      <span className="text-gray-300 text-xs mt-0.5">📍</span>
                      <p className="text-xs text-gray-500 leading-snug line-clamp-2 flex-1">
                        {h.address || "주소 없음"}
                      </p>
                    </div>

                    {/* 개설일 */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-300 text-xs">📅</span>
                      <p className="text-xs text-gray-400">개설 {formatDate(h.openDate)}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}
