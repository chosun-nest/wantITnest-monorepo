#!/bin/bash

# ===========================================
# wantITnest - Backend 서비스 배포 스크립트
# Spring Boot + AI API + Node.js Chat
# ===========================================

set -e  # 에러 발생 시 스크립트 종료

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 프로젝트 설정
PROJECT_NAME="wantitnest-backend"
COMPOSE_FILE="docker-compose.backend.yml"

# 환경변수 파일 검증
check_env_files() {
    echo -e "${BLUE}🔍 환경변수 파일을 확인합니다...${NC}"
    
    if [ ! -f ".env.backend" ]; then
        echo -e "${RED}❌ .env.backend 파일이 없습니다.${NC}"
        echo -e "${YELLOW}   .env.backend.template을 참고하여 환경변수 파일을 생성해주세요.${NC}"
        exit 1
    fi
    
    # 중요 환경변수 확인
    source .env.backend
    
    # OpenAI API 키 확인
    if [ -z "$OPENAI_API_KEY" ] || [ "$OPENAI_API_KEY" = "your_openai_api_key_here" ]; then
        echo -e "${YELLOW}⚠️ OPENAI_API_KEY가 설정되지 않았거나 기본값입니다.${NC}"
        echo -e "${YELLOW}   .env.backend 파일에서 올바른 OpenAI API 키를 설정해주세요.${NC}"
        echo -e "${YELLOW}   (ChatBot 기능이 작동하지 않을 수 있습니다.)${NC}"
    fi
    
    echo -e "${GREEN}✅ 환경변수 파일 확인 완료${NC}"
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

# Backend 서비스 시작
start_services() {
    echo -e "${GREEN}🚀 Backend 서비스를 시작합니다...${NC}"
    
    check_env_files
    check_docker
    
    # 이전 컨테이너 정리
    echo -e "${BLUE}🧹 이전 컨테이너를 정리합니다...${NC}"
    docker-compose -p $PROJECT_NAME -f $COMPOSE_FILE down || true
    
    # 필요한 디렉토리 생성
    echo -e "${BLUE}🗂️ 필요한 디렉토리를 생성합니다...${NC}"
    mkdir -p backend/uploaded-images
    mkdir -p backend/logs
    mkdir -p ai-api/logs
    mkdir -p chat-websocket/logs
    
    # 이미지 빌드 및 서비스 시작
    echo -e "${BLUE}🔨 Docker 이미지를 빌드하고 서비스를 시작합니다...${NC}"
    docker-compose -p $PROJECT_NAME -f $COMPOSE_FILE up -d --build
    
    echo ""
    echo -e "${GREEN}✅ Backend 서비스가 시작되었습니다!${NC}"
    echo ""
}

# Backend 서비스 중지
stop_services() {
    echo -e "${YELLOW}🛑 Backend 서비스를 중지합니다...${NC}"
    
    docker-compose -p $PROJECT_NAME -f $COMPOSE_FILE down
    
    echo -e "${GREEN}✅ Backend 서비스가 중지되었습니다!${NC}"
}

# 로그 확인
show_logs() {
    local service_name=$1
    
    if [ -z "$service_name" ]; then
        echo -e "${BLUE}📜 모든 Backend 서비스의 로그를 확인합니다...${NC}"
        echo ""
        
        # 파일 로그가 있는 서비스들의 최신 로그 표시
        echo -e "${YELLOW}=== Spring Backend 파일 로그 (최근 20줄) ===${NC}"
        if [ -f "backend/logs/application.log" ]; then
            tail -20 backend/logs/application.log 2>/dev/null || echo "로그 파일을 찾을 수 없습니다."
        else
            echo "로그 파일이 아직 생성되지 않았습니다."
        fi
        echo ""
        
        echo -e "${YELLOW}=== Chatbot API 파일 로그 (최근 20줄) ===${NC}"
        if [ -f "ai-api/logs/app.log" ]; then
            tail -20 ai-api/logs/app.log 2>/dev/null || echo "로그 파일을 찾을 수 없습니다."
        else
            echo "로그 파일이 아직 생성되지 않았습니다."
        fi
        echo ""
        
        # 실시간 컨테이너 로그 표시
        echo -e "${YELLOW}=== 실시간 컨테이너 로그 (Ctrl+C로 종료) ===${NC}"
        docker-compose -p $PROJECT_NAME -f $COMPOSE_FILE logs -f --tail=10
        
    else
        echo -e "${BLUE}📜 $service_name 서비스의 로그를 확인합니다...${NC}"
        
        # 특정 서비스의 파일 로그 확인
        case $service_name in
            "spring-backend")

                if [ -f "backend/logs/application.log" ]; then
                    echo -e "${YELLOW}=== Spring Boot 파일 로그 (최근 50줄) ===${NC}"
                    tail -50 backend/logs/application.log
                    echo ""
                fi
                echo -e "${YELLOW}=== Spring Boot 컨테이너 로그 ===${NC}"
                docker-compose -p $PROJECT_NAME -f $COMPOSE_FILE logs -f $service_name
                ;;
            "ai-api")
                if [ -f "ai-api/logs/app.log" ]; then
                    echo -e "${YELLOW}=== Chatbot API 파일 로그 (최근 50줄) ===${NC}"
                    tail -50 ai-api/logs/app.log
                    echo ""
                fi
                echo -e "${YELLOW}=== Chatbot API 컨테이너 로그 ===${NC}"
                docker-compose -p $PROJECT_NAME -f $COMPOSE_FILE logs -f $service_name
                ;;
            "chat-websocket")
                echo -e "${YELLOW}=== Node.js 실시간 채팅 로그 ===${NC}"
                docker-compose -p $PROJECT_NAME -f $COMPOSE_FILE logs -f $service_name
                ;;
            "mysql-container")
                echo -e "${YELLOW}=== MySQL 컨테이너 로그 ===${NC}"
                docker-compose -p $PROJECT_NAME -f $COMPOSE_FILE logs -f $service_name
                ;;
            *)
                echo -e "${RED}❌ 알 수 없는 서비스명: $service_name${NC}"
                echo -e "${BLUE}Backend에서 사용 가능한 서비스:${NC}"
                echo -e "   - spring-backend (Spring Boot API)"
                echo -e "   - ai-api (AI API)"  
                echo -e "   - chat-websocket (실시간 채팅)"
                exit 1
                ;;
        esac
    fi
}

