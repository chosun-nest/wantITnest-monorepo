#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import signal
import sys
from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger
from pytz import timezone
from datetime import datetime

from logger_config import logger
from crawler_service import crawler_service
from config import SCHEDULE_CONFIG

class CrawlerScheduler:
    def __init__(self):
        self.scheduler = BlockingScheduler(
            timezone=timezone(SCHEDULE_CONFIG["timezone"])
        )
        self.setup_signal_handlers()
        self.setup_jobs()
    
    def setup_signal_handlers(self):
        """시그널 핸들러 설정 (우아한 종료)"""
        signal.signal(signal.SIGINT, self.signal_handler)
        signal.signal(signal.SIGTERM, self.signal_handler)
    
    def signal_handler(self, signum, frame):
        """시그널 처리 (Ctrl+C 등)"""
        logger.info(f"종료 신호 수신 ({signum}). 스케줄러를 정리하고 종료합니다...")
        self.shutdown()
        sys.exit(0)
    
    def setup_jobs(self):
        """스케줄 작업 설정"""
        if not SCHEDULE_CONFIG["enabled"]:
            logger.warning("스케줄링이 비활성화되어 있습니다")
            return
        
        for i, schedule in enumerate(SCHEDULE_CONFIG["schedules"]):
            job_id = f"crawl_job_{i}"
            
            if schedule["type"] == "cron":
                trigger = CronTrigger(
                    hour=schedule.get("hour"),
                    minute=schedule.get("minute", 0),
                    timezone=SCHEDULE_CONFIG["timezone"]
                )
                schedule_desc = f"매일 {schedule['hour']:02d}:{schedule.get('minute', 0):02d}"
                
            elif schedule["type"] == "interval":
                trigger = IntervalTrigger(
                    hours=schedule.get("hours", 0),
                    minutes=schedule.get("minutes", 0),
                    seconds=schedule.get("seconds", 0)
                )
                schedule_desc = f"매 {schedule.get('hours', 0)}시간 {schedule.get('minutes', 0)}분마다"            
            else:
                logger.warning(f"지원하지 않는 스케줄 타입: {schedule['type']}")
                continue
            
            self.scheduler.add_job(
                func=self.crawl_job,
                trigger=trigger,
                id=job_id,
                name=f"조선대 공지사항 크롤링 - {schedule_desc}",
                max_instances=1,
                coalesce=True
            )
            
            logger.info(f"스케줄 등록: {schedule_desc}")
    
    def crawl_job(self):
        """크롤링 작업 실행"""
        try:
            logger.info("="*60)
            logger.info("📢 예약된 조선대 공지사항 크롤링 작업 시작")
            start_time = datetime.now()
            
            total_notices = crawler_service.crawl_all_categories()
            
            end_time = datetime.now()
            duration = (end_time - start_time).total_seconds()
            logger.info(f"✅ 크롤링 작업 완료 (소요시간: {duration:.2f}초, 처리된 공지사항: {total_notices}개)")
            logger.info("="*60)
            
        except Exception as e:
            logger.error(f"❌ 예약된 크롤링 작업 중 오류: {e}")
    
    def run_once(self):
        """즉시 한 번 실행 (테스트용)"""
        logger.info("🧪 테스트 크롤링 실행...")
        self.crawl_job()
    
    def start(self):
        """스케줄러 시작"""
        logger.info("🚀 조선대 공지사항 자동 크롤링 스케줄러 시작")
        logger.info(f"설정된 작업 수: {len(self.scheduler.get_jobs())}")
        
        try:
            self.scheduler.start()
        except KeyboardInterrupt:
            logger.info("사용자에 의한 종료 요청")
            self.shutdown()
    
    def shutdown(self):
        """스케줄러 종료"""
        if self.scheduler.running:
            self.scheduler.shutdown(wait=True)
            logger.info("스케줄러가 정상적으로 종료되었습니다")
def main():
    """메인 함수"""
    import argparse
    
    parser = argparse.ArgumentParser(description="조선대학교 공지사항 자동 크롤링 시스템")
    parser.add_argument("--test", action="store_true", help="즉시 한 번 실행 (테스트용)")
    parser.add_argument("--debug", action="store_true", help="디버그 모드")
    
    args = parser.parse_args()
    
    if args.debug:
        import logging
        logging.getLogger("apscheduler").setLevel(logging.DEBUG)
    
    scheduler_instance = CrawlerScheduler()
    
    if args.test:
        scheduler_instance.run_once()
    else:
        scheduler_instance.start()

if __name__ == "__main__":
    main()