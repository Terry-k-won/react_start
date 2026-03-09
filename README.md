# Hospital Mapping Web

이 작은 프로젝트는 `hospital.xlsx` 파일에서 병원 데이터(`종별코드명` 및 `주소`)를 추출하고,
한반도 지도 위에 마커로 표시하는 간단한 웹 애플리케이션입니다.

## 사용 방법

1. 필요한 패키지 설치:
   ```bash
   pip install -r requirements.txt
   ```

2. 원본 엑셀 파일이 현재 디렉토리에 `hospital.xlsx` 이름으로 있어야 합니다.
   `run_hospital.py` 를 실행하면 `hospital_parsed.xlsx`가 생성됩니다:
   ```bash
   python3 run_hospital.py
   ```

3. Flask 서버 실행:
   ```bash
   python3 app.py
   ```

4. 브라우저에서 `http://localhost:5000` 으로 접속하면 지도가 나타납니다.
   각 마커에 마우스를 올리면 `종별코드명`이 툴팁으로 표시됩니다.

5. 좌표 계산이 완료되면 `hospital_parsed_with_coords.xlsx` 파일에 위도/경도 정보도 저장됩니다.
   이후 실행 시 재계산 없이 빠르게 로딩됩니다.

> **참고**: 지오코딩은 외부 서비스(Nominatim)를 사용하므로 실행이 느릴 수 있으며,
> 과도한 요청은 차단될 수 있습니다. 이미 계산된 좌표가 있다면
> `hospital_parsed_with_coords.xlsx` 를 이용하거나 파일에 `lat`/`lon` 컬럼을 추가해 주세요.
