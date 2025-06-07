# 조선대학교 공지사항 자동 크롤링 시스템

이 프로젝트는 조선대학교의 각종 공지사항을 자동으로 크롤링하여 Spring Boot 백엔드 서버로 전송하는 시스템입니다.

## 📁 프로젝트 구조

```
NEST-AI/
├── src/
│   ├── config.py                    # 설정 파일
│   ├── logger_config.py             # 로깅 설정
│   ├── notice_crawler.py            # 기존 FastAPI 크롤링 로직
│   ├── crawler_service.py           # 크롤링 서비스 클래스
│   ├── scheduler_app.py             # APScheduler 메인 실행 파일
│   ├── utils.py                     # 유틸리티 함수
│   ├── requirements.txt             # 패키지 목록
│   └── logs/                        # 로그 파일 저장
└── data/                            # 캐시 데이터 저장
```

## 🚀 설치 및 실행

### 1. 환경 설정

```bash
# 1. .env 파일 생성
cp .env.example .env

# 2. .env 파일 수정 (필요에 따라)
# - SPRING_SERVER_BASE_URL: 스프링 서버 주소
# - LOG_LEVEL: 로그 레벨 (DEBUG, INFO, WARNING, ERROR)
# - 기타 설정값들
```

### 2. 패키지 설치

```bash
cd src
pip install -r requirements.txt
```

### 2. 실행 방법

#### 자동 스케줄링 실행 (메인)

```bash
python scheduler_app.py
```

#### 테스트 실행 (즉시 한 번 크롤링)

```bash
python scheduler_app.py --test
```

#### 디버그 모드

```bash
python scheduler_app.py --debug
```

#### 기존 FastAPI 서버 실행 (수동 크롤링)

```bash
uvicorn notice_crawler:app --reload
```

## ⚙️ 설정

### 스케줄링 설정 (config.py)

- 매일 오전 9시, 오후 5시 2시간 간격 자동 크롤링
- 시간대: Asia/Seoul
- 필요시 interval 스케줄 추가 가능

### 크롤링 대상 카테고리

1. 일반공지
2. 학사공지
3. 장학공지
4. IT융합대학 공지
5. 컴퓨터공학과 공지

## 🔧 주요 기능

✅ **자동 스케줄링**: APScheduler를 사용한 정시 크롤링  
✅ **중복 방지**: 이미 수집한 공지사항은 재전송하지 않음  
✅ **에러 처리**: 카테고리별 독립 처리, 재시도 로직  
✅ **상세 로깅**: 파일 및 콘솔 로그, 회전 로그 지원  
✅ **설정 관리**: config.py에서 중앙 관리

## 📊 로그 확인

```bash
tail -f src/logs/crawler.log
```

## 🛠️ API 엔드포인트 (Spring 서버)

- POST `/api/v1/notices/{category}`
- 기본 서버 주소: `http://localhost:6030`

## ⚠️ 주의사항

- Chrome 브라우저가 설치되어 있어야 합니다
- Spring Boot 서버가 먼저 실행되어 있어야 합니다
- 네트워크 연결 상태를 확인해주세요
