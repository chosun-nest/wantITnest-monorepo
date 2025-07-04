import requests
import time
import re

from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from urllib.parse import urljoin, quote

from logger_config import logger
from utils import NoticeCache, retry_on_failure, get_base_url
from config import CATEGORIES, API_CONFIG, CRAWL_CONFIG, MISC_CONFIG

class NoticeService:
    def __init__(self):
        self.cache = NoticeCache()
        self.session = requests.Session()
    
    @retry_on_failure(max_retries=API_CONFIG["retry_count"], delay=API_CONFIG["retry_delay"])
    def crawl_all_categories(self):
        """모든 카테고리의 공지사항 크롤링"""
        logger.info("전체 카테고리 공지사항 크롤링 시작")
        
        total_new_notices = 0
        
        for category in CATEGORIES.keys():
            try:
                new_notices = self.crawl_category(category)
                if new_notices:
                    self.send_to_spring_server(category, new_notices)
                    total_new_notices += len(new_notices)
                    logger.info(f"[{category}] 새로운 공지사항 {len(new_notices)}개 처리 완료")
                else:
                    logger.info(f"[{category}] 새로운 공지사항 없음")
                
                # 카테고리 간 딜레이
                time.sleep(CRAWL_CONFIG["delay_between_requests"])
                
            except Exception as e:
                logger.error(f"[{category}] 크롤링 중 오류: {e}")
                continue
        
        # 캐시 정리
        self.cache.cleanup_old_entries(MISC_CONFIG["duplicate_check_hours"])
        
        logger.info(f"전체 크롤링 완료. 총 {total_new_notices}개의 새로운 공지사항 처리")
        return total_new_notices
    
    def crawl_category(self, category: str):
        """특정 카테고리의 공지사항 크롤링 (기존 로직 기반)"""
        url = CATEGORIES.get(category)
        if not url:
            logger.error(f"잘못된 카테고리: {category}")
            return []
        
        BASE_URL = get_base_url(url)
        
        # Selenium 설정
        options = Options()
        for option in CRAWL_CONFIG["selenium_options"]:
            options.add_argument(option)        
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=options)
        
        try:
            driver.get(url)
            soup = BeautifulSoup(driver.page_source, "html.parser")
            
            notices = []
            rows = soup.select("table tbody tr")
            
            for row in rows:
                cols = row.find_all("td")
                if len(cols) < 5:
                    continue
                
                notice = self.parse_notice_row(cols, category, BASE_URL)
                if notice and not self.cache.is_duplicate(notice):
                    notices.append(notice)
            
            # 연도 필터링
            filtered_notices = [
                notice for notice in notices 
                if notice["date"].startswith(str(CRAWL_CONFIG["year_filter"]))
            ]
            
            logger.info(f"[{category}] 수집된 공지사항: {len(filtered_notices)}개")
            return filtered_notices[:MISC_CONFIG["max_notices_per_category"]]
            
        finally:
            driver.quit()
    
    def parse_notice_row(self, cols, category, base_url):
        try:
            number = cols[0].text.strip()
            writer = cols[2].text.strip()
                    # 조회수 처리 - 숫자만 추출
            views_text = cols[4].text.strip()
            views = re.sub(r'[^0-9]', '', views_text)
            
            # 날짜 처리 (장학공지 특별 처리)
            if category == "장학공지":
                date_divs = cols[3].find_all("div", class_="date_fl")
                if len(date_divs) > 0:
                    date = date_divs[0].text.strip()
                    deadline = date_divs[1].text.strip() if len(date_divs) > 1 else ""
                else:
                    date = cols[3].text.strip()
                    deadline = ""
            else:
                date = cols[3].text.strip()
                deadline = ""
            
            # 제목과 링크 처리
            subject_cell = cols[1]
            link_tag = subject_cell.select_one("a")
            title = link_tag.text.strip() if link_tag else subject_cell.text.strip()
            href = link_tag["href"] if link_tag else ""
            link = urljoin(base_url, href)            
            # 기본 공지사항 구조
            notice = {
                "category": category,
                "number": number,
                "title": title,
                "writer": writer,
                "date": date,
                "views": views,
                "link": link
            }
            
            # 장학공지에는 마감일 추가
            if category == "장학공지" and deadline:
                notice["deadline"] = deadline
            
            return notice
            
        except Exception as e:
            logger.warning(f"공지사항 파싱 실패: {e}")
            return None
    
    @retry_on_failure(max_retries=API_CONFIG["retry_count"], delay=API_CONFIG["retry_delay"])
    def send_to_spring_server(self, category, notices):
        """스프링 서버로 공지사항 전송"""
        try:
            # requests가 자동으로 URL 인코딩 처리
            base_url = API_CONFIG['base_url'].rstrip('/')
            endpoint = API_CONFIG['endpoint_template'].format(category=category)
            api_url = f"{base_url}{endpoint}"
            
            logger.info(f"[{category}] API 요청 URL: {api_url}")
            
            response = self.session.post(
                api_url,
                json={"notices": notices},
                timeout=API_CONFIG["timeout"]
            )
            response.raise_for_status()
            
            # ✅ 전송 성공 시에만 캐시에 저장
            for notice in notices:
                self.cache.add_notice(notice)
            
            logger.info(f"[{category}] 스프링 서버 전송 성공: {response.status_code}, 캐시 업데이트 완료")
            return True
            
        except requests.RequestException as e:
            logger.error(f"[{category}] 스프링 서버 전송 실패: {e}")
            raise

# 전역 크롤러 인스턴스
crawler_service = NoticeService()