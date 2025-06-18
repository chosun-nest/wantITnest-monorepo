# Multi-stage build for production
FROM node:20-alpine AS builder

# 작업 디렉터리 설정
WORKDIR /app

# 의존성 파일 복사 및 설치
COPY package*.json ./
RUN npm ci

# 소스 코드 복사
COPY . .

# 프로덕션 빌드
RUN npm run build

# 최종 단계: 빌드된 파일만 유지
FROM alpine:latest

# 작업 디렉터리 설정
WORKDIR /app

# 빌드된 파일을 dist 디렉터리에 복사
COPY --from=builder /app/dist ./dist

# 빌드 완료 표시
RUN echo "React build completed successfully"

# 컨테이너가 종료되지 않도록 대기 (볼륨 마운트를 위해)
CMD ["tail", "-f", "/dev/null"]
