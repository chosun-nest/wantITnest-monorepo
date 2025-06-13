# Nginx 프록시 설정

## 📁 파일 구조

```
nginx/
├── Dockerfile     # Nginx 이미지 설정
├── nginx.conf     # Nginx 설정 파일
└── README.md      # 이 파일
```

## 🏗️ 아키텍처 구조

### 통합 프록시 방식

```
Client Request (Port 80)
         ↓
    Nginx Proxy
    ├── /api/*  → nest-be:6030 (Spring Boot 백엔드)
    ├── /ai/*   → nest-ai:8000 (AI 크롤링 서비스)
    ├── /uploaded-images/* → 업로드된 이미지 파일
    └── /*      → React 정적 파일 (빌드된 정적 파일)
```

## 🚀 사용 방법

### 1. 실행 명령어

```bash
# 프로젝트 루트에서 실행
docker-compose -f docker-compose.proxy.yml up --build -d

# 또는 스크립트 사용
./docker-compose-run.sh up
```

### 2. 접속 방법

- **메인 웹사이트**: http://localhost
- **API 요청**: http://localhost/api/v1/...
- **AI 서비스**: http://localhost/ai/...
- **업로드 이미지**: http://localhost/uploaded-images/...

## 🔧 주요 기능

### 프록시 라우팅

- **`/`**: React 빌드된 정적 파일 서빙
- **`/api/*`**: Spring Boot 백엔드로 프록시 (nest-be:6030)
- **`/ai/*`**: AI 크롤링 서비스로 프록시 (nest-ai:8000)
- **`/uploaded-images/*`**: 업로드된 이미지 파일 서빙

### 성능 최적화

- **정적 파일 캐싱**: JS, CSS, 이미지 파일 1년 캐싱
- **gzip 압축**: 전송 데이터 압축으로 성능 향상
- **AI 서비스 타임아웃**: 크롤링 작업을 위한 긴 타임아웃 (300초)

### CORS 처리

- 모든 서비스가 동일한 도메인(localhost)에서 서빙
- API 요청에 대한 CORS 헤더 자동 추가
- Preflight 요청 자동 처리

### SPA 지원

- React Router 완전 지원
- 모든 경로가 index.html로 fallback
- 브라우저 새로고침 시에도 정상 동작

## ✅ 장점

- **단일 포트**: 포트 80 하나로 모든 서비스 접근
- **CORS 해결**: 같은 도메인에서 모든 리소스 서빙
- **보안 강화**: 백엔드 서비스들이 직접 노출되지 않음
- **운영 편의성**: 하나의 도메인으로 전체 애플리케이션 관리

## 🔧 설정 수정

nginx.conf 파일에서 필요에 따라 수정 가능한 항목들:

### 백엔드 서버 주소 변경
```nginx
upstream backend {
    server nest-be:6030;  # 서버 주소 변경 가능
}

upstream ai_server {
    server nest-ai:8000;  # AI 서버 주소 변경 가능
}
```

### 포트 변경
```nginx
server {
    listen 80;  # 원하는 포트로 변경 가능
    ...
}
```
