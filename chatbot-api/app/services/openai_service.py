import openai
from typing import AsyncGenerator, List
from fastapi import HTTPException
from app.config import settings
from app.models.chat import ChatMessage, ChatResponse

class OpenAIService:
    """OpenAI API 호출 서비스"""
    
    def __init__(self):
        """OpenAI 클라이언트 초기화"""
        if not settings.OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY가 설정되지 않았습니다.")
        
        self.client = openai.AsyncOpenAI(
            api_key=settings.OPENAI_API_KEY
        )
    
    async def create_chat_completion_stream(
        self, 
        messages: List[ChatMessage],
        temperature: float = None,
        max_tokens: int = None
    ) -> AsyncGenerator[str, None]:
        """스트리밍 채팅 완성 생성"""
        try:
            # 메시지를 OpenAI 형식으로 변환
            openai_messages = [
                {"role": msg.role, "content": msg.content} 
                for msg in messages
            ]
            
            # OpenAI API 호출
            stream = await self.client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=openai_messages,
                temperature=temperature or settings.OPENAI_TEMPERATURE,
                max_tokens=max_tokens or settings.OPENAI_MAX_TOKENS,
                stream=True
            )
            
            # 스트리밍 데이터 처리
            async for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    yield chunk.choices[0].delta.content
                    
        except openai.AuthenticationError:
            raise HTTPException(
                status_code=401, 
                detail="OpenAI API 키가 올바르지 않습니다."
            )
        except openai.RateLimitError:
            raise HTTPException(
                status_code=429, 
                detail="API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요."
            )
        except openai.APIError as e:
            raise HTTPException(
                status_code=500, 
                detail=f"OpenAI API 오류: {str(e)}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=500, 
                detail=f"예상치 못한 오류가 발생했습니다: {str(e)}"
            )
    
    async def create_chat_completion(
        self, 
        messages: List[ChatMessage],
        temperature: float = None,
        max_tokens: int = None
    ) -> ChatResponse:
        """비스트리밍 채팅 완성 생성"""
        try:
            # 메시지를 OpenAI 형식으로 변환
            openai_messages = [
                {"role": msg.role, "content": msg.content} 
                for msg in messages
            ]
            
            # OpenAI API 호출
            response = await self.client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=openai_messages,
                temperature=temperature or settings.OPENAI_TEMPERATURE,
                max_tokens=max_tokens or settings.OPENAI_MAX_TOKENS,
                stream=False
            )
            
            # 응답 데이터 추출
            content = response.choices[0].message.content
            usage = {
                "prompt_tokens": response.usage.prompt_tokens,
                "completion_tokens": response.usage.completion_tokens,
                "total_tokens": response.usage.total_tokens
            }
            
            return ChatResponse(
                content=content,
                usage=usage
            )
            
        except openai.AuthenticationError:
            raise HTTPException(
                status_code=401, 
                detail="OpenAI API 키가 올바르지 않습니다."
            )
        except openai.RateLimitError:
            raise HTTPException(
                status_code=429, 
                detail="API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요."
            )
        except openai.APIError as e:
            raise HTTPException(
                status_code=500, 
                detail=f"OpenAI API 오류: {str(e)}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=500, 
                detail=f"예상치 못한 오류가 발생했습니다: {str(e)}"
            )

# 전역 서비스 인스턴스
openai_service = OpenAIService()