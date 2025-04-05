import Navbar from "../components/layout/navbar";
import ProfileCard from "../components/profile/profile-card";
import { useRef, useEffect, useState } from "react";

export default function Profile() {
  const navbarRef = useRef<HTMLDivElement>(null);
  const [navHeight, setNavHeight] = useState(0);

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

  return (
    <>
      {/* ref를 Navbar에 직접 전달 */}
      <Navbar ref={navbarRef} />

      <div
        className="px-10 min-h-screen bg-white flex"
        style={{ paddingTop: `${navHeight}px` }}
      >
        <div className="w-1/4">
          <ProfileCard />
        </div>
        <div className="flex-1 pl-8">{/* 오른쪽 내용 필요시 */}</div>
      </div>
    </>
  );
}
