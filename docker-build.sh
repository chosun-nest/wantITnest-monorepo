#!/bin/bash

# 하나라도 실패하면 스크립트 즉시 종료
set -e

cd "$(dirname "$0")"

IMAGE_NAME="nest-be-spring-boot-6030-image"
CONTAINER_NAME="nest-be-spring-boot-6030-container"
PORT=6030

echo "🔨 Spring Boot 프로젝트 빌드 중..."
./gradlew bootJar

echo "🧹 기존 컨테이너 정리 중..."
docker stop $CONTAINER_NAME || true
docker rm $CONTAINER_NAME || true

echo "🗑 기존 이미지 삭제 중..."
docker rmi $IMAGE_NAME || true

echo "📦 Docker 이미지 빌드 시작!"
docker build -t $IMAGE_NAME .

 # 🗂️ 호스트 이미지 폴더 생성
mkdir -p ./uploaded-images

echo "🚀 컨테이너 실행 중!"
# 호스트의 이미지 디렉터리를 컨테이너 내부 /app/uploaded-images 경로에 마운트
docker run -d \
  --name $CONTAINER_NAME \
  -p $PORT:6030 \
  -v "$(pwd)/uploaded-images:/app/uploaded-images" \
  $IMAGE_NAME

echo "✅ 완료! http://119.219.30.209:$PORT 에서 백엔드 확인 가능!"

echo ""
echo "📜 컨테이너 로그 출력 시작 (Ctrl+C로 중단)"
echo "--------------------------------------------"
docker logs -f $CONTAINER_NAME