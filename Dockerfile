# 1. OpenJDK 17 기반
FROM openjdk:17-jdk-slim

# 2. 작업 디렉터리 설정
WORKDIR /app

# 3. jar 파일 복사
COPY build/libs/*.jar app.jar

# 4. 실행
ENTRYPOINT ["java", "-jar", "app.jar"]
