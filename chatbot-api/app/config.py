import os
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

class Settings:
    """애플리케이션 설정"""
    
    # OpenAI 설정
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    OPENAI_TEMPERATURE: float = float(os.getenv("OPENAI_TEMPERATURE", "0.7"))
    OPENAI_MAX_TOKENS: Optional[int] = None if not os.getenv("OPENAI_MAX_TOKENS") else int(os.getenv("OPENAI_MAX_TOKENS"))
    
    # 채팅 설정
    MAX_MESSAGES_HISTORY: int = int(os.getenv("CHATBOT_MAX_MESSAGES_HISTORY", "8"))
    
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
except ValueError as e:
    print(f"❌ 설정 오류: {e}")
    print("OPENAI_API_KEY 환경변수가 설정되지 않았습니다.")
    print("💡 .env 파일을 확인하거나 환경변수를 설정해주세요.")