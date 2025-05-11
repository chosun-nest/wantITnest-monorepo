import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/navbar";
import ProfileCard from "../components/profile/card/ProfileCard";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../store/slices/authSlice";
import Modal from "../components/common/modal";
import { ModalContent } from "../types/modal";

export default function Profile() {
  const navbarRef = useRef<HTMLDivElement>(null);
  const [navHeight, setNavHeight] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const isLoggedIn = useSelector(selectIsLoggedIn);

  const [modalContent, setModalContent] = useState<ModalContent>({
    title: "",
    message: "",
    type: "info",
  });
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
  useEffect(() => {
    if (!isLoggedIn) {
      setModalContent({
        title: "로그인 필요",
        message: "로그인이 필요한 페이지 입니다",
        type: "error",
        onClose: () => navigate("/login"),
      });
      setShowModal(true);
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, navigate]);

  return (
    <>
      {" "}
      {showModal && (
        <Modal
          title={modalContent.title}
          message={modalContent.message}
          type={modalContent.type}
          onClose={() => {
            setShowModal(false);
            modalContent.onClose?.();
          }}
        />
      )}
      <Navbar ref={navbarRef} />
      <div
        className="flex min-h-screen px-20 bg-white"
        style={{ paddingTop: navHeight + 40 }}
      >
        <div className="w-1/4 pr-6">
          {loading ? (
            <div className="relative p-4 bg-white border shadow-md w-80 rounded-xl">
              <p className="text-sm text-gray-500"> 불러오는 중...</p>
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
