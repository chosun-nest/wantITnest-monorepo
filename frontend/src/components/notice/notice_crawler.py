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

########
# # # ▶ Spring API로 POST 전송 시의 코드

# #Selenium + BeautifulSoup 혼합 사용
# import time
# import requests
# from urllib.parse import urljoin
# from bs4 import BeautifulSoup
# from selenium import webdriver
# from selenium.webdriver.chrome.service import Service
# from webdriver_manager.chrome import ChromeDriverManager

# # ✅ 설정값
# MAX_PAGE = 10
# BASE_URL = "https://eie.chosun.ac.kr"
# LIST_URL = "https://eie.chosun.ac.kr/eie/5563/subview.do?enc=Zm5jdDF8QEB8JTJGYmJzJTJGZWllJTJGMzIwJTJGYXJ0Y2xMaXN0LmRvJTNG"
# API_URL = "http://localhost:6030/api/notices"

# # ✅ Selenium 설정
# options = webdriver.ChromeOptions()
# options.add_argument("--headless")  # 브라우저 창 없이 실행

# # ✅ Chrome 드라이버 자동 설치 및 실행
# service = Service(ChromeDriverManager().install())
# driver = webdriver.Chrome(service=service, options=options)

# all_notices = []

# # ✅ 페이지 반복 크롤링
# for page in range(1, MAX_PAGE + 1):
#     print(f"\n▶ {page}페이지 크롤링 중...")
#     # 각 페이지에 ?page= 파라미터 붙여 반복
#     driver.get(f"{LIST_URL}&page={page}")
#     time.sleep(2)
#     soup = BeautifulSoup(driver.page_source, 'html.parser')
#     # 상단 고정 제외 (tr.notice 제외한 tr들만 크롤링)
#     rows = soup.select("table.board-table.horizon5 tbody tr:not(.notice)")  

#     print(f"크롤링한 공지 수: {len(rows)}")

#     for row in rows:
#         cols = row.find_all("td")
#         if len(cols) < 5:
#             continue

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

#         notice = {
#             'number': number,
#             'title': title,
#             'writer': writer,
#             'date': date,
#             'views': views,
#             'link': link
#         }
#         all_notices.append(notice)

# # ✅ 드라이버 종료
# driver.quit()

# # ✅ Spring API로 POST 전송 (requests.post())
# headers = {"Content-Type": "application/json"}

# # 에러 로그와 성공 로그 구분
# for notice in all_notices:
#     try:
#         res = requests.post(API_URL, json=notice, headers=headers)
#         if res.status_code == 200:
#             print(f"✅ 등록 완료: {notice['title']}")
#         else:
#             print(f"❌ 실패: {res.status_code}, {res.text}")
#     except Exception as e:
#         print(f"🚨 예외 발생: {e}")


########
## Python 크롤러를 FastAPI 서버로 바꾸기
# GET /crawl로 요청하면 학사공지 크롤링 데이터 JSON을 반환함.

## FastAPI 서버 실행 방법
# uvicorn notice_crawler:app --host 0.0.0.0 --port 8000 --reload

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import time
import requests
from apscheduler.schedulers.background import BackgroundScheduler  # ✅ 스케줄러 import 추가


app = FastAPI()

# ✅ CORS 설정 (React 통신 허용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 개발용 전체 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/crawl")
def crawl_notices():
    # ✅ 크롤링 대상 URL
    LIST_URL = "https://eie.chosun.ac.kr/eie/5563/subview.do?enc=Zm5jdDF8QEB8JTJGYmJzJTJGZWllJTJGMzIwJTJGYXJ0Y2xMaXN0LmRvJTNG"
    BASE_URL = "https://eie.chosun.ac.kr"

    # ✅ Selenium 옵션 설정
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # 창 없이 실행
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("user-agent=Mozilla/5.0")  # User-Agent 추가

    # ✅ ChromeDriver 자동 설치 및 로드
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)

    # ✅ 페이지 열기
    driver.get(LIST_URL)
    time.sleep(2)  # 로딩 대기 (JS 실행 시간 확보)

    # ✅ BeautifulSoup 파싱
    soup = BeautifulSoup(driver.page_source, "html.parser")

    # ✅ 필요한 데이터만 크롤링
    rows = soup.select("table.board-table.horizon5 tbody tr:not(.notice)")

    notices = []

    for row in rows:
        cols = row.find_all("td")
        if len(cols) < 5:
            continue  # 데이터 불완전한 행 무시

        number = cols[0].text.strip()
        title_cell = cols[1]
        title_tag = title_cell.select_one("a")
        title = title_tag.text.strip() if title_tag else title_cell.text.strip()
        link = BASE_URL + title_tag['href'] if title_tag else ""

        writer = cols[2].text.strip()
        date = cols[3].text.strip()
        views = cols[4].text.strip()

        notice = {
            "number": number,
            "title": title,
            "writer": writer,
            "date": date,
            "views": views,
            "link": link
        }
        notices.append(notice)

    # ✅ 크롬 드라이버 종료
    driver.quit()

    # ✅ 크롤링된 데이터 반환
    return {"notices": notices}

# 여기서부터 새로운 함수 추가
SPRING_API_URL = "http://localhost:6030/api/notices"  # Spring API 주소

@app.get("/crawl-and-post")
def crawl_and_post_notices():
    notices = crawl_notices()["notices"]

    headers = {"Content-Type": "application/json"}

    success_count = 0
    fail_count = 0

    for notice in notices:
        try:
            res = requests.post(SPRING_API_URL, json=notice, headers=headers)
            if res.status_code == 200:
                success_count += 1
            else:
                fail_count += 1
        except Exception as e:
            print(f"🚨 예외 발생: {e}")
            fail_count += 1

    return {"message": "전송 완료", "성공": success_count, "실패": fail_count}

# ✅ (여기부터!!) 스케줄러 코드 추가
def scheduled_crawl_and_post():
    print("⏰ 하루 1번 자동 크롤링 및 전송 시작")
    crawl_and_post_notices()

scheduler = BackgroundScheduler()
scheduler.add_job(scheduled_crawl_and_post, "cron", hour=3, minute=0)  # 새벽 3시마다 실행
scheduler.start()