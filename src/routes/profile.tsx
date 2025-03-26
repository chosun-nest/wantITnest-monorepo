export default function Profile() {
  //return <div>hi</div>;
  return (
    <div className="w-80 p-4 border rounded-xl shadow-md bg-white">
      {/* 프로필 이미지 */}
      <div className="flex justify-center">
        <img
          src="/images/user.png"
          alt="Profile"
          className="w-20 h-20 rounded-full border"
        />
      </div>

      {/* 이름 및 전공 정보 */}
      <h2 className="text-lg font-bold text-center mt-2">도레미</h2>
      <p className="text-gray-500 text-center">컴퓨터학부 20학번</p>

      {/* 한 줄 소개 */}
      <p className="text-sm text-center mt-2">
        AI/Data 개발자가 되고 싶은 도레미 입니다.
      </p>

      {/* 관심사 해시태그 */}
      <div className="flex flex-wrap justify-center gap-1 mt-2">
        <span className="bg-gray-200 text-xs px-2 py-1 rounded-full">#AI</span>
        <span className="bg-gray-200 text-xs px-2 py-1 rounded-full">#Data</span>
        <span className="bg-gray-200 text-xs px-2 py-1 rounded-full">#Web</span>
      </div>

      {/* 이메일 */}
      <p className="text-sm text-center text-gray-600 mt-2">
        domremi404@gmail.com
      </p>

      {/* 버튼들 */}
      <div className="flex justify-center gap-2 mt-3">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
          수정
        </button>
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

