from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from typing import List
import json
import asyncio

from app.models.chat import ChatRequest, ChatResponse, ErrorResponse
from app.services.openai_service import openai_service

# APIRouter 생성
router = APIRouter()

@router.post(
    "/api/ai/chatbot",
    response_model=ChatResponse,
    responses={
        400: {"model": ErrorResponse, "description": "잘못된 요청"},
        401: {"model": ErrorResponse, "description": "인증 오류"},
        429: {"model": ErrorResponse, "description": "요청 한도 초과"},
        500: {"model": ErrorResponse, "description": "서버 오류"}
    },
    summary="AI 챗봇과 대화",
    description="OpenAI GPT 모델을 사용하여 AI와 대화합니다. 스트리밍과 비스트리밍 모드를 지원합니다."
)
async def chat(request: ChatRequest):
    """
    AI 챗봇과 대화하는 엔드포인트
    
    - **messages**: 대화 메시지 목록 (최소 1개 이상)
    - **stream**: 스트리밍 응답 여부 (기본값: true)
    - **temperature**: 응답 창의성 0.0~2.0 (기본값: 0.7)  
    - **max_tokens**: 최대 토큰 수 (선택사항)
    """
    
    # 입력 검증
    if not request.messages:
        raise HTTPException(
            status_code=400,
            detail="메시지가 비어있습니다."
        )
    
    # 메시지 개수 제한 (너무 긴 대화 방지)
    from app.config import settings
    if len(request.messages) > settings.MAX_MESSAGES_HISTORY:
        # 최근 메시지만 유지
        request.messages = request.messages[-settings.MAX_MESSAGES_HISTORY:]
    
    try:
        # 스트리밍 응답
        if request.stream:
            return StreamingResponse(
                generate_stream_response(
                    request.messages,
                    request.temperature,
                    request.max_tokens
                ),
                media_type="text/plain",
                headers={
                    "Cache-Control": "no-cache",
                    "Connection": "keep-alive",
                }
            )
        
        # 비스트리밍 응답
        else:
            response = await openai_service.create_chat_completion(
                messages=request.messages,
                temperature=request.temperature,
                max_tokens=request.max_tokens
            )
            return response
            
    except HTTPException:
        # OpenAI 서비스에서 발생한 HTTPException은 그대로 전달
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"챗봇 서비스 오류: {str(e)}"
        )

async def generate_stream_response(
    messages: List,
    temperature: float = None,
    max_tokens: int = None
):
    """스트리밍 응답 생성기"""
    try:
        async for chunk in openai_service.create_chat_completion_stream(
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens
        ):
            # SSE(Server-Sent Events) 형식으로 전송
            yield f"data: {json.dumps({'content': chunk}, ensure_ascii=False)}\n\n"
            
            # 클라이언트가 실시간으로 받을 수 있도록 약간의 지연
            await asyncio.sleep(0.01)
        
        # 스트리밍 종료 신호
        yield f"data: {json.dumps({'done': True}, ensure_ascii=False)}\n\n"
        
    except Exception as e:
        # 스트리밍 중 오류 발생시 에러 메시지 전송
        error_data = {
            "error": True,
            "message": f"스트리밍 중 오류 발생: {str(e)}"
        }
        yield f"data: {json.dumps(error_data, ensure_ascii=False)}\n\n"

# 헬스체크용 엔드포인트
@router.get(
    "/api/ai/chatbot/health",
    summary="챗봇 서비스 상태 확인",
    description="챗봇 서비스와 OpenAI API 연결 상태를 확인합니다."
)
async def chat_health():
    """챗봇 서비스 헬스체크"""
    try:
        # OpenAI API 연결 테스트 (간단한 요청)
        from app.models.chat import ChatMessage
        test_messages = [
            ChatMessage(role="user", content="hello")
        ]
        
        # 매우 짧은 응답으로 테스트
        response = await openai_service.create_chat_completion(
            messages=test_messages,
            temperature=0.1,
            max_tokens=5
        )
        
        return {
            "status": "healthy",
            "openai_connection": "ok",
            "message": "챗봇 서비스가 정상 작동 중입니다."
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=f"챗봇 서비스 연결 실패: {str(e)}"
        )