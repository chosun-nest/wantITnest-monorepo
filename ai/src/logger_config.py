import logging
import logging.handlers
import os
from config import LOG_CONFIG

def setup_logger():
    """로거 설정"""
    # logs 디렉토리 생성
    log_dir = os.path.dirname(LOG_CONFIG["file_path"])
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)
    
    # 로거 생성
    logger = logging.getLogger("CrawlerLogger")
    logger.setLevel(getattr(logging, LOG_CONFIG["level"]))
    
    # 기존 핸들러 제거 (중복 방지)
    for handler in logger.handlers[:]:
        logger.removeHandler(handler)
    
    # 파일 핸들러 (회전 로그)
    file_handler = logging.handlers.RotatingFileHandler(
        LOG_CONFIG["file_path"],
        maxBytes=LOG_CONFIG["max_file_size"],
        backupCount=LOG_CONFIG["backup_count"],
        encoding='utf-8'
    )
    file_handler.setLevel(logging.INFO)
    
    # 콘솔 핸들러
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    
    # 포매터 설정
    formatter = logging.Formatter(LOG_CONFIG["format"])
    file_handler.setFormatter(formatter)
    console_handler.setFormatter(formatter)
    
    # 핸들러 추가
    logger.addHandler(file_handler)
    logger.addHandler(console_handler)
    
    return logger

# 전역 로거 인스턴스
logger = setup_logger()