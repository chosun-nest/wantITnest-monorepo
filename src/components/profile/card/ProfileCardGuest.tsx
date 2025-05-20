// 로그인 하지 않았을 경우 띄우는 게스트 카드
export default function GuestCard() {
  return (
    <div className="w-80 h-[450px] p-4 border rounded-xl shadow-md bg-white flex items-center justify-center">
      <p className="text-sm text-center text-gray-600">
        로그인 후 프로필 카드를 완성하세요<span className="ml-1">🌟</span>
      </p>
    </div>
  );
}