import pandas as pd

# 1. 원본 엑셀 파일 불러오기
input_file = './new_hospital.xlsx'
df = pd.read_excel(input_file)

# 2. CSV 파일로 내보내기
# encoding='utf-8-sig'는 엑셀에서 열었을 때 한글이 깨지는 것을 방지합니다.
output_file = './new_hospital.csv'
df.to_csv(output_file, index=False, encoding='utf-8-sig')

print(f"변환 완료! '{output_file}' 파일이 생성되었습니다.")