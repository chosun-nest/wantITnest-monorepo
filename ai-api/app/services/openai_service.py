# app/services/openai_service.py
# FAQ/OPENAI 응답 로직(유사질문 리스트 기반 FAQ 매칭), config.py 연동
# -> 서비스 계층의 get_faq_answer 함수에서 먼저 FAQ_LIST로 빠르게 답변 시도 -> 일치하는 질문이 없을 때만 OpenAI API 호출
# 구체 에러 분리(401, 429, 500 등)

from openai import OpenAI, OpenAIError, AuthenticationError, RateLimitError
from app.config import settings
import re

# 1. FAQ 리스트 (여기서 직접 관리, 필요시 config.faq로 분리 가능)
FAQ_LIST = [
    {
        "questions": [
            "비밀번호를 잊어버렸어요",
            "비밀번호 잊어버림",
            "비밀번호 분실",
            "비밀번호를 분실했어요",
            "비번을 잊었어요"
        ],
        "answer": "로그인 화면에서 '비밀번호 재설정하기' 또는 프로필 수정에서 하단에 '계정 관리 설정' 버튼을 클릭하여 비밀번호를 재설정할 수 있습니다."
    },
    {
        "questions": [
            "회원가입은 어떻게 하나요?",
            "회원 가입 방법",
            "회원 등록 방법"
        ],
        "answer": "홈페이지 우측 상단의 Signup 버튼을 클릭해 정보를 입력하시면 가입이 완료됩니다."
    },
    {
        "questions": [
            "회원탈퇴 하고 싶어요",
            "회원 탈퇴 방법",
            "계정 삭제"
        ],
        "answer": "프로필 수정에서 하단에 '계정 탈퇴하기' 버튼을 클릭하여 회원 탈퇴가 가능합니다. 탈퇴 시 비밀번호 확인이 필요합니다."
    },
    # ... 필요에 따라 FAQ 계속 추가
]

# 2. FAQ 매칭 함수
# 마침표, 특수문자, 대소문자, 공백 등 전부 무시하고 비교
def normalize(text):
    return re.sub(r"[^\w\s]", "", text).strip().lower()

def get_faq_answer(user_q: str):
    user_q_n = normalize(user_q)
    for faq in FAQ_LIST:
        for pattern in faq["questions"]:
            if normalize(pattern) in user_q_n or user_q_n in normalize(pattern):
                return faq["answer"]
    return None

# 3. OpenAI 클라이언트 초기화
client = OpenAI(
    api_key=settings.OPENAI_API_KEY,
)

# 4. OpenAI 호출 함수 (config 설정 연동, 예외 처리)
def get_openai_answer(user_q: str):
    try:
        response = client.chat.completions.create(
            model=settings.OPENAI_MODEL,  # config.py에서 관리
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": user_q}
            ],
            max_tokens=settings.OPENAI_MAX_TOKENS,  # config에서 직접 값 or 기본값(258) 적용
            temperature=settings.OPENAI_TEMPERATURE,
        )
        return response.choices[0].message.content.strip()
    except AuthenticationError:
        # OpenAI API 키 오류
        raise ValueError("Unauthorized: Invalid or missing OpenAI API key.")
    except RateLimitError:
        # 요금제 한도 초과
        raise RuntimeError("Rate limit exceeded. Please try again later.")
    except OpenAIError:
        # 기타 OpenAI API 에러
        raise RuntimeError("OpenAI Service Error.")
    except Exception as e:
        # 예기치 못한 모든 에러
        raise RuntimeError(f"Unexpected Error: {e}")