# 서비스 재시작
restart_services() {
    local service_name=$1
    local build_flag=$2
    
    if [ -z "$service_name" ]; then
        # 모든 서비스 재시작
        if [ "$build_flag" = "--build" ]; then
            echo -e "${BLUE}🔄 모든 Backend 서비스를 다시 빌드하고 재시작합니다...${NC}"
            stop_services
            start_services
        else
            echo -e "${BLUE}🔄 모든 Backend 서비스를 재시작합니다...${NC}"
            docker-compose -p $PROJECT_NAME -f $COMPOSE_FILE restart
            echo -e "${GREEN}✅ 모든 Backend 서비스가 재시작되었습니다!${NC}"
        fi
    else
        # 특정 서비스 재시작
        case $service_name in
            "spring-backend"|"ai-api"|"chat-websocket")
                if [ "$build_flag" = "--build" ]; then
                    echo -e "${BLUE}🔄 $service_name 서비스를 다시 빌드하고 재시작합니다...${NC}"
                    docker-compose -p $PROJECT_NAME -f $COMPOSE_FILE stop $service_name
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
    echo -e "${BLUE}📊 Backend 서비스 상태를 확인합니다...${NC}"
    echo ""
    
    docker-compose -p $PROJECT_NAME -f $COMPOSE_FILE ps
    echo ""
    
    # 헬스체크 정보 표시
    echo -e "${BLUE}🏥 서비스 헬스체크:${NC}"
    echo -e "   - Spring Boot: $(curl -s http://localhost:6030/actuator/health 2>/dev/null | grep -o '"status":"[^"]*"' || echo '연결 실패')"
    echo -e "   - Chatbot API: $(curl -s http://localhost:8001/health 2>/dev/null | grep -o '"status":"[^"]*"' || echo '연결 실패')"
    echo -e "   - Node Chat: $(curl -s http://localhost:4000/health 2>/dev/null || echo '연결 실패')"
    echo ""
}

# 사용법 표시
show_usage() {
    echo -e "${BLUE}🔍 Backend 서비스 배포 스크립트 사용법:${NC}"
    echo ""
    echo -e "${GREEN}기본 명령어:${NC}"
    echo -e "   ${YELLOW}./docker-run-backend.sh up${NC}                     - Backend 서비스 시작"
    echo -e "   ${YELLOW}./docker-run-backend.sh down${NC}                   - Backend 서비스 중지"
    echo -e "   ${YELLOW}./docker-run-backend.sh status${NC}                 - Backend 서비스 상태 확인"
    echo ""
    echo -e "${GREEN}로그 확인:${NC}"
    echo -e "   ${YELLOW}./docker-run-backend.sh logs${NC}                   - 모든 Backend 로그 확인"
    echo -e "   ${YELLOW}./docker-run-backend.sh logs [서비스명]${NC}          - 특정 서비스 로그 확인"
    echo ""
    echo -e "${GREEN}서비스 재시작:${NC}"
    echo -e "   ${YELLOW}./docker-run-backend.sh restart${NC}                - 모든 Backend 서비스 재시작"
    echo -e "   ${YELLOW}./docker-run-backend.sh restart [서비스명]${NC}       - 특정 서비스 재시작"
    echo -e "   ${YELLOW}./docker-run-backend.sh restart --build${NC}        - 모든 서비스 재빌드 후 재시작"
    echo -e "   ${YELLOW}./docker-run-backend.sh restart [서비스명] --build${NC} - 특정 서비스 재빌드 후 재시작"
    echo ""
    echo -e "${GREEN}📌 Backend 서비스명 목록:${NC}"
    echo -e "   - ${BLUE}spring-backend${NC}     (Spring Boot API - 6030 포트)"
    echo -e "   - ${BLUE}ai-api${NC}        (챗봇 API - 8001 포트)"
    echo -e "   - ${BLUE}chat-websocket${NC}  (실시간 채팅 - 4000 포트)"
    echo ""
    echo -e "${GREEN}📌 사용 예시:${NC}"
    echo -e "   ${YELLOW}./docker-run-backend.sh logs spring-backend${NC}    # Spring Boot 로그 확인"
    echo -e "   ${YELLOW}./docker-run-backend.sh restart ai-api --build${NC}  # 챗봇 API 재빌드 후 재시작"
    echo ""
    echo -e "${GREEN}📚 유용한 정보:${NC}"
    echo -e "   - 파일 로그 위치: backend/logs/, ai-api/logs/"
    echo -e "   - 환경설정: .env.backend"
    echo -e "   - Docker Compose: docker-compose.backend.yml"
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
    *)
        show_usage
        ;;
esac