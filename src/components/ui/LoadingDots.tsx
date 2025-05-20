// 로딩 ui - 비밀번호 변경 시 글자 비교 시 사용

export default function LoadingDots() {
  return (
    <div className="flex gap-1">
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
    </div>
  );
}
