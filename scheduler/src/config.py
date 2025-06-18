import os
from datetime import datetime
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

# 스케줄링 설정
SCHEDULE_CONFIG = {
    "enabled": os.getenv("SCHEDULE_ENABLED", "true").lower() == "true",
    "schedules": [
        # {"type": "interval", "minutes": 1} # test 시 활성화
        {"type": "cron", "hour": 9, "minute": 0},
        {"type": "cron", "hour": 11, "minute": 0},
        {"type": "cron", "hour": 13, "minute": 0},
        {"type": "cron", "hour": 15, "minute": 0},
        {"type": "cron", "hour": 17, "minute": 0},
    ],
    "timezone": os.getenv("SCHEDULE_TIMEZONE", "Asia/Seoul")
}

# 크롤링 대상 카테고리
CATEGORIES = {
    "일반공지": "https://www3.chosun.ac.kr/chosun/217/subview.do",
    "학사공지": "https://www4.chosun.ac.kr/acguide/9326/subview.do?layout=unknown",
    "장학공지": "https://www3.chosun.ac.kr/scho/2138/subview.do",
    "IT융합대학 공지": "https://eie.chosun.ac.kr/eie/5563/subview.do",
    "컴퓨터공학과 공지": "https://eie.chosun.ac.kr/ce/5670/subview.do",
    "SW중심대학사업단 공지": "https://sw.chosun.ac.kr/main/menu?gc=605XOAS"
}

# API 설정
API_CONFIG = {
    # Docker Compose의 SPRING_SERVER_URL을 우선 사용, 없으면 .env의 SPRING_SERVER_BASE_URL 사용
    "base_url": os.getenv("SPRING_SERVER_URL") or os.getenv("SPRING_SERVER_BASE_URL", "http://localhost:6030"),
    "endpoint_template": "/api/v1/notices/{category}",
    "timeout": int(os.getenv("API_TIMEOUT_SECONDS", "30")),
    "retry_count": int(os.getenv("API_RETRY_COUNT", "3")),
    "retry_delay": int(os.getenv("API_RETRY_DELAY_SECONDS", "5"))  # seconds
}

# 크롤링 설정
CRAWL_CONFIG = {
    "delay_between_requests": int(os.getenv("CRAWL_DELAY_SECONDS", "2")),  # seconds
    "year_filter": os.getenv("CRAWL_YEAR_FILTER", "2025"),  # 크롤링할 연도
    "selenium_options": [
        "--headless",
        "--no-sandbox", 
        "--disable-dev-shm-usage",
        "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    ]
}

# 로깅 설정
LOG_CONFIG = {
    "level": os.getenv("LOG_LEVEL", "INFO"),
    "file_path": os.getenv("LOG_FILE_PATH", "src/logs/crawler.log"),
    "max_file_size": int(os.getenv("LOG_MAX_FILE_SIZE_MB", "10")) * 1024 * 1024,  # MB를 bytes로 변환
    "backup_count": int(os.getenv("LOG_BACKUP_COUNT", "5")),
    "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
}

# 기타 설정
MISC_CONFIG = {
    "duplicate_check_hours": int(os.getenv("DUPLICATE_CHECK_HOURS", "24")),  # 중복 체크할 시간 범위
    "max_notices_per_category": int(os.getenv("MAX_NOTICES_PER_CATEGORY", "100"))
}
