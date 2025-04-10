import { useNavigate } from "react-router-dom";

export default function ProfileCard() {
  const navigate = useNavigate(); //페이지 이동을 위한 hook
  // 예시용 SNS 링크 (나중에 props 또는 상태에서 받아올 수 있음)
  const githubUrl = "https://github.com/";
  const linkedinUrl = "https://linkedin.com/";

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
        AI/Data 개발자가 되고 싶은 도레미 입니다.
      </p>

      {/* 관심사 해시태그 */}
      <div className="flex flex-wrap justify-left gap-2 mt-5">
        <span className="bg-gray-200 text-xs px-2 py-1 rounded-full">#AI</span>
        <span className="bg-gray-200 text-xs px-2 py-1 rounded-full">
          #Data
        </span>
        <span className="bg-gray-200 text-xs px-2 py-1 rounded-full">#Web</span>
      </div>

      {/* SNS 아이콘 */}
      <div className="flex justify-center items-center gap-10 mt-10">
        <a href={githubUrl} target="_blank" rel="noreferrer">
          <img
            src="/assets/images/github-logo.png"
            alt="GitHub"
            className="w-12 h-12 hover:opacity-80"
          />
        </a>
        <a href={linkedinUrl} target="_blank" rel="noreferrer">
          <img
            src="/assets/images/LinkedIn-logo.png"
            alt="LinkedIn"
            className="w-13 h-12 hover:opacity-80"
          />
        </a>
      </div>

      {/* 수정 버튼 */}
      <div className="flex justify-end gap-2 mt-5">
        <button
          onClick={() => navigate("/profile-edit")} // 수정 버튼 클릭 시 profile-edit.tsx로 이동
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          수정
        </button>
      </div>
    </div>
  );
}
