#!/bin/bash

# ===========================================
# wantITnest - Frontend 서비스 배포 스크립트  
# React + Nginx + Crawler
# ===========================================

set -e  # 에러 발생 시 스크립트 종료

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 프로젝트 설정
PROJECT_NAME="want-it-nest-frontend"
COMPOSE_FILE="docker-compose.frontend.yml"

# 환경변수 파일 검증
check_env_files() {
    echo -e "${BLUE}🔍 환경변수 파일을 확인합니다...${NC}"
    
    if [ ! -f ".env.frontend" ]; then
        echo -e "${RED}❌ .env.frontend 파일이 없습니다.${NC}"
        echo -e "${YELLOW}   .env.frontend.template을 참고하여 환경변수 파일을 생성해주세요.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ 환경변수 파일 확인 완료${NC}"
}

# 환경변수 로드
load_env_vars() {
    echo -e "${BLUE}🔧 환경변수를 로드합니다...${NC}"
    export $(cat .env.frontend | grep -v ^# | grep -v ^$ | xargs)
    echo -e "${YELLOW}   VITE_API_BASE_URL: $VITE_API_BASE_URL${NC}"
    echo -e "${YELLOW}   VITE_API_CHAT_URL: $VITE_API_CHAT_URL${NC}"
    
    # docker-compose 설정 확인 (디버깅용)
    echo -e "${BLUE}🔍 Docker Compose 설정을 확인합니다...${NC}"
    echo -e "${YELLOW}   build args에서 VITE_API_BASE_URL 치환 결과:${NC}"
    docker-compose -f $COMPOSE_FILE config | grep -A 5 "VITE_API_BASE_URL" || echo "   설정을 찾을 수 없습니다."
}

# Docker 설치 확인
check_docker() {
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker가 설치되지 않았습니다.${NC}"
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}❌ Docker Compose가 설치되지 않았습니다.${NC}"
        exit 1
    fi
}

# Frontend 서비스 시작
start_services() {
    echo -e "${GREEN}🚀 Frontend 서비스를 시작합니다...${NC}"
    
    check_env_files
    check_docker
    load_env_vars
    
    # 이전 컨테이너 정리
    echo -e "${BLUE}🧹 이전 컨테이너를 정리합니다...${NC}"
    docker-compose -p $PROJECT_NAME -f $COMPOSE_FILE down || true
    
    # React 빌드 볼륨만 삭제 (업로드 이미지는 보존)
    echo -e "${BLUE}🗑️  이전 React 빌드 볼륨을 삭제합니다...${NC}"
    docker volume rm ${PROJECT_NAME}_react-dist 2>/dev/null || echo "   React 볼륨이 없거나 이미 삭제되었습니다."
    
    # 필요한 디렉토리 생성
    echo -e "${BLUE}🗂️ 필요한 디렉토리를 생성합니다...${NC}"
    mkdir -p scheduler/logs
    mkdir -p scheduler/data
    mkdir -p volume/ssl
    mkdir -p volume/letsencrypt
    
    # 이미지 빌드 및 서비스 시작
    echo -e "${BLUE}🔨 Docker 이미지를 빌드하고 서비스를 시작합니다...${NC}"
    docker-compose -p $PROJECT_NAME -f $COMPOSE_FILE up -d --build
    
    # 상태 확인
    echo -e "${BLUE}📊 서비스 상태를 확인합니다...${NC}"
    sleep 10
    docker-compose -p $PROJECT_NAME -f $COMPOSE_FILE ps
    
    echo ""
    echo -e "${GREEN}✅ Frontend 서비스가 시작되었습니다!${NC}"
    echo -e "${BLUE}🔍 서비스 확인:${NC}"
    echo -e "   - ${YELLOW}웹사이트 (HTTP)${NC}: http://localhost"
    echo -e "   - ${YELLOW}웹사이트 (HTTPS)${NC}: https://localhost (SSL 설정 후)"
    echo -e "   - ${YELLOW}크롤링 API${NC}: http://localhost:8000"
    echo ""
}

# Frontend 서비스 중지
stop_services() {
    echo -e "${YELLOW}🛑 Frontend 서비스를 중지합니다...${NC}"
    
    docker-compose -p $PROJECT_NAME -f $COMPOSE_FILE down
    
    echo -e "${GREEN}✅ Frontend 서비스가 중지되었습니다!${NC}"
}

