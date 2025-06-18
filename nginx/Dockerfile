# Nginx 베이스 이미지 사용
FROM nginx:alpine

# 필수 패키지 설치 (curl for health check)
RUN apk add --no-cache curl

# 정적 nginx.conf 파일 복사
COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d/ /etc/nginx/conf.d/

# 포트 노출
EXPOSE 80 443

# nginx 시작 (기본 엔트리포인트 사용)
CMD ["nginx", "-g", "daemon off;"]
