export async function fetchOpenAIStream({
  messages,
  onMessage,
}: {
  messages: { role: string; content: string }[];
  onMessage: (content: string) => void;
}) {
  const res = await fetch("/api/ai/chatbot", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages,
      stream: true,
      temperature: 0.7,
    }),
  });

  if (!res.ok || !res.body) {
    throw new Error("챗봇 API 요청 실패");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
      const line = buffer.slice(0, newlineIndex).trim();
      buffer = buffer.slice(newlineIndex + 1);

      if (!line.startsWith("data: ")) continue;

      const jsonStr = line.slice("data: ".length).trim();

      try {
        const parsed = JSON.parse(jsonStr);

        // 스트리밍 완료 신호 확인
        if (parsed.done) {
          return;
        }

        // 에러 처리
        if (parsed.error) {
          throw new Error(parsed.message || "챗봇 응답 중 오류 발생");
        }

        // 컨텐츠가 있으면 메시지 콜백 호출
        if (parsed.content) {
          onMessage(parsed.content);
        }
      } catch (e) {
        console.error("JSON parse error:", e);
      }
    }
  }
}
