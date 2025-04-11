interface GuestCardProps {
  onEdit: () => void;
}

// 로그인 전 사용자를 위한 고정 예시 프로필 카드
export default function GuestCard({ onEdit }: GuestCardProps) {
  return (
    <div className="w-80 p-4 border rounded-xl shadow-md bg-white">
      {/* 프로필 이미지 */}
      <div className="flex justify-center mb-7">
        <img
          src="/assets/images/user.png"
          alt="Profile"
          className="w-30 h-30 rounded-full border"
        />
      </div>

      {/* 이름 및 전공 정보 */}
      <div className="flex items-center justify-left mt-2 gap-2">
        <h2 className="text-lg font-bold">도레미</h2>
        <p className="text-gray-500">컴퓨터학과 20학번</p>
      </div>

      {/* 한 줄 소개 */}
      <p className="text-sm text-left mt-2">
        [한줄소개] 예시 프로필입니다.
        <br />로그인 후 더 많은 정보를 확인하세요:)
      </p>

      {/* 관심분야 해시태그 */}
      <div className="flex flex-wrap justify-left gap-2 mt-5">
        <span className="bg-gray-200 text-xs px-2 py-1 rounded-full">#AI</span>
        <span className="bg-gray-200 text-xs px-2 py-1 rounded-full">#Data</span>
        <span className="bg-gray-200 text-xs px-2 py-1 rounded-full">#Web</span>
      </div>

      {/* SNS 아이콘 */}
      <div className="flex justify-center items-center gap-10 mt-10">
        <a href="https://github.com/" target="_blank" rel="noreferrer">
          <img
            src="/assets/images/github-logo.png"
            alt="GitHub"
            className="w-12 h-12 hover:opacity-80"
          />
        </a>
        <a href="https://linkedin.com/" target="_blank" rel="noreferrer">
          <img
            src="/assets/images/LinkedIn-logo.png"
            alt="LinkedIn"
            className="w-13 h-12 hover:opacity-80"
          />
        </a>
      </div>

      {/* 수정 버튼 (테스트용 → 추후 제거 예정) */}
      <div className="flex justify-end gap-2 mt-5">
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          수정
        </button>
      </div>
    </div>
  );
}
