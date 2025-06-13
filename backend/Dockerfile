# ===== Stage 1: Gradle 빌드 =====
FROM gradle:8.5-jdk17-alpine AS builder

# 작업 디렉터리 설정
WORKDIR /app

# Gradle 설정 파일들 먼저 복사 (캐시 최적화)
COPY build.gradle settings.gradle ./
COPY gradle/ ./gradle/

# 의존성 다운로드 (캐시 레이어)
RUN gradle dependencies --no-daemon

# 소스 코드 복사
COPY src/ ./src/

# JAR 파일 빌드 (테스트 제외)
RUN gradle bootJar --no-daemon -x test

# ===== Stage 2: 런타임 =====
FROM openjdk:17-jdk-slim

# 애플리케이션 사용자 생성 (보안)
RUN addgroup --system --gid 1001 nestapp && \
    adduser --system --uid 1001 --ingroup nestapp nestapp

# 작업 디렉터리 설정
WORKDIR /app

# 이미지 업로드 디렉터리 생성
RUN mkdir -p /app/uploaded-images && \
    chown -R nestapp:nestapp /app

# 빌드된 JAR 파일 복사
COPY --from=builder /app/build/libs/*.jar app.jar

# 소유권 변경
RUN chown nestapp:nestapp app.jar

# 비특권 사용자로 전환
USER nestapp

# 포트 노출
EXPOSE 6030

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "app.jar"]
