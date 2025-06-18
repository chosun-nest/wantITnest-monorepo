import os
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

class Settings:
    """애플리케이션 설정"""
    
    # OpenAI 설정 (새로운 환경변수 체계)
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    OPENAI_TEMPERATURE: float = float(os.getenv("OPENAI_TEMPERATURE", "0.7"))
    OPENAI_MAX_TOKENS: Optional[int] = None if not os.getenv("OPENAI_MAX_TOKENS") else int(os.getenv("OPENAI_MAX_TOKENS"))
    
    # 채팅 설정 (새로운 환경변수 체계)
    MAX_MESSAGES_HISTORY: int = int(os.getenv("CHATBOT_MAX_MESSAGES_HISTORY", "20"))
    STREAM_RESPONSE: bool = os.getenv("CHATBOT_STREAM_RESPONSE", "true").lower() == "true"
    
    # 서버 설정
    APP_NAME: str = "Chatbot API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = os.getenv("CHATBOT_DEBUG", "false").lower() == "true"
    
    # 서버 연결 정보
    HOST: str = os.getenv("CHATBOT_HOST", "0.0.0.0")
    PORT: int = int(os.getenv("CHATBOT_PORT", "8001"))
    
    # 타임아웃 설정
    TIMEOUT: int = int(os.getenv("CHATBOT_TIMEOUT", "30000"))
    HEALTH_CHECK_TIMEOUT: int = int(os.getenv("CHATBOT_HEALTH_CHECK_TIMEOUT", "5000"))
    
    def validate_settings(self) -> bool:
        """필수 설정 검증"""
        if not self.OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY 환경변수가 설정되지 않았습니다.")
        
        if not self.OPENAI_API_KEY.startswith("sk-"):
            raise ValueError("올바르지 않은 OpenAI API 키 형식입니다.")
        
        return True

# 전역 설정 인스턴스
settings = Settings()

# 앱 시작시 설정 검증
try:
    settings.validate_settings()
    print("✅ 설정 검증 완료")
    print(f"📊 OpenAI 모델: {settings.OPENAI_MODEL}")
    print(f"🌡️ Temperature: {settings.OPENAI_TEMPERATURE}")
    print(f"💬 최대 메시지 히스토리: {settings.MAX_MESSAGES_HISTORY}")
    print(f"🌊 스트리밍 모드: {settings.STREAM_RESPONSE}")
    print(f"🐛 디버그 모드: {settings.DEBUG}")
except ValueError as e:
    print(f"❌ 설정 오류: {e}")
    print("💡 .env 파일을 확인하거나 환경변수를 설정해주세요.")