// frontend/src/api/ai/ai.ts

/**
 * 백엔드 FastAPI 서버로 챗봇 질문을 보내고, 답변을 받아오는 함수
 * (OpenAI 직접 호출 X)
 */

export async function fetchChatBotAnswer(question: string): Promise<string> {
  const res = await fetch("http://localhost:8000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  if (!res.ok) return "오류가 발생했습니다.";
  const data = await res.json();
  return data.answer ?? "적절한 답변을 찾지 못했습니다.";
}