# 로그 확인
show_logs() {
    local service_name=$1
    
    if [ -z "$service_name" ]; then
        echo -e "${BLUE}📜 모든 Frontend 서비스의 로그를 확인합니다...${NC}"
        echo ""
        
        # 크롤러 파일 로그 표시
        echo -e "${YELLOW}=== Crawler 파일 로그 (최근 20줄) ===${NC}"
        if [ -f "scheduler/logs/crawler.log" ]; then
            tail -20 scheduler/logs/crawler.log 2>/dev/null || echo "로그 파일을 찾을 수 없습니다."
        else
            echo "로그 파일이 아직 생성되지 않았습니다."
        fi
        echo ""
        
        # 실시간 컨테이너 로그 표시
        echo -e "${YELLOW}=== 실시간 컨테이너 로그 (Ctrl+C로 종료) ===${NC}"
        docker-compose -p $PROJECT_NAME -f $COMPOSE_FILE logs -f --tail=10
        
    else
        echo -e "${BLUE}📜 $service_name 서비스의 로그를 확인합니다...${NC}"
        
        # 특정 서비스의 로그 확인
        case $service_name in
            "crawler")
                if [ -f "scheduler/logs/crawler.log" ]; then
                    echo -e "${YELLOW}=== Crawler 파일 로그 (최근 50줄) ===${NC}"
                    tail -50 scheduler/logs/crawler.log
                    echo ""
                fi
                echo -e "${YELLOW}=== Crawler 컨테이너 로그 ===${NC}"
                docker-compose -p $PROJECT_NAME -f $COMPOSE_FILE logs -f $service_name
                ;;
            "nginx")
                echo -e "${YELLOW}=== Nginx 웹서버 로그 ===${NC}"
                docker-compose -p $PROJECT_NAME -f $COMPOSE_FILE logs -f $service_name
                ;;
            "react-frontend")
                echo -e "${YELLOW}=== React 빌드 로그 ===${NC}"
                docker-compose -p $PROJECT_NAME -f $COMPOSE_FILE logs -f $service_name
                ;;
            *)
                echo -e "${RED}❌ 알 수 없는 서비스명: $service_name${NC}"
                echo -e "${BLUE}Frontend에서 사용 가능한 서비스:${NC}"
                echo -e "   - crawler (크롤링 서비스)"
                echo -e "   - nginx (웹 서버)"
                echo -e "   - react-frontend (React 빌드)"
                exit 1
                ;;
        esac
    fi
}

# 서비스 재시작
restart_services() {
    local service_name=$1
    local build_flag=$2
    
    # 항상 환경변수 로드 (모든 재시작 시)
    check_env_files
    load_env_vars
    
    if [ -z "$service_name" ]; then
        # 모든 서비스 재시작
        if [ "$build_flag" = "--build" ]; then
            echo -e "${BLUE}🔄 모든 Frontend 서비스를 다시 빌드하고 재시작합니다...${NC}"
            stop_services
            start_services
        else
            echo -e "${BLUE}🔄 모든 Frontend 서비스를 재시작합니다...${NC}"
            docker-compose -p $PROJECT_NAME -f $COMPOSE_FILE restart
            echo -e "${GREEN}✅ 모든 Frontend 서비스가 재시작되었습니다!${NC}"
        fi
    else
        # 특정 서비스 재시작
        case $service_name in
            "react-frontend"|"crawler"|"nginx")
                if [ "$build_flag" = "--build" ]; then
                    echo -e "${BLUE}🔄 $service_name 서비스를 다시 빌드하고 재시작합니다...${NC}"
                    
                    # React 재빌드 시 볼륨도 삭제
                    if [ "$service_name" = "react-frontend" ]; then
                        docker-compose -p $PROJECT_NAME -f $COMPOSE_FILE stop $service_name
                        docker volume rm ${PROJECT_NAME}_react-dist 2>/dev/null || echo "   React 볼륨이 없거나 이미 삭제되었습니다."
                    else
                        docker-compose -p $PROJECT_NAME -f $COMPOSE_FILE stop $service_name
                    fi
                    
                    docker-compose -p $PROJECT_NAME -f $COMPOSE_FILE build --no-cache $service_name
                    docker-compose -p $PROJECT_NAME -f $COMPOSE_FILE up -d $service_name
                else
                    echo -e "${BLUE}🔄 $service_name 서비스를 재시작합니다...${NC}"
                    docker-compose -p $PROJECT_NAME -f $COMPOSE_FILE restart $service_name
                fi
                echo -e "${GREEN}✅ $service_name 서비스가 재시작되었습니다!${NC}"
                ;;
            *)
                echo -e "${RED}❌ 알 수 없는 서비스명: $service_name${NC}"
                exit 1
                ;;
        esac
    fi
}

