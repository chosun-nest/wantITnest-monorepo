import os
from datetime import datetime
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

# 스케줄링 설정
SCHEDULE_CONFIG = {
    "enabled": True,
    "schedules": [
        # {"type": "interval", "minutes": 1} # test 시 활성화
        {"type": "cron", "hour": 9, "minute": 0},
        {"type": "cron", "hour": 11, "minute": 0},
        {"type": "cron", "hour": 13, "minute": 0},
        {"type": "cron", "hour": 15, "minute": 0},
        {"type": "cron", "hour": 17, "minute": 0},
    ],
    "timezone": "Asia/Seoul"
}

# 크롤링 대상 카테고리
CATEGORIES = {
    "일반공지": "https://www3.chosun.ac.kr/chosun/217/subview.do",
    "학사공지": "https://www4.chosun.ac.kr/acguide/9326/subview.do?layout=unknown",
    "장학공지": "https://www3.chosun.ac.kr/scho/2138/subview.do",
    "IT융합대학": "https://eie.chosun.ac.kr/eie/5563/subview.do",
    "컴퓨터공학전공": "https://eie.chosun.ac.kr/ce/5670/subview.do",
    "정보통신공학전공": "https://eie.chosun.ac.kr/ice/7953/subview.do",
    "인공지능공학전공": "https://eie.chosun.ac.kr/aie/7977/subview.do",
    "모빌리티SW전공": "https://mobility.chosun.ac.kr/mobility/12563/subview.do",
    "SW중심대학사업단": "https://sw.chosun.ac.kr/main/menu?gc=605XOAS"
}

# API 설정
API_CONFIG = {
    # Docker Compose의 SPRING_SERVER_URL을 우선 사용, 없으면 .env의 SPRING_SERVER_BASE_URL 사용
    "base_url": os.getenv("API_SERVER_URL"),
    "endpoint_template": "/api/v1/notices/{category}",
    "timeout": 30,
    "retry_count": 3,
    "retry_delay": 5  # seconds
}

# 크롤링 설정
CRAWL_CONFIG = {
    "delay_between_requests": 2,  # seconds
    "year_filter": 2025,  # 크롤링할 연도
    "selenium_options": [
        "--headless",
        "--no-sandbox", 
        "--disable-dev-shm-usage",
        "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    ]
}

# 로깅 설정
LOG_CONFIG = {
    "level": "INFO",
    "file_path": "src/logs/crawler.log",
    "max_file_size": 10 * 1024 * 1024,
    "backup_count": 5,
    "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
}

# 기타 설정
MISC_CONFIG = {
    "duplicate_check_hours": 24,  # 중복 체크할 시간 범위
    "max_notices_per_category": 100
}
