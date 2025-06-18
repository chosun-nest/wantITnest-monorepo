from typing import List, Optional, Literal
from pydantic import BaseModel, Field

class ChatMessage(BaseModel):
    """채팅 메시지 모델"""
    role: Literal["user", "assistant", "system"] = Field(
        ..., 
        description="메시지 역할: user(사용자), assistant(AI), system(시스템)"
    )
    content: str = Field(
        ..., 
        min_length=1,
        description="메시지 내용"
    )

class ChatRequest(BaseModel):
    """채팅 요청 모델"""
    messages: List[ChatMessage] = Field(
        ...,
        min_items=1,
        description="대화 메시지 목록"
    )
    stream: Optional[bool] = Field(
        default=True,
        description="스트리밍 응답 여부"
    )
    temperature: Optional[float] = Field(
        default=None,
        ge=0.0,
        le=2.0,
        description="응답 창의성 (0.0~2.0)"
    )
    max_tokens: Optional[int] = Field(
        default=None,
        gt=0,
        description="최대 토큰 수"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "messages": [
                    {
                        "role": "user",
                        "content": "안녕하세요! 파이썬에 대해 알려주세요."
                    }
                ],
                "stream": True,
                "temperature": 0.7
            }
        }

class ChatResponse(BaseModel):
    """채팅 응답 모델 (비스트리밍용)"""
    role: Literal["assistant"] = Field(
        default="assistant",
        description="응답 역할 (항상 assistant)"
    )
    content: str = Field(
        ...,
        description="AI 응답 내용"
    )
    usage: Optional[dict] = Field(
        default=None,
        description="토큰 사용량 정보"
    )

class ErrorResponse(BaseModel):
    """에러 응답 모델"""
    error: str = Field(
        ...,
        description="에러 메시지"
    )
    detail: Optional[str] = Field(
        default=None,
        description="에러 상세 정보"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "error": "Invalid API key",
                "detail": "OpenAI API 키가 올바르지 않습니다."
            }
        }