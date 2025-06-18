#!/bin/bash

# ===========================================
# wantITnest
# AWS Frontend Server 배포 스크립트
# ===========================================

set -e  # 에러 발생 시 스크립트 종료

echo "🚀 Frontend Server 배포를 시작합니다..."

# 환경변수 파일들 확인
REQUIRED_ENV_FILES=(".env.common" ".env.frontend")

for env_file in "${REQUIRED_ENV_FILES[@]}"; do
    if [ ! -f "$env_file" ]; then
        echo "❌ $env_file 파일이 없습니다."
        echo "   .env.template을 참고하여 환경변수 파일들을 생성해주세요:"
        echo "   - .env.common (공통 설정)"
        echo "   - .env.frontend (Frontend 전용 설정)"
        exit 1
    fi
done

# Backend Server IP 확인
if grep -q "BACKEND_SERVER_IP=10.0.10.xxx" .env.common; then
    echo "⚠️  .env.common 파일에서 BACKEND_SERVER_IP를 실제 Backend EC2 IP로 수정해주세요."
    echo "   Backend EC2에서 다음 명령어로 IP 확인: curl -s http://169.254.169.254/latest/meta-data/local-ipv4"
    exit 1
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
docker-compose -f docker-compose.frontend.yml down

# React 빌드 볼륨만 삭제 (업로드 이미지는 보존)
echo "🗑️  이전 React 빌드 볼륨을 삭제합니다..."
docker volume rm capstone-design-aws_react-dist 2>/dev/null || echo "   React 볼륨이 없거나 이미 삭제되었습니다."

# 이미지 빌드
echo "🔨 Docker 이미지를 빌드합니다..."
docker-compose -f docker-compose.frontend.yml build --no-cache

# 서비스 시작
echo "🎯 Frontend 서비스를 시작합니다..."
docker-compose -p want-it-nest-frontend -f docker-compose.frontend.yml up -d

# 상태 확인
echo "📊 서비스 상태를 확인합니다..."
sleep 10
docker-compose -f docker-compose.frontend.yml ps

# 로그 확인
echo "📝 서비스 로그를 확인합니다..."
docker-compose -f docker-compose.frontend.yml logs --tail=20

echo ""
echo "✅ Frontend Server 배포가 완료되었습니다!"
echo ""
echo "🌐 접속 정보:"
echo "   - HTTP:  http://localhost"
echo "   - HTTPS: https://localhost (SSL 설정 후)"
echo "   - 크롤링 API: http://localhost:8000"
echo ""
echo "📚 유용한 명령어:"
echo "   - 로그 보기: docker-compose -f docker-compose.frontend.yml logs -f"
echo "   - 재시작: docker-compose -f docker-compose.frontend.yml restart"
echo "   - 중지: docker-compose -f docker-compose.frontend.yml down"
echo ""
