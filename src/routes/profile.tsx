import Navbar from "../components/layout/navbar";
import ProfileComponent from "../components/profile/profile-card";
import { useRef, useEffect, useState } from "react";

export default function Profile() {
  const navbarRef = useRef<HTMLDivElement>(null);
  const [navHeight, setNavHeight] = useState(0);

  useEffect(() => {
    if (navbarRef.current) {
      setNavHeight(navbarRef.current.offsetHeight);
    }
  }, []);

  return (
    <>
      {/* 상단 네비게이션 */}
      <div ref={navbarRef}>
        <Navbar />
      </div>

      {/* 컨텐츠 전체 영역 */}
      <div className="px-8 bg-white min-h-screen" style={{ paddingTop: navHeight }}>
        <div className="text-[25px] font-bold text-[#00256c] font-sans px-4 mb-4" style={{ fontFamily: "Monomaniac One" }}>
          계정 정보
        </div>

        <div className="w-1/4">
          <ProfileComponent />
        </div>

        <div className="flex-1 pl-8">{/* 오른쪽 내용 필요시 */}</div>
      </div>
    </>
  );
}
