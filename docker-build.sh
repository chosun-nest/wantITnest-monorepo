#!/bin/bash

cd "$(dirname "$0")"

IMAGE_NAME="nest-js-react-image"
CONTAINER_NAME="nest-js-react-dev-5173"
PORT=5173

echo "🧹 기존 컨테이너 정리 중..."

docker stop $CONTAINER_NAME
docker rm $CONTAINER_NAME

echo "🐳 Docker 이미지 빌드 시작!"
docker build -t $IMAGE_NAME .

echo "🚀 컨테이너 실행 중!"
docker run -d \
  --name $CONTAINER_NAME \
  -p $PORT:5173 \
  $IMAGE_NAME

echo "✅ 완료! http://localhost:$PORT 에서 확인 가능해요!"
