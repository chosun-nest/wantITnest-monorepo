# app/main.py
# FastAPI 실행 진입점 (uvicorn 실행, 미들웨어, 라우터 등록)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import chat

# FastAPI 앱 생성
app = FastAPI(
    title="Chatbot API",
    description="OpenAI 기반 챗봇 API 서버",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 챗봇 라우터 등록 (Nginx에서 /api/chat으로 라우팅)
app.include_router(chat.router, tags=["chat"])

# 헬스체크 엔드포인트
@app.get("/health", tags=["system"])
async def health_check():
    return {"status": "healthy", "message": "Chatbot API is running"}

# 루트 엔드포인트
@app.get("/", tags=["system"])
async def root():
    return {
        "message": "Chatbot API Server", 
        "docs": "/docs",
        "health": "/health"
    }

# 개발/테스트용 직접 실행 지원
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=8001,  # 스케줄러가 8000번 포트 사용 중이므로 8001번 포트 사용
        reload=True  # # 개발시만 True - 운영시 제거
    )