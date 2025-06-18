#!/bin/bash

# ===========================================
# 조선대 IT융합대학 캡스톤 프로젝트
# AWS Backend Server 배포 스크립트
# ===========================================

set -e  # 에러 발생 시 스크립트 종료

echo "🚀 Backend Server 배포를 시작합니다..."

# 환경변수 파일들 확인
REQUIRED_ENV_FILES=(".env.common" ".env.backend")

for env_file in "${REQUIRED_ENV_FILES[@]}"; do
    if [ ! -f "$env_file" ]; then
        echo "❌ $env_file 파일이 없습니다."
        echo "   .env.template을 참고하여 환경변수 파일들을 생성해주세요:"
        echo "   - .env.common (공통 설정)"
        echo "   - .env.backend (Backend 전용 설정)"
        exit 1
    fi
done

# 중요 환경변수 확인
echo "🔍 중요 환경변수를 확인합니다..."
source .env.backend

# OpenAI API 키 확인
if [ -z "$OPENAI_API_KEY" ] || [ "$OPENAI_API_KEY" = "your_openai_api_key_here" ]; then
    echo "⚠️ OPENAI_API_KEY가 설정되지 않았거나 기본값입니다."
    echo "   .env.backend 파일에서 올바른 OpenAI API 키를 설정해주세요."
    echo "   (ChatBot 기능이 작동하지 않을 수 있습니다.)"
fi

# DB 비밀번호 확인
if [ -z "$DB_PASSWORD" ] || [ "$DB_PASSWORD" = "your_secure_db_password_here" ]; then
    echo "⚠️ DB_PASSWORD가 설정되지 않았거나 기본값입니다."
    echo "   .env.backend 파일에서 보안이 강화된 데이터베이스 비밀번호를 설정해주세요."
fi

# Docker 및 Docker Compose 설치 확인
if ! command -v docker &> /dev/null; then
    echo "❌ Docker가 설치되지 않았습니다."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose가 설치되지 않았습니다."
    exit 1
fi

# 이전 컨테이너 정리
echo "🧹 이전 컨테이너를 정리합니다..."
docker-compose -p want-it-nest-backend -f docker-compose.backend.yml down
# 이미지 빌드
echo "🔨 Docker 이미지를 빌드합니다..."
docker-compose -p want-it-nest-backend -f docker-compose.backend.yml build --no-cache

# Backend 서비스 시작
echo "🎯 Backend 서비스를 시작합니다..."
docker-compose -p want-it-nest-backend -f docker-compose.backend.yml up -d

echo ""
echo "✅ Backend Server 배포가 완료되었습니다!"
echo ""
