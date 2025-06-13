#!/bin/bash

# 하나라도 실패하면 스크립트 즉시 종료
set -e

# 명령어 옵션 확인
if [ "$1" == "up" ]; then
  # 환경 모드 설정 (기본값: prod)
  PROFILE=${2:-prod}
  echo "🚀 모든 서비스를 시작합니다... (Profile: $PROFILE)"
  
  # Spring Boot 프로젝트 빌드 (BE 서비스 준비)
  echo "🔨 Spring Boot 프로젝트 빌드 중..."
  cd backend
  ./gradlew bootJar
  cd ..
  
  # uploaded-images 디렉토리 생성
  echo "🗂️ 이미지 업로드 디렉토리 확인 중..."
  mkdir -p backend/uploaded-images
  
  # Profile 환경변수 설정 후 Docker Compose 실행
  echo "🔨 기존 컨테이너와 이미지를 정리합니다..."
  docker-compose -f docker-compose.proxy.yml down
  docker system prune -f --volumes
  
  echo "🐳 최신 코드로 전체 재빌드합니다... (SPRING_PROFILES_ACTIVE=$PROFILE)"
  SPRING_PROFILES_ACTIVE=$PROFILE docker-compose -f docker-compose.proxy.yml up -d --build --force-recreate
  
  echo "✅ 모든 서비스가 시작되었습니다! (Profile: $PROFILE)"
  echo "🔍 서비스 확인:"
  echo "   - 웹 애플리케이션: http://localhost"
  
  if [ "$PROFILE" == "dev" ] || [ "$PROFILE" == "local" ] || [ "$PROFILE" == "test" ]; then
    echo "🧪 개발 모드: 테스트 데이터가 자동으로 로드됩니다."
  else
    echo "🚀 운영 모드: 테스트 데이터 로드를 건너뜁니다."
  fi

elif [ "$1" == "dev" ]; then
  echo "🧪 개발 모드로 모든 서비스를 시작합니다... (테스트 데이터 포함)"
  
  cd backend
  ./gradlew bootJar
  cd ..
  
  mkdir -p backend/uploaded-images
  
  # 개발 모드로 실행
  echo "🔨 기존 컨테이너와 이미지를 정리합니다..."
  docker-compose -f docker-compose.proxy.yml down
  docker system prune -f --volumes
  
  echo "🐳 최신 코드로 전체 재빌드합니다..."
  SPRING_PROFILES_ACTIVE=dev docker-compose -f docker-compose.proxy.yml up -d --build --force-recreate
  
  echo "✅ 개발 모드로 시작 완료! 테스트 데이터가 로드됩니다."
  echo "🔍 서비스 확인:"
  echo "   - 웹 애플리케이션: http://localhost"

elif [ "$1" == "prod" ]; then
  echo "🚀 운영 모드로 모든 서비스를 시작합니다... (테스트 데이터 제외)"
  
  cd backend
  ./gradlew bootJar
  cd ..
  
  mkdir -p backend/uploaded-images
  
  # 운영 모드로 실행
  echo "🔨 기존 컨테이너와 이미지를 정리합니다..."
  docker-compose -f docker-compose.proxy.yml down
  docker system prune -f --volumes
  
  echo "🐳 최신 코드로 전체 재빌드합니다..."
  SPRING_PROFILES_ACTIVE=prod docker-compose -f docker-compose.proxy.yml up -d --build --force-recreate
  
  echo "✅ 운영 모드로 시작 완료! 테스트 데이터를 건너뜁니다."
  echo "🔍 서비스 확인:"
  echo "   - 웹 애플리케이션: http://localhost"

elif [ "$1" == "down" ]; then
  echo "🛑 모든 서비스를 중지합니다..."
  docker-compose -f docker-compose.proxy.yml down
  echo "✅ 모든 서비스가 중지되었습니다!"

elif [ "$1" == "logs" ]; then
  # 특정 서비스 로그 확인
  if [ "$2" != "" ]; then
    echo "📜 $2 서비스의 로그를 확인합니다..."
    docker-compose -f docker-compose.proxy.yml logs -f $2
  else
    echo "📜 모든 서비스의 로그를 확인합니다..."
    docker-compose -f docker-compose.proxy.yml logs -f
  fi

elif [ "$1" == "restart" ]; then
  # 특정 서비스 재시작
  if [ "$2" != "" ]; then
    echo "🔄 $2 서비스를 재시작합니다..."
    docker-compose -f docker-compose.proxy.yml restart $2
    echo "✅ $2 서비스가 재시작되었습니다!"
  else
    echo "🔄 모든 서비스를 재시작합니다..."
    docker-compose -f docker-compose.proxy.yml restart
    echo "✅ 모든 서비스가 재시작되었습니다!"
  fi

else
  # 사용법 표시
  echo "🔍 사용법:"
  echo "   ./docker-compose-run.sh up [profile]  - 모든 서비스 시작 (기본: prod)"
  echo "   ./docker-compose-run.sh dev           - 개발 모드로 시작 (테스트 데이터 O)"
  echo "   ./docker-compose-run.sh prod          - 운영 모드로 시작 (테스트 데이터 X)"
  echo "   ./docker-compose-run.sh down          - 모든 서비스 중지"
  echo "   ./docker-compose-run.sh logs          - 모든 서비스 로그 확인"
  echo "   ./docker-compose-run.sh logs [서비스명]  - 특정 서비스 로그 확인"
  echo "   ./docker-compose-run.sh restart       - 모든 서비스 재시작"
  echo "   ./docker-compose-run.sh restart [서비스명]  - 특정 서비스 재시작"
  echo
  echo "📌 Profile 예시:"
  echo "   ./docker-compose-run.sh dev           # 개발용 (테스트 데이터 포함)"
  echo "   ./docker-compose-run.sh prod          # 운영용 (테스트 데이터 제외)"
  echo "   ./docker-compose-run.sh up dev        # 개발용"
  echo "   ./docker-compose-run.sh up prod       # 운영용 (기본값)"
  echo
  echo "📌 서비스명 예시: nest-ai, nest-be, nest-fe"
fi
