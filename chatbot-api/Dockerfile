# ====================================================
# FastAPI Chatbot API Dockerfile
# Multi-stage build for optimized production image
# ====================================================

# ============= Stage 1: Dependencies =============
FROM python:3.11-slim AS dependencies

# 작업 디렉토리 설정
WORKDIR /app

# 시스템 의존성 설치 (빌드 도구)
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Python 최적화 환경변수
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# pip 업그레이드
RUN pip install --upgrade pip

# requirements.txt 복사 및 의존성 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ============= Stage 2: Production =============
FROM python:3.11-slim AS production

# 작업 디렉토리 설정
WORKDIR /app

# 런타임 환경변수
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONPATH=/app

# 비root 사용자 생성 (보안)
RUN groupadd -r appuser && useradd -r -g appuser appuser

# 필요한 런타임 라이브러리만 설치
RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Stage 1에서 설치된 Python 패키지 복사
COPY --from=dependencies /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=dependencies /usr/local/bin /usr/local/bin

# 애플리케이션 코드 복사
COPY app/ ./app/

# 로그 디렉토리 생성
RUN mkdir -p /app/logs && chown -R appuser:appuser /app

# 비root 사용자로 전환
USER appuser

# 헬스체크 설정
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8001/health || exit 1

# 포트 노출
EXPOSE 8001

# 애플리케이션 실행
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001", "--workers", "1"]