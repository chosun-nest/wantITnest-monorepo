# Nginx 설정 업데이트 가이드

## 🎯 **현재 프로젝트 구조에 맞춘 변경사항**

### 📁 **기존 구조 분석**
- **nest-ai**: 포트 8000 (크롤링 AI 서비스)
- **nest-be**: 포트 6030 (Spring Boot 백엔드)
- **nest-fe**: 포트 5173 (React 프론트엔드)

### 🔄 **Nginx를 통한 통합 아키텍처**
```
Client Request (Port 80)
         ↓
    Nginx Proxy
    ↙    ↓    ↘
nest-ai nest-be nest-fe
(8000)  (6030)  (static)
```

## 📋 **수정된 docker-compose.yml 적용 가이드**

### 1. **기존 docker-compose.yml 백업**
```bash
cp docker-compose.yml docker-compose.yml.backup
```

### 2. **새로운 docker-compose.yml 적용**
위에서 제시한 구조로 변경:
- 모든 서비스의 포트 노출 제거
- nginx만 포트 80으로 노출
- react-build 볼륨 추가
- nginx 서비스 추가

### 3. **환경변수 수정**
`.env` 파일에서:
```bash
# 프론트엔드 API URL을 nginx를 통하도록 변경
VITE_API_BASE_URL="/api"
```

## 🔧 **업데이트된 nginx 기능**

### **새로 추가된 라우팅:**
- `/api/*` → nest-be:6030 (기존 백엔드 API)
- `/ai/*` → nest-ai:8000 (AI 크롤링 서비스)
- `/uploaded-images/*` → 업로드된 이미지 파일 서빙
- `/*` → React 정적 파일 (SPA 라우팅 포함)

### **성능 최적화:**
- AI 서비스용 긴 타임아웃 설정 (크롤링 작업 고려)
- 이미지 파일 캐싱 (1개월)
- gzip 압축 적용

## 🚀 **배포 순서**

### 1. **프론트엔드 프로덕션 Dockerfile 준비**
`frontend/Dockerfile.prod` 파일이 생성되었습니다.

### 2. **전체 스택 빌드 및 실행**
```bash
# 기존 컨테이너 정리
docker-compose down

# 새로운 구조로 실행
docker-compose up --build -d
```

### 3. **접속 확인**
- **메인 사이트**: http://localhost
- **API 테스트**: http://localhost/api/v1/...
- **AI 서비스**: http://localhost/ai/...
- **이미지**: http://localhost/uploaded-images/...

## ⚠️ **중요한 변경사항**

### **프론트엔드 코드 수정 필요:**
`frontend/src/api/index.tsx`:
```typescript
const API = axios.create({
  baseURL: "/api",  // nginx를 통한 상대 경로
  withCredentials: false,
});
```

### **백엔드 CORS 설정 조정 가능:**
nginx에서 CORS를 처리하므로 백엔드의 CORS 설정을 단순화할 수 있습니다.

## 🎉 **기대 효과**

1. **단일 진입점**: 모든 서비스가 포트 80을 통해 접근
2. **CORS 문제 해결**: 같은 도메인에서 모든 리소스 서빙
3. **성능 향상**: 정적 파일 캐싱 및 압축
4. **보안 강화**: 백엔드 서비스가 직접 노출되지 않음
5. **운영 편의성**: 하나의 도메인으로 전체 애플리케이션 관리
