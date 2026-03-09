from flask import Flask
import pandas as pd
import folium
from geopy.geocoders import Nominatim
from geopy.extra.rate_limiter import RateLimiter

app = Flask(__name__)

# 간단한 메모리 캐시를 사용하면 동일 주소를 여러 번 요청하지 않도록 할 수 있습니다.
geocode_cache = {}


@app.route("/")
def index():
    # 파싱된 엑셀 파일을 읽어옵니다.
    df = pd.read_excel("hospital_parsed.xlsx")

    # 위도/경도 칼럼이 없는 경우 추가합니다.
    if "lat" not in df.columns or "lon" not in df.columns:
        geolocator = Nominatim(user_agent="hospital_mapper")
        # 1초에 한 번만 호출하도록 제한
        geocode = RateLimiter(geolocator.geocode, min_delay_seconds=1)

        import time
        from geopy.exc import GeocoderRateLimited

        def geocode_address(addr):
            # 네트워크 문제나 요청 제한으로 인해 오류가 날 수 있으므로 예외를 처리합니다.
            if pd.isna(addr):
                return None
            if addr in geocode_cache:
                return geocode_cache[addr]
            try:
                # 타임아웃을 늘려서 느린 응답에 대비합니다.
                location = geocode(addr + ", South Korea", timeout=10)
            except GeocoderRateLimited as e:
                # 429 응답이 오면 잠시 대기 후 다시 시도
                print(f"rate limit: {addr} -> {e}, waiting 5 seconds")
                time.sleep(5)
                try:
                    location = geocode(addr + ", South Korea", timeout=10)
                except Exception as e2:
                    print(f"지연 후에도 geocode 실패: {addr} -> {e2}")
                    location = None
            except Exception as e:
                # 기타 예외 처리
                print(f"geocode 실패: {addr} -> {e}")
                location = None
            geocode_cache[addr] = location
            return location

        df["location"] = df["주소"].apply(geocode_address)
        df["lat"] = df["location"].apply(lambda loc: loc.latitude if loc else None)
        df["lon"] = df["location"].apply(lambda loc: loc.longitude if loc else None)

        # 계산한 좌표를 엑셀에 같이 저장해 재사용할 수 있게 합니다.
        df.to_excel("hospital_parsed_with_coords.xlsx", index=False)
    else:
        # 이미 좌표가 있는 경우 그냥 읽어옵니다.
        pass

    # 지도 생성 (한반도 중앙을 기본으로 설정)
    m = folium.Map(location=[36.5, 127.5], zoom_start=7)

    for _, row in df.dropna(subset=["lat", "lon"]).iterrows():
        folium.Marker(
            location=[row["lat"], row["lon"]],
            tooltip=row["종별코드명"],  # 마우스 오버 시 나타나는 텍스트
            popup=row["종별코드명"],
        ).add_to(m)

    # folium 객체의 HTML을 바로 리턴하면 간단히 웹에서 확인할 수 있습니다.
    return m.get_root().render()


if __name__ == "__main__":
    # 개발용 서버를 실행합니다.
    app.run(debug=True)
