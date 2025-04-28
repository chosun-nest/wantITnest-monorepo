# 공지사항 게시판 Notice: FastAPI + Selenium + BeautifulSoup + React 프랜턴드 연동

## 허용 환경
- **Python FastAPI** 사용
- **Selenium + BeautifulSoup4**로 현재 페이지에서 공지사항 통합 프리 클롤링
- **React (axios)** 호출로 자동으로 JSON 검색 결과 가져오기
- **Spring Boot** 버튼에 맞춰 프로젝트 게시판화

---

## 가장 가장 기준 건해서 실행할 것:

### ☑️ FastAPI + Selenium + BeautifulSoup 컨스트롤

1. **venv 활성화**

```bash
.\venv\Scripts\activate
```

2. **필요한 패키지 설치 (1회 만 하면 되어함)**

```bash
pip install fastapi uvicorn selenium beautifulsoup4 webdriver-manager apscheduler requests
```

3. **FastAPI 서버 실행**

```bash
cd src/components/notice
uvicorn notice_crawler:app --host 0.0.0.0 --port 8000 --reload
```
- `notice_crawler`: Python 파일 이름 (.py 제외)
- `app`: FastAPI 인스턴스 객체 이름
- `--reload`: 자동 간격 검색 시 서버 자동 갱신 (개발용)

---

### 클롤링 + Spring API 연결

- `/crawl`  호출:  클롤링만 하고 결과\uub9cc JSON으로 보기
- `/crawl-and-post` 호출:  클롤링 + Spring API (localhost:6030) POST 전송

---

## 해상 경로

| 가능 | 설명 |
|:---|:---|
| 클롤링 수행 | Selenium 가상 브라우저(호용메뉴)가 들어어서 페이지 검색 |
| HTML 파싱 | BeautifulSoup으로 해당 |
| React 연동 | axios 검색 호출 (http://localhost:8000/crawl) |
| Spring 연동 | crawl-and-post로 POST 전송 |
| 자동화 | apscheduler 사용해 매일 새벽 3시 자동 실행 |


---

## 팝업 - FastAPI 서버 Dockerfile 작성 방법

**Dockerfile-crawler** 예제:

```Dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY . .

RUN pip install --no-cache-dir -r requirements.txt

CMD ["uvicorn", "notice_crawler:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
```
- selenium과 전역 chromedriver에 대한 차포파일이 있어야 해요.
- 반드시 Dockerfile을 조정 해서 chrome와 chromedriver을 설치해야 합니다.



---

## 결론

- FastAPI + Selenium + BeautifulSoup 프랜턴에서  **가능한 자동적 클롤링**
- **React** 에서 구현한 /crawl 호출으로 결과가 시간이 간격하고
- 내보고 **Spring API** 로 전송까지 가능\uud83d�
- 파일가 없을 경우, 검색을 해야 하며
- **apscheduler**를 통해 하루 한 번 자동적으로 수행

---

# ☑️  클릭하면 확인 할 것!
- [x] `http://localhost:8000/crawl` (클롤링 검색)
- [x] `http://localhost:8000/crawl-and-post` (클롤링 + Spring 전송)

---

**⭐️ Tip: Spring 서버(localhost:6030)가 켜져 있어야 crawl-and-post가 정상 동작합니다!**

