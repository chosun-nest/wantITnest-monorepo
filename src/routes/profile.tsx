import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import Navbar from "../components/layout/navbar";
import ProfileCard from "../components/profile/profile-card";

export default function Profile() {
  const navbarRef = useRef<HTMLDivElement>(null);
  const [navHeight, setNavHeight] = useState(0);
  const [loading, setLoading] = useState(true);

  // Navbar 높이 계산
  useEffect(() => {
    const handleResize = () => {
      if (navbarRef.current) {
        setNavHeight(navbarRef.current.offsetHeight);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 로그인 여부 확인
  // useEffect(() => {
  //   const token = localStorage.getItem("accesstoken");
  //   if (!token) {
  //     alert("로그인이 필요한 페이지입니다.");
  //     window.location.href = "/login"; // 로그인 페이지로 이동
  //   } else {
  //     setLoading(false);
  //   }
  // }, []);

  return (
    <>
      <Navbar ref={navbarRef} />

      <div
        className="px-15 min-h-screen bg-white flex"
        style={{ paddingTop: navHeight + 20 }}
      >
        <div className="w-1/4">
          {loading ? (
            <div className="w-80 p-4 border rounded-xl shadow-md bg-white z-10 relative">
              <p className="text-gray-500 text-sm">🛜 불러오는 중...</p>
            </div>
          ) : (
            <ProfileCard />
          )}
        </div>

        <div className="flex-1 pl-8">
          {/* 나중에 히스토리, 채팅방 등 들어갈 자리 */}
        </div>
      </div>
    </>
  );
}
