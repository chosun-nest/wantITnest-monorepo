import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/navbar";
import ProfileCard from "../components/profile/card/ProfileCard";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../store/slices/authSlice";
import Modal from "../components/common/modal";
import { ModalContent } from "../types/modal";
import {
  GridContainer,
  GridItem,
  ItemTitle,
} from "../assets/styles/profile.styles"    // 프로필 grid 적용
import { CaretDown, CaretUp } from "phosphor-react";   // history 열림, 닫힘용

// 화면 너비 감지 훅
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);
  return isMobile;
}

export default function Profile() {
  const navbarRef = useRef<HTMLDivElement>(null);
  const [navHeight, setNavHeight] = useState(0);
  const isMobile = useIsMobile();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const isLoggedIn = useSelector(selectIsLoggedIn);

  const [modalContent, setModalContent] = useState<ModalContent>({
    title: "",
    message: "",
    type: "info",
  });
  // history 열림/닫힘 상태
  const [historyOpen, setHistoryOpen] = useState(true);
  
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
      <GridContainer $isMobile={isMobile} $navbarHeight={navHeight}>
        {/* 1행: 내 프로필 */}
        <GridItem $isMobile={isMobile} $row="1" $col="1">
          {loading ? (
              <div className="relative p-4 …">
              <p> 불러오는 중…</p>
            </div>
          ) : (
            <ProfileCard />
          )}
        </GridItem>
        {/* 1행: History (min-height 해제) */}
        <GridItem
          $isMobile={isMobile}
          $row="1"
          $col="2"
          $colSpan="2"
          $noMinHeight
        >
        
          {/* 헤더에 onClick 걸기 */}
          <ItemTitle onClick={() => setHistoryOpen(o => !o)}>
            <span>History</span>
            {historyOpen
              ? <CaretUp   size={20} weight="bold" />
              : <CaretDown size={20} weight="bold" />}
          </ItemTitle>

          {historyOpen && (
            <div style={{ padding: 16 }}>
              {/* 히스토리 콘텐츠 */}
              <p>• 첫 번째 활동 내역</p>
              <p>• 두 번째 활동 내역</p>
              {/* … */}
            </div>
          )}
        </GridItem>
          
        {/* 2행: 활동 로그 */}
        <GridItem $isMobile={isMobile} $row="2" $col="2" $colSpan="2">
          <ItemTitle>활동 로그</ItemTitle>
          {/* 여기에 실제 로그 리스트 */}
        </GridItem>
        
      </GridContainer>
        {/* <div
          className="flex min-h-screen px-20 bg-white"
          style={{ paddingTop: navHeight + 40 }}
        > */}
        
        {/* <div>
          {loading ? (
            <div className="relative p-4 bg-white border shadow-md w-80 rounded-xl">
              <p className="text-sm text-gray-500"> 불러오는 중...</p>
            </div>
          ) : (
            <ProfileCard />
          )}
        </div>
        <div>
          나중에 히스토리, 채팅방 등 들어갈 자리
        </div> */}
        
      {/* </div> */}
    </>
  );
}
