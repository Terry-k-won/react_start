import Papa from "papaparse";

export interface Hospital {
  name: string;       // 요양기관명
  type: string;       // 요양종별
  address: string;    // 도로명주소
  openDate: string;   // 개설일자
  sido: string;       // 도로명주소 첫 번째 단어에서 추출한 시/도
}

interface RawRow {
  요양기관명: string;
  요양종별: string;
  도로명주소: string;
  개설일자: string;
  [key: string]: string;
}

function extractSido(address: string): string {
  if (!address) return "알 수 없음";
  const firstWord = address.trim().split(/\s+/)[0];
  return firstWord || "알 수 없음";
}

export async function parseHospitalCsv(): Promise<Hospital[]> {
  const response = await fetch("/hospital.csv");
  const csvText = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse<RawRow>(csvText, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        const hospitals: Hospital[] = results.data
          .map((row) => ({
            name: row["요양기관명"]?.trim() ?? "",
            type: row["요양종별"]?.trim() ?? "",
            address: row["도로명주소"]?.trim() ?? "",
            openDate: row["개설일자"]?.trim() ?? "",
            sido: extractSido(row["도로명주소"]),
          }))
          .filter((h) => h.name && h.type);

        console.log(`[코멥] 총 ${hospitals.length}개 기관 로드됨`);
        console.log("[코멥] 샘플 데이터 (상위 5개):", hospitals.slice(0, 5));

        const sidoCounts = hospitals.reduce<Record<string, number>>((acc, h) => {
          acc[h.sido] = (acc[h.sido] ?? 0) + 1;
          return acc;
        }, {});
        console.log("[코멥] 시/도별 기관 수:", sidoCounts);

        resolve(hospitals);
      },
      error(err) {
        reject(new Error(`CSV 파싱 실패: ${err.message}`));
      },
    });
  });
}
