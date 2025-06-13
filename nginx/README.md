# Nginx 빌드 분리 설정 가이드

## 📁 파일 구조

```
nginx/
├── Dockerfile                     # 단순 Nginx 이미지
├── nginx.conf                     # 정적 파일 서빙 설정
├── docker-compose.example.yml     # 기존 예시 (참고용)
├── DEPLOYMENT.md                   # 배포 가이드
└── README.md                       # 이 파일
```

## 🏗️ 빌드 분리 아키텍처

### 프로덕션 방식 구조

```
1. nest-fe Container: React 빌드 → react-build Volume → 종료
2. nginx Container: react-build Volume 마운트 → 정적 파일 서빙

Client Request (Port 80)
         ↓
    Nginx (정적 파일)
    ├── /api/* → nest-be:6030 (Spring Boot)
    ├── /ai/*  → nest-ai:8000 (AI Service)
    ├── /uploaded-images/* → 이미지 파일
    └── /*     → React 정적 파일 (빌드됨)
```

### 🔧 빌드 과정

1. **nest-fe**: React 프로덕션 빌드 수행
2. **볼륨 저장**: 빌드된 파일을 react-build 볼륨에 저장
3. **컨테이너 종료**: 빌드 완료 후 nest-fe 컨테이너 종료 (`restart: "no"`)
4. **nginx 서빙**: nginx가 볼륨의 정적 파일 서빙

## 🚀 사용 방법

### 1. 기본 설정

이 nginx 설정은 다음과 같이 동작합니다:

- **포트 80**에서 모든 요청을 받음
- **React 빌드된 정적 파일** 서빙
- `/api/`로 시작하는 요청은 Spring Boot 백엔드(nest-be:6030)로 프록시
- `/ai/`로 시작하는 요청은 AI 서비스(nest-ai:8000)로 프록시
- `/uploaded-images/`는 업로드된 이미지 파일 서빙
- **SPA 라우팅** 지원 (모든 경로를 index.html로 fallback)

### 2. Docker로 실행

#### 빌드 분리 방식으로 실행:

```bash
# 프로젝트 루트에서
docker-compose -f docker-compose.proxy.yml up --build -d
```

#### 기존 방식 (개발용):

```bash
# 프로젝트 루트에서
docker-compose up --build -d
```

### 3. 접속 방법

#### 빌드 분리 방식 사용 시:

- **메인 사이트**: http://localhost (React 정적 파일)
- **API 테스트**: http://localhost/api/v1/...
- **AI 서비스**: http://localhost/ai/...
- **이미지**: http://localhost/uploaded-images/...

## 🔧 주요 기능

### 프로덕션 최적화

- **정적 파일 서빙**: 빌드된 React 파일 직접 서빙
- **캐싱 최적화**: JS, CSS, 이미지 파일 1년 캐싱
- **압축**: gzip을 통한 전송 최적화
- **보안**: hot reload 등 개발용 기능 제거

### 통합 라우팅

- **`/`**: React 정적 파일 서빙
- **`/api/*`**: Spring Boot 백엔드 프록시 (nest-be:6030)
- **`/ai/*`**: AI 크롤링 서비스 프록시 (nest-ai:8000)
- **`/uploaded-images/*`**: 업로드된 이미지 파일 서빙

### CORS 해결

- 모든 서비스가 동일한 도메인(localhost)에서 서빙
- API 요청에 대한 CORS 헤더 자동 추가
- Preflight 요청 처리

### SPA 라우팅 지원

- React Router 완전 지원
- 모든 경로가 index.html로 fallback
- 브라우저 새로고침 시에도 정상 동작

### 4. 설정 수정이 필요한 경우

#### 백엔드 서버 주소 변경:

`nginx.conf`의 upstream 섹션을 수정하세요:

```nginx
upstream backend {
    server your-backend-server:6030;
}

upstream ai_server {
    server your-ai-server:8000;
}
```

#### 포트 변경:

`nginx.conf`의 listen 포트를 변경하세요:

```nginx
server {
    listen 8080;  # 원하는 포트로 변경
    ...
}
```

### ✅ **운영 편의성**

- 하나의 포트(80)로 모든 서비스 접근
- 서비스 간 내부 통신으로 보안 강화
- 로드밸런서나 CDN 연결 시 단일 진입점

## 📋 **프론트엔드 API URL 변경 필요**

nginx 프록시를 사용하려면 프론트엔드에서 API 호출 방식을 변경해야 합니다:
