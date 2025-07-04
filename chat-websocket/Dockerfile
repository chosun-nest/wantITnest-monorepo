# 멀티 스테이지 빌드를 위한 Dockerfile
# Node.js 채팅 서버용 최적화된 프로덕션 이미지

# ============================================================
# 빌드 스테이지: 의존성 설치 및 앱 준비
# ============================================================
FROM node:22-alpine AS build

# 보안을 위한 비root 사용자 설정
USER node

# 작업 디렉토리 설정
WORKDIR /home/node/app

# package.json과 package-lock.json 먼저 복사 (캐시 최적화)
COPY --chown=node:node package*.json ./

# 모든 의존성 설치 (dev dependencies 포함)
RUN npm ci --frozen-lockfile

# 소스 코드 복사
COPY --chown=node:node . .

# ============================================================
# 프로덕션 스테이지: 최종 런타임 이미지
# ============================================================
FROM node:22-alpine AS production

# 보안 및 성능 향상을 위한 시스템 설정
RUN apk add --no-cache \
    tini \
    && rm -rf /var/cache/apk/*

# 비 root 사용자로 실행
USER node

# 작업 디렉토리 설정
WORKDIR /home/node/app

# 빌드 스테이지에서 package.json과 package-lock.json 복사
COPY --chown=node:node --from=build /home/node/app/package*.json ./

# 프로덕션 의존성만 설치
RUN npm ci --only=production --frozen-lockfile \
    && npm cache clean --force

# 빌드 스테이지에서 소스 코드 복사
COPY --chown=node:node --from=build /home/node/app/server.js ./

# 포트 노출 (기본값: 4000)
EXPOSE 4000

# 환경 변수 설정
ENV NODE_ENV=production
ENV PORT=4000

# Tini를 init 프로세스로 사용하여 신호 처리 및 좀비 프로세스 방지
ENTRYPOINT ["/sbin/tini", "--"]

# 애플리케이션 실행
CMD ["node", "server.js"]