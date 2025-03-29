import Navbar from "../components/layout/navbar";  //상단 네비게이션 바 불러오기
import ProfileComponent from "../components/profile/profile-component";

export default function Profile() {
  return (
    <>
      <Navbar />
      <div className="flex pt-6 px-8 bg-gray-100 min-h-screen pt-20">
        {/* 왼쪽 프로필 박스 */}
        <div className="w-1/4">
          <ProfileComponent />
        </div>

        {/* 오른쪽 공간 */}
        <div className="flex-1 pl-8">
          {/* 추가 컴포넌트 넣을 곳 */}
        </div>
      </div>
    </>
  );
}