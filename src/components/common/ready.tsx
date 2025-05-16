export default function Ready() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] p-8 bg-orange-50 border-2 border-dashed border-orange-400 rounded-2xl">
      {/* 삼각형 경고 아이콘 (SVG) */}
      <svg
        className="w-24 h-24 text-orange-500 mb-4"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
      </svg>

      <div className="text-3xl font-bold text-orange-600 mb-2">
        공사중 페이지입니다
      </div>
      <p className="text-base text-gray-700 text-center">
        이 페이지는 아직 준비 중입니다. <br />
        빠른 시일 내에 제공될 예정입니다.
      </p>
    </div>
  );
}
