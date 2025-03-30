import { useNavigate } from "react-router-dom";

export default function ProfileComponent() {
  const navigate = useNavigate(); //페이지 이동을 위한 hook

  return (
    <div className="w-80 p-4 border rounded-xl shadow-md bg-white">
      {/* 프로필 이미지 */}
      <div className="flex justify-center mb-7">
        <img
          src="../public/assets/images/user.png"
          alt="Profile"
          className="w-30 h-30 rounded-full border"
        />
      </div>

      {/* 이름 및 전공 정보 */}
      <div className="flex items-center justify-left mt-2 gap-2">
        <h2 className="text-lg font-bold">도레미</h2>
        <p className="text-gray-500">컴퓨터학부 20학번</p>
      </div>

      {/* 한 줄 소개 */}
      <p className="text-sm text-left mt-2">
        AI/Data 개발자가 되고 싶은 도레미 입니다.
      </p>

      {/* 관심사 해시태그 */}
      <div className="flex flex-wrap justify-left gap-1 mt-2">
        <span className="bg-gray-200 text-xs px-2 py-1 rounded-full">#AI</span>
        <span className="bg-gray-200 text-xs px-2 py-1 rounded-full">
          #Data
        </span>
        <span className="bg-gray-200 text-xs px-2 py-1 rounded-full">#Web</span>
      </div>

      {/* 이메일 */}
      <p className="text-sm text-left text-gray-600 mt-2">
        domremi404@gmail.com
      </p>

      {/* 수정 버튼 */}
      <div className="flex justify-end gap-2 mt-3">
        <button
          onClick={() => navigate("/profile-edit")} // 수정 버튼 클릭 시 profile-edit.tsx로 이동
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          수정
        </button>
      </div>

      {/*sns 링크*/}
      <div className="flex justify-items-start gap-2 mt-3">
        <a href="#" className="text-black text-xl">
          🔗
        </a>

        <a href="#" className="text-black text-xl">
          🔗
        </a>
      </div>
    </div>
  );
}
