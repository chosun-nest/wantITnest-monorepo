import hashlib
import json
import time
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
from logger_config import logger

# .env 파일 로드
load_dotenv()

class NoticeCache:
    """공지사항 중복 체크를 위한 캐시"""
    def __init__(self):
        self.cache = {}
        self.cache_file = os.getenv("CACHE_FILE_PATH", "data/notice_cache.json")
        self.load_cache()
    
    def load_cache(self):
        """캐시 파일에서 데이터 로드"""
        try:
            if os.path.exists(self.cache_file):
                with open(self.cache_file, 'r', encoding='utf-8') as f:
                    self.cache = json.load(f)
            else:
                self.cache = {}
        except Exception as e:
            logger.warning(f"캐시 로드 실패: {e}")
            self.cache = {}
    
    def save_cache(self):
        """캐시를 파일에 저장"""
        try:
            os.makedirs(os.path.dirname(self.cache_file), exist_ok=True)
            with open(self.cache_file, 'w', encoding='utf-8') as f:
                json.dump(self.cache, f, ensure_ascii=False, indent=2)
        except Exception as e:
            logger.error(f"캐시 저장 실패: {e}")
    
    def is_duplicate(self, notice_data):
        """중복 공지사항인지 확인"""
        notice_hash = self.generate_hash(notice_data)
        return notice_hash in self.cache
    
    def add_notice(self, notice_data):
        """새 공지사항을 캐시에 추가"""
        notice_hash = self.generate_hash(notice_data)
        self.cache[notice_hash] = {
            "timestamp": datetime.now().isoformat(),
            "title": notice_data.get("title", ""),
            "category": notice_data.get("category", "")
        }
        self.save_cache()
    
    def generate_hash(self, notice_data):
        """공지사항 데이터의 해시 생성"""
        key_data = f"{notice_data.get('category', '')}{notice_data.get('title', '')}{notice_data.get('date', '')}"
        return hashlib.md5(key_data.encode()).hexdigest()
    
    def cleanup_old_entries(self, hours=24):
        """오래된 캐시 엔트리 정리"""
        cutoff_time = datetime.now() - timedelta(hours=hours)
        to_remove = []
        
        for key, value in self.cache.items():
            try:
                entry_time = datetime.fromisoformat(value["timestamp"])
                if entry_time < cutoff_time:
                    to_remove.append(key)
            except:
                to_remove.append(key)  # 잘못된 형식은 삭제
        
        for key in to_remove:
            del self.cache[key]
        
        if to_remove:
            self.save_cache()
            logger.info(f"정리된 오래된 캐시 엔트리: {len(to_remove)}개")

def retry_on_failure(max_retries=3, delay=5):
    """재시도 데코레이터"""
    def decorator(func):
        def wrapper(*args, **kwargs):
            for attempt in range(max_retries):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt < max_retries - 1:
                        logger.warning(f"시도 {attempt + 1} 실패: {e}. {delay}초 후 재시도...")
                        time.sleep(delay)
                    else:
                        logger.error(f"모든 재시도 실패: {e}")
                        raise
        return wrapper
    return decorator

def get_base_url(full_url):
    parts = full_url.split("/", 3)
    return f"{parts[0]}//{parts[2]}"