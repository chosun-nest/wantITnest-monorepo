#!/bin/bash

# Docker 빌드 및 실행 스크립트

set -e  # 오류 발생 시 스크립트 중단

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🐳 조선대 공지사항 크롤러 Docker 빌드 및 실행${NC}"
echo "=================================================="

# 환경변수 파일 체크
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env 파일이 없습니다. .env.example을 복사하세요${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ .env 파일이 생성되었습니다${NC}"
fi

# 이전 컨테이너 정리
echo -e "${YELLOW}🧹 기존 컨테이너 정리 중...${NC}"
docker-compose down -v 2>/dev/null || true

# 이미지 빌드
echo -e "${BLUE}🔨 Docker 이미지 빌드 중...${NC}"
docker-compose build --no-cache

# 컨테이너 실행
echo -e "${GREEN}🚀 컨테이너 실행 중...${NC}"
docker-compose up -d

# 컨테이너 상태 확인
echo -e "${BLUE}📊 컨테이너 상태 확인${NC}"
docker-compose ps

# 로그 확인 옵션
echo ""
echo -e "${GREEN}✅ 크롤러가 성공적으로 시작되었습니다!${NC}"
echo ""
echo "📋 유용한 명령어들:"
echo "  docker-compose logs -f crawler          # 실시간 로그 보기"
echo "  docker-compose exec crawler python scheduler_app.py --test  # 즉시 테스트"
echo "  docker-compose down                     # 중지"
echo ""

# 로그 실시간 보기 옵션
read -p "실시간 로그를 보시겠습니까? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}📄 실시간 로그 (Ctrl+C로 종료)${NC}"
    docker-compose logs -f crawler
fi