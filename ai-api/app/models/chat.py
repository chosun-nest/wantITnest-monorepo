# app/models/chat.py
# 클라이언트와 주고받을 데이터 모델 (ChatRequest/ChatResponse) 정의

from pydantic import BaseModel

class ChatRequest(BaseModel):
    question: str

class ChatResponse(BaseModel):
    answer: str
