import Navbar from "../components/layout/navbar";  //상단 네비게이션 바 불러오기
import ProfileComponent from "../components/profile/profile-component";
import { useRef, useEffect, useState } from "react";

export default function Profile() {
  const navbarRef = useRef<HTMLDivElement>(null);
  const [navHeight, setNavHeight] = useState(0);

  useEffect(() => {
    if(navbarRef.current) {
      setNavHeight(navbarRef.current.offsetHeight);
    }
  }, []);

  return (
    <>
      {/* ref로 Navbar 높이 측정 */}
      <div ref={navbarRef}>
        <Navbar />
      </div>
      <div className="flex px-8 bg-white min-h-screen" style={{marginTop : navHeight}}>
        
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