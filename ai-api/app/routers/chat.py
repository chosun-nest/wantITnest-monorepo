# app/routers/chat.py
# 상세 예외처리/상태코드/응답 메시지 분기, POST, health check 지원

from fastapi import APIRouter, HTTPException, status
from app.models.chat import ChatRequest, ChatResponse
from app.services.openai_service import get_faq_answer, get_openai_answer

router = APIRouter()

@router.post("/api/ai/chatbot", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    # 1. FAQ 유사질문 자동매칭
    faq_answer = get_faq_answer(req.question)
    if faq_answer:
        return ChatResponse(answer=faq_answer)
    
    # 2. 미매칭 시만 OpenAI 호출
    try:
        answer = get_openai_answer(req.question)
        return ChatResponse(answer=answer)
    except ValueError as ve:
        # OpenAI API키 등 인증 에러
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(ve))
    except RuntimeError as re:
        # 요금제 한도 초과 등
        detail = str(re)
        if "Rate limit" in detail:
            raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=detail)
        else:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=detail)
    except Exception as e:
        # 예기치 못한 기타 에러
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"서버 오류: {e}")

# 헬스 체크 엔드포인트(선택)
@router.get("/health")
async def health_check():
    return {"status": "ok", "service": "AI Chatbot Backend"}