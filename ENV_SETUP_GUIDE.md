# 환경변수 설정 가이드

## 📂 환경변수 파일 구조

```
capstone-design-aws/
├── .env.common     # 공통 설정 (도메인, 서버 IP 등)
├── .env.frontend   # Frontend 전용 (Nginx, SSL 등)
├── .env.backend    # Backend 전용 (DB, JWT, AWS 등)
└── .env.template   # 기존 통합 템플릿 (참고용)
```

## 🚀 설정 방법

### 1. 환경변수 파일 생성
```bash
# 템플릿에서 복사
cp .env.common .env.common.bak  # 백업 (선택사항)

# 각 파일을 직접 수정
vi .env.common    # 공통 설정
vi .env.frontend  # Frontend 설정
vi .env.backend   # Backend 설정
```

### 2. 필수 수정 항목

#### `.env.common` (공통)
```bash
DOMAIN_NAME=your-actual-domain.com
FRONTEND_SERVER_IP=xxx.xxx.xxx.xxx    # Frontend EC2 Elastic IP
BACKEND_SERVER_IP=10.0.10.xxx         # Backend EC2 Private IP
```

#### `.env.frontend` (Frontend)
```bash
ALLOWED_ORIGINS=https://your-actual-domain.com
SSL_EMAIL=your-email@example.com
```

#### `.env.backend` (Backend)
```bash
DB_PASSWORD=your_secure_password
JWT_SECRET=your_256_bit_secret_key
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
S3_BUCKET_NAME=your-bucket-name
```

## 🔧 배포 방법

### Frontend Server 배포
```bash
# 환경변수 확인
cat .env.common .env.frontend

# 배포 실행
./deploy-frontend.sh
```

### Backend Server 배포
```bash
# 환경변수 확인
cat .env.common .env.backend

# 배포 실행
./deploy-backend.sh
```

## 📋 환경변수 우선순위

Docker Compose는 다음 순서로 환경변수를 로드합니다:

1. **docker-compose.yml의 environment 섹션** (최우선)
2. **env_file로 지정된 파일들** (.env.frontend → .env.common 순)
3. **시스템 환경변수**

### 충돌 시 해결
```bash
# 같은 변수가 여러 파일에 있는 경우
# .env.frontend의 값이 .env.common의 값을 덮어씀
```

## ⚠️ 보안 주의사항

### 중요한 파일들을 .gitignore에 추가
```bash
# .gitignore에 추가
.env.common
.env.frontend
.env.backend
```

### 백업 및 공유
```bash
# 민감한 정보 제거한 템플릿만 공유
# 실제 환경변수 파일은 안전한 곳에 별도 보관
```

## 🔍 트러블슈팅

### 환경변수가 적용되지 않는 경우
```bash
# 1. 파일 존재 확인
ls -la .env.*

# 2. 환경변수 로드 확인
docker-compose config

# 3. 컨테이너 내부 환경변수 확인
docker exec -it nginx-frontend env | grep DOMAIN_NAME
```

### 서비스별 환경변수 확인
```bash
# Frontend 관련 환경변수
docker-compose -f docker-compose.frontend.yml config

# Backend 관련 환경변수
docker-compose -f docker-compose.backend.yml config
```
