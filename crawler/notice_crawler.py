# 터미널에서 테스트 실행 시의 코드
# (cmd -> $ cd ./crawler -> $ python notice_crawler.py)

# import time
# from urllib.parse import urljoin
# from bs4 import BeautifulSoup
# from selenium import webdriver
# from selenium.webdriver.chrome.service import Service
# from webdriver_manager.chrome import ChromeDriverManager

# # 1. Selenium 드라이버 실행
# options = webdriver.ChromeOptions()
# options.add_argument("--headless")  # 창 없이 실행하고 싶으면 주석 해제
# # options.add_argument("--no-sandbox")
# # options.add_argument("--disable-dev-shm-usage")


# # 크롬 드라이버 자동 설치 및 실행
# # driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
# driver = webdriver.Chrome(options=options)

# # 페이지 수 설정
# MAX_PAGE = 10  # 실제 필요한 만큼 조정

# # 2. 접속할 URL (&page=)
# BASE_URL = "https://eie.chosun.ac.kr"
# LIST_URL = "https://eie.chosun.ac.kr/eie/5563/subview.do?enc=Zm5jdDF8QEB8JTJGYmJzJTJGZWllJTJGMzIwJTJGYXJ0Y2xMaXN0LmRvJTNG"

# all_data = []

# for page in range(1, MAX_PAGE + 1):
#     print(f"▶ {page}페이지 크롤링 중...")

#     # 페이지 이동을 위한 파라미터 구성
#     url = f"{LIST_URL}&amp=&page={page}"
#     driver.get(url)

#     # 3. 페이지 로딩 대기
#     time.sleep(2)

#     # 4. BeautifulSoup로 파싱
#     soup = BeautifulSoup(driver.page_source, 'html.parser')

#     # 5. 공지사항 행 전체 가져오기 (상단고정 포함 일반공지까지 모두)
#     # rows = soup.select('table.board-table.horizon5 tbody tr')
#     # 5. 공지사항 행 전체 가져오기 (상단고정 제외한 일반공지만)
#     rows = soup.select("table.board-table.horizon5 tbody tr:not(.notice)")

#     print(f"크롤링한 공지 수: {len(rows)}")

#     # 6. 공지사항 정보 추출 및 출력
#     for row in rows:
#         cols = row.find_all("td")
#         if len(cols) < 5:
#             continue  # 구조가 다른 경우 무시 (예: 광고 row, 잘못된 row 등)

#         number = cols[0].text.strip()
#         subject_cell = cols[1]
#         link_tag = subject_cell.select_one("a")
#         title = link_tag.text.strip() if link_tag else subject_cell.text.strip()
#         href = link_tag["href"] if link_tag else ""
#         link = urljoin(BASE_URL, href)
#         writer = cols[2].text.strip()
#         date = cols[3].text.strip()
#         views = cols[4].text.strip()

#         print(f"[{number}] {title} / {writer} / {date} / 조회수: {views}")
#         print(f"🔗 링크: {link}")

#         all_data.append({
#             'number': number,
#             'title': title,
#             'writer': writer,
#             'date': date,
#             'views': views,
#             'link': link
#         })

# # 7. 브라우저 닫기
# driver.quit()


# # ▶ Spring API로 POST 전송 시의 코드

#Selenium + BeautifulSoup 혼합 사용
import time
import requests
from urllib.parse import urljoin
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

# ✅ 설정값
MAX_PAGE = 10
BASE_URL = "https://eie.chosun.ac.kr"
LIST_URL = "https://eie.chosun.ac.kr/eie/5563/subview.do?enc=Zm5jdDF8QEB8JTJGYmJzJTJGZWllJTJGMzIwJTJGYXJ0Y2xMaXN0LmRvJTNG"
API_URL = "http://localhost:6030/api/notices"

# ✅ Selenium 설정
options = webdriver.ChromeOptions()
options.add_argument("--headless")  # 브라우저 창 없이 실행

# ✅ Chrome 드라이버 자동 설치 및 실행
service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service, options=options)

all_notices = []

# ✅ 페이지 반복 크롤링
for page in range(1, MAX_PAGE + 1):
    print(f"\n▶ {page}페이지 크롤링 중...")
    # 각 페이지에 ?page= 파라미터 붙여 반복
    driver.get(f"{LIST_URL}&page={page}")
    time.sleep(2)
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    # 상단 고정 제외 (tr.notice 제외한 tr들만 크롤링)
    rows = soup.select("table.board-table.horizon5 tbody tr:not(.notice)")  

    print(f"크롤링한 공지 수: {len(rows)}")

    for row in rows:
        cols = row.find_all("td")
        if len(cols) < 5:
            continue

        number = cols[0].text.strip()
        subject_cell = cols[1]
        link_tag = subject_cell.select_one("a")
        title = link_tag.text.strip() if link_tag else subject_cell.text.strip()
        href = link_tag["href"] if link_tag else ""
        link = urljoin(BASE_URL, href)
        writer = cols[2].text.strip()
        date = cols[3].text.strip()
        views = cols[4].text.strip()

        print(f"[{number}] {title} / {writer} / {date} / 조회수: {views}")
        print(f"🔗 링크: {link}")

        notice = {
            'number': number,
            'title': title,
            'writer': writer,
            'date': date,
            'views': views,
            'link': link
        }
        all_notices.append(notice)

# ✅ 드라이버 종료
driver.quit()

# ✅ Spring API로 POST 전송 (requests.post())
headers = {"Content-Type": "application/json"}

# 에러 로그와 성공 로그 구분
for notice in all_notices:
    try:
        res = requests.post(API_URL, json=notice, headers=headers)
        if res.status_code == 200:
            print(f"✅ 등록 완료: {notice['title']}")
        else:
            print(f"❌ 실패: {res.status_code}, {res.text}")
    except Exception as e:
        print(f"🚨 예외 발생: {e}")