# 서비스 상태 확인
show_status() {
    echo -e "${BLUE}📊 Frontend 서비스 상태를 확인합니다...${NC}"
    echo ""
    
    docker-compose -p $PROJECT_NAME -f $COMPOSE_FILE ps
    echo ""
    
    # 헬스체크 정보 표시
    echo -e "${BLUE}🏥 서비스 헬스체크:${NC}"
    echo -e "   - 웹사이트: $(curl -s -o /dev/null -w '%{http_code}' http://localhost 2>/dev/null || echo '연결 실패')"
    echo -e "   - 크롤링 API: $(curl -s http://localhost:8000/health 2>/dev/null | grep -o '"status":"[^"]*"' || echo '연결 실패')"
    echo ""
    
    # 볼륨 정보 표시
    echo -e "${BLUE}💾 볼륨 정보:${NC}"
    echo -e "   - React 빌드: $(docker volume ls | grep ${PROJECT_NAME}_react-dist || echo '볼륨 없음')"
    echo -e "   - 업로드 이미지: $(docker volume ls | grep uploaded-images || echo '볼륨 없음')"
    echo ""
}

# SSL 인증서 갱신
renew_ssl() {
    echo -e "${BLUE}🔒 SSL 인증서를 갱신합니다...${NC}"
    
    if [ ! -d "volume/letsencrypt" ]; then
        echo -e "${YELLOW}⚠️ Let's Encrypt 디렉토리가 없습니다. SSL 설정을 먼저 진행해주세요.${NC}"
        exit 1
    fi
    
    # Nginx 컨테이너에서 certbot 실행
    docker-compose -p $PROJECT_NAME -f $COMPOSE_FILE exec nginx certbot renew --nginx
    docker-compose -p $PROJECT_NAME -f $COMPOSE_FILE restart nginx
    
    echo -e "${GREEN}✅ SSL 인증서가 갱신되었습니다!${NC}"
}

# 사용법 표시
show_usage() {
    echo -e "${BLUE}🔍 Frontend 서비스 배포 스크립트 사용법:${NC}"
    echo ""
    echo -e "${GREEN}기본 명령어:${NC}"
    echo -e "   ${YELLOW}./docker-run-frontend.sh up${NC}                     - Frontend 서비스 시작"
    echo -e "   ${YELLOW}./docker-run-frontend.sh down${NC}                   - Frontend 서비스 중지"
    echo -e "   ${YELLOW}./docker-run-frontend.sh status${NC}                 - Frontend 서비스 상태 확인"
    echo -e "   ${YELLOW}./docker-run-frontend.sh ssl-renew${NC}              - SSL 인증서 갱신"
    echo ""
    echo -e "${GREEN}로그 확인:${NC}"
    echo -e "   ${YELLOW}./docker-run-frontend.sh logs${NC}                   - 모든 Frontend 로그 확인"
    echo -e "   ${YELLOW}./docker-run-frontend.sh logs [서비스명]${NC}          - 특정 서비스 로그 확인"
    echo ""
    echo -e "${GREEN}서비스 재시작:${NC}"
    echo -e "   ${YELLOW}./docker-run-frontend.sh restart${NC}                - 모든 Frontend 서비스 재시작"
    echo -e "   ${YELLOW}./docker-run-frontend.sh restart [서비스명]${NC}       - 특정 서비스 재시작"
    echo -e "   ${YELLOW}./docker-run-frontend.sh restart --build${NC}        - 모든 서비스 재빌드 후 재시작"
    echo -e "   ${YELLOW}./docker-run-frontend.sh restart [서비스명] --build${NC} - 특정 서비스 재빌드 후 재시작"
    echo ""
    echo -e "${GREEN}📌 Frontend 서비스명 목록:${NC}"
    echo -e "   - ${BLUE}react-frontend${NC}     (React 빌드)"
    echo -e "   - ${BLUE}nginx${NC}              (웹 서버 - 80/443 포트)"
    echo -e "   - ${BLUE}crawler${NC}            (크롤링 서비스 - 8000 포트)"
    echo ""
    echo -e "${GREEN}📌 사용 예시:${NC}"
    echo -e "   ${YELLOW}./docker-run-frontend.sh logs nginx${NC}             # Nginx 로그 확인"
    echo -e "   ${YELLOW}./docker-run-frontend.sh restart react-frontend --build${NC}  # React 재빌드 후 재시작"
    echo -e "   ${YELLOW}./docker-run-frontend.sh ssl-renew${NC}              # SSL 인증서 갱신"
    echo ""
    echo -e "${GREEN}📚 유용한 정보:${NC}"
    echo -e "   - 크롤러 로그 위치: scheduler/logs/"
    echo -e "   - 환경설정: .env.frontend"
    echo -e "   - Docker Compose: docker-compose.frontend.yml"
    echo -e "   - SSL 인증서: volume/letsencrypt/"
    echo -e "   - 업로드 이미지: 백엔드와 공유되는 볼륨"
    echo ""
}

# 메인 스크립트 로직
case $1 in
    "up")
        start_services
        ;;
    "down")
        stop_services
        ;;
    "logs")
        show_logs $2
        ;;
    "restart")
        if [ "$2" = "--build" ]; then
            restart_services "" "--build"
        elif [ "$3" = "--build" ]; then
            restart_services $2 "--build"
        else
            restart_services $2
        fi
        ;;
    "status")
        show_status
        ;;
    "ssl-renew")
        renew_ssl
        ;;
    *)
        show_usage
        ;;
esac